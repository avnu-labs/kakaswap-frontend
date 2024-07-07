import { useWeb3ModalProvider, useWeb3ModalAccount } from "@web3modal/ethers/react";
import type { ContractTransactionResponse, Eip1193Provider } from "ethers";
import { parseUnits, BrowserProvider, Contract } from "ethers";
import React, { useEffect, useMemo } from "react";

import { FactoryAbi, PairAbi } from "../../contracts/abis";
import { KAKASWAP_FACTORY, KAKASWAP_ROUTER, WETH_ADDRESS } from "../../contracts/addresses";
import { addLiquidityQuote, removeLiquidityQuote } from "../../helpers/liquidity";
import {
  getAmountPercentage,
  getShareOfPool,
  parseReadableStringToBigNumber,
  stringHexToStringDec,
} from "../../helpers/math";
import { getTotalLiquidityInUSD } from "../../helpers/pool";
import { isEnoughBalance } from "../../helpers/token";
import { displayError } from "../../services/toast.service";
import { ARFError, NotEnoughBalanceError, PoolHasNoLiquidityError, PoolNotExistError, UnknownError } from "../ARFError";
import { useBlock } from "../BlockProvider";
import { useTransactions } from "../TransactionsProvider";
import { useTranslate } from "../TranslateProvider";
import type { PoolState, TokenState } from "../WalletBaseProvider";
import { useWalletBase } from "../WalletBaseProvider";
import { useWallet } from "../WalletProvider";

import type { LiquidityManagerState, AddLiquidityQuoteState, RemoveLiquidityQuoteState } from "./model";
import { POOL_STATE_INITIAL_STATE } from "./model";

const NO_PROVIDER = "No provider";

interface PoolManagerState {
  pools: PoolState[];
  currentAddLiquidityQuote?: AddLiquidityQuoteState;
  currentRemoveLiquidityQuote?: RemoveLiquidityQuoteState;
  isSigning: boolean;
}

interface FetchPools {
  type: "fetch_pools";
  pools: PoolState[];
}

interface AddPool {
  type: "add_pool";
  pool: PoolState;
}

interface SigningQuote {
  type: "signing_quote";
  isSigning: boolean;
}

interface UpdatePoolReserves {
  type: "update_pool_reserves";
  reserveToken0: bigint;
  reserveToken1: bigint;
  totalSupply: bigint;
  pool: PoolState;
  blockHash: string | undefined;
}

interface ResetPoolBalance {
  type: "reset_pool_balance";
}

interface UpdatePoolBalance {
  type: "update_pool_balance";
  balance: string;
  pool: PoolState;
  token0AmountPooled: string;
  token1AmountPooled: string;
  poolShare: number;
}

interface ResetAddLiquidityQuote {
  type: "reset_add_liquidity_quote";
}

interface ResetRemoveLiquidityQuote {
  type: "reset_remove_liquidity_quote";
}

interface UpdateAddLiquidityQuote {
  type: "update_add_liquidity_quote";
  loading: boolean;
  pool?: PoolState;
  amountToken0: string;
  amountToken1: string;
  estimatedLPReceived: string;
  poolShare: number;
  slippage: number;
  isFirstAmountUpdated: boolean;
  isFirstDeposit: boolean;
  token0?: TokenState;
  token1?: TokenState;
  rateToken0Token1: number;
  rateToken1Token0: number;
  error: ARFError | undefined;
}

interface UpdateRemoveLiquidityQuote {
  type: "update_remove_liquidity_quote";
  loading: boolean;
  pool?: PoolState;
  amountLP: string;
  minToken0Received: string;
  minToken1Received: string;
  slippage: number;
  error: ARFError | undefined;
}

interface SetAllowance {
  type: "set_allowance";
  pool: PoolState;
  allowance: string;
}

type Action =
  | UpdateAddLiquidityQuote
  | ResetAddLiquidityQuote
  | ResetRemoveLiquidityQuote
  | UpdateRemoveLiquidityQuote
  | SigningQuote
  | UpdatePoolReserves
  | ResetPoolBalance
  | UpdatePoolBalance
  | FetchPools
  | AddPool
  | SetAllowance;

function reducer(state: PoolManagerState, action: Action): PoolManagerState {
  switch (action.type) {
    case "fetch_pools": {
      return {
        ...state,
        pools: action.pools,
      };
    }
    case "add_pool": {
      return {
        ...state,
        pools: [...state.pools, action.pool],
      };
    }
    case "set_allowance": {
      const poolIdx = state.pools.findIndex((token) => token.address === action.pool.address);
      const newPools = [...state.pools];
      if (poolIdx > -1) {
        newPools[poolIdx].allowance = action.allowance;
        return {
          ...state,
          pools: [...newPools],
        };
      }
      return state;
    }
    case "signing_quote": {
      return {
        ...state,
        isSigning: action.isSigning,
      };
    }
    case "update_pool_reserves": {
      const poolIndex = state.pools.findIndex((pool) => pool.address === action.pool.address);

      const newPools = [...state.pools];
      if (poolIndex > -1) {
        const { reserveToken0, reserveToken1 } = action;
        const actualPool = newPools[poolIndex];
        newPools[poolIndex] = {
          ...actualPool,
          reserveToken0,
          reserveToken1,
          totalSupply: action.totalSupply,
          liquidityUSD: getTotalLiquidityInUSD(actualPool, reserveToken0, reserveToken1),
          lastBlockHash: action.blockHash,
        };
      }

      return {
        ...state,
        pools: newPools,
      };
    }
    case "reset_pool_balance": {
      return {
        ...state,
        pools: [...state.pools].map((pool) => {
          return {
            ...pool,
            balance: "0",
            token0AmountPooled: "0",
            token1AmountPooled: "0",
            poolShare: 0,
          };
        }),
      };
    }
    case "update_pool_balance": {
      const poolIndex = state.pools.findIndex((pool) => pool.address === action.pool.address);

      const newPools = [...state.pools];
      if (poolIndex > -1) {
        newPools[poolIndex] = {
          ...newPools[poolIndex],
          balance: action.balance,
          token0AmountPooled: action.token0AmountPooled,
          token1AmountPooled: action.token1AmountPooled,
          poolShare: action.poolShare,
        };
      }

      return {
        ...state,
        pools: newPools,
      };
    }
    case "reset_add_liquidity_quote": {
      return {
        ...state,
        currentAddLiquidityQuote: undefined,
      };
    }
    case "reset_remove_liquidity_quote": {
      return {
        ...state,
        currentRemoveLiquidityQuote: undefined,
      };
    }
    case "update_add_liquidity_quote": {
      return {
        ...state,
        currentAddLiquidityQuote: {
          loading: action.loading,
          pool: action.pool,
          amountToken0: action.amountToken0,
          amountToken1: action.amountToken1,
          estimatedLPReceived: action.estimatedLPReceived,
          token0: action.token0,
          token1: action.token1,
          poolShare: action.poolShare,
          slippage: action.slippage,
          isFirstDeposit: action.isFirstDeposit,
          isFirstAmountUpdated: action.isFirstAmountUpdated,
          rateToken0Token1: action.rateToken0Token1,
          rateToken1Token0: action.rateToken1Token0,
          error: action.error,
        },
      };
    }
    case "update_remove_liquidity_quote": {
      return {
        ...state,
        currentRemoveLiquidityQuote: {
          loading: action.loading,
          amountLPToken: action.amountLP,
          pool: action.pool,
          minToken0Received: action.minToken0Received,
          minToken1Received: action.minToken1Received,
          slippage: action.slippage,
          error: action.error,
        },
      };
    }
    default: {
      return state;
    }
  }
}

const usePoolManager = (): LiquidityManagerState => {
  const [state, dispatch] = React.useReducer(reducer, {
    ...POOL_STATE_INITIAL_STATE,
  });
  const { isConnected, address } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const { t } = useTranslate();
  const { blockHash } = useBlock();
  const { addTransaction } = useTransactions();
  const { getBalance, approve, getAllowance } = useWalletBase();
  const { getTokenBalance, tokens } = useWallet();
  const { currentAddLiquidityQuote, currentRemoveLiquidityQuote, pools } = state;
  // Called when account changed
  useEffect(() => {
    if (!isConnected) {
      // reset wallet if account is undefined (disconnected)
      dispatch({
        type: "reset_pool_balance",
      });
    }
  }, [isConnected]);

  const getLPAllowance = React.useCallback(
    async (pool: PoolState, callerAccount: Eip1193Provider) => {
      getAllowance(pool, address, callerAccount).then((balance: number) => {
        dispatch({
          type: "set_allowance",
          allowance: balance.toString(10),
          pool,
        });
      });
    },
    [address, getAllowance]
  );

  const getLPAllowanceForAll = React.useCallback(
    async (poolsToGetAllowance: PoolState[], callerAccount: Eip1193Provider) => {
      poolsToGetAllowance.forEach((pool: PoolState) => {
        getLPAllowance(pool, callerAccount);
      });
    },
    [getLPAllowance]
  );

  const approveLP = React.useCallback(
    async (pool: PoolState, amount: string, callerAccount: Eip1193Provider) => {
      approve(pool, amount, callerAccount).then(() => {
        getLPAllowance(pool, callerAccount);
      });
    },
    [approve, getLPAllowance]
  );

  const getPoolFromTokens = React.useCallback(
    (token0: TokenState, token1: TokenState) => {
      // Get registered pool from 2 tokens
      return pools.find(({ token0: { address: token0Address }, token1: { address: token1Address } }) => {
        return (
          (token0Address === token0.address && token1Address === token1.address) ||
          (token1Address === token0.address && token0Address === token1.address) ||
          (token0.isNative &&
            (token0Address === WETH_ADDRESS || token1Address === WETH_ADDRESS) &&
            (token1.address === token1Address || token1.address === token0Address)) ||
          (token1.isNative &&
            (token0Address === WETH_ADDRESS || token1Address === WETH_ADDRESS) &&
            (token0.address === token1Address || token0.address === token0Address))
        );
      });
    },
    [pools]
  );

  const getTokenState = React.useCallback(
    (tokenAddress: string): TokenState | undefined => {
      const token = tokens.find(
        (tokenToCheck: TokenState) => stringHexToStringDec(tokenToCheck.address) === stringHexToStringDec(tokenAddress)
      );
      if (!token) return undefined;
      // Remove balance as it is not represent the state of wallet
      // Only the ref to token infos
      return {
        ...token,
        balance: "0",
      };
    },
    [tokens]
  );

  const getAllPools = React.useCallback(
    async (provider: Eip1193Provider) => {
      if (!provider) throw Error(NO_PROVIDER);
      const ethersProvider = new BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();
      const factoryContract = new Contract(KAKASWAP_FACTORY, FactoryAbi, signer);

      const allPairsLength = await factoryContract.allPairsLength();
      const pairPromises = Array.from(Array(Number(allPairsLength)).keys()).map((index) => {
        return factoryContract.allPairs(index);
      });
      const allPairs = await Promise.all(pairPromises);
      const pairsInfosPromises = allPairs.map(async (pairAddress) => {
        const internalInfoPromises = [];
        const pairContract = new Contract(pairAddress, PairAbi, signer);
        internalInfoPromises.push(pairContract.token0());
        internalInfoPromises.push(pairContract.token1());
        internalInfoPromises.push(pairContract.symbol());
        internalInfoPromises.push(pairContract.totalSupply());
        internalInfoPromises.push(pairContract.getReserves());
        const internalInfo = await Promise.all(internalInfoPromises);
        return {
          address: pairAddress,
          name: "Pool name",
          symbol: internalInfo[2],
          decimals: 18,
          totalSupply: BigInt(internalInfo[3]),
          token0: getTokenState(internalInfo[0]),
          token1: getTokenState(internalInfo[1]),
          reserveToken0: BigInt(internalInfo[4][0]),
          reserveToken1: BigInt(internalInfo[4][1]),
          balance: "",
          blockHash: undefined,
        };
      });
      const newPools = await Promise.all(pairsInfosPromises).then((pairsInfos) => {
        return pairsInfos;
      });
      dispatch({
        type: "fetch_pools",
        // eslint-disable-next-line
        // @ts-ignore
        pools: newPools
          .filter((pool) => pool.token0 && pool.token1)
          .map((pool) => {
            return {
              ...pool,
              token0AmountPooled: "0",
              token1AmountPooled: "0",
              poolShare: 0,
              lastBlockHash: "",
              liquidityUSD: "",
              allowance: "",
              isNative: false,
            };
          }),
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getTokenState]
  );

  const getReserves = React.useCallback(
    async (pool: PoolState | undefined) => {
      if (!pool) return { reserveToken0: BigInt(0), reserveToken1: BigInt(0), totalSupply: BigInt(0) };
      if (!walletProvider) throw new Error(NO_PROVIDER);

      // Check if pool reserve already found in state
      const poolIndex = pools.findIndex((poolValue) => poolValue.address === pool.address);

      let tempPool: PoolState;
      if (poolIndex > -1) {
        tempPool = pools[poolIndex];
        // Return if last hash checked is same as current hash
        if (tempPool.lastBlockHash === blockHash) {
          return Promise.resolve({
            ...tempPool,
          });
        }
      }
      // Reserve not fetch or reserve outdated -> fetch new datas
      const ethersProvider = new BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();
      const pairContract = new Contract(pool.address, PairAbi, signer);

      // Pool reserve should be fetch or re-fetch depending on las blockHash
      const fetchPromises = [pairContract.getReserves(), pairContract.totalSupply()];
      return Promise.all(fetchPromises).then((response) => {
        const [reservesResponse, supplyResponse] = response;

        dispatch({
          type: "update_pool_reserves",
          pool,
          reserveToken0: reservesResponse[0],
          reserveToken1: reservesResponse[1],
          totalSupply: supplyResponse,
          blockHash,
        });

        return {
          ...tempPool,
          lastBlockHash: blockHash,
          reserveToken0: reservesResponse[0],
          reserveToken1: reservesResponse[1],
          totalSupply: supplyResponse,
          walletProvider,
        };
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pools, blockHash, walletProvider]
  );

  const getRemoveLiquidityQuote = React.useCallback(
    async (pool: PoolState, amountLPToken: string, slippage: number) => {
      // We know tokenFrom & tokenTo are defined & Pool exists
      return getReserves(pool).then(({ reserveToken0, reserveToken1, totalSupply }) => {
        return removeLiquidityQuote(pool, amountLPToken, totalSupply, reserveToken0, reserveToken1, slippage);
      });
    },
    [getReserves]
  );

  const getLPBalance = React.useCallback(
    async (pool: PoolState, callerAccount: Eip1193Provider) => {
      getBalance(pool, address, callerAccount).then((balance: number) => {
        if (balance !== 0) {
          // Get a quote for remove liquidity, to get amount token0 & token1 pooled, with a 0% slippage
          getRemoveLiquidityQuote(pool, balance.toString(), 0).then((quoteResult) => {
            const {
              minToken0Received: token0AmountPooled,
              minToken1Received: token1AmountPooled,
              totalSupply,
            } = quoteResult;
            const poolShare = getShareOfPool(pool, totalSupply, balance.toString(), false);
            dispatch({
              type: "update_pool_balance",
              balance: balance.toString(),
              token0AmountPooled,
              token1AmountPooled,
              poolShare,
              pool,
            });
          });
        } else {
          dispatch({
            type: "update_pool_balance",
            balance: "0",
            token0AmountPooled: "0",
            token1AmountPooled: "0",
            poolShare: 0,
            pool,
          });
        }
      });
    },
    [address, getRemoveLiquidityQuote, getBalance]
  );

  // Need to init token list before call
  const getLPBalanceForAll = React.useCallback(
    async (poolsToGetBalance: PoolState[], callerAccount: Eip1193Provider) => {
      poolsToGetBalance.forEach((pool: PoolState) => {
        getLPBalance(pool, callerAccount);
      });
    },
    [getLPBalance]
  );

  const RouterAbi = [
    "function addLiquidity(address, address, uint, uint, uint, uint, address, uint) external returns (uint, uint, uint)",
    "function addLiquidityETH(address, uint, uint, uint, address, uint) external returns (uint, uint, uint)",
    "function removeLiquidity(address, address, uint, uint, uint, address, uint) external returns (uint, uint, uint)",
    "function removeLiquidityETH(address, uint, uint, uint, address, uint) external returns (uint, uint, uint)",
  ];

  const addLiquidity = React.useCallback(
    async (_addLiquidityQuote: AddLiquidityQuoteState, adderAccount: Eip1193Provider) => {
      if (!adderAccount) throw new Error(NO_PROVIDER);
      const { amountToken0, amountToken1, token0, token1, slippage, pool } = _addLiquidityQuote;
      if (!token0 || !token1) throw new UnknownError();

      const amountToken0Min = getAmountPercentage(
        parseReadableStringToBigNumber(amountToken0, token0.decimals),
        slippage
      );
      const amountToken1Min = getAmountPercentage(
        parseReadableStringToBigNumber(amountToken1, token1.decimals),
        slippage
      );

      const ethersProvider = new BrowserProvider(adderAccount);
      const signer = await ethersProvider.getSigner();
      const routerContract = new Contract(KAKASWAP_ROUTER, RouterAbi, signer);

      const actionLabel = `${t.pool.add_liquidity} ${token0.symbol} - ${token1.symbol}`;

      dispatch({ type: "signing_quote", isSigning: true });
      let call;
      if (token0.isNative) {
        call = routerContract.addLiquidityETH(
          token1.address,
          parseUnits(amountToken1, token1.decimals).toString(), // Amount token desired
          amountToken1Min.toString(), // Amount token min
          amountToken0Min.toString(), // Amount eth min
          address,
          1915961880000, // 2030
          {
            value: parseUnits(amountToken0, token0.decimals).toString(),
          }
        );
      } else if (token1.isNative) {
        call = routerContract.addLiquidityETH(
          token0.address,
          parseUnits(amountToken1, token0.decimals).toString(), // Amount token desired
          amountToken0Min.toString(), // Amount token min
          amountToken1Min.toString(), // Amount eth min
          address,
          1915961880000, // 2030
          {
            value: parseUnits(amountToken1, token1.decimals).toString(),
          }
        );
      } else {
        call = routerContract.addLiquidity(
          token0.address,
          token1.address,
          parseUnits(amountToken0, token0.decimals).toString(),
          parseUnits(amountToken1, token1.decimals).toString(),
          amountToken0Min.toString(),
          amountToken1Min.toString(),
          address,
          1915961880000 // 2030
        );
      }

      call
        .then((response: ContractTransactionResponse) => {
          dispatch({ type: "signing_quote", isSigning: false });
          addTransaction(
            response,
            actionLabel,
            () => {
              // On success, reload balance & allowance
              getTokenBalance(token0, adderAccount);
              getTokenBalance(token1, adderAccount);
              if (pool) {
                getLPBalance(pool, adderAccount);
              }
            },
            () => {}
          );
          // reset the quote -> to reset the view
          dispatch({
            type: "reset_add_liquidity_quote",
          });
        })
        .catch(() => {
          dispatch({ type: "signing_quote", isSigning: false });
          // Update toast to "error"
          displayError(t.common.transaction_rejected_by_user, actionLabel);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [addTransaction, address, getLPBalance, getTokenBalance, t]
  );

  const getAddLiquidityQuote = React.useCallback(
    async (
      pool: PoolState | undefined,
      amountToken0: string,
      amountToken1: string,
      isFirstAmountUpdated: boolean,
      slippage: number
    ) => {
      // We know tokenFrom & tokenTo are defined & Pool exists
      return getReserves(pool).then(({ reserveToken0, reserveToken1, totalSupply }) => {
        return addLiquidityQuote(
          pool,
          amountToken0,
          amountToken1,
          isFirstAmountUpdated,
          totalSupply,
          reserveToken0,
          reserveToken1,
          slippage
        );
      });
    },
    [getReserves]
  );

  // Get an updated addLiquidityQuote
  const updateAddLiquidityQuote = React.useCallback(
    async (
      token0: TokenState | undefined,
      token1: TokenState | undefined,
      amountToken0: string,
      amountToken1: string,
      isFirstAmountUpdated: boolean,
      slippage: number
      // eslint-disable-next-line sonarjs/cognitive-complexity
    ) => {
      let updateQuoteBase: UpdateAddLiquidityQuote = {
        type: "update_add_liquidity_quote",
        pool: undefined,
        loading: true,
        token0,
        token1,
        rateToken0Token1: 0,
        rateToken1Token0: 0,
        amountToken0,
        amountToken1,
        estimatedLPReceived: "",
        poolShare: 0,
        slippage,
        isFirstDeposit: false,
        isFirstAmountUpdated,
        error: undefined,
      };

      Promise.resolve()
        .then(() => {
          // token0 or token1 not defined, or amount not defined
          // update to empty addLiquidityQuote
          if (!token0 || !token1 || (amountToken0 === "" && amountToken1 === "")) {
            dispatch({ ...updateQuoteBase, loading: false });
            return;
          }
          // Pool is a wrapper (no need of liquidity)
          const isWrapper =
            (token0.isNative && token1.address === WETH_ADDRESS) ||
            (token1.isNative && token0.address === WETH_ADDRESS);

          if (isWrapper) {
            throw new PoolHasNoLiquidityError();
          }

          const pool = getPoolFromTokens(token0, token1);

          // dispatch addLiquidityQuote loading
          dispatch({ ...updateQuoteBase });

          const correctOrder =
            pool &&
            (pool.token0.address === token0.address || (token0.isNative && pool.token0.address === WETH_ADDRESS));
          // Check tokens order
          const isTokenInvertedInPool = !correctOrder;

          // Get addLiquidityQuote for current params
          getAddLiquidityQuote(
            pool,
            isTokenInvertedInPool ? amountToken1 : amountToken0,
            isTokenInvertedInPool ? amountToken0 : amountToken1,
            isTokenInvertedInPool ? !isFirstAmountUpdated : isFirstAmountUpdated,
            slippage
          ).then((quoteResult) => {
            if (quoteResult) {
              const {
                quotedAmountToken0,
                quotedAmountToken1,
                estimatedLPReceived,
                rateToken0Token1,
                rateToken1Token0,
                poolShare,
                isFirstDeposit,
              } = quoteResult;
              const orderedRateToken0Token1 = isTokenInvertedInPool ? rateToken1Token0 : rateToken0Token1;
              const orderedRateToken1Token0 = isTokenInvertedInPool ? rateToken0Token1 : rateToken1Token0;
              const orderedQuotedAmount0 = isTokenInvertedInPool ? quotedAmountToken1 : quotedAmountToken0;
              const orderedQuotedAmount1 = isTokenInvertedInPool ? quotedAmountToken0 : quotedAmountToken1;
              // Check balance for token0 if user is connected
              if (isConnected) {
                const enoughToken0 = isEnoughBalance(token0, orderedQuotedAmount0);
                const enoughToken1 = isEnoughBalance(token1, orderedQuotedAmount1);
                let error;
                if (!enoughToken0 && !enoughToken1) {
                  error = new NotEnoughBalanceError(token0, token1);
                } else if (!enoughToken0) {
                  error = new NotEnoughBalanceError(token0);
                } else if (!enoughToken1) {
                  error = new NotEnoughBalanceError(token1);
                }
                updateQuoteBase = {
                  ...updateQuoteBase,
                  error,
                };
              }

              dispatch({
                ...updateQuoteBase,
                type: "update_add_liquidity_quote",
                loading: false,
                pool,
                token0,
                token1,
                rateToken0Token1: orderedRateToken0Token1,
                rateToken1Token0: orderedRateToken1Token0,
                amountToken0: orderedQuotedAmount0,
                amountToken1: orderedQuotedAmount1,
                estimatedLPReceived,
                poolShare,
                slippage,
                isFirstDeposit,
              });
            } else {
              throw new UnknownError();
            }
          });
        })
        .catch((error) => {
          if (error instanceof ARFError) {
            throw error;
          } else {
            throw new UnknownError(error.error);
          }
        })
        .catch((error) => {
          dispatch({
            ...updateQuoteBase,
            loading: false,
            error,
          });
        });
    },
    [getPoolFromTokens, getAddLiquidityQuote, isConnected]
  );

  const removeLiquidity = React.useCallback(
    async (_removeLiquidityQuote: RemoveLiquidityQuoteState, removerAccount: Eip1193Provider) => {
      const { amountLPToken, minToken0Received, minToken1Received, pool } = _removeLiquidityQuote;
      if (!pool || !pool.token0 || !pool.token1) throw new UnknownError();

      const ethersProvider = new BrowserProvider(removerAccount);
      const signer = await ethersProvider.getSigner();
      const routerContract = new Contract(KAKASWAP_ROUTER, RouterAbi, signer);
      const actionLabel = `${t.pool.remove_liquidity} ${pool.token0.symbol} - ${pool.token1.symbol}`;
      dispatch({ type: "signing_quote", isSigning: true });
      routerContract
        .removeLiquidity(
          pool.token0.address,
          pool.token1.address,
          parseUnits(amountLPToken, pool.decimals).toString(),
          parseUnits(minToken0Received, pool.token0.decimals).toString(),
          parseUnits(minToken1Received, pool.token1.decimals).toString(),
          address,
          1915961880000 // 2030
        )
        .then((value: ContractTransactionResponse) => {
          dispatch({ type: "signing_quote", isSigning: false });
          addTransaction(
            value,
            actionLabel,
            () => {
              // On success, reload balance & allowance
              getTokenBalance(pool.token0, removerAccount);
              getTokenBalance(pool.token1, removerAccount);
              getLPBalance(pool, removerAccount);
            },
            () => {}
          );
          // reset the quote -> to reset the view
          dispatch({
            type: "reset_remove_liquidity_quote",
          });
        })
        // eslint-disable-next-line sonarjs/no-identical-functions
        .catch(() => {
          dispatch({ type: "signing_quote", isSigning: false });
          // Update toast to "error"
          displayError(t.common.transaction_rejected_by_user, actionLabel);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [addTransaction, address, getLPBalance, getTokenBalance, t]
  );

  const updateRemoveLiquidityQuote = React.useCallback(
    async (pool: PoolState, amountLPToken: string, slippage: number) => {
      const updateQuoteBase: UpdateRemoveLiquidityQuote = {
        type: "update_remove_liquidity_quote",
        loading: true,
        amountLP: amountLPToken,
        minToken0Received: "0",
        minToken1Received: "0",
        pool,
        slippage,
        error: undefined,
      };
      Promise.resolve()
        .then(() => {
          // pool not defined, or amount not defined, or account not defined
          // update to empty removeLiquidityQuote
          if (!pool || amountLPToken === "" || !isConnected) {
            dispatch({ ...updateQuoteBase, loading: false });
            return;
          }

          // Pool to remove LP not exist
          if (!pool) {
            throw new PoolNotExistError();
          }

          // User has not enough LP token
          if (!isEnoughBalance(pool, amountLPToken)) {
            throw new NotEnoughBalanceError(pool);
          }

          // dispatch removeLiquidityQuote loading
          dispatch({ ...updateQuoteBase });

          getRemoveLiquidityQuote(pool, amountLPToken, slippage).then((quoteResult) => {
            if (quoteResult) {
              const { minToken0Received, minToken1Received } = quoteResult;
              dispatch({
                ...updateQuoteBase,
                type: "update_remove_liquidity_quote",
                loading: false,
                pool,
                amountLP: amountLPToken,
                minToken0Received,
                minToken1Received,
                slippage,
              });
            } else {
              throw new UnknownError();
            }
          });
        })
        // eslint-disable-next-line sonarjs/no-identical-functions
        .catch((error) => {
          if (error instanceof ARFError) {
            throw error;
          } else {
            throw new UnknownError(error.error);
          }
        })
        // eslint-disable-next-line sonarjs/no-identical-functions
        .catch((error) => {
          dispatch({
            ...updateQuoteBase,
            loading: false,
            error,
          });
        });
    },
    [isConnected, getRemoveLiquidityQuote]
  );

  return useMemo(
    () => ({
      ...state,
      getReserves,
      getLPBalance,
      approveLP,
      getLPAllowance,
      getLPBalanceForAll,
      getLPAllowanceForAll,
      getPoolFromTokens,
      getAllPools,
      addLiquidity,
      removeLiquidity,
      updateAddLiquidityQuote,
      updateRemoveLiquidityQuote,
      currentAddLiquidityQuote,
      currentRemoveLiquidityQuote,
    }),
    [
      state,
      getReserves,
      getLPBalance,
      approveLP,
      getLPAllowance,
      getLPAllowanceForAll,
      getLPBalanceForAll,
      getPoolFromTokens,
      getAllPools,
      addLiquidity,
      removeLiquidity,
      updateAddLiquidityQuote,
      updateRemoveLiquidityQuote,
      currentAddLiquidityQuote,
      currentRemoveLiquidityQuote,
    ]
  );
};

export default usePoolManager;

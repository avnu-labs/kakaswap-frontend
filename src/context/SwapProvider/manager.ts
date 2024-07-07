import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import type { ContractTransactionResponse, Eip1193Provider } from "ethers";
import { parseEther, parseUnits, BrowserProvider, Contract } from "ethers";
import React, { useMemo } from "react";

import { RouterAbi, Weth9Abi } from "../../contracts/abis";
import { KAKASWAP_ROUTER, WETH_ADDRESS } from "../../contracts/addresses";
import { formatBigNumberToReadableString, toFixed } from "../../helpers/math";
import { quote } from "../../helpers/swap";
import { isEnoughBalance } from "../../helpers/token";
import { displayError } from "../../services/toast.service";
import { ARFError, NotEnoughBalanceError, NotEnoughLiquidityError, PoolNotExistError, UnknownError } from "../ARFError";
import { usePool } from "../PoolProvider";
import { useTransactions } from "../TransactionsProvider";
import type { TokenState } from "../WalletBaseProvider";
import { useWallet } from "../WalletProvider";
import { useTranslate } from "context/TranslateProvider";

import type { SwapQuoteState, SwapState } from "./model";
import { SWAP_STATE_INITIAL_STATE } from "./model";

interface SwapManagerState {
  currentSwapQuote?: SwapQuoteState;
  isSigning: boolean;
}

interface ResetQuote {
  type: "reset_quote";
}

interface SigningQuote {
  type: "signing_quote";
  isSigning: boolean;
}

interface UpdateQuote {
  type: "update_quote";
  loading: boolean;
  slippage: number;
  amountTokenFrom: string;
  amountTokenTo: string;
  tokenFrom?: TokenState;
  tokenTo?: TokenState;
  rateToken0Token1: number;
  rateToken1Token0: number;
  minAmountReceived: string;
  priceImpact: number;
  lpFee: string;
  route: string;
  error: ARFError | undefined;
}

type Action = UpdateQuote | ResetQuote | SigningQuote;

function reducer(state: SwapManagerState, action: Action): SwapManagerState {
  // eslint-disable-next-line sonarjs/no-small-switch
  switch (action.type) {
    case "update_quote": {
      return {
        ...state,
        currentSwapQuote: {
          loading: action.loading,
          slippage: action.slippage,
          amountTokenFrom: action.amountTokenFrom,
          amountTokenTo: action.amountTokenTo,
          tokenFrom: action.tokenFrom,
          tokenTo: action.tokenTo,
          rateToken0Token1: action.rateToken0Token1,
          rateToken1Token0: action.rateToken1Token0,
          minAmountReceived: action.minAmountReceived,
          priceImpact: action.priceImpact,
          lpFee: action.lpFee,
          route: action.route,
          error: action.error,
        },
      };
    }
    case "reset_quote": {
      return {
        ...state,
        currentSwapQuote: undefined,
      };
    }
    case "signing_quote": {
      return {
        ...state,
        isSigning: action.isSigning,
      };
    }
    default: {
      return state;
    }
  }
}

const useSwapManager = (): SwapState => {
  const [state, dispatch] = React.useReducer(reducer, {
    ...SWAP_STATE_INITIAL_STATE,
  });

  const { t } = useTranslate();
  const { getReserves, getPoolFromTokens } = usePool();
  const { getTokenBalance, getTokenAllowance } = useWallet();
  const { addTransaction } = useTransactions();
  const { currentSwapQuote } = state;
  const { isConnected, address } = useWeb3ModalAccount();

  // TODO is there a case when output amount could be > reserve token ???? I think no but to check
  const getQuote = React.useCallback(
    async (
      amountTokenFrom: string, // We are sure it is defined
      tokenFrom: TokenState,
      tokenTo: TokenState,
      slippage: number
    ) => {
      if (
        (tokenFrom.isNative && tokenTo.address === WETH_ADDRESS) ||
        (tokenTo.isNative && tokenFrom.address === WETH_ADDRESS)
      ) {
        return {
          amountReceived: parseEther(amountTokenFrom),
          minAmountReceived: amountTokenFrom,
          pricePerTokenTo: 1,
          pricePerTokenFrom: 1,
          priceImpact: 0,
          lpFee: "0",
        };
      }
      const pool = getPoolFromTokens(tokenFrom, tokenTo);
      if (!pool) {
        throw new PoolNotExistError();
      }
      // We know tokenFrom & tokenTo are defined & Pool exists
      return getReserves(pool).then(({ reserveToken0, reserveToken1 }) => {
        // Check pool initialized & have liquidity
        if (reserveToken0 === BigInt(0) || reserveToken1 === BigInt(0)) {
          throw new NotEnoughLiquidityError();
        }

        // Check tokens order
        const reserveTokenFrom =
          pool.token0?.address === tokenFrom.address || (tokenFrom.isNative && pool.token0?.address === WETH_ADDRESS)
            ? reserveToken0
            : reserveToken1;
        const reserveTokenTo =
          pool.token1?.address === tokenTo.address || (tokenTo.isNative && pool.token1?.address === WETH_ADDRESS)
            ? reserveToken1
            : reserveToken0;

        // Get & return the quote with data
        return quote(reserveTokenFrom, reserveTokenTo, tokenFrom, tokenTo, amountTokenFrom, slippage);
      });
    },
    [getPoolFromTokens, getReserves]
  );

  // Get an updated quote base on AmountTokenFrom, tokenFrom & tokenTo
  // amountToken as real, will be mult by decimals
  const updateSwapQuote = React.useCallback(
    async (
      amountTokenFrom: string,
      tokenFrom: TokenState | undefined,
      tokenTo: TokenState | undefined,
      slippage: number
    ) => {
      let updateQuoteBase: UpdateQuote = {
        type: "update_quote",
        loading: true,
        slippage,
        amountTokenFrom,
        amountTokenTo: "",
        tokenFrom,
        tokenTo,
        rateToken0Token1: 0,
        rateToken1Token0: 0,
        minAmountReceived: "",
        priceImpact: 0,
        lpFee: "",
        route: "",
        error: undefined,
      };
      // token0 or token1 not defined, or amount not defined
      // update to empty quote
      if (!tokenFrom || !tokenTo || amountTokenFrom === "") {
        dispatch({ ...updateQuoteBase, loading: false });
        return;
      }
      // Check balance if user is connected
      if (isConnected && !isEnoughBalance(tokenFrom, amountTokenFrom)) {
        updateQuoteBase = {
          ...updateQuoteBase,
          error: new NotEnoughBalanceError(tokenFrom),
        };
      }

      // dispatch quote loading
      dispatch({ ...updateQuoteBase });
      // Get quote for current params
      getQuote(amountTokenFrom, tokenFrom, tokenTo, slippage)
        .then((quoteResult) => {
          if (quoteResult) {
            const { amountReceived, minAmountReceived, pricePerTokenTo, pricePerTokenFrom, priceImpact, lpFee } =
              quoteResult;
            // Dispatch loaded quote
            dispatch({
              ...updateQuoteBase,
              type: "update_quote",
              loading: false,
              slippage,
              amountTokenFrom,
              amountTokenTo: formatBigNumberToReadableString(amountReceived, tokenTo.decimals),
              tokenFrom,
              tokenTo,
              rateToken0Token1: pricePerTokenTo,
              rateToken1Token0: pricePerTokenFrom,
              minAmountReceived,
              priceImpact,
              route: `${tokenFrom.symbol} - ${tokenTo.symbol}(direct)`,
              lpFee,
            });
          } else {
            throw new UnknownError();
          }
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
    [getQuote, isConnected]
  );

  const swap = React.useCallback(
    async (swapQuote: SwapQuoteState, swapperAccount: Eip1193Provider) => {
      const { tokenFrom, tokenTo, amountTokenFrom, minAmountReceived } = swapQuote;
      if (!tokenFrom || !tokenTo) throw new UnknownError();

      const ethersProvider = new BrowserProvider(swapperAccount);
      const signer = await ethersProvider.getSigner();
      const routerContract = new Contract(KAKASWAP_ROUTER, RouterAbi, signer);
      const weth9Contract = new Contract(WETH_ADDRESS, Weth9Abi, signer);

      const amountFrom = parseUnits(amountTokenFrom, tokenFrom.decimals);
      const amountToMin = parseUnits(toFixed(parseFloat(minAmountReceived), tokenTo.decimals), tokenTo.decimals);
      const actionLabel = `${t.swap.swap} ${tokenFrom.symbol} ${t.common.for} ${tokenTo.symbol}`;

      dispatch({ type: "signing_quote", isSigning: true });
      let call;
      if (tokenFrom.isNative) {
        if (tokenTo.address === WETH_ADDRESS) {
          // Wrap ETH to WETH
          call = weth9Contract.deposit({ value: amountFrom });
        } else {
          call = routerContract.swapExactETHForTokens(
            amountToMin,
            [WETH_ADDRESS, tokenTo.address],
            address,
            1915961880000, // 2030
            { value: amountFrom }
          );
        }
      } else if (tokenTo.isNative) {
        if (tokenFrom.address === WETH_ADDRESS) {
          // Unwrap WETH to ETH
          call = weth9Contract.withdraw(amountFrom);
        } else {
          call = routerContract.swapExactTokensForETH(
            amountFrom,
            amountToMin,
            [tokenFrom.address, WETH_ADDRESS],
            address,
            1915961880000 // 2030
          );
        }
      } else {
        call = routerContract.swapExactTokensForTokens(
          amountFrom,
          amountToMin,
          [tokenFrom.address, tokenTo.address],
          address,
          1915961880000 // 2030
        );
      }
      call
        .then((value: ContractTransactionResponse) => {
          dispatch({ type: "signing_quote", isSigning: false });
          addTransaction(
            value,
            actionLabel,
            () => {
              // On success, reload balance
              getTokenBalance(tokenFrom, swapperAccount);
              getTokenBalance(tokenTo, swapperAccount);
              getTokenAllowance(tokenFrom, swapperAccount);
              getTokenAllowance(tokenTo, swapperAccount);
            },
            () => {}
          );
          // reset the quote -> to reset the view
          /* dispatch({
            type: "reset_quote",
          }); */
        })
        .catch(() => {
          dispatch({ type: "signing_quote", isSigning: false });
          // Update toast to "error"
          displayError(t.common.transaction_rejected_by_user, actionLabel);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [address, addTransaction, getTokenBalance]
  );

  return useMemo(
    () => ({ ...state, currentSwapQuote, updateSwapQuote, swap }),
    [state, currentSwapQuote, updateSwapQuote, swap]
  );
};

export default useSwapManager;

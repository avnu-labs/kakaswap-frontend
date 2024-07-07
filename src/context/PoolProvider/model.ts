import type { Eip1193Provider } from "ethers";

import type { ARFError } from "../ARFError";
import type { PoolState, TokenState } from "../WalletBaseProvider";

export interface AddLiquidityQuoteState {
  loading: boolean;
  pool?: PoolState;
  amountToken0: string;
  amountToken1: string;
  estimatedLPReceived: string;
  token0?: TokenState;
  token1?: TokenState;
  rateToken0Token1: number;
  rateToken1Token0: number;
  poolShare: number;
  slippage: number;
  isFirstAmountUpdated: boolean;
  isFirstDeposit: boolean;
  error?: ARFError;
}

export interface RemoveLiquidityQuoteState {
  loading: boolean;
  pool?: PoolState;
  amountLPToken: string;
  minToken0Received: string;
  minToken1Received: string;
  slippage: number;
  error?: ARFError;
}

export interface LiquidityManagerState {
  pools: PoolState[];
  currentAddLiquidityQuote?: AddLiquidityQuoteState;
  currentRemoveLiquidityQuote?: RemoveLiquidityQuoteState;
  isSigning: boolean;
  getAllPools: (account: Eip1193Provider) => void;
  getReserves: (
    pool: PoolState
  ) => Promise<PoolState | { reserveToken0: bigint; reserveToken1: bigint; totalSupply: bigint }>;
  getLPBalance: (pool: PoolState, account: Eip1193Provider) => void;
  getLPAllowance: (pools: PoolState, account: Eip1193Provider) => void;
  getLPAllowanceForAll: (pools: PoolState[], account: Eip1193Provider) => void;
  approveLP: (pool: PoolState, amount: string, account: Eip1193Provider) => void;
  getLPBalanceForAll: (pools: PoolState[], account: Eip1193Provider) => void;
  getPoolFromTokens: (token0: TokenState, token1: TokenState) => PoolState | undefined;
  addLiquidity: (addLiquidityQuote: AddLiquidityQuoteState, account: Eip1193Provider) => void;
  removeLiquidity: (removeLiquidityQuote: RemoveLiquidityQuoteState, account: Eip1193Provider) => void;
  updateAddLiquidityQuote: (
    token0: TokenState | undefined,
    token1: TokenState | undefined,
    amountToken0: string,
    amountToken1: string,
    isFirstAmountUpdated: boolean,
    slippage: number
  ) => void;
  updateRemoveLiquidityQuote: (pool: PoolState, amountLPToken: string, slippage: number) => void;
}

export const POOL_STATE_INITIAL_STATE: LiquidityManagerState = {
  pools: [],
  currentAddLiquidityQuote: undefined,
  currentRemoveLiquidityQuote: undefined,
  isSigning: false,
  getAllPools: () => undefined,
  getReserves: () =>
    Promise.resolve({
      address: "0x0",
      name: "",
      symbol: "",
      decimals: 0,
      totalSupply: BigInt("0"),
      token0: {
        address: "0x0",
        allowance: "0",
        balance: "0",
        chainId: -1,
        decimals: 0,
        logoURI: "",
        name: "",
        symbol: "",
        isApproving: false,
      },
      token1: {
        address: "0x0",
        allowance: "0",
        balance: "0",
        chainId: -1,
        decimals: 0,
        logoURI: "",
        name: "",
        symbol: "",
        isApproving: false,
      },
      balance: "0",
      allowance: "0",
      liquidityUSD: "0",
      volumeUSD_24: "0",
      feesUSD_24: "0",
      reserveToken0: BigInt("0"),
      reserveToken1: BigInt("0"),
      token0AmountPooled: "0",
      token1AmountPooled: "0",
      poolShare: 0,
      lastUpdate: undefined,
      isNative: false,
    }),
  getLPBalance: () => undefined,
  getLPBalanceForAll: () => undefined,
  getLPAllowance: () => undefined,
  getLPAllowanceForAll: () => undefined,
  approveLP: () => undefined,
  getPoolFromTokens: () => undefined,
  addLiquidity: () => undefined,
  removeLiquidity: () => undefined,
  updateAddLiquidityQuote: () => undefined,
  updateRemoveLiquidityQuote: () => undefined,
};

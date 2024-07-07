import type { Eip1193Provider } from "ethers";

export interface TokenState {
  name?: string;
  symbol: string;
  address: string;
  chainId: number;
  decimals: number;
  logoURI: string;
  balance: string;
  allowance: string;
  isNative?: boolean;
}

export interface PoolState {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: bigint;
  token0: TokenState;
  token1: TokenState;
  reserveToken0: bigint;
  reserveToken1: bigint;
  balance: string; // User LP balance
  token0AmountPooled: string;
  token1AmountPooled: string;
  poolShare: number;
  lastBlockHash?: string;
  liquidityUSD?: string;
  allowance: string;
  isNative: false;
}

export interface WalletBaseState {
  isSigning: boolean;
  approve: (token: TokenState | PoolState, amount: string, provider: Eip1193Provider | undefined) => Promise<any>;
  getBalance: (
    token: TokenState | PoolState,
    address: string | undefined,
    provider: Eip1193Provider | undefined
  ) => Promise<any>;
  getAllowance: (
    token: TokenState | PoolState,
    address: string | undefined,
    provider: Eip1193Provider | undefined
  ) => Promise<any>;
}

export const WALLET_BASE_STATE_INITIAL_STATE: WalletBaseState = {
  isSigning: false,
  approve: () => Promise.reject(),
  getBalance: () => Promise.reject(),
  getAllowance: () => Promise.reject(),
};

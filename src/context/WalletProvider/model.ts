import type { Eip1193Provider } from "ethers";

import type { TokenState } from "../WalletBaseProvider";

export interface WalletState {
  tokens: TokenState[];
  approveToken: (token: TokenState, amount: string, account: Eip1193Provider) => void;
  getTokenBalance: (token: TokenState, account: Eip1193Provider) => void;
  getTokenBalanceForAll: (tokens: TokenState[], account: Eip1193Provider) => void;
  getTokenAllowance: (token: TokenState, account: Eip1193Provider) => void;
  getTokenAllowanceForAll: (tokens: TokenState[], account: Eip1193Provider) => void;
}

export const WALLET_STATE_INITIAL_STATE: WalletState = {
  tokens: [],
  approveToken: () => undefined,
  getTokenBalance: () => undefined,
  getTokenBalanceForAll: () => undefined,
  getTokenAllowance: () => undefined,
  getTokenAllowanceForAll: () => undefined,
};

import type { Eip1193Provider } from "ethers";

import type { ARFError } from "../ARFError";
import type { TokenState } from "../WalletBaseProvider";

export interface SwapQuoteState {
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
  error?: ARFError;
}

export interface SwapState {
  currentSwapQuote?: SwapQuoteState;
  isSigning: boolean;
  updateSwapQuote: (
    amountTokenFrom: string,
    tokenFrom: TokenState | undefined,
    tokenTo: TokenState | undefined,
    slippage: number
  ) => void;
  swap: (swapQuote: SwapQuoteState, account: Eip1193Provider) => void;
}

export const SWAP_STATE_INITIAL_STATE: SwapState = {
  currentSwapQuote: undefined,
  isSigning: false,
  updateSwapQuote: () => undefined,
  swap: () => undefined,
};

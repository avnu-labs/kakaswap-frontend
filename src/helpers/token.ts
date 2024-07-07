import type { PoolState, TokenState } from "../context/WalletBaseProvider";

import { isReadableStringLowerEquals, readableStringNotZeroOrUndefined } from "./math";

// Check if a given token amount is zero or undefined
export const isTokenAmountZero = (token: TokenState | PoolState, amountRequested: string) => {
  return !readableStringNotZeroOrUndefined(amountRequested, token.decimals);
};

export const isEnoughBalance = (token: TokenState | PoolState | undefined, amountToken: string): boolean => {
  if (token) {
    return (
      isTokenAmountZero(token, amountToken) || isReadableStringLowerEquals(amountToken, token.balance, token.decimals)
    );
  }
  return false;
};

// Check if add liquidity action is allowed or should be disabled
// if input === 0
export const isInputsCompleteForAddLiquidity = (
  token0: TokenState | undefined,
  token1: TokenState | undefined,
  amountToken0: string,
  amountToken1: string
) => {
  if (!token0 || !token1) return false;

  const token0IsZero = isTokenAmountZero(token0, amountToken0);
  const token1IsZero = isTokenAmountZero(token1, amountToken1);
  return !token0IsZero && !token1IsZero;
};

// Check if remove liquidity action is allowed or should be disabled
// if input === 0
export const isInputsCompleteForRemoveLiquidity = (pool: PoolState, amountTokenToRemove: string) => {
  if (!pool) return false;

  const lpIsZero = isTokenAmountZero(pool, amountTokenToRemove);
  return !lpIsZero;
};

// Check if swap action is allowed or should be disabled
// if input === 0
export const isInputsCompleteForSwap = (tokens: (TokenState | undefined)[], amountToken: string) => {
  if (!tokens[0] || !tokens[1]) return false;

  const tokenIsZero = isTokenAmountZero(tokens[0], amountToken);

  return !tokenIsZero;
};

import type { PoolState } from "../context/WalletBaseProvider";

import {
  formatBigNumberToReadableString,
  getLPReceived,
  getShareOfPool,
  getTokenEquivalenceFromReserve,
  parseReadableStringToBigNumber,
  toFixed,
} from "./math";

export const addLiquidityQuote = (
  pool: PoolState | undefined,
  amountToken0: string,
  amountToken1: string,
  isFirstAmountUpdated: boolean,
  totalSupply: bigint,
  reserveToken0: bigint,
  reserveToken1: bigint,
  slippage: number
  // eslint-disable-next-line sonarjs/cognitive-complexity
) => {
  let quotedAmountToken0 = amountToken0;
  let quotedAmountToken1 = amountToken1;
  const isFirstDeposit = !pool || (reserveToken0 === BigInt(0) && reserveToken1 === BigInt(0));
  if (!isFirstDeposit && pool) {
    const { token0, token1 } = pool;
    quotedAmountToken0 = isFirstAmountUpdated ? amountToken0 : "";
    quotedAmountToken1 = isFirstAmountUpdated ? "" : amountToken1;
    // Parse input to BigNumbers
    const bnAmountToken0 = parseReadableStringToBigNumber(quotedAmountToken0, token0.decimals);
    const bnAmountToken1 = parseReadableStringToBigNumber(quotedAmountToken1, token1.decimals);

    if (bnAmountToken0 !== BigInt(0)) {
      // calculate addLiquidityQuote for token 1, base on token 0 input
      quotedAmountToken1 = getTokenEquivalenceFromReserve(
        bnAmountToken0,
        token1.decimals,
        reserveToken0,
        reserveToken1
      );
    } else if (bnAmountToken1 !== BigInt(0)) {
      // calculate addLiquidityQuote for token 0, base on token 1 input
      quotedAmountToken0 = getTokenEquivalenceFromReserve(
        bnAmountToken1,
        token0.decimals,
        reserveToken1,
        reserveToken0
      );
    }
  }

  const bnNewAmountToken0 = parseReadableStringToBigNumber(quotedAmountToken0, pool?.token0?.decimals || 18);
  const bnNewAmountToken1 = parseReadableStringToBigNumber(quotedAmountToken1, pool?.token1?.decimals || 18);

  // Calculate price of token0 for 1 token1
  const rateToken0Token1 =
    bnNewAmountToken1 !== BigInt(0) ? parseFloat(quotedAmountToken0) / parseFloat(quotedAmountToken1) : 0;

  // Calculate price of token1 for 1 token0
  const rateToken1Token0 =
    bnNewAmountToken0 !== BigInt(0) ? parseFloat(quotedAmountToken1) / parseFloat(quotedAmountToken0) : 0;

  const estimatedLPReceived = getLPReceived(pool, bnNewAmountToken0, bnNewAmountToken1);

  const floatEstimatedLPReceived = parseFloat(estimatedLPReceived);
  const minEstimatedLPReceived = (floatEstimatedLPReceived - floatEstimatedLPReceived * slippage).toString(10);

  // 100% of pool share if first deposit
  const poolShare = isFirstDeposit ? 100 : getShareOfPool(pool, totalSupply, minEstimatedLPReceived);
  return {
    quotedAmountToken0,
    quotedAmountToken1,
    rateToken0Token1,
    rateToken1Token0,
    estimatedLPReceived: minEstimatedLPReceived,
    poolShare,
    slippage,
    isFirstDeposit,
  };
};

export const removeLiquidityQuote = (
  pool: PoolState,
  amountLPToRemove: string,
  totalSupply: bigint,
  reserveToken0: bigint,
  reserveToken1: bigint,
  slippage: number
) => {
  const bnAmountLPToRemove = parseReadableStringToBigNumber(amountLPToRemove, pool.decimals);

  // return if pool empty
  if (totalSupply === BigInt(0)) {
    return {
      minToken0Received: "0",
      minToken1Received: "0",
      totalSupply,
    };
  }
  const estimatedToken0Received = formatBigNumberToReadableString(
    (bnAmountLPToRemove * reserveToken0) / totalSupply,
    pool.token0.decimals
  );
  const estimatedToken1Received = formatBigNumberToReadableString(
    (bnAmountLPToRemove * reserveToken1) / totalSupply,
    pool.token1.decimals
  );

  const floatEstimatedToken0Received = parseFloat(estimatedToken0Received);
  const minToken0Received = floatEstimatedToken0Received - floatEstimatedToken0Received * slippage;

  const floatEstimatedToken1Received = parseFloat(estimatedToken1Received);
  const minToken1Received = floatEstimatedToken1Received - floatEstimatedToken1Received * slippage;

  return {
    minToken0Received: toFixed(minToken0Received, pool.token0.decimals),
    minToken1Received: toFixed(minToken1Received, pool.token1.decimals),
    totalSupply,
  };
};

import type { PoolState } from "../context/WalletBaseProvider";

import { formatBigNumberToReadableString } from "./math";

export const amountToPercentage = (value: string, poolBalance: string): number => {
  if (!value || value === "") return 0;
  const floatBalance = parseFloat(poolBalance);
  if (poolBalance === "" || floatBalance === 0) return 0;

  return +Math.min((parseFloat(value) / floatBalance) * 100, 100).toFixed(2);
};

// Get a % of balance
export const percentageToAmount = (percentage: number, poolBalance: string): string => {
  if (percentage === 0) return "0";
  if (percentage === 100) return poolBalance.toString();
  return ((parseFloat(poolBalance) / 100) * percentage).toString();
};

// Get the fraction of an amount
export const percentageOfAmount = (percentage: number, amount: string): string | undefined => {
  if (amount === "") return undefined;
  return ((parseFloat(amount) / 100) * percentage).toString();
};

// Get total liquidity i nUSD from reserve & tokens
// TODO Make a service to fetch price from CMC / CoinGecko ??
export const getTotalLiquidityInUSD = (pool: PoolState, reserveToken0: bigint, reserveToken1: bigint): string => {
  // Here we fixed both price at 0.419$ for testing purpose
  return formatBigNumberToReadableString(
    (reserveToken0 * BigInt(419)) / BigInt(1000) + (reserveToken1 * BigInt(419)) / BigInt(1000),
    pool.decimals
  );
};

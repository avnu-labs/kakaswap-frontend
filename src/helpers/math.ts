import type { BigNumberish } from "ethers";
import { formatUnits, parseUnits } from "ethers";

import type { PoolState } from "../context/WalletBaseProvider";

const ONE = BigInt(1);
const TWO = BigInt(2);

const bigNumberSqrt = (value: bigint): bigint => {
  let z = (value + ONE) / TWO;
  let y = value;
  while (z - y < 0) {
    y = z;
    z = (value / z + z) / TWO;
  }
  return y;
};

// Avoid scientific notation, limit length to fraction digits
export const toFixed = (x: number, fractionDigits: number) => {
  let result: any = parseFloat(x.toFixed(fractionDigits));
  if (Math.abs(result) < 1.0) {
    const e = parseInt(result.toString().split("e-")[1], 10);
    if (e) {
      result *= 10 ** (e - 1);
      result = `0.${(new Array(e).join("0") + result.toString().substring(2)).substring(0, fractionDigits)}`;
    }
  } else {
    let e = parseInt(result.toString().split("+")[1], 10);
    if (e > 20) {
      e -= 20;
      result /= 10 ** e;
      result += new Array(e + 1).join("0");
    }
  }
  return `${result}`;
};

// Transform a big string hexadecimal to a big string decimal
export const stringHexToStringDec = (valueHex: BigNumberish): string => BigInt(valueHex).toString();

// ------------------ Format to readable ------------------ //

export const formatBigNumberToReadableString = (value: bigint, decimals: number): string =>
  formatUnits(value, decimals);

// ------------------ Parse from readable ------------------ //

export const parseReadableStringToBigNumber = (value: string, decimals: number): bigint => {
  try {
    return parseUnits(value.toString(), decimals);
  } catch (e) {
    // Parsing errors, return 0
    return BigInt("0");
  }
};

export const readableStringNotZeroOrUndefined = (value: string, decimal: number): boolean => {
  return value !== "" && parseReadableStringToBigNumber(value, decimal) !== BigInt(0);
};

export const isReadableStringLowerEquals = (value0: string, value1: string, decimalValue: number): boolean => {
  return parseReadableStringToBigNumber(value0, decimalValue) <= parseReadableStringToBigNumber(value1, decimalValue);
};

// ------------------ Calculs (be aware of types) ------------------ //

export const getLPReceived = (pool: PoolState | undefined, amountToken0: bigint, amountToken1: bigint): string => {
  if (!pool) return "0";
  const { reserveToken0, reserveToken1 } = pool;

  // If it's first deposit
  if (reserveToken0 === BigInt(0) && reserveToken1 === BigInt(0)) {
    if (amountToken0 === BigInt(0) || amountToken1 === BigInt(0)) {
      return "0";
    }

    // TODO display min liquidity error if < minLiquidity
    const minLiquidity = BigInt(10 ** 3);
    return formatBigNumberToReadableString(bigNumberSqrt(amountToken0 * amountToken1) - minLiquidity, pool.decimals);
  }

  // if pool is already filled
  const lpToken0 = amountToken0 * pool.totalSupply;
  const lpToken1 = amountToken1 * pool.totalSupply;
  const quotientToken0 = lpToken0 / reserveToken0;
  const quotientToken1 = lpToken1 / reserveToken1;
  const result = quotientToken0 < quotientToken1 ? quotientToken0 : quotientToken1;
  return formatBigNumberToReadableString(result, pool.decimals);
};

// Get the share of a pool given by amounts put in
// afterAddingLiquidity = false to get actual share of pool
export const getShareOfPool = (
  pool: PoolState | undefined,
  totalSupply: bigint,
  lpAmount: string,
  afterAddingLiquidity = true
): number => {
  if (!pool) return 100;
  const { decimals } = pool;
  const bnLPAmount = parseReadableStringToBigNumber(lpAmount, decimals);
  const bnNewTotalSupply = totalSupply + bnLPAmount;
  const supply = afterAddingLiquidity ? bnNewTotalSupply : totalSupply;
  if (supply === BigInt(0)) return 0;
  // get 2 decimals precision, sufficient to display < 0.01%
  // Multiply by 10^10 & divide by 10^8 === multiply by 100
  return Number(toFixed(parseFloat(((bnLPAmount * BigInt(10 ** 10)) / supply).toString()) / 10 ** 8, decimals));
};

// Get equivalence on token1 for input token0 base on reserve of the pool
export const getTokenEquivalenceFromReserve = (
  amountTokenFrom: bigint,
  decimalTokenTo: number,
  reserveTokenFrom: bigint,
  reserveTokenTo: bigint
): string => {
  // Calculate the token equivalence
  return formatBigNumberToReadableString((amountTokenFrom * reserveTokenTo) / reserveTokenFrom, decimalTokenTo);
};

// Get fractional amount base on input percentage
export const getAmountPercentage = (amount: bigint, slippage: number): bigint => {
  const slippageInMil = BigInt(slippage * 1000);
  return (amount / BigInt(1000)) * (BigInt(1000) - slippageInMil);
};

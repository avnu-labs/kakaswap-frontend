// eslint-disable-next-line max-classes-per-file
import type { PoolState, TokenState } from "./WalletBaseProvider";

export enum ARFErrorType {
  INSUFFICIENT_BALANCE = "INSUFFICIENT_BALANCE",
  INSUFFICIENT_LIQUIDITY = "INSUFFICIENT_LIQUIDITY",
  POOL_NOT_EXIST = "POOL_NOT_EXIST",
  POOL_HAS_NO_LIQUIDITY = "POOL_HAS_NO_LIQUIDITY",
  UNKNOWN = "UNKNOWN_SWAP_ERROR",
}

export class ARFError extends Error {
  type: ARFErrorType;

  constructor(type: ARFErrorType, message?: string) {
    super(message);
    this.type = type;
  }
}

export class NotEnoughBalanceError extends ARFError {
  constructor(token0: TokenState | PoolState, token1?: TokenState) {
    const text = token1 ? `${token0.symbol} & ${token1.symbol}` : token0.symbol;
    super(ARFErrorType.INSUFFICIENT_BALANCE, `Not enough ${text} balance`);
  }
}

export class NotEnoughLiquidityError extends ARFError {
  constructor() {
    super(ARFErrorType.INSUFFICIENT_BALANCE, `Not enough liquidity`);
  }
}

export class PoolNotExistError extends ARFError {
  constructor() {
    super(ARFErrorType.POOL_NOT_EXIST, "Pool not exist");
  }
}

export class PoolHasNoLiquidityError extends ARFError {
  constructor() {
    super(ARFErrorType.POOL_HAS_NO_LIQUIDITY, "No liquidity needed");
  }
}

export class UnknownError extends ARFError {
  constructor(message?: string) {
    super(ARFErrorType.UNKNOWN, message);
  }
}

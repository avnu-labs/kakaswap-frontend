import type { TokenState } from "./model";

// eslint-disable-next-line import/prefer-default-export
export const aTokenState = (): TokenState => ({
  name: "Kakaswap Coin",
  symbol: "KKC",
  address: "1234",
  chainId: 1001,
  decimals: 18,
  logoURI: "logo",
  balance: "20", // TODO: why having balance ? there is 'getBalance()'
  allowance: "20", // TODO: why having allowance ? there is 'getAllowance()'
});

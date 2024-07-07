import tokensJson from "../assets/default.tokenlist.json";

export function getDefaultList(chainId: number) {
  return tokensJson.tokens.filter((token) => token.chainId === chainId);
}

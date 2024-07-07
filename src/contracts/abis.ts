// Minimals abis for UniswapV2

export const RouterAbi = [
  "function swapExactTokensForTokens(uint, uint, address[], address, uint) external returns (uint[])",
  "function swapExactTokensForETH(uint, uint, address[], address, uint) external returns (uint[])",
  "function swapExactETHForTokens(uint, address[], address, uint) external returns (uint[])",
];

export const Weth9Abi = ["function deposit() external returns ()", "function withdraw(uint) external returns ()"];

export const PairAbi = [
  "function token0() view returns (address)",
  "function token1() view returns (address)",
  "function symbol() view returns (uint)",
  "function getReserves() view returns (uint, uint)",
  "function totalSupply() view returns (uint)",
  "function balanceOf(address) view returns (uint)",
];

export const FactoryAbi = [
  "function allPairs(uint) view returns (address pair)",
  "function allPairsLength() view returns (uint)",
];

export const TokenAbi = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function balanceOf(address) view returns (uint)",
  "function transfer(address to, uint amount)",
  "function approve(address, uint) external returns (bool)",
  "function allowance(address, address) view returns (uint)",
  "event Transfer(address indexed from, address indexed to, uint amount)",
];

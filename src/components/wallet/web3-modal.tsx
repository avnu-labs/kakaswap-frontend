import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react";

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "";

// 2. Set chains
export const kakarotSepolia = {
  chainId: 920637907288165,
  name: "Kakarot Sepolia",
  currency: "ETH",
  explorerUrl: "https://sepolia.kakarotscan.org",
  rpcUrl: "https://sepolia-rpc-priority.kakarot.org",
};

// 3. Create a metadata object
const metadata = {
  name: "KakaSwap",
  description: "Kakarot AMM",
  url: "https://www.kakaswap.xyz",
  icons: ["https://www.kakaswap.xyz/kakarot_logo_mini.svg"],
};
// 4. Create Ethers config
const ethersConfig = defaultConfig({
  metadata,
  enableEIP6963: true, // true by default
  enableInjected: true, // true by default
  enableCoinbase: false, // true by default
});

// 5. Create a Web3Modal instance
createWeb3Modal({
  ethersConfig,
  chains: [kakarotSepolia],
  projectId,
  enableAnalytics: false,
  enableOnramp: false,
  themeVariables: {
    "--w3m-accent": "#fe7506",
    "--w3m-color-mix": "#FFFADB",
    "--w3m-color-mix-strength": 50,
  },
  themeMode: "light",
});

function Web3Modal({ children }: { children: JSX.Element }) {
  return children;
}

export default Web3Modal;

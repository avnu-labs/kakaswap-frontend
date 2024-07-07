import { useWeb3ModalProvider } from "@web3modal/ethers/react";
import { BrowserProvider } from "ethers";
import React, { useMemo } from "react";

import { BlockContext } from "./context";

export interface BlockHashProviderProps {
  children: React.ReactNode;
  interval?: number;
}

export function BlockHashProvider({ interval, children }: BlockHashProviderProps): JSX.Element {
  const { walletProvider } = useWeb3ModalProvider();
  const [blockHash, setBlockHash] = React.useState<string | undefined>(undefined);
  const [blockNumber, setBlockNumber] = React.useState<number | undefined>(undefined);

  const fetchBlockHash = React.useCallback(() => {
    if (!walletProvider) return;
    new BrowserProvider(walletProvider)
      .getBlock("latest")
      .then((block) => {
        if (!block) return;
        const { hash, number } = block;
        if (!hash || !number) return;
        setBlockHash(hash);
        setBlockNumber(number);
      })
      .catch(console.log);
  }, [walletProvider]);

  React.useEffect(() => {
    fetchBlockHash();
    const intervalId = setInterval(() => {
      fetchBlockHash();
    }, interval ?? 5000);
    return () => clearInterval(intervalId);
  }, [interval, fetchBlockHash]);

  const contextValue = useMemo(() => ({ blockHash, blockNumber }), [blockHash, blockNumber]);
  return <BlockContext.Provider value={contextValue}>{children}</BlockContext.Provider>;
}

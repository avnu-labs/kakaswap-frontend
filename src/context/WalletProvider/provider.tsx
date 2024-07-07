import type React from "react";

import { WalletContext } from "./context";
import useWalletManager from "./manager";

export interface WalletProviderProps {
  children: React.ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps): JSX.Element {
  const state = useWalletManager();
  return <WalletContext.Provider value={state}>{children}</WalletContext.Provider>;
}

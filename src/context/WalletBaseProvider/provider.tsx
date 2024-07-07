import type React from "react";

import { WalletBaseContext } from "./context";
// eslint-disable-next-line import/no-cycle
import { useWalletBaseManager } from "./index";

export interface WalletBaseProviderProps {
  children: React.ReactNode;
}

export function WalletBaseProvider({ children }: WalletBaseProviderProps): JSX.Element {
  const state = useWalletBaseManager();
  return <WalletBaseContext.Provider value={state}>{children}</WalletBaseContext.Provider>;
}

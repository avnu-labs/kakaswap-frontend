import type React from "react";

import { SwapContext } from "./context";
import useSwapManager from "./manager";

export interface SwapProviderProps {
  children: React.ReactNode;
}

export function SwapProvider({ children }: SwapProviderProps): JSX.Element {
  const state = useSwapManager();
  return <SwapContext.Provider value={state}>{children}</SwapContext.Provider>;
}

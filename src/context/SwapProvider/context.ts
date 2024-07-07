import React from "react";

import type { SwapState } from "./model";
import { SWAP_STATE_INITIAL_STATE } from "./model";

export const SwapContext = React.createContext<SwapState>(SWAP_STATE_INITIAL_STATE);

export function useSwap() {
  return React.useContext(SwapContext);
}

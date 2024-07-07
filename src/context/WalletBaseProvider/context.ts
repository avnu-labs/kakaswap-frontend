import React from "react";

import type { WalletBaseState } from "./model";
import { WALLET_BASE_STATE_INITIAL_STATE } from "./model";

export const WalletBaseContext = React.createContext<WalletBaseState>(WALLET_BASE_STATE_INITIAL_STATE);

export function useWalletBase() {
  return React.useContext(WalletBaseContext);
}

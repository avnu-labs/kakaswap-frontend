import React from "react";

import type { WalletState } from "./model";
import { WALLET_STATE_INITIAL_STATE } from "./model";

export const WalletContext = React.createContext<WalletState>(WALLET_STATE_INITIAL_STATE);

export function useWallet() {
  return React.useContext(WalletContext);
}

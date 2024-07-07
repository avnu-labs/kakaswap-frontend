import { createContext, useContext } from "react";

import type { LiquidityManagerState } from "./model";
import { POOL_STATE_INITIAL_STATE } from "./model";

export const PoolContext = createContext<LiquidityManagerState>(POOL_STATE_INITIAL_STATE);
export const usePool = (): LiquidityManagerState => useContext(PoolContext);

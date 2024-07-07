import type { FC, ReactNode } from "react";

import { PoolContext } from "./context";
import usePoolManager from "./manager";

interface Props {
  children: ReactNode;
}

const PoolProvider: FC<Props> = ({ children }) => {
  const state = usePoolManager();
  return <PoolContext.Provider value={state}>{children}</PoolContext.Provider>;
};

export default PoolProvider;

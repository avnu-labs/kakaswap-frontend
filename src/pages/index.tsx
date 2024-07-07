import { Box } from "@chakra-ui/react";
import type { FC } from "react";

import SwapManager from "../components/swap/SwapManager";

const SwapScreen: FC = () => (
  <Box mb={8} w="500px" display="flex" flexDirection="column" alignItems="center">
    <SwapManager />
  </Box>
);

export default SwapScreen;

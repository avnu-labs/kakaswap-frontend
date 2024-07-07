import type { DeepPartial, Theme } from "@chakra-ui/react";

const Tooltip: DeepPartial<Theme["components"]["Tooltip"]> = {
  baseStyle: {
    background: "pineGreen.900",
    color: "white",
    borderRadius: "xl",
    padding: "8px 12px",
    fontSize: "12px",
  },
};

export default Tooltip;

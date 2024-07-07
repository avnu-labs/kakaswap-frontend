import type { DeepPartial, Theme } from "@chakra-ui/react";

const Popover: DeepPartial<Theme["components"]["Popover"]> = {
  baseStyle: {
    content: {
      _focus: {
        boxShadow: "none",
      },
      _light: {
        bg: "whiteArgile.900",
        border: "1px solid",
        borderColor: "carrotOrange.900",
      },
    },
    header: {
      border: "none",
    },
    footer: {
      border: "none",
    },
  },
};

export default Popover;

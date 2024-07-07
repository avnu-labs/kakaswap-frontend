import type { DeepPartial, Theme } from "@chakra-ui/react";

const Button: DeepPartial<Theme["components"]["Button"]> = {
  baseStyle: {
    borderRadius: "8px",
    outline: "none",
    fontVariant: "none",
    textDecoration: "none !important",
    boxShadow: "none !important",
    _light: {
      color: "whiteAlpha.900",
      bg: "carrotOrange.900",
      _hover: {
        bg: "carrotOrange.700",
      },
      _active: {
        bg: "carrotOrange.900",
      },
      _disabled: {
        bg: "carrotOrange.700",
      },
    },
  },
};

export default Button;

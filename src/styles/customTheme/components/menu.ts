import type { DeepPartial, Theme } from "@chakra-ui/react";

const Menu: DeepPartial<Theme["components"]["Menu"]> = {
  baseStyle: {
    list: {
      _light: {
        bg: "whiteArgile.900",
        border: "1px solid",
        borderColor: "carrotOrange.900",
      },
    },
    item: {
      opacity: ".7",
      _light: {
        bg: "inherit",
        textDecoration: "none",
        outline: "none",
        boxShadow: "none",
        _hover: {
          opacity: ".9",
        },
        _focus: {
          opacity: ".9",
        },
        _active: {
          opacity: "1",
        },
      },
    },
  },
};

export default Menu;

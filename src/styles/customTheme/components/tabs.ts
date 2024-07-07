import type { DeepPartial, Theme } from "@chakra-ui/react";

const Tabs: DeepPartial<Theme["components"]["Tabs"]> = {
  baseStyle: {
    tab: {
      mr: 1,
      _light: {
        borderRadius: "xl",
        _selected: {
          color: "white",
          background: "pineGreen.900",
        },
        _focus: {
          outline: "none",
          boxShadow: "none",
        },
      },
    },
  },
};

export default Tabs;

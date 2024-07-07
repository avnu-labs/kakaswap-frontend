import type { DeepPartial, Theme } from "@chakra-ui/react";

const Modal: DeepPartial<Theme["components"]["Modal"]> = {
  baseStyle: {
    dialog: {
      borderRadius: "xl",
      _light: {
        background: "whiteArgile.900",
      },
    },
    body: {
      _light: {
        background: "whiteArgile.900",
        borderBottomRadius: "xl",
      },
    },
    closeButton: {
      _focus: {
        outline: "none",
        boxShadow: "none",
      },
    },
  },
};

export default Modal;

import type { DeepPartial, Theme } from "@chakra-ui/react";

const Table: DeepPartial<Theme["components"]["Table"]> = {
  baseStyle: {
    thead: {
      th: {
        fontSize: "11px",
        borderColor: "pineGreen.300",
        transition: "color .1s ease-in",
        "&:first-of-type": {
          paddingStart: "0",
        },
        "&:last-of-type": {
          paddingEnd: "0",
        },
      },
    },
    tbody: {
      td: {
        fontSize: "14px",
        "&:first-of-type": {
          paddingStart: "0",
        },
        "&:last-of-type": {
          paddingEnd: "0",
        },
      },
    },
  },
};

export default Table;

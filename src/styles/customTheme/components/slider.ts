import type { DeepPartial, Theme } from "@chakra-ui/react";

const Slider: DeepPartial<Theme["components"]["Slider"]> = {
  baseStyle: {
    thumb: {
      _light: {
        bg: "pineGreen.900",
        outline: "none",
        boxShadow: "none",
      },
    },
    track: {
      _light: {
        bg: "pineGreen.300",
      },
    },
    filledTrack: {
      _light: {
        bg: "pineGreen.900",
      },
    },
  },
};

export default Slider;

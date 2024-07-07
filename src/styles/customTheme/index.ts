import { extendTheme } from "@chakra-ui/react";
import type { Styles } from "@chakra-ui/theme-tools";

import colors from "./colors";
import Button from "./components/button";
import Input from "./components/input";
import Menu from "./components/menu";
import Modal from "./components/modal";
import Popover from "./components/popover";
import Slider from "./components/slider";
import Table from "./components/table";
import Tabs from "./components/tabs";
import Tooltip from "./components/tooltip";
import fonts from "./fonts";

const globalStyles: Styles = {
  global: () => ({
    body: {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      color: colors.pineGreen["900"],
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      bg: colors.whiteArgile["900"],
    },
  }),
};
const customTheme = extendTheme({
  initialColorMode: "light",
  useSystemColorMode: false,
  fonts,
  colors,
  styles: globalStyles,
  components: {
    Button,
    Modal,
    Popover,
    Input,
    Table,
    Menu,
    Tabs,
    Slider,
    Tooltip,
  },
});

export default customTheme;

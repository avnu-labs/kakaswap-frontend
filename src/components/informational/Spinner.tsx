import { Box, Flex } from "@chakra-ui/react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";

const id = "__419SPINNER__";
const SVGEmbeddedStyle = ({ animation }: any) => {
  return <style>{animation}</style>;
};

const RotateAnimation = `@keyframes Rotate${id}{100%{transform:rotate(360deg);}}`;
const rotate360 = `@keyframes rotate${id}{0% {transform: rotate(0deg);}100% {transform: rotate(360deg);}}`;

const spinnerAnimation = [RotateAnimation, rotate360].join("\n");

interface SpinnerProps {
  animate?: boolean;
  color?: string;
}
const Spinner = ({ animate = true, color }: SpinnerProps) => {
  const primary = "#FF7500";
  return (
    <Flex ml="5px" h="16px" w="16px" align="center" transition="250ms ease color">
      <Box
        w="8px"
        h="8px"
        minHeight="8px"
        minWidth="8px"
        borderRadius="50%"
        position="relative"
        backgroundColor={color || primary}
        transition="250ms ease background-color"
      >
        {animate && (
          <>
            <SVGEmbeddedStyle animation={spinnerAnimation} />
            <Box
              animation={`rotate${id} 1s cubic-bezier(0.83, 0, 0.17, 1) infinite`}
              transform="translateZ(0)"
              borderTop="1px solid transparent"
              borderRight="1px solid transparent"
              borderBottom="1px solid transparent"
              borderLeft={`2px solid ${color || primary}`}
              background="transparent"
              w="14px"
              h="14px"
              borderRadius="50%"
              position="relative"
              transition="250ms ease border-color"
              left="-3px"
              top="-3px"
            />
          </>
        )}
      </Box>
    </Flex>
  );
};

export default Spinner;

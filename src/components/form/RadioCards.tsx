import { Box, HStack } from "@chakra-ui/layout";
import type { RadioProps as ChakraRadioProps } from "@chakra-ui/radio";
import { useRadio, useRadioGroup } from "@chakra-ui/radio";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";

const RadioCard = (props: ChakraRadioProps) => {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();
  const { children, isDisabled } = props;
  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        fontWeight="medium"
        cursor={isDisabled ? "normal" : "pointer"}
        borderWidth="1px"
        borderRadius="xl"
        color="pineGreen.700"
        borderColor={isDisabled ? "transparent" : "pineGreen.300"}
        _checked={{
          color: "white",
          bg: "pineGreen.900",
          borderColor: "pineGreen.900",
        }}
        px={3}
        py={1}
      >
        {children}
      </Box>
    </Box>
  );
};

interface RadioCardsProps {
  type: "percentage" | undefined;
  onChange: (newPercentage: any) => void;
}
const RadioCards = ({ type, onChange }: RadioCardsProps) => {
  const options =
    type === "percentage"
      ? [
          { value: 25, text: "25%" },
          { value: 50, text: "50%" },
          { value: 75, text: "75%" },
          { value: 100, text: "100%" },
        ]
      : [];

  const { getRootProps, getRadioProps } = useRadioGroup({
    onChange,
  });

  const group = getRootProps();
  const firstIndicationText = "0%";
  return (
    <HStack {...group} w="full" justify="space-between">
      <RadioCard isDisabled key={0} {...getRadioProps({ value: firstIndicationText })}>
        {firstIndicationText}
      </RadioCard>
      {options.map(({ value, text }) => {
        const radio = getRadioProps({ value: text });
        return (
          <RadioCard key={value} {...radio}>
            {text}
          </RadioCard>
        );
      })}
    </HStack>
  );
};

export default RadioCards;

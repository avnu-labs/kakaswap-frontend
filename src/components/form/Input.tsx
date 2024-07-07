import type { InputProps as ChakraInputProps } from "@chakra-ui/react";
import { Input as ChakraInput, InputGroup, InputRightElement } from "@chakra-ui/react";
import { forwardRef } from "@chakra-ui/system";
import type { ChangeEvent } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";

interface InputProps extends ChakraInputProps {
  disabled?: boolean;
  fontSize?: number | string;
  inputRightElement?: JSX.Element;
  placeholder: string;
  onInputChanged: (event: ChangeEvent<HTMLInputElement>) => void;
}

const Input = forwardRef<InputProps, "input">(
  ({ disabled, fontSize = 24, inputRightElement, value, placeholder, onInputChanged, ...props }: InputProps, ref) => {
    return (
      <InputGroup>
        <ChakraInput
          {...props}
          ref={ref}
          value={value}
          onChange={onInputChanged}
          fontSize={fontSize}
          opacity={disabled ? 0.5 : 1}
          variant="unstyled"
          placeholder={placeholder}
          disabled={disabled}
        />
        {inputRightElement && <InputRightElement h="full">{inputRightElement}</InputRightElement>}
      </InputGroup>
    );
  }
);

export default Input;

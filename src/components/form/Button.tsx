import type { ButtonProps as ChakraButtonProps } from "@chakra-ui/button";
import { Button as ChakraButton } from "@chakra-ui/button";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";

interface ButtonProps extends ChakraButtonProps {
  errorText?: string;
}
const Button = ({ errorText, children, disabled, ...props }: ButtonProps) => {
  let isButtonDisabled = disabled;
  if (errorText) {
    isButtonDisabled = true;
  }

  return (
    <ChakraButton disabled={isButtonDisabled} {...props}>
      {errorText || children}
    </ChakraButton>
  );
};

export default Button;

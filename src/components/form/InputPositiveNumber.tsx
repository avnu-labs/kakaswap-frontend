import type { InputProps } from "@chakra-ui/react";
import { forwardRef } from "@chakra-ui/system";
import type { ChangeEvent } from "react";

import { isPositiveNumber } from "../../services/form.service";

import Input from "./Input";

interface Props extends InputProps {
  disabled?: boolean;
  fontSize?: number;
  inputRightElement?: JSX.Element;
  onChangeNumber: (amount: string) => void;
}

const InputPositiveNumber = forwardRef<Props, "input">(
  ({ value, disabled, fontSize = 24, inputRightElement, onChangeNumber, ...props }: Props, ref) => {
    const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
      if (target.value === "" || isPositiveNumber(target.value)) onChangeNumber(target.value);
    };

    return (
      <Input {...props} ref={ref} fontSize={fontSize} value={value} placeholder="0.00" onInputChanged={handleChange} />
    );
  }
);

export default InputPositiveNumber;

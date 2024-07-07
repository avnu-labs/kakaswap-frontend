import { HStack } from "@chakra-ui/layout";
import { Text, Tooltip } from "@chakra-ui/react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";

import { toFixed } from "../../helpers/math";

interface TruncatedAmountProps {
  amount: string | number;
  symbol?: string;
  showFull?: boolean;
  isDisabled?: boolean;
}
const TruncatedAmount = ({ amount, symbol = "", showFull = false, isDisabled = false }: TruncatedAmountProps) => {
  const typedAmount = typeof amount === "number" ? amount : parseFloat(amount);
  const isZero = typedAmount === 0;
  const fullAmount = toFixed(typedAmount, 22);
  const truncatedAmount = toFixed(typedAmount, 5);
  const lowerThanMinDisplay = truncatedAmount === "0" && !showFull;
  return (
    <Tooltip label={fullAmount} placement="left" closeOnClick={false} isDisabled={!lowerThanMinDisplay || isDisabled}>
      <HStack spacing={1}>
        <Text>
          {showFull && fullAmount}
          {!showFull &&
            /* eslint-disable-next-line no-nested-ternary */
            (isZero ? "0" : lowerThanMinDisplay ? " < 0.00001" : truncatedAmount)}
        </Text>
        <Text>{symbol}</Text>
      </HStack>
    </Tooltip>
  );
};

export default TruncatedAmount;

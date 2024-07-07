import type { TagProps as ChakraTagProps } from "@chakra-ui/react";
import {
  Popover,
  PopoverBody,
  Portal,
  PopoverTrigger,
  Text,
  PopoverContent,
  PopoverHeader,
  Box,
  Flex,
  Tag as ChakraTag,
  PopoverFooter,
} from "@chakra-ui/react";
import type { FC } from "react";
import { useCallback, useEffect, useState } from "react";
import * as React from "react";
import { HiOutlineCog } from "react-icons/hi";

import { SLIPPAGE_SEVERITY } from "../../helpers/constants";
import InputPositiveNumber from "../form/InputPositiveNumber";

const slippageValuesBase = ["0.1", "0.5", "1"];

interface TagProps extends ChakraTagProps {
  isSelected: boolean;
  onClick: () => void;
}

const Tag = ({ isSelected, onClick, children, ...props }: TagProps) => {
  return (
    <ChakraTag
      bg={isSelected ? "carrotOrange.700" : "transparent"}
      color={isSelected ? "white" : "carrotOrange.900"}
      border="1px solid"
      borderColor="carrotOrange.900"
      onClick={onClick}
      {...props}
      cursor="pointer"
    >
      {children}
    </ChakraTag>
  );
};

enum SlippageSeverity {
  SAFE,
  MAY_FAIL,
  MAY_FRONT_RUN,
  TOO_HIGH,
}

interface Props {
  initialValue: number;
  onChange: (slippage: number) => void;
}
const PopoverOptions: FC<Props> = ({ initialValue, onChange }) => {
  const initialFocusRef = React.useRef(null);
  const [slippage, setSlippage] = useState<string>(initialValue.toString());
  const [slippageSeverity, setSlippageSeverity] = useState<SlippageSeverity>(SlippageSeverity.SAFE);

  const checkSeverity = useCallback((): SlippageSeverity => {
    const fSlippage = parseFloat(slippage) || 0;
    const [MAY_FAIL, MAY_FRONT_RUN, TOO_HIGH] = SLIPPAGE_SEVERITY;
    if (fSlippage < MAY_FAIL) {
      return SlippageSeverity.MAY_FAIL;
    }
    if (fSlippage > TOO_HIGH) {
      return SlippageSeverity.TOO_HIGH;
    }
    if (fSlippage > MAY_FRONT_RUN) {
      return SlippageSeverity.MAY_FRONT_RUN;
    }
    return SlippageSeverity.SAFE;
  }, [slippage]);

  const getSeverityText = (severity: SlippageSeverity) => {
    switch (severity) {
      case SlippageSeverity.TOO_HIGH:
        return "Slippage too high";
      case SlippageSeverity.MAY_FAIL:
        return "Your tx may fail";
      case SlippageSeverity.MAY_FRONT_RUN:
        return "Your tx may be front run";
      case SlippageSeverity.SAFE:
      default:
        return "";
    }
  };

  useEffect(() => {
    if (slippage === "") {
      onChange(0);
    } else {
      let fSlippage = parseFloat(slippage);
      fSlippage = Math.min(fSlippage, 50); // Max 50% slippage
      const formattedSlippage = parseFloat(fSlippage.toFixed(2));
      onChange(formattedSlippage);
    }
    setSlippageSeverity(checkSeverity());
  }, [checkSeverity, onChange, slippage]);
  return (
    <Popover isLazy id="options-popover-id" placement="bottom-end" initialFocusRef={initialFocusRef}>
      <PopoverTrigger>
        <Box marginLeft="auto" as="button">
          <HiOutlineCog size={18} />
        </Box>
      </PopoverTrigger>
      <Portal>
        <PopoverContent fontSize="14px">
          <PopoverHeader>Settings</PopoverHeader>
          <PopoverBody>
            <Text>Slippage tolerance</Text>
            <Flex mt={4} direction="row" justify="space-between">
              <Box flex={1}>
                <InputPositiveNumber
                  ref={initialFocusRef}
                  fontSize={18}
                  inputRightElement={<Text>%</Text>}
                  value={slippage}
                  onChangeNumber={setSlippage}
                />
              </Box>
              <Flex direction="row" flex={2} justify="flex-end">
                {slippageValuesBase.map((tagValue) => {
                  return (
                    <Tag
                      key={`option-tag-${tagValue}`}
                      isSelected={tagValue === slippage}
                      onClick={() => setSlippage(tagValue)}
                      mx={1}
                    >
                      {tagValue}%
                    </Tag>
                  );
                })}
              </Flex>
            </Flex>
          </PopoverBody>

          {slippageSeverity !== SlippageSeverity.SAFE && (
            <PopoverFooter>
              <Text color="error.900">{getSeverityText(slippageSeverity)}</Text>
            </PopoverFooter>
          )}
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

export default PopoverOptions;

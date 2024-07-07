import type { FlexProps } from "@chakra-ui/layout";
import { Box, Flex } from "@chakra-ui/layout";
import type { FC } from "react";

import { useTranslate } from "../../context/TranslateProvider";
import type { TokenState } from "../../context/WalletBaseProvider";

import TokenFormItem from "./TokenFormItem";
import { TokenFormType } from "./TokensForm";

interface Props extends FlexProps {
  token0: TokenState | undefined;
  token1: TokenState | undefined;
  amountToken0: string;
  amountToken1: string;
  type: TokenFormType;
}

const TokensFormStatus: FC<Props> = ({ token0, token1, amountToken0, amountToken1, type, ...props }) => {
  const { t } = useTranslate();
  return (
    <Flex direction="column" {...props} w="full">
      <Box mb={4}>
        <TokenFormItem
          label={type === TokenFormType.SWAP ? t.common.from : ""}
          onlyStatus
          token={token0}
          amount={amountToken0}
          onChangeAmount={() => {}}
          onChangeToken={() => {}}
        />
      </Box>
      <Box>
        <TokenFormItem
          label={type === TokenFormType.SWAP ? t.common.to : ""}
          onlyStatus
          token={token1}
          amount={amountToken1}
          onChangeAmount={() => {}}
          onChangeToken={() => {}}
        />
      </Box>
    </Flex>
  );
};

export default TokensFormStatus;

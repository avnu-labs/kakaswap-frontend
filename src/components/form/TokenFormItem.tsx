import { Box, Flex, Text, useColorMode } from "@chakra-ui/react";
import type { FC } from "react";

import type { TokenState } from "../../context/WalletBaseProvider";
import CoinChooser from "../coin/CoinChooser";

import BalancePercentageSelector from "./BalancePercentageSelector";
import InputPositiveNumber from "./InputPositiveNumber";

interface Props {
  amount: string;
  token: TokenState | undefined;
  label: string;
  disabled?: boolean;
  onlyStatus?: boolean;
  onChangeToken: (token: TokenState) => void;
  onChangeAmount: (amount: string) => void;
}

const TokenFormItem: FC<Props> = ({
  amount,
  label,
  token,
  disabled = false,
  onlyStatus = false,
  onChangeToken,
  onChangeAmount,
}) => {
  const { colorMode } = useColorMode();
  return (
    <Box
      border="1px solid"
      borderColor={colorMode === "light" ? "blackAlpha.500" : "whiteAlpha.600"}
      padding={2}
      borderRadius={6}
      w="full"
    >
      <Flex fontSize={14} justify="space-between" align="center" mb={2}>
        <Text>{label}</Text>
        {!onlyStatus && <BalancePercentageSelector token={token} disabled={disabled} onChangeAmount={onChangeAmount} />}
      </Flex>
      <Flex justify="space-between" align="center">
        <Box sx={{ flex: 1 }}>
          <InputPositiveNumber disabled={disabled || onlyStatus} value={amount} onChangeNumber={onChangeAmount} />
        </Box>
        <CoinChooser value={token} disabled={onlyStatus} onChange={onChangeToken} />
      </Flex>
    </Box>
  );
};

export default TokenFormItem;

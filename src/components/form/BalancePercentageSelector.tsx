import type { TextProps } from "@chakra-ui/react";
import { Text, Box, Flex } from "@chakra-ui/react";
import { faWallet } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { FC } from "react";

import type { TokenState } from "../../context/WalletBaseProvider";
import { toFixed } from "../../helpers/math";

const StyledText: FC<TextProps & { disabled?: boolean }> = ({ disabled, ...props }) => (
  <Text
    as="span"
    mr={2}
    cursor="pointer"
    maxWidth="100px"
    whiteSpace="nowrap"
    overflow="hidden"
    textOverflow="ellipsis"
    _hover={{ textDecoration: disabled ? "none" : "underline" }}
    {...props}
  />
);

interface Props {
  token: TokenState | undefined;
  disabled?: boolean;
  onChangeAmount: (amount: string) => void;
}

const BalancePercentageSelector: FC<Props> = ({ token, disabled = false, onChangeAmount }) => {
  const handleClickPercentage = (percentOfBalance: number) => () => {
    if (!token || disabled) return;
    onChangeAmount(
      percentOfBalance === 100
        ? token.balance
        : toFixed((parseFloat(token.balance) / 100) * percentOfBalance, token.decimals)
    );
  };

  return (
    <Flex justify="flex-end" align="center" opacity={0.6}>
      {token ? (
        <>
          {!disabled && (
            <>
              <StyledText onClick={handleClickPercentage(25)}>25%</StyledText>
              <StyledText onClick={handleClickPercentage(50)}>50%</StyledText>
              <StyledText onClick={handleClickPercentage(75)}>75%</StyledText>
              <Box bg="whiteAlpha.600" h="15px" w="1px" mr={2} />
            </>
          )}
          <StyledText onClick={handleClickPercentage(100)} disabled>
            {parseFloat(token.balance || "0").toFixed(2)}
          </StyledText>
        </>
      ) : (
        "-"
      )}
      <FontAwesomeIcon icon={faWallet} />
    </Flex>
  );
};

export default BalancePercentageSelector;

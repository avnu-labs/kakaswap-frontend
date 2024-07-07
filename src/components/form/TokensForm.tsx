import { Box, Flex } from "@chakra-ui/react";
import type { FC } from "react";

import { useTranslate } from "../../context/TranslateProvider";
import type { TokenState } from "../../context/WalletBaseProvider";

import TokenFormItem from "./TokenFormItem";

export interface ChangeTokensEvent {
  tokens: (TokenState | undefined)[];
  amounts: string[];
  updatedIndex: number;
}

export enum TokenFormType {
  SWAP,
  LIQUIDITY,
}

interface Props {
  tokens: (TokenState | undefined)[];
  amounts: string[];
  onChange: (value: ChangeTokensEvent) => void;
  separatorAction: "none" | "swap";
  disableSecondInput?: boolean;
  separatorIcon: JSX.Element;
  type: TokenFormType;
}

const TokensForm: FC<Props> = ({
  tokens,
  amounts,
  separatorAction,
  disableSecondInput = false,
  separatorIcon,
  type,
  onChange,
}) => {
  const { t } = useTranslate();

  const handleClickOnSeparator = () => {
    if (separatorAction === "swap") {
      onChange({ tokens: [tokens[1], tokens[0]], amounts: [amounts[0], ""], updatedIndex: 0 });
    }
  };

  const handleChangeAmount = (index: number) => (amount: string) => {
    const newAmounts = [...amounts];
    newAmounts[index] = amount;
    onChange({ tokens, amounts: newAmounts, updatedIndex: index });
  };

  const handleChangeToken = (index: number) => (token: TokenState) => {
    if ((index === 0 && token === tokens[1]) || (index === 1 && token === tokens[0])) {
      onChange({
        tokens: index === 0 ? [token, undefined] : [undefined, token],
        amounts: ["", ""],
        updatedIndex: index,
      });
    } else {
      const newTokens = [...tokens];
      newTokens[index] = token;
      onChange({
        tokens: newTokens,
        amounts,
        updatedIndex: 0,
      });
    }
  };

  return (
    <Flex width="full" align="center" direction="column">
      {/* Token 0 */}
      <TokenFormItem
        label={type === TokenFormType.SWAP ? t.common.from : "Token 1"}
        token={tokens[0]}
        amount={amounts[0]}
        onChangeToken={handleChangeToken(0)}
        onChangeAmount={handleChangeAmount(0)}
      />

      {/* Separator indication */}
      <Box as={separatorAction === "none" ? "span" : "button"} onClick={handleClickOnSeparator} my={4}>
        {separatorIcon}
      </Box>

      {/* Token 1 */}
      <TokenFormItem
        label={type === TokenFormType.SWAP ? t.common.to : "Token 2"}
        disabled={disableSecondInput}
        token={tokens[1]}
        amount={amounts[1]}
        onChangeToken={handleChangeToken(1)}
        onChangeAmount={handleChangeAmount(1)}
      />
    </Flex>
  );
};

export default TokensForm;

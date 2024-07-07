import { HStack } from "@chakra-ui/layout";
import { Flex, Text } from "@chakra-ui/react";
import { faArrowRightArrowLeft } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

import { useTranslate } from "../../context/TranslateProvider";
import type { TokenState } from "../../context/WalletBaseProvider";

import TruncatedAmount from "./TruncatedAmount";

interface TokenPriceRateProps {
  token0: TokenState | undefined;
  token1: TokenState | undefined;
  rateToken0Token1: number;
  rateToken1Token0: number;
}
const TokenPriceRate = ({ token0, token1, rateToken0Token1, rateToken1Token0 }: TokenPriceRateProps) => {
  const { t } = useTranslate();
  const [showPricePerToken0, setShowPricePerToken0] = useState(false);
  return (
    <Flex
      direction="row"
      align="center"
      justify="flex-end"
      cursor="pointer"
      onClick={() => setShowPricePerToken0(!showPricePerToken0)}
    >
      <FontAwesomeIcon icon={faArrowRightArrowLeft} size="sm" />
      <Text ml={2} as="div">
        {showPricePerToken0 ? (
          <HStack spacing={1}>
            <TruncatedAmount amount={rateToken0Token1} symbol={token0 ? token0.symbol : "-"} />
            <Text>{t.common.per}</Text>
            <Text>{token1 ? token1.symbol : "-"}</Text>
          </HStack>
        ) : (
          <HStack spacing={1}>
            <TruncatedAmount amount={rateToken1Token0} symbol={token1 ? token1.symbol : "-"} />
            <Text>{t.common.per}</Text>
            <Text>{token0 ? token0.symbol : "-"}</Text>
          </HStack>
        )}
      </Text>
    </Flex>
  );
};

export default TokenPriceRate;

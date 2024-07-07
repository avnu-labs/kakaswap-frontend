import { Text } from "@chakra-ui/layout";
import { VStack } from "@chakra-ui/react";

import type { RemoveLiquidityQuoteState } from "../../context/PoolProvider";
import InfosItem from "../informational/InfosItem";
import { useTranslate } from "context/TranslateProvider";

interface RemoveLiquidityInfosProps {
  removeLiquidityQuote: RemoveLiquidityQuoteState;
}

const RemoveLiquidityInfos = ({ removeLiquidityQuote }: RemoveLiquidityInfosProps) => {
  const { loading, amountLPToken, slippage } = removeLiquidityQuote;
  const { t } = useTranslate();
  return (
    <VStack w="full" fontSize={14} spacing={1}>
      <InfosItem loading={loading} keyText={t.pool.slippage} value={<Text>{slippage * 100} %</Text>} />
      <InfosItem loading={loading} keyText={t.pool.lp_send} value={<Text>{amountLPToken}</Text>} />
    </VStack>
  );
};

export default RemoveLiquidityInfos;

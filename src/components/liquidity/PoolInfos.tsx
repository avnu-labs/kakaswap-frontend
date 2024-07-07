import { Text, VStack } from "@chakra-ui/react";
import type { FC } from "react";

import type { AddLiquidityQuoteState } from "../../context";
import InfosItem from "../informational/InfosItem";
import TokenPriceRate from "../informational/TokenPriceRate";
import TruncatedAmount from "../informational/TruncatedAmount";
import { useTranslate } from "context/TranslateProvider";

interface Props {
  addLiquidityQuote: AddLiquidityQuoteState;
}

const PoolInfos: FC<Props> = ({ addLiquidityQuote }) => {
  const { loading, poolShare, estimatedLPReceived, slippage, token0, token1, rateToken0Token1, rateToken1Token0 } =
    addLiquidityQuote;
  const { t } = useTranslate();
  return (
    <VStack w="full" fontSize={14} spacing={1}>
      <InfosItem loading={loading} keyText={t.pool.slippage} value={<Text>{slippage * 100} %</Text>} />
      <InfosItem
        loading={loading}
        keyText={t.swap.rate}
        value={
          <TokenPriceRate
            token0={token0}
            token1={token1}
            rateToken0Token1={rateToken0Token1}
            rateToken1Token0={rateToken1Token0}
          />
        }
      />
      <InfosItem
        loading={loading}
        keyText={t.pool.pool_share}
        value={<Text>{poolShare < 0.01 ? "< 0.01" : poolShare} %</Text>}
      />
      <InfosItem
        loading={loading}
        keyText={t.pool.lp_received}
        value={<TruncatedAmount showFull amount={estimatedLPReceived} symbol="LP" />}
      />
    </VStack>
  );
};

export default PoolInfos;

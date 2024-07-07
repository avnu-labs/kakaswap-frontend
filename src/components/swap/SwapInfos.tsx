import { Text, VStack } from "@chakra-ui/react";

import type { SwapQuoteState } from "../../context/SwapProvider";
import InfosItem, { Severity } from "../informational/InfosItem";
import TokenPriceRate from "../informational/TokenPriceRate";
import TruncatedAmount from "../informational/TruncatedAmount";
import { useTranslate } from "context/TranslateProvider";

// TODO Make correct price severity range
function getPriceImpactSeverity(priceImpact: number) {
  if (priceImpact < 5) {
    return Severity.SAFE;
  }
  if (priceImpact < 10) {
    return Severity.WARNING;
  }
  return Severity.DANGER;
}

interface SwapInfosProps {
  swapQuote: SwapQuoteState;
}

const SwapInfos = ({ swapQuote }: SwapInfosProps) => {
  const { t } = useTranslate();

  const {
    loading,
    tokenFrom,
    tokenTo,
    slippage,
    rateToken0Token1,
    rateToken1Token0,
    minAmountReceived,
    priceImpact,
    lpFee,
    route,
  } = swapQuote;

  return (
    <VStack w="full" fontSize={14} spacing={1}>
      <InfosItem loading={loading} keyText={t.pool.slippage} value={<Text>{slippage * 100} %</Text>} />
      <InfosItem
        loading={loading}
        keyText={t.swap.rate}
        value={
          <TokenPriceRate
            token0={tokenFrom}
            token1={tokenTo}
            rateToken0Token1={rateToken0Token1}
            rateToken1Token0={rateToken1Token0}
          />
        }
      />
      <InfosItem
        loading={loading}
        keyText={t.swap.min_received}
        value={
          <Text>
            {minAmountReceived === "" ? (
              "0"
            ) : (
              <TruncatedAmount amount={minAmountReceived} symbol={tokenTo ? tokenTo.symbol : "-"} />
            )}
          </Text>
        }
      />
      <InfosItem
        loading={loading}
        keyText={t.swap.price_impact}
        value={<Text>{priceImpact < 0.01 ? "< 0.01" : priceImpact.toFixed(2)} %</Text>}
        severityLevel={getPriceImpactSeverity(priceImpact)}
      />
      <InfosItem
        loading={loading}
        keyText={t.swap.lp_fees}
        value={
          <Text>
            <TruncatedAmount showFull amount={lpFee === "" ? "0" : lpFee} symbol={tokenFrom ? tokenFrom.symbol : "-"} />
          </Text>
        }
      />
      <InfosItem loading={loading} keyText={t.swap.route} value={<Text>{route}</Text>} />
    </VStack>
  );
};

export default SwapInfos;

import { HStack } from "@chakra-ui/layout";
import {
  Box,
  Flex,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
  VStack,
  Tooltip,
  Skeleton,
} from "@chakra-ui/react";
import { faQuestionCircle } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useWeb3ModalProvider } from "@web3modal/ethers/react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { usePool } from "../../context";
import type { RemoveLiquidityQuoteState } from "../../context";
import type { PoolState, TokenState } from "../../context/WalletBaseProvider";
import { DEFAULT_SLIPPAGE } from "../../helpers/constants";
import { amountToPercentage, percentageOfAmount, percentageToAmount } from "../../helpers/pool";
import { isInputsCompleteForRemoveLiquidity } from "../../helpers/token";
import Button from "../form/Button";
import InputPositiveNumber from "../form/InputPositiveNumber";
import RadioCards from "../form/RadioCards";
import TransactionValidationModal from "../form/TransactionValidationModal";
import InfosItem from "../informational/InfosItem";
import TruncatedAmount from "../informational/TruncatedAmount";
import PopoverOptions from "../layout/PopoverOptions";
import { useTranslate } from "context/TranslateProvider";

interface RemoveLiquidityManagerProps {
  pool: PoolState;
}
const RemoveLiquidityManager = ({ pool }: RemoveLiquidityManagerProps) => {
  const { t } = useTranslate();
  const { walletProvider } = useWeb3ModalProvider();
  const { approveLP, removeLiquidity, updateRemoveLiquidityQuote, currentRemoveLiquidityQuote } = usePool();
  const [amountLPToRemove, setAmountLPToRemove] = useState<string>("");
  const [amountLPPercentage, setAmountLPPercentage] = useState<number>(0);
  const [localRemoveLiquidityQuote, setLocalRemoveLiquidityQuote] = useState<RemoveLiquidityQuoteState | undefined>(
    undefined
  );

  const [removeLiquiditySlippage, setRemoveLiquiditySlippage] = useState<number>(DEFAULT_SLIPPAGE);
  const [isValidationTransactionOpen, setValidationTransactionOpen] = useState(false);

  const isEnoughAllowance = useMemo(() => {
    const amountToken1 = parseFloat(localRemoveLiquidityQuote?.amountLPToken || "0");
    const allowanceLP = parseFloat(localRemoveLiquidityQuote?.pool?.allowance || "0");
    return allowanceLP >= amountToken1;
  }, [localRemoveLiquidityQuote]);

  // Call when remove removeLiquidityQuote is updated
  useEffect(() => {
    if (currentRemoveLiquidityQuote) {
      const { pool: quotePool } = currentRemoveLiquidityQuote;
      if (quotePool?.address === pool.address) {
        setLocalRemoveLiquidityQuote(currentRemoveLiquidityQuote);
      }
    } else {
      // reset the local remove liquidity quote
      // TODO may set to undefined not necessary, because setAmountLP will trigger new quote calculation
      setLocalRemoveLiquidityQuote(undefined);
      setAmountLPToRemove("");
    }
  }, [pool, currentRemoveLiquidityQuote]);

  // Update removeLiquidityQuote when amount has changed
  useEffect(() => {
    setTimeout(() => {
      updateRemoveLiquidityQuote(pool, amountLPToRemove, removeLiquiditySlippage / 100);
      setAmountLPPercentage(amountToPercentage(amountLPToRemove, pool.balance));
    });
  }, [pool, updateRemoveLiquidityQuote, amountLPToRemove, removeLiquiditySlippage]);

  const onRemoveLiquidity = () => {
    // Display validation modal
    setValidationTransactionOpen(true);
  };

  function removeLiquidityValidationReturn(validate: boolean) {
    setValidationTransactionOpen(false);
    if (validate && walletProvider && localRemoveLiquidityQuote)
      removeLiquidity(localRemoveLiquidityQuote, walletProvider);
  }

  // When radio has change
  const onRadioPercentageChange = (newPercentage: string) => {
    const lpBalance = pool.balance;
    let newAmountLPToRemove;
    const floatPercentage = parseFloat(newPercentage);
    switch (floatPercentage) {
      case 0:
      case 25:
      case 50:
      case 75:
        newAmountLPToRemove = percentageOfAmount(floatPercentage, lpBalance);
        break;
      case 100:
      default:
        newAmountLPToRemove = lpBalance;
        break;
    }
    setAmountLPToRemove(newAmountLPToRemove || "");
  };

  // When slider value has changed
  const onSliderValueChange = (newValue: any) => {
    setAmountLPToRemove(percentageToAmount(newValue, pool.balance));
  };

  const renderLPPanel = (title: string, body: any, footerChildren: any, isInfosPanel: boolean, tooltip?: string) => {
    return (
      <>
        <TransactionValidationModal
          removeLiquidityQuoteState={localRemoveLiquidityQuote}
          isOpen={isValidationTransactionOpen}
          onClose={(validate) => removeLiquidityValidationReturn(validate)}
        />
        <Flex
          pr={isInfosPanel ? 6 : 0}
          pl={!isInfosPanel ? 6 : 0}
          direction="column"
          justify="space-between"
          flex={isInfosPanel ? 5 : 7}
          borderRight={isInfosPanel ? "1px solid" : "none"}
          borderColor="pineGreen.300"
        >
          <Flex direction="column">
            <Flex direction="row" justify="space-between">
              <Tooltip key="menu-tooltip-positions" label={tooltip} placement="bottom-start" closeOnClick={false}>
                <Flex mb={2} justify="flex-start" align="center">
                  <Text mr={2} fontSize="16px" fontWeight="semibold">
                    {title}
                  </Text>
                  {tooltip && <FontAwesomeIcon fontSize="16px" icon={faQuestionCircle} />}
                </Flex>
              </Tooltip>
              {!isInfosPanel && (
                <PopoverOptions
                  initialValue={removeLiquiditySlippage}
                  onChange={(newSlippage) => setRemoveLiquiditySlippage(newSlippage)}
                />
              )}
            </Flex>

            {body}
          </Flex>
          <Flex justify="flex-end" align="center" mt={4}>
            {footerChildren}
          </Flex>
        </Flex>
      </>
    );
  };

  const getTokenAmountReceived = useCallback((token: TokenState | undefined, amount: string | undefined) => {
    if (token && amount) {
      return `${amount === "" ? 0 : amount}`;
    }
    return "0";
  }, []);

  const renderInfosLPBody = () => {
    const { token0AmountPooled, token1AmountPooled } = pool;

    return (
      <VStack w="full" spacing={1}>
        <InfosItem loading={false} keyText="LP" value={<TruncatedAmount amount={pool.balance} symbol="LP" />} />
        <InfosItem
          loading={false}
          keyText={`${pool.token0.symbol} ${t.pool.pooled}`}
          value={
            <TruncatedAmount
              amount={getTokenAmountReceived(pool.token0, token0AmountPooled)}
              symbol={pool.token0.symbol}
            />
          }
        />
        <InfosItem
          loading={false}
          keyText={`${pool.token1.symbol} ${t.pool.pooled}`}
          value={
            <TruncatedAmount
              amount={getTokenAmountReceived(pool.token1, token1AmountPooled)}
              symbol={pool.token1.symbol}
            />
          }
        />
        <InfosItem
          loading={false}
          keyText={t.pool.pool_share}
          value={<TruncatedAmount amount={pool.poolShare} symbol="%" />}
        />
      </VStack>
    );
  };

  const renderRemoveLPBody = () => {
    return (
      <>
        <Flex direction="column" align="flex-start" justify="flex-start" mb={4} w="50%">
          <Text mb={2}>{t.pool.amount_remove}</Text>
          <Flex direction="row" align="flex-end">
            <InputPositiveNumber value={amountLPToRemove} onChangeNumber={setAmountLPToRemove} />
            <Flex direction="row" ml={2} mb={1}>
              <Text>LP</Text>
              <Text ml={1}>({amountLPPercentage}%)</Text>
            </Flex>
          </Flex>
        </Flex>
        <Box mb={4} pr={8}>
          <Slider
            focusThumbOnChange={false}
            aria-label="slider-ex-1"
            defaultValue={0}
            onChange={onSliderValueChange}
            value={amountLPPercentage}
            min={0}
            max={100}
            step={10}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </Box>
        <RadioCards type="percentage" onChange={onRadioPercentageChange} />
        <Text mt={4} mb={2} color="whiteAlpha.600">
          {t.pool.will_receive} ({t.pool.slippage}: {removeLiquiditySlippage}%)
        </Text>
        <VStack w="full" spacing={1} align="flex-start">
          <HStack>
            {localRemoveLiquidityQuote?.loading ? (
              <Skeleton startColor="whiteAlpha.400" endColor="whiteAlpha.200" width="50px" height="18px" />
            ) : (
              <TruncatedAmount
                amount={getTokenAmountReceived(
                  localRemoveLiquidityQuote?.pool?.token0,
                  localRemoveLiquidityQuote?.minToken0Received
                )}
              />
            )}
            <Text>{localRemoveLiquidityQuote?.pool?.token0.symbol}</Text>
          </HStack>
          <HStack>
            {localRemoveLiquidityQuote?.loading ? (
              <Skeleton startColor="whiteAlpha.400" endColor="whiteAlpha.200" width="50px" height="18px" />
            ) : (
              <TruncatedAmount
                amount={getTokenAmountReceived(
                  localRemoveLiquidityQuote?.pool?.token1,
                  localRemoveLiquidityQuote?.minToken1Received
                )}
              />
            )}
            <Text>{localRemoveLiquidityQuote?.pool?.token1.symbol}</Text>
          </HStack>
        </VStack>
      </>
    );
  };

  // ---------- Errors / Disabled checks ---------- //

  const getRemoveErrorText = () => {
    if (localRemoveLiquidityQuote && localRemoveLiquidityQuote.error) {
      if (localRemoveLiquidityQuote.error.message) {
        return localRemoveLiquidityQuote.error.message;
      }
      return localRemoveLiquidityQuote.error.type;
    }
    return undefined;
  };

  // ---------- Buttons / rendering ---------- //

  const renderRemoveButtons = () => {
    return (
      <Flex direction="row">
        {isEnoughAllowance ? (
          <Button
            ml={2}
            disabled={!isInputsCompleteForRemoveLiquidity(pool, amountLPToRemove)}
            errorText={getRemoveErrorText()}
            onClick={onRemoveLiquidity}
            size="sm"
          >
            {t.pool.remove_liquidity}
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={() =>
              walletProvider && approveLP(pool, currentRemoveLiquidityQuote?.amountLPToken || "0", walletProvider)
            }
            w="full"
          >
            Approve {pool?.symbol}
          </Button>
        )}
      </Flex>
    );
  };

  return (
    <Flex direction="row" fontSize="14px" pb={4} borderBottom="1px solid" borderColor="pineGreen.300">
      {/* Render left panel */}
      {renderLPPanel(
        t.pool.your_positions,
        renderInfosLPBody(),
        undefined,
        true,
        "This represent your position based on the current pool rate. This is adjusting over the time"
      )}
      {/* Render right panel */}
      {renderLPPanel(t.pool.remove_liquidity, renderRemoveLPBody(), renderRemoveButtons(), false)}
    </Flex>
  );
};

export default RemoveLiquidityManager;

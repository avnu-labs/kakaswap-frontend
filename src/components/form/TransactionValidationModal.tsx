import { Flex } from "@chakra-ui/layout";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text } from "@chakra-ui/react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type React from "react";
import { useEffect, useState } from "react";

import type { AddLiquidityQuoteState, RemoveLiquidityQuoteState, SwapQuoteState } from "../../context";
import { useTranslate } from "../../context/TranslateProvider";
import PoolInfos from "../liquidity/PoolInfos";
import RemoveLiquidityInfos from "../liquidity/RemoveLiquidityInfos";
import SwapInfos from "../swap/SwapInfos";

import Button from "./Button";
import { TokenFormType } from "./TokensForm";
import TokensFormStatus from "./TokensFormStatus";

interface TransactionValidationProps {
  swapQuote?: SwapQuoteState;
  addLiquidityQuote?: AddLiquidityQuoteState;
  removeLiquidityQuoteState?: RemoveLiquidityQuoteState;
  isOpen: boolean;
  onClose: (validate: boolean) => void;
}

const TransactionValidationModal = ({
  swapQuote,
  addLiquidityQuote,
  removeLiquidityQuoteState,
  isOpen,
  onClose,
}: TransactionValidationProps) => {
  const { t } = useTranslate();
  const [priceUpdated, setPriceUpdated] = useState(false);

  // Set price update to true when quote as changed
  useEffect(() => {
    setPriceUpdated(true);
  }, [swapQuote, addLiquidityQuote, removeLiquidityQuoteState]);

  useEffect(() => {
    setPriceUpdated(false);
  }, [isOpen]);

  const onValidateClick = () => {
    if (priceUpdated) {
      setPriceUpdated(false);
    } else {
      onClose(true);
    }
  };
  const renderFooter = (validationText: string, isLoading: boolean) => {
    return (
      <>
        {/* <Text mt={4} fontSize="14px" color="warning.100">
              Output is estimated, you will receive a minimum of ...
            </Text> */}
        <Button
          w="full"
          _hover={{ border: "1px solid", borderColor: "whiteAlpha.900" }}
          mt={8}
          disabled={isLoading}
          onClick={() => onValidateClick()}
        >
          {priceUpdated ? t.common.warning_price_updated : validationText}
        </Button>
      </>
    );
  };
  const renderModal = (title: string, body: React.ReactElement) => {
    return (
      <>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{body}</ModalBody>
      </>
    );
  };

  const renderAddLiquidityValidation = (quote: AddLiquidityQuoteState) => {
    return renderModal(
      t.pool.add_liquidity,
      <Flex direction="column" justify="space-between" align="flex-start">
        <Text mb={4}>{t.common.add}</Text>
        <TokensFormStatus
          mb={4}
          type={TokenFormType.LIQUIDITY}
          token0={quote.token0}
          token1={quote.token1}
          amountToken0={quote.amountToken0}
          amountToken1={quote.amountToken1}
        />
        <Text mb={4}>Transaction details</Text>
        <PoolInfos addLiquidityQuote={quote} />
        {renderFooter(t.common.confirm, quote.loading)}
      </Flex>
    );
  };
  const renderRemoveLiquidityValidation = (quote: RemoveLiquidityQuoteState) => {
    return renderModal(
      t.pool.remove_liquidity,
      <Flex direction="column" justify="space-between" align="flex-start">
        <Text mb={4}>{t.pool.will_receive}</Text>
        <TokensFormStatus
          mb={4}
          type={TokenFormType.LIQUIDITY}
          token0={quote.pool?.token0}
          token1={quote.pool?.token1}
          amountToken0={quote.minToken0Received}
          amountToken1={quote.minToken1Received}
        />
        <Text mb={4}>Transaction details</Text>
        <RemoveLiquidityInfos removeLiquidityQuote={quote} />
        {renderFooter(t.common.confirm, quote.loading)}
      </Flex>
    );
  };
  const renderSwapValidation = (quote: SwapQuoteState) => {
    return renderModal(
      t.swap.confirm_swap,
      <Flex direction="column" justify="space-between" align="flex-start">
        <Text mb={4}>{t.swap.swap}</Text>
        <TokensFormStatus
          mb={4}
          type={TokenFormType.SWAP}
          token0={quote.tokenFrom}
          token1={quote.tokenTo}
          amountToken0={quote.amountTokenFrom}
          amountToken1={quote.amountTokenTo}
        />
        <Text mb={4}>Transaction details</Text>
        <SwapInfos swapQuote={quote} />
        {renderFooter(t.common.confirm, quote.loading)}
      </Flex>
    );
  };

  const renderValidation = () => {
    if (swapQuote) {
      return renderSwapValidation(swapQuote);
    }
    if (addLiquidityQuote) {
      return renderAddLiquidityValidation(addLiquidityQuote);
    }
    if (removeLiquidityQuoteState) {
      return renderRemoveLiquidityValidation(removeLiquidityQuoteState);
    }
    return <Text>No quote available :(</Text>;
  };

  return (
    <Modal isCentered isOpen={isOpen} onClose={() => onClose(false)}>
      <ModalOverlay />
      <ModalContent>{renderValidation()}</ModalContent>
    </Modal>
  );
};

export default TransactionValidationModal;

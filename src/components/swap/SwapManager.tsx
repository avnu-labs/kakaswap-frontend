import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { faArrowsRotate, faCheckDouble, faChevronDown } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useWeb3ModalProvider } from "@web3modal/ethers/react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useSwap } from "../../context";
import { useWallet } from "../../context/WalletProvider";
import { DEFAULT_SLIPPAGE } from "../../helpers/constants";
import { isInputsCompleteForSwap } from "../../helpers/token";
import Button from "../form/Button";
import type { ChangeTokensEvent } from "../form/TokensForm";
import TokensForm, { TokenFormType } from "../form/TokensForm";
import TransactionValidationModal from "../form/TransactionValidationModal";
import Spinner from "../informational/Spinner";
import Collapsible from "../layout/Collapsible";
import PopoverOptions from "../layout/PopoverOptions";
import { WalletConnect } from "../wallet";
import { useTranslate } from "context/TranslateProvider";

import SwapInfos from "./SwapInfos";

const CARROT = "carrotOrange.300";
const SwapManager = () => {
  const { walletProvider } = useWeb3ModalProvider();
  const { t } = useTranslate();
  const { approveToken } = useWallet();
  const { currentSwapQuote, updateSwapQuote, swap } = useSwap();
  const [isSwapInfoOpen, setSwapInfoOpen] = useState(false);
  const [swapSlippage, setSwapSlippage] = useState<number>(DEFAULT_SLIPPAGE);
  const [isValidationTransactionOpen, setValidationTransactionOpen] = useState(false);

  const isEnoughAllowance = useMemo(() => {
    if (currentSwapQuote?.tokenFrom?.isNative) return true;
    const amountToken0 = parseFloat(currentSwapQuote?.amountTokenFrom || "0");
    const allowanceToken0 = parseFloat(currentSwapQuote?.tokenFrom?.allowance || "0");
    return allowanceToken0 >= amountToken0;
  }, [
    currentSwapQuote?.amountTokenFrom,
    currentSwapQuote?.tokenFrom?.allowance,
    currentSwapQuote?.tokenFrom?.isNative,
  ]);

  useEffect(() => {
    updateSwapQuote(
      currentSwapQuote?.amountTokenFrom || "",
      currentSwapQuote?.tokenFrom,
      currentSwapQuote?.tokenTo,
      swapSlippage / 100
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateSwapQuote, swapSlippage]);

  const handleChangeTokens = useCallback(
    (event: ChangeTokensEvent) =>
      updateSwapQuote(event.amounts[0], event.tokens[0], event.tokens[1], swapSlippage / 100),
    [updateSwapQuote, swapSlippage]
  );

  // Display validation modal
  const onSwapClick = useCallback(() => setValidationTransactionOpen(true), [setValidationTransactionOpen]);

  const swapValidationReturn = useCallback(
    (validate: boolean) => {
      setValidationTransactionOpen(false);
      if (validate && walletProvider && currentSwapQuote) {
        swap(currentSwapQuote, walletProvider);
      }
    },
    [setValidationTransactionOpen, swap, walletProvider, currentSwapQuote]
  );

  const getMainErrorText = useCallback(() => {
    if (currentSwapQuote && currentSwapQuote.error) {
      if (currentSwapQuote.error.message) {
        return currentSwapQuote.error.message;
      }
      return currentSwapQuote.error.type;
    }
    return undefined;
  }, [currentSwapQuote]);

  // Check if we should display infos for swap
  // Hide if:
  // - CurrentSwapQuote is undefined
  // - Tokens are not defined
  // - Amount input is not defined
  const shouldDisplayInfos = useCallback(() => {
    return (
      currentSwapQuote && currentSwapQuote.tokenFrom && currentSwapQuote.tokenTo && currentSwapQuote?.amountTokenFrom
    );
  }, [currentSwapQuote]);

  // TODO: export this in new component
  // Render the main Add/Remove/Connect button
  const renderMainButton = useCallback(() => {
    const tokenFrom = currentSwapQuote?.tokenFrom;
    const tokenTo = currentSwapQuote?.tokenTo;
    return (
      <WalletConnect
        fullWidth
        customConnectedButton={
          isEnoughAllowance || getMainErrorText() ? (
            <Button
              disabled={
                currentSwapQuote?.loading ||
                !isInputsCompleteForSwap([tokenFrom, tokenTo], currentSwapQuote?.amountTokenFrom || "")
              }
              errorText={getMainErrorText()}
              onClick={() => onSwapClick()}
              w="full"
            >
              {t.swap.swap}
            </Button>
          ) : (
            <Button
              onClick={() =>
                tokenFrom &&
                walletProvider &&
                approveToken(tokenFrom, currentSwapQuote?.amountTokenFrom, walletProvider)
              }
              w="full"
            >
              Approve {tokenFrom?.symbol}
            </Button>
          )
        }
      />
    );
  }, [
    currentSwapQuote?.tokenFrom,
    currentSwapQuote?.tokenTo,
    currentSwapQuote?.loading,
    currentSwapQuote?.amountTokenFrom,
    isEnoughAllowance,
    getMainErrorText,
    t.swap.swap,
    onSwapClick,
    walletProvider,
    approveToken,
  ]);

  return (
    <>
      <TransactionValidationModal
        swapQuote={currentSwapQuote}
        isOpen={isValidationTransactionOpen}
        onClose={(validate) => swapValidationReturn(validate)}
      />
      <Flex width="full" align="center" direction="column">
        <Flex width="full" align="center" mb={4}>
          <Heading as="h2" size="md">
            <Box>{t.swap.swap}</Box>
          </Heading>

          <PopoverOptions initialValue={swapSlippage} onChange={setSwapSlippage} />
        </Flex>

        <TokensForm
          type={TokenFormType.SWAP}
          amounts={[currentSwapQuote?.amountTokenFrom || "", currentSwapQuote?.amountTokenTo || ""]}
          tokens={[currentSwapQuote?.tokenFrom, currentSwapQuote?.tokenTo]}
          onChange={handleChangeTokens}
          separatorIcon={<FontAwesomeIcon icon={faArrowsRotate} size="lg" />}
          separatorAction="swap"
          disableSecondInput
        />
        {/* Loader/Price infos */}
        {currentSwapQuote && currentSwapQuote.error?.type !== "POOL_NOT_EXIST" && shouldDisplayInfos() && (
          <Flex
            w="full"
            mt={4}
            border="1px solid"
            borderColor={isSwapInfoOpen ? CARROT : "transparent"}
            borderRadius="xl"
            transition="all .3s"
          >
            <Collapsible
              onUpdate={(isOpen) => setSwapInfoOpen(isOpen)}
              defaultIsOpen
              header={
                <Flex
                  w="full"
                  fontWeight="medium"
                  direction="row"
                  align="center"
                  justify="space-between"
                  p={2}
                  bg={isSwapInfoOpen ? CARROT : "transparent"}
                  borderTopRadius="xl"
                  borderBottomRadius={isSwapInfoOpen ? "none" : "xl"}
                  _hover={{
                    bg: CARROT,
                  }}
                >
                  <Flex w="full" direction="row" align="center" justify="flex-start">
                    <Box minWidth="24px">
                      {currentSwapQuote.loading ? <Spinner /> : <FontAwesomeIcon icon={faCheckDouble} />}
                    </Box>
                    <Text ml={2} fontSize={14}>
                      {currentSwapQuote.loading ? t.swap.waiting_quote : t.swap.quote_updated}
                    </Text>
                  </Flex>
                  <Box
                    fontSize="14px"
                    transition="transform .3s ease"
                    transform={`rotate(${isSwapInfoOpen ? "180" : "0"}deg)`}
                  >
                    <FontAwesomeIcon icon={faChevronDown} />
                  </Box>
                </Flex>
              }
            >
              {/* Swap Info */}
              {currentSwapQuote && (
                <Box mt={2} p={2}>
                  <SwapInfos swapQuote={currentSwapQuote} />
                </Box>
              )}
            </Collapsible>
          </Flex>
        )}
        {/* Buttons */}
        <Box mt={4} w="full">
          {/* Connect/Swap button */}
          {renderMainButton()}
        </Box>
      </Flex>
    </>
  );
};

export default SwapManager;

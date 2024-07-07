import { HStack } from "@chakra-ui/layout";
import { Box, Flex, Text } from "@chakra-ui/react";
import { faCheckDouble } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useWeb3ModalProvider } from "@web3modal/ethers/react";
import { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";

import { usePool } from "../../context";
import { ARFErrorType } from "../../context/ARFError";
import { useWallet } from "../../context/WalletProvider";
import { DEFAULT_SLIPPAGE } from "../../helpers/constants";
import { isInputsCompleteForAddLiquidity } from "../../helpers/token";
import Button from "../form/Button";
import type { ChangeTokensEvent } from "../form/TokensForm";
import TokensForm, { TokenFormType } from "../form/TokensForm";
import TransactionValidationModal from "../form/TransactionValidationModal";
import InformationBox from "../informational/InformationBox";
import Spinner from "../informational/Spinner";
import Collapsible from "../layout/Collapsible";
import PopoverOptions from "../layout/PopoverOptions";
import { WalletConnect } from "../wallet";
import { useTranslate } from "context/TranslateProvider";

import PoolInfos from "./PoolInfos";

const CARROT = "carrotOrange.300";

const AddLiquidityManager = () => {
  const { walletProvider } = useWeb3ModalProvider();
  const { t } = useTranslate();
  const { approveToken } = useWallet();
  const { currentAddLiquidityQuote, updateAddLiquidityQuote, addLiquidity } = usePool();
  const [addLiquiditySlippage, setAddLiquiditySlippage] = useState<number>(DEFAULT_SLIPPAGE);
  const [isValidationTransactionOpen, setValidationTransactionOpen] = useState(false);

  // Update addLiquidityQuote when change token with token0 amount not changed
  useEffect(() => {
    updateAddLiquidityQuote(
      currentAddLiquidityQuote?.token0,
      currentAddLiquidityQuote?.token1,
      currentAddLiquidityQuote?.amountToken0 || "",
      currentAddLiquidityQuote?.amountToken1 || "",
      true,
      addLiquiditySlippage / 100
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addLiquiditySlippage]);

  const isFirstDeposit = currentAddLiquidityQuote && currentAddLiquidityQuote.isFirstDeposit;

  const handleChangeTokens = (event: ChangeTokensEvent) => {
    updateAddLiquidityQuote(
      event.tokens[0],
      event.tokens[1],
      event.amounts[0],
      event.amounts[1],
      event.updatedIndex === 0,
      addLiquiditySlippage / 100
    );
  };

  function onAddLiquidity() {
    // Display validation modal
    setValidationTransactionOpen(true);
  }

  function addLiquidityValidationReturn(validate: boolean) {
    setValidationTransactionOpen(false);
    if (validate && walletProvider && currentAddLiquidityQuote) {
      addLiquidity(currentAddLiquidityQuote, walletProvider);
    }
  }

  function getMainErrorText() {
    if (currentAddLiquidityQuote && currentAddLiquidityQuote.error) {
      if (currentAddLiquidityQuote.error.message) {
        return currentAddLiquidityQuote.error.message;
      }
      return currentAddLiquidityQuote.error.type;
    }
    return undefined;
  }

  // TODO: export this in new component
  // Render the main Add/Remove/Connect button
  const renderMainButton = () => {
    const token0 = currentAddLiquidityQuote?.token0;
    const token1 = currentAddLiquidityQuote?.token1;
    const amountToken0 = parseFloat(currentAddLiquidityQuote?.amountToken0 || "0");
    const allowanceToken0 = parseFloat(token0?.allowance || "0");
    const isToken0EnoughAllowance = currentAddLiquidityQuote?.token0?.isNative || allowanceToken0 >= amountToken0;

    const amountToken1 = parseFloat(currentAddLiquidityQuote?.amountToken1 || "0");
    const allowanceToken1 = parseFloat(token1?.allowance || "0");
    const isToken1EnoughAllowance = currentAddLiquidityQuote?.token1?.isNative || allowanceToken1 >= amountToken1;

    const addLiquidityButton = (
      <Button
        disabled={
          currentAddLiquidityQuote?.loading ||
          !isInputsCompleteForAddLiquidity(
            token0,
            token1,
            currentAddLiquidityQuote?.amountToken0 || "",
            currentAddLiquidityQuote?.amountToken1 || ""
          )
        }
        errorText={getMainErrorText()}
        onClick={() => onAddLiquidity()}
        w="full"
      >
        {`${isFirstDeposit ? t.pool.create_and : ""}${t.pool.add_liquidity}`}
      </Button>
    );
    const approveButtons = token0 && token1 && walletProvider && (
      <HStack w="full">
        <Button
          onClick={() => approveToken(token0, currentAddLiquidityQuote?.amountToken0, walletProvider)}
          disabled={isToken0EnoughAllowance}
          w="full"
        >
          Approve {token0?.symbol}
        </Button>
        <Button
          onClick={() => approveToken(token1, currentAddLiquidityQuote?.amountToken1, walletProvider)}
          disabled={isToken1EnoughAllowance}
          w="full"
        >
          Approve {token1?.symbol}
        </Button>
      </HStack>
    );
    return (
      <WalletConnect
        customConnectedButton={
          (!isToken0EnoughAllowance || !isToken1EnoughAllowance) && !getMainErrorText()
            ? approveButtons
            : addLiquidityButton
        }
      />
    );
  };

  // Check if we should display infos for addLiquidity
  // Hide if:
  // - Current addLiquidityQuote is undefined
  // - Tokens are not defined
  // - Amount input is not defined
  const shouldDisplayInfos = (): boolean =>
    !!(
      currentAddLiquidityQuote &&
      currentAddLiquidityQuote.token0 &&
      currentAddLiquidityQuote.token1 &&
      (currentAddLiquidityQuote.amountToken0 || currentAddLiquidityQuote.amountToken1)
    );

  const isInfoOpen =
    currentAddLiquidityQuote && currentAddLiquidityQuote.error?.type !== ARFErrorType.POOL_HAS_NO_LIQUIDITY;
  return (
    <>
      <TransactionValidationModal
        addLiquidityQuote={currentAddLiquidityQuote}
        isOpen={isValidationTransactionOpen}
        onClose={(validate) => addLiquidityValidationReturn(validate)}
      />
      <Flex width="full" align="center" direction="column">
        <Flex width="full" align="center" mb={4}>
          <PopoverOptions initialValue={addLiquiditySlippage} onChange={setAddLiquiditySlippage} />
        </Flex>
        <TokensForm
          type={TokenFormType.LIQUIDITY}
          tokens={[currentAddLiquidityQuote?.token0, currentAddLiquidityQuote?.token1]}
          amounts={[currentAddLiquidityQuote?.amountToken0 || "", currentAddLiquidityQuote?.amountToken1 || ""]}
          onChange={handleChangeTokens}
          separatorAction="none"
          separatorIcon={<AiOutlinePlus size="24" />}
        />

        {/* Loader/Price infos */}
        {currentAddLiquidityQuote && shouldDisplayInfos() && (
          <Flex
            w="full"
            mt={8}
            border="1px solid"
            borderColor={isInfoOpen ? CARROT : "transparent"}
            borderRadius="xl"
            transition="all .3s"
          >
            <Collapsible
              disabledHeaderToggle={!isInfoOpen}
              isOpen={isInfoOpen}
              header={
                <Flex
                  w="full"
                  fontWeight="medium"
                  direction="row"
                  align="center"
                  justify="space-between"
                  p={2}
                  bg={isInfoOpen ? CARROT : "transparent"}
                  borderTopRadius="xl"
                  borderBottomRadius={isInfoOpen ? "none" : "xl"}
                  _hover={{
                    bg: CARROT,
                  }}
                >
                  <Flex w="full" direction="row" align="center" justify="flex-start">
                    <Box minWidth="24px">
                      {currentAddLiquidityQuote.loading ? <Spinner /> : <FontAwesomeIcon icon={faCheckDouble} />}
                    </Box>
                    <Text ml={2} fontSize={14}>
                      {currentAddLiquidityQuote.loading ? t.swap.waiting_quote : t.swap.quote_updated}
                    </Text>
                  </Flex>
                </Flex>
              }
            >
              {/* Swap Info */}
              <Box mt={2} p={2}>
                <PoolInfos addLiquidityQuote={currentAddLiquidityQuote} />
              </Box>
            </Collapsible>
          </Flex>
        )}

        {/* Buttons */}
        <Box my={8} w="full">
          {/* Connect/Add liquidity */}
          {renderMainButton()}
        </Box>
        {isFirstDeposit && (
          <InformationBox
            title={t.pool.pool_creation}
            content={<Text dangerouslySetInnerHTML={{ __html: t.pool.warning_no_pool }} />}
            level="warning"
          />
        )}
      </Flex>
    </>
  );
};

export default AddLiquidityManager;

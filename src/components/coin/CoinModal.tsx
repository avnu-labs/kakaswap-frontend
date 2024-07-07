import { Link } from "@chakra-ui/layout";
import {
  Box,
  Flex,
  Input,
  Modal as ChakraModal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  Image,
} from "@chakra-ui/react";
import { faQuestionCircle } from "@fortawesome/pro-light-svg-icons";
import { faCircleNotch } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers/react";
import type { ChangeEvent } from "react";
import { useCallback, useEffect, useState } from "react";

import { useTranslate } from "../../context/TranslateProvider";
import type { TokenState } from "../../context/WalletBaseProvider";
import { useWallet } from "../../context/WalletProvider";

interface ModalProps {
  isOpen: boolean;
  onClose: any;
  disableItem?: TokenState;
  onSelected: (token: TokenState) => void;
}

const CoinModal = ({ isOpen, onClose, disableItem, onSelected }: ModalProps) => {
  const { t } = useTranslate();
  const { isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const { tokens } = useWallet();
  const [filteredTokens, setFilteredTokens] = useState<TokenState[]>([]);
  const [filter, setFilter] = useState<string>();

  const filterTokens = useCallback((tokensToFilter: TokenState[], filterString: string | undefined): TokenState[] => {
    if (!filterString) return tokensToFilter;
    const filterStringLowerCase: string = filterString.toLowerCase();
    return tokensToFilter.filter((token: TokenState) => {
      return (
        token.address.toLowerCase().indexOf(filterStringLowerCase) > -1 ||
        token.symbol.toLowerCase().indexOf(filterStringLowerCase) > -1 ||
        (token.name || "Unknown").toLowerCase().indexOf(filterStringLowerCase) > -1
      );
    });
  }, []);

  const addTokenToWallet = useCallback(
    (e: any, tokenToWatch: TokenState) => {
      if (!walletProvider) return;
      e.stopPropagation();
      walletProvider.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: tokenToWatch.address,
            symbol: tokenToWatch.symbol,
            decimals: tokenToWatch.decimals,
            image: tokenToWatch.logoURI,
          },
        },
      });
    },
    [walletProvider]
  );

  useEffect(() => {
    setFilteredTokens(filterTokens(tokens, filter));
  }, [tokens, filterTokens, filter]);

  const handleInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const newFilter = evt.target.value;
    // Will trigger effect above
    setFilter(newFilter);
  };

  const renderCoinItem = (token: TokenState, isDisabled: boolean) => {
    return (
      <Flex
        key={`token-item${token.address}`}
        w="full"
        direction="row"
        justify="space-between"
        fontSize="sm"
        px={6}
        py={2}
        cursor={isDisabled ? "normal" : "pointer"}
        opacity={isDisabled ? 0.4 : "ihnerit"}
        _hover={{
          backgroundColor: isDisabled ? "inherit" : "blackAlpha.100",
        }}
        onClick={() => !isDisabled && onSelected(token)}
      >
        <Flex direction="row" justify="flex-start" align="center">
          <Box w="8" mr={4}>
            <Image
              boxSize="28px"
              fallback={<FontAwesomeIcon size="2x" icon={faQuestionCircle} />}
              src={token.logoURI}
              alt={`${token.name}-logo`}
            />
          </Box>
          <Flex direction="column">
            <Text mb={1} fontWeight="medium">
              {token.symbol}
            </Text>
            <Text opacity={0.7} fontSize="xs">
              {token.name}
            </Text>
          </Flex>
        </Flex>
        <Flex direction="column" justify="space-between" align="flex-end">
          <Box mb={1} fontWeight="medium">
            {isConnected && token.balance && parseFloat(token.balance).toFixed(4)}
            {isConnected && !token.balance && <FontAwesomeIcon icon={faCircleNotch} spin />}
            {!isConnected && "-"}
          </Box>
          {isConnected && (
            <Link opacity={0.7} fontSize="xs">
              <Text onClick={(e) => addTokenToWallet(e, token)}>{t.common.add_to_watchlist}</Text>
            </Link>
          )}
        </Flex>
      </Flex>
    );
  };

  return (
    <ChakraModal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t.common.choose_coin}</ModalHeader>
        <ModalCloseButton />
        <Box w="full" mb={6} px={6}>
          <Input
            focusBorderColor="pineGreen.900"
            borderColor="pineGreen.900"
            placeholder={t.common.token_name_or_address_placeholder}
            onChange={handleInputChange}
          />
        </Box>
        <ModalBody px={0}>
          <Flex w="full" align="flex-start" direction="column">
            {filteredTokens.length > 0 ? (
              <VStack w="full" spacing={2}>
                {disableItem && renderCoinItem(disableItem, true)}
                {filteredTokens
                  .filter((token: TokenState) => !disableItem || disableItem.address !== token.address)
                  .map((token: TokenState) => {
                    return renderCoinItem(token, false);
                  })}
              </VStack>
            ) : (
              <Text px={6} py={2} opacity={0.6}>
                {t.common.no_result}
              </Text>
            )}
          </Flex>
        </ModalBody>
      </ModalContent>
    </ChakraModal>
  );
};

export default CoinModal;

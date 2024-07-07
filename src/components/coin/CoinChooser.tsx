import { Box, Flex, Image, useDisclosure } from "@chakra-ui/react";
import { faQuestionCircle } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { FC } from "react";
import { FiChevronDown } from "react-icons/fi";

import { useTranslate } from "../../context/TranslateProvider";
import type { TokenState } from "../../context/WalletBaseProvider";

import CoinModal from "./CoinModal";

interface Props {
  value: TokenState | undefined;
  disabled?: boolean;
  onChange: (token: TokenState) => void;
}

const CoinChooser: FC<Props> = ({ value, disabled, onChange }) => {
  const { t } = useTranslate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleChange = (newValue: TokenState) => {
    onChange(newValue);
    onClose();
  };

  return (
    <>
      <Flex
        as={disabled ? "span" : "button"}
        bg="pineGreen.900"
        color="white"
        borderRadius="xl"
        align="center"
        px={3}
        py={2}
        direction="row"
        _hover={{
          backgroundColor: disabled ? "pineGreen.900" : "pineGreen.700",
        }}
        onClick={() => {
          if (!disabled) onOpen();
        }}
      >
        {value && (
          <Flex mr={2}>
            <Image
              fallback={<FontAwesomeIcon fontSize="24px" icon={faQuestionCircle} />}
              src={value.logoURI}
              boxSize="24px"
              alt={`${value.name}-logo`}
            />
          </Flex>
        )}
        <Box fontSize={14} mr={1} fontWeight="semibold">
          {value ? value.symbol : t.common.select_a_coin}
        </Box>
        {!disabled && (
          <Flex justify="center" align="center">
            <FiChevronDown size="18px" />
          </Flex>
        )}
      </Flex>
      <CoinModal disableItem={value} onSelected={handleChange} isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default CoinChooser;

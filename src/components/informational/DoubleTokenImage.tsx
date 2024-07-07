import { Box, Flex, Image } from "@chakra-ui/react";
import { faQuestionCircle } from "@fortawesome/pro-light-svg-icons";
import { faQuestionCircle as faQuestionCircleFull } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import type { TokenState } from "../../context/WalletBaseProvider";

interface DoubleImageProps {
  token0: TokenState;
  token1: TokenState;
}
const DoubleTokenImage = ({ token0, token1 }: DoubleImageProps) => {
  const isBothLogoUndefined = !token0?.logoURI && !token1?.logoURI;
  return (
    <Flex direction="row" align="center" justify="center">
      <Box>
        <Image
          border="1px solid"
          borderColor="blackAlpha.300"
          borderRadius="full"
          boxSize="28px"
          src={token0?.logoURI}
          fallback={<FontAwesomeIcon fontSize="26px" icon={faQuestionCircle} />}
          alt={`logo ${token0.name}`}
        />
      </Box>
      <Box ml={-2}>
        <Image
          border="1px solid"
          borderColor="blackAlpha.300"
          borderRadius="full"
          boxSize="28px"
          src={token1?.logoURI}
          fallback={
            <FontAwesomeIcon
              color="white"
              fontSize="26px"
              icon={isBothLogoUndefined ? faQuestionCircleFull : faQuestionCircle}
            />
          }
          alt={`logo ${token1.name}`}
        />
      </Box>
    </Flex>
  );
};

export default DoubleTokenImage;

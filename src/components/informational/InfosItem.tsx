import { Box, Flex, Skeleton, Text, useColorMode } from "@chakra-ui/react";
import type { FC, ReactElement } from "react";

interface Props {
  loading: boolean;
  keyText: string;
  value: ReactElement;
  severityLevel?: Severity;
}

export enum Severity {
  SAFE,
  WARNING,
  DANGER,
}

function getColorBySeverity(severity: Severity | undefined) {
  switch (severity) {
    case Severity.SAFE:
      return "green.500";
    case Severity.WARNING:
      return "orange.500";
    case Severity.DANGER:
      return "red.500";
    default:
      return undefined;
  }
}

const InfosItem: FC<Props> = ({ loading, keyText, value, severityLevel }) => {
  const { colorMode } = useColorMode();
  return (
    <Flex w="full" justify="space-between" align="center">
      <Text color={colorMode === "light" ? "blackAlpha.600" : "whiteAlpha.600"}>{keyText}</Text>
      <Box color={getColorBySeverity(severityLevel) || (colorMode === "light" ? "black" : "whiteAlpha.900")}>
        {loading ? (
          <Skeleton
            startColor={colorMode === "light" ? "blackAlpha.400" : "whiteAlpha.400"}
            endColor={colorMode === "light" ? "blackAlpha.200" : "whiteAlpha.200"}
            width="70px"
            height="12px"
          />
        ) : (
          value
        )}
      </Box>
    </Flex>
  );
};

export default InfosItem;

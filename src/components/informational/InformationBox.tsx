import { Flex, Text, Box } from "@chakra-ui/react";
import { IoWarningOutline } from "react-icons/io5";

interface InformationBoxProps {
  level?: "info" | "success" | "warning" | "sever";
  title: string;
  content: any;
}
const InformationBox = ({ level = "info", title, content }: InformationBoxProps) => {
  return (
    <Flex
      width="full"
      align="flex-start"
      justify="flex-start"
      direction="row"
      background={`${level}.100`}
      p={2}
      borderRadius={4}
      fontSize={14}
      color={`${level}.200`}
    >
      <Box>
        <IoWarningOutline size="24px" />
      </Box>
      <Flex direction="column" pl={4}>
        <Text as="span" color={`${level}.900`} mb={2}>
          {title}
        </Text>
        <Text as="div" color={`${level}.800`} fontSize={12}>
          {content}
        </Text>
      </Flex>
    </Flex>
  );
};

export default InformationBox;

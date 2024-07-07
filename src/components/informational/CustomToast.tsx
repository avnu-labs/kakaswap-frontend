import { Flex, Text } from "@chakra-ui/react";
import { faCircleNotch, faArrowUpRightFromSquare } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import IconLink from "../form/IconLink";

interface CustomToastProps {
  title?: string;
  message: string;
  link?: string;
  linkLabel?: string;
  loading?: boolean;
}
const CustomToast = ({ title, message, link, linkLabel, loading = false }: CustomToastProps) => {
  return (
    <Flex width="full" align="flex-start" justify="flex-start" direction="column" py={4} px={2}>
      {title && (
        <Flex width="full" direction="row" justify="space-between" align="center" mb={4}>
          <Text fontWeight="bold" fontSize={18}>
            {title}
          </Text>
          {loading && <FontAwesomeIcon icon={faCircleNotch} spin />}
        </Flex>
      )}
      <Text as="div" fontSize={14} lineHeight={1.5} opacity={0.6}>
        {message}
      </Text>
      {link && linkLabel && (
        <IconLink href={link} mt={4} icon={faArrowUpRightFromSquare}>
          {linkLabel}
        </IconLink>
      )}
    </Flex>
  );
};

export default CustomToast;

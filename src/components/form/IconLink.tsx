import { Link, Text } from "@chakra-ui/react";
import type { HTMLChakraProps } from "@chakra-ui/system";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";

interface IconLinkProps extends HTMLChakraProps<"a"> {
  icon: any;
  children: string;
  onClick?: () => void;
}

const IconLink = ({ icon, children, onClick, ...props }: IconLinkProps) => {
  return (
    <Link
      {...props}
      opacity={0.6}
      as="a"
      display="flex"
      flexDirection="row"
      justifyContent="center"
      alignItems="center"
      target="_blank"
      onClick={() => onClick && onClick()}
    >
      <FontAwesomeIcon icon={icon} />
      <Text ml={1}>{children}</Text>
    </Link>
  );
};

export default IconLink;

import { Box, Collapse, Flex, useDisclosure } from "@chakra-ui/react";
import { useEffect } from "react";

interface CollapsibleProps {
  header: any;
  children: any;
  defaultIsOpen?: boolean;
  closable?: boolean;
  disabledHeaderToggle?: boolean;
  isOpen?: boolean;
  onUpdate?: (isOpen: boolean) => void;
}
const Collapsible = ({
  header,
  children,
  defaultIsOpen = false,
  closable = true,
  disabledHeaderToggle = false,
  isOpen = false,
  onUpdate,
}: CollapsibleProps) => {
  const { isOpen: internalIsOpen, onToggle } = useDisclosure({ defaultIsOpen });
  useEffect(() => {
    if (onUpdate) onUpdate(internalIsOpen);
  }, [internalIsOpen, onUpdate]);
  return (
    <Flex w="full" direction="column">
      <Box
        w="full"
        borderRadius={6}
        onClick={() => !disabledHeaderToggle && onToggle()}
        cursor={disabledHeaderToggle || !closable ? "inherit" : "pointer"}
      >
        {header}
      </Box>
      <Collapse in={internalIsOpen || isOpen || !closable} animateOpacity>
        <Box>{children}</Box>
      </Collapse>
    </Flex>
  );
};

export default Collapsible;

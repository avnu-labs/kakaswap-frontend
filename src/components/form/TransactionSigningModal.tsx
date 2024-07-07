import { Flex } from "@chakra-ui/layout";
import { Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay } from "@chakra-ui/react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { faSpinner } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
  isOpen: boolean;
}
const TransactionSigningModal = ({ isOpen }: Props) => {
  return (
    <Modal
      isCentered
      isOpen={isOpen}
      onClose={() => {
        // Do nothing
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Signing</ModalHeader>
        <ModalBody>
          <Flex direction="column" justify="space-between" align="center" gap={4} pb={4}>
            <FontAwesomeIcon icon={faSpinner} spin size="2x" />
            <span>Sign the transaction on your wallet</span>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default TransactionSigningModal;

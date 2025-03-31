import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import Output from "./Output";

const OutputModal = ({ isOpen, setIsOutputModalOpen }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOutputModalOpen(false)}
      isCentered
      size="xl"
    >
      <ModalOverlay backdropFilter="blur(8px)" />
      <ModalContent maxW="90vw" maxH="90vh">
        <ModalCloseButton />
        <ModalBody p={0}>
          <Output />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default OutputModal;

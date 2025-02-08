import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import Output from "./Output";

const OutputModal = ({ isOpen, onClose, html, css, js }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <ModalOverlay backdropFilter="blur(8px)" />
      <ModalContent maxW="90vw" maxH="90vh">
        <ModalCloseButton />
        <ModalBody p={0}>
          <Output html={html} css={css} js={js} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default OutputModal;

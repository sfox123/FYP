import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Text,
  Button,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import FilePreview from "./FilePreview";

const ExportModal = ({ isOpen, onClose, handleDownloadZip }) => {
  // Retrieve generated code from centralized state
  const { html, css, js } = useSelector((state) => state.result);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay backdropFilter="blur(8px)" />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody p={4}>
          <Text fontSize="xl" mb={4} fontWeight="bold">
            Export Preview
          </Text>
          <FilePreview title="index.html" content={html} />
          <FilePreview title="styles.css" content={css} />
          <FilePreview title="script.js" content={js} />
          <Button colorScheme="blue" onClick={handleDownloadZip} width="100%">
            Download Zip
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ExportModal;

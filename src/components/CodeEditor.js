import React, { useRef, useEffect, useState } from "react";
import {
  Box,
  Spinner,
  HStack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import { Editor, useMonaco } from "@monaco-editor/react";
import { useDispatch, useSelector } from "react-redux";
import { setHtml, setCss, setJs } from "../redux/resultSlice";
import { FaExternalLinkAlt } from "react-icons/fa";
import { FaHtml5, FaCss3, FaJs } from "react-icons/fa";

const languageData = {
  html: { icon: FaHtml5, color: "tomato" },
  css: { icon: FaCss3, color: "blue" },
  js: { icon: FaJs, color: "#E4CD05" },
};

export default function CodeEditor({ lang }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const monaco = useMonaco();
  const dispatch = useDispatch();
  const editorRef = useRef(null);

  const { html, css, js } = useSelector((state) => state.result);
  const currentCode = lang === "html" ? html : lang === "css" ? css : js;

  // When Redux state changes, update the editor's model without remounting it
  useEffect(() => {
    if (editorRef.current) {
      const model = editorRef.current.getModel();
      if (model && model.getValue() !== currentCode) {
        model.setValue(currentCode);
      }
    }
  }, [currentCode]);

  const handleChange = (value) => {
    if (lang === "html") dispatch(setHtml(value));
    else if (lang === "css") dispatch(setCss(value));
    else if (lang === "js") dispatch(setJs(value));
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    editor.layout();
    editor.focus();

    // Attach the onMouseMove event to highlight corresponding lines in the output iframe.
    editor.onMouseMove((e) => {
      const position = e.target.position;
      if (position) {
        const lineNumber = position.lineNumber;
        // Assuming the output iframe is the first <iframe> in the DOM.
        const iframe = document.querySelector("iframe");
        if (iframe && iframe.contentDocument) {
          const iframeDoc = iframe.contentDocument;
          // Clear previous outlines.
          iframeDoc
            .querySelectorAll("*")
            .forEach((el) => (el.style.outline = ""));
          // Highlight all elements with a matching data-line attribute.
          const elements = iframeDoc.querySelectorAll(
            `[data-line="${lineNumber}"]`
          );
          elements.forEach((el) => {
            el.style.outline = "2px solid red";
          });
        }
      }
    });
  };

  const { icon: Icon, color } = languageData[lang] || {};

  return (
    <Box>
      <HStack
        spacing={2}
        align="center"
        padding={0.5}
        bg={color}
        justifyContent="space-between"
      >
        <HStack marginLeft={2} spacing={2} align="center">
          {Icon && <Icon />}
          <Text color="white">{lang.toUpperCase()}</Text>
        </HStack>
        <Box
          onClick={() => setIsModalOpen(true)}
          marginRight={2}
          cursor="pointer"
        >
          <FaExternalLinkAlt color="white" />
        </Box>
      </HStack>

      {monaco ? (
        <Editor
          height="20vh"
          theme="vs-dark"
          defaultLanguage={lang === "js" ? "javascript" : lang}
          value={currentCode}
          onChange={handleChange}
          onMount={handleEditorDidMount}
        />
      ) : (
        <Spinner size="xl" />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isCentered
        size="xl"
      >
        <ModalOverlay backdropFilter="blur(8px)" />
        <ModalContent maxW="90vw" maxH="90vh">
          <ModalCloseButton />
          <ModalBody p={0}>
            {monaco ? (
              <Editor
                height="80vh"
                theme="vs-dark"
                defaultLanguage={lang === "js" ? "javascript" : lang}
                value={currentCode}
                onChange={handleChange}
                onMount={handleEditorDidMount}
              />
            ) : (
              <Spinner size="xl" />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

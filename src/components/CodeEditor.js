import React, { useRef, useEffect, useState, useMemo } from "react";
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
  html: {
    icon: FaHtml5,
    color: "tomato",
  },
  css: {
    icon: FaCss3,
    color: "blue",
  },
  js: {
    icon: FaJs,
    color: "#E4CD05",
  },
};

export default function CodeEditor({ lang }) {
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const monaco = useMonaco();
  const dispatch = useDispatch();
  const editorRef = useRef(null);

  const { html, css, js, lineNumbers } = useSelector((state) => state.result);
  const currentCode = lang === "html" ? html : lang === "css" ? css : js;
  const currentLineNumbers = useMemo(
    () => lineNumbers[lang] || [],
    [lineNumbers, lang]
  );

  const handleChange = (value) => {
    if (lang === "html") dispatch(setHtml(value));
    if (lang === "css") dispatch(setCss(value));
    if (lang === "js") dispatch(setJs(value));
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    editor.layout();
    editor.focus();
    setIsEditorReady(true);
  };

  useEffect(() => {
    if (isEditorReady && editorRef.current && monaco) {
      try {
        const decorations = currentLineNumbers.map((rangeObj) => {
          const { startLine, startColumn, endLine, endColumn } = rangeObj;
          return {
            range: new monaco.Range(startLine, startColumn, endLine, endColumn),
            options: {
              inlineClassName: "highlight-line",
            },
          };
        });
        editorRef.current.deltaDecorations([], decorations);
      } catch (error) {
        console.error(
          "Error applying decorations:",
          error.message,
          error.stack
        );
      }
    }
  }, [isEditorReady, currentLineNumbers, monaco]);

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
        {/* Pop-out icon to open modal */}
        <Box
          onClick={() => setIsModalOpen(true)}
          marginRight={2}
          cursor="pointer"
        >
          <FaExternalLinkAlt color="white" />
        </Box>
      </HStack>

      {/* Inline Editor */}
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

      {/* Modal Pop-out */}
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

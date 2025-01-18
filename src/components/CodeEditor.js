import React, { useRef, useEffect, useState } from 'react';
import { Badge, Box, Spinner, HStack, Text, VStack } from '@chakra-ui/react';
import { Editor } from '@monaco-editor/react';
import { useDispatch, useSelector } from 'react-redux';
import { setHtml, setCss, setJs } from '../redux/codeSlice';


import { FaHtml5, FaCss3, FaJs } from 'react-icons/fa';

const languageData = {
  html: {
    icon: FaHtml5,
    color: 'tomato',
  },
  css: {
    icon: FaCss3,
    color: 'blue',
  },
  js: {
    icon: FaJs,
    color: '#E4CD05',
  },
};



export default function CodeEditor({ lang, monaco }) {
  const [isEditorReady, setIsEditorReady] = useState(false);
  const dispatch = useDispatch();
  const editorRef = useRef(null);

  // Grab the relevant code & line numbers from Redux
  const { html, css, js, lineNumbers } = useSelector((state) => state.code);
  const currentCode = lang === 'html' ? html : lang === 'css' ? css : js;
  const currentLineNumbers = lineNumbers[lang] || [];

  // Called when user edits in Monaco
  const handleChange = (value) => {
    if (lang === 'html') dispatch(setHtml(value));
    if (lang === 'css') dispatch(setCss(value));
    if (lang === 'js') dispatch(setJs(value));
  };

  // Called once the editor has mounted
  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    editor.layout();
    editor.focus();
    setIsEditorReady(true);
  };

  // Update highlights whenever lineNumbers changes
  useEffect(() => {
    if (isEditorReady && editorRef.current && monaco) {
      try {
        // Convert each line range into a decoration
        const decorations = currentLineNumbers.map((rangeObj) => {
          const { startLine, startColumn, endLine, endColumn } = rangeObj;
          return {
            range: new monaco.Range(startLine, startColumn, endLine, endColumn),
            options: {
              inlineClassName: 'highlight-line', // see index.css
            },
          };
        });

        // Apply the decorations (remove old ones by passing [])
        editorRef.current.deltaDecorations([], decorations);
      } catch (error) {
        console.error('Error applying decorations:', error.message, error.stack);
      }
    }
  }, [isEditorReady, currentLineNumbers, monaco]);

  const { icon: Icon, color } = languageData[lang] || {};

  return (
    <Box>
      <HStack spacing={2} align="center" padding={0.5} bg={color}>
        {Icon && <Icon />}
        <Text color={"white"}>{lang.toUpperCase()}</Text>
      </HStack>
      {monaco ? (
        <Editor
          height="30vh"
          theme="vs-dark"
          defaultLanguage={lang === 'js' ? 'javascript' : lang}
          value={currentCode}
          onChange={handleChange}
          onMount={handleEditorDidMount}
        />
      ) : (
        <Spinner size="xl" />
      )}
    </Box>
  );
}
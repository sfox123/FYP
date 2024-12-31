// src/components/CodeEditor.js
import React, { useRef, useEffect, useState } from 'react';
import { Box, Spinner } from '@chakra-ui/react';
import { Editor, useMonaco } from '@monaco-editor/react';
import { useDispatch, useSelector } from 'react-redux';
import { setHtml, setCss, setJs } from '../redux/codeSlice';

export default function CodeEditor({ lang }) {
  const dispatch = useDispatch();
  const monaco = useMonaco();
  const editorRef = useRef(null);
  const [isEditorReady, setIsEditorReady] = useState(false);

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
    }
  }, [isEditorReady, currentLineNumbers, monaco]);

  return (
    <Box minH="30vh">
      <Editor
        height="30vh"
        theme="vs-dark"
        defaultLanguage={lang === 'js' ? 'javascript' : lang}
        value={currentCode}
        onChange={handleChange}
        onMount={handleEditorDidMount}
      />
      {!isEditorReady && <Spinner size="xl" />}
    </Box>
  );
}

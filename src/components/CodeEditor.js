import React, { useRef } from 'react'
import { Box } from '@chakra-ui/react'
import { Editor } from '@monaco-editor/react'

export default function CodeEditor({lang, template, onChange}) {
  const editorRef = useRef();

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus()
  }

  return (
    <Box height={'25vh'}>
        <Editor
          theme='vs-dark' 
          defaultLanguage={lang} 
          onMount={onMount} 
          defaultValue={template} 
          onChange={(value) => onChange(value)} 
        />
    </Box>
  )
}

import React, { useRef, useState } from 'react'
import { Box } from '@chakra-ui/react'
import { Editor } from '@monaco-editor/react'


export default function CodeEditor({lang, template}) {
  const editorRef = useRef();
  const [value, setValue] = useState('');

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus()
  }
  return (
    <Box>
        <Editor height={'75vh'} theme='vs-dark' defaultLanguage={lang} onMount={onMount} value={value} onChange={(value) => setValue(value)} defaultValue={template} />
    </Box>
  )
}

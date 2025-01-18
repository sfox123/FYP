import React from 'react';
import { Box, HStack } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import CodeEditor from './components/CodeEditor';
import Output from './components/Output';
import InputComponent from './components/Input';
import { useMonaco } from '@monaco-editor/react';

function App() {
  const { html, css, js } = useSelector((state) => state.code);
  const monaco = useMonaco();
 
  return (
    <Box p={2} height="100vh">
      <HStack spacing={4} align="stretch" height="calc(100vh - 80px)">
        {/* Left side: Code editors */}
        <Box flex="2" display="flex" flexDirection="column"  >
          {['html', 'css', 'js'].map((lang) => (
            <Box
            key={lang} 
            flex="1"
            p={4} 
            m={2} 
            borderRadius="md" 
            bg="gray.800"
            overflow="auto"
            data-state="open"
            _open={{
              animation: "fadeIn 0.3s ease-out",
            }}
            className="hide-scrollbar" 
            >
              <CodeEditor monaco={monaco} lang={lang} />
            </Box>
          ))}
        </Box>

        {/* Right side: Live preview */}
        <Box flex="2" bg="gray.800" p={4} borderRadius="md">
          <Output html={html} css={css} js={js} />
        </Box>
      </HStack>

      {/* Bottom input box */}
      <InputComponent />
    </Box>
  );
}

export default App;
import { Box, HStack } from "@chakra-ui/react";
import CodeEditor from './components/CodeEditor'
import Output from "./components/Output";
import { useState } from "react";
import { languages } from "./db/db";

function App() {
  const [html, setHtml] = useState(languages[0].template);
  const [css, setCss] = useState(languages[1].template);
  const [js, setJs] = useState(languages[2].template);

  return (
    <Box>
    <HStack spacing={4} align="stretch">
      <Box width={'100%'}>
        {languages.map((language, index) => (
          <Box key={index} p={4} m={2} borderRadius={'md'}>
            <CodeEditor 
              lang={language.lang} 
              template={language.template} 
              onChange={(value) => {
                if(language.lang === 'html') setHtml(value);
                if(language.lang === 'css') setCss(value);
                if(language.lang === 'javascript') setJs(value);
              }} 
            />
          </Box>
        ))}
      </Box>
      <Output html={html} css={css} js={js} />
    </HStack>
    </Box>
  );
}

export default App;

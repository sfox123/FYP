import { Box, Flex, VStack } from "@chakra-ui/react";
import CodeEditor from './components/CodeEditor'

import { languages } from "./db/db";

function App() {
  return (
    <Flex direction="row" minH={'100vh'} bg={'#0f0a19'} color={'gray.500'} px={6} py={8}>
      <VStack spacing={4} align="stretch" flex="1">
        {languages.map((language, index) => (
          <Box key={index} p={4} m={2} bg={'gray.700'} borderRadius={'md'}>
            <CodeEditor lang={language.lang} template={language.template} />
          </Box>
        ))}
      </VStack>
    </Flex>
  );
}

export default App;
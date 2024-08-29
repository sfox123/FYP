import { Box, Text } from '@chakra-ui/react'
import React, { useEffect, useRef } from 'react'

export default function Output({ html, css, js }) {
  const iframeRef = useRef(null);
  const timeoutRef = useRef(null);

  const runCode = () => {
    const combinedCode = `
      <html>
      <head>
        <style>${css}</style>
      </head>
      <body>
        ${html}
        <script>${js}<\/script>
      </body>
      </html>
    `;
    const iframe = iframeRef.current;
    iframe.srcdoc = combinedCode;
  }

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      runCode();
    }, 3000); // Auto-run code after 3 seconds
    return () => clearTimeout(timeoutRef.current);
  }, [html, css, js]);

  return (
    <Box width={'100%'} p={4}>
        <Text mb={2} fontSize={'large'}>
            Output
        </Text>
        <Box height={'75vh'} p={2} border={'1px solid'} borderRadius={4} borderColor={'#333'}>
          <iframe ref={iframeRef} title="output" width="100%" height="100%" />
        </Box>
    </Box>
  )
}

// src/components/Output.js
import React, { useRef, useEffect } from 'react';
import { Box } from '@chakra-ui/react';

export default function Output({ html, css, js }) {
  const iframeRef = useRef(null);

  useEffect(() => {
    if (iframeRef.current) {
      const document = iframeRef.current.contentDocument;
      const documentContents = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <style>${css}</style>
          </head>
          <body>
            ${html}
            <script>${js}</script>
          </body>
        </html>
      `;
      document.open();
      document.write(documentContents);
      document.close();
    }
  }, [html, css, js]);

  return (
    <Box flex="1" bg="gray.100">
      <iframe
        ref={iframeRef}
        title="Output Preview"
        style={{ width: '100%', height: '85vh', border: 'none' }}
      />
    </Box>
  );
}

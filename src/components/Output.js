// Output.js
import React, { useRef, useEffect } from "react";
import { Box } from "@chakra-ui/react";

export default function Output({ html, css, js, onOutputReady }) {
  const iframeRef = useRef(null);

  useEffect(() => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      const docContents = `
        <!DOCTYPE html>
        <html lang="en">
          <head><style>${css}</style></head>
          <body>
            ${html}
            <script>${js}</script>
          </body>
        </html>
      `;
      doc.open();
      doc.write(docContents);
      doc.close();
    }
  }, [html, css, js]);

  // If you want to wait for the iframe's actual onLoad
  const handleLoad = () => {
    if (onOutputReady) onOutputReady();
  };

  return (
    <Box flex="1" bg="gray.100">
      <iframe
        ref={iframeRef}
        title="Output Preview"
        style={{ width: "100%", height: "85vh", border: "none" }}
        onLoad={handleLoad}
      />
    </Box>
  );
}

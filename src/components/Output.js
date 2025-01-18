// Output.js
import React, { useRef, useEffect } from "react";
import { AspectRatio } from "@chakra-ui/react";

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
    <AspectRatio height={"100%"} borderRadius={24} flex="1" bg="">
      <iframe
        ref={iframeRef}
        title="Output Preview"
        style={{ width: "100%", borderRadius:8, height: "100%", border: "none" }}
        onLoad={handleLoad}
        allowFullScreen
      />
    </AspectRatio>
  );
}

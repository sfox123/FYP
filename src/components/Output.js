import React, { useRef, useEffect } from "react";
import { AspectRatio } from "@chakra-ui/react";
import { useSelector } from "react-redux";

export default function Output({ onOutputReady }) {
  const iframeRef = useRef(null);
  // Retrieve generated code from the centralized result state
  const { html, css, js } = useSelector((state) => state.result);

  useEffect(() => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      const docContents = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <style>${css}</style>
          </head>
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

  const handleLoad = () => {
    if (onOutputReady) onOutputReady();
  };

  return (
    <AspectRatio height="100%" borderRadius={24} flex="1">
      <iframe
        ref={iframeRef}
        title="Output Preview"
        style={{
          width: "100%",
          borderRadius: 8,
          height: "100%",
          border: "none",
        }}
        onLoad={handleLoad}
        allowFullScreen
      />
    </AspectRatio>
  );
}

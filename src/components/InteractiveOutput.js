import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import StyleEditor from "./StyleEditor";
import { Box } from "@chakra-ui/react";

export default function InteractiveOutput() {
  const iframeRef = useRef(null);
  const { html, css, js } = useSelector((state) => state.result);
  const [selectedElement, setSelectedElement] = useState(null);
  const [elementStyles, setElementStyles] = useState({});
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const iframeDoc = iframeRef.current.contentDocument;
    const content = `
      <!DOCTYPE html>
      <html lang="en">
      <head><style>${css}</style></head>
      <body>${html}<script>${js}</script></body>
      </html>
    `;
    iframeDoc.open();
    iframeDoc.write(content);
    iframeDoc.close();

    const handleMouseOver = (e) => {
      e.target.style.outline = "2px solid blue";
    };

    const handleMouseOut = (e) => {
      e.target.style.outline = "";
    };

    const handleClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setSelectedElement(e.target);
      const rect = e.target.getBoundingClientRect();
      setPosition({ top: rect.top + rect.height + 10, left: rect.left });

      const computedStyles = iframeDoc.defaultView.getComputedStyle(e.target);
      setElementStyles({
        backgroundColor: computedStyles.backgroundColor,
        color: computedStyles.color,
        fontSize: computedStyles.fontSize,
        padding: computedStyles.padding,
        margin: computedStyles.margin,
        borderRadius: computedStyles.borderRadius,
      });
    };

    iframeDoc.addEventListener("mouseover", handleMouseOver);
    iframeDoc.addEventListener("mouseout", handleMouseOut);
    iframeDoc.addEventListener("click", handleClick);

    return () => {
      iframeDoc.removeEventListener("mouseover", handleMouseOver);
      iframeDoc.removeEventListener("mouseout", handleMouseOut);
      iframeDoc.removeEventListener("click", handleClick);
    };
  }, [html, css, js]);

  const updateElementStyle = (style, value) => {
    if (selectedElement) {
      selectedElement.style[style] = value;
      setElementStyles((prev) => ({ ...prev, [style]: value }));
    }
  };

  return (
    <Box position="relative" height="100%">
      <iframe
        ref={iframeRef}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          background: "white",
        }}
      />
      {selectedElement && (
        <StyleEditor
          position={position}
          styles={elementStyles}
          updateStyle={updateElementStyle}
          close={() => setSelectedElement(null)}
        />
      )}
    </Box>
  );
}

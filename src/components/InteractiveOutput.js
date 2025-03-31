import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setHtml, setCss } from "../redux/resultSlice";
import StyleEditor from "./StyleEditor";
import { Box } from "@chakra-ui/react";

// Modified helper: Update or append a CSS rule for a given selector.
// The selector may be a tag (e.g. "h1") or a class (e.g. "editable-123456").
// We build the regex accordingly.
function updateGlobalCssRule(existingCss, selector, property, value) {
  let regex;
  if (selector.startsWith(".")) {
    regex = new RegExp(`\\.${selector.slice(1)}\\s*\\{([^}]*)\\}`, "m");
  } else {
    regex = new RegExp(`\\b${selector}\\s*\\{([^}]*)\\}`, "m");
  }
  const match = existingCss.match(regex);
  let newRule = "";
  if (match) {
    let ruleBody = match[1].trim();
    const propRegex = new RegExp(`${property}\\s*:\\s*[^;]+;?`, "i");
    if (propRegex.test(ruleBody)) {
      ruleBody = ruleBody.replace(propRegex, `${property}: ${value};`);
    } else {
      ruleBody += ` ${property}: ${value};`;
    }
    newRule = `${selector} { ${ruleBody} }`;
    return existingCss.replace(regex, newRule);
  } else {
    newRule = `${selector} { ${property}: ${value}; }`;
    return existingCss + "\n" + newRule;
  }
}

// Helper: Check if the element already has an editable class (prefix "editable-").
// If not, assign one and return the class name prefixed with a dot.
function assignEditableClass(element) {
  const existing = Array.from(element.classList).find((cl) =>
    cl.startsWith("editable-")
  );
  if (existing) return "." + existing;
  const newClass = "editable-" + Math.floor(Math.random() * 1000000);
  element.classList.add(newClass);
  return "." + newClass;
}

// Helper: Get the target selector for style updates.
// If a rule for the element's tag (lowercase) exists in the CSS, we return that tag name.
// Otherwise, we assign an editable class and return that class selector.
function getTargetSelector(element, currentCss) {
  const tag = element.tagName.toLowerCase();
  const tagRegex = new RegExp(`\\b${tag}\\s*\\{`, "i");
  if (tagRegex.test(currentCss)) {
    // A global rule for this tag exists—use the tag as the selector.
    return tag;
  } else {
    // No rule exists for this tag; assign a unique editable class.
    return assignEditableClass(element);
  }
}

export default function InteractiveOutput() {
  const iframeRef = useRef(null);
  const dispatch = useDispatch();
  const { html, css, js } = useSelector((state) => state.result);
  const [selectedElement, setSelectedElement] = useState(null);
  const [elementStyles, setElementStyles] = useState({});
  const [position, setPosition] = useState({ top: 0, left: 0 });

  // Render the iframe using a fixed template.
  // We always use Redux's html for the body.
  const renderIframeContent = (cssContent = css) => {
    const iframeDoc = iframeRef.current.contentDocument;
    const content = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <style>${cssContent}</style>
        </head>
        <body>
          ${html}
          <script>${js}</script>
        </body>
      </html>
    `;
    iframeDoc.open();
    iframeDoc.write(content);
    iframeDoc.close();
  };

  // We do not update Redux HTML when editing styles—only CSS is updated.
  // The HTML remains the code editor’s source.
  useEffect(() => {
    renderIframeContent();
    const iframeDoc = iframeRef.current.contentDocument;

    const handleMouseOver = (e) => {
      e.target.style.outline = "2px solid blue";
    };

    const handleMouseOut = (e) => {
      e.target.style.outline = "";
    };

    const handleClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const target = e.target;
      // Instead of always assigning an editable class,
      // we let getTargetSelector decide based on existing CSS.
      const targetSelector = getTargetSelector(target, css);
      setSelectedElement(target);
      const rect = target.getBoundingClientRect();
      setPosition({ top: rect.top + rect.height + 10, left: rect.left });
      const computedStyles = iframeDoc.defaultView.getComputedStyle(target);
      setElementStyles({
        backgroundColor: computedStyles.backgroundColor,
        color: computedStyles.color,
        fontSize: computedStyles.fontSize,
        padding: computedStyles.padding,
        margin: computedStyles.margin,
        borderRadius: computedStyles.borderRadius,
        targetSelector, // store the selector for updates
      });
      // Re-render the iframe so that, if a class was added, it is visible.
      renderIframeContent(css);
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

  // Instead of updating inline styles, update the CSS rule for the target selector.
  const updateElementStyle = (property, value) => {
    if (selectedElement && elementStyles.targetSelector) {
      const selector = elementStyles.targetSelector; // either a tag name (like "h1") or a class (like ".editable-123456")
      const newCss = updateGlobalCssRule(css, selector, property, value);
      dispatch(setCss(newCss));
      // Re-render the iframe with the updated CSS.
      renderIframeContent(newCss);
      // Update local state for the style editor UI.
      setElementStyles((prev) => ({ ...prev, [property]: value }));
    }
  };

  // On closing the style editor, export the final HTML using a fixed head template.
  // The body is taken from the original Redux HTML.
  const handleCloseEditor = () => {
    const finalHtml = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Exported Project</title>
    <link rel="stylesheet" href="styles.css">
  </head>
  <body>
    ${html}
  </body>
</html>
    `.trim();
    dispatch(setHtml(finalHtml));
    setSelectedElement(null);
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
        title="Interactive Output"
      />
      {selectedElement && (
        <StyleEditor
          position={position}
          styles={elementStyles}
          updateStyle={updateElementStyle}
          close={handleCloseEditor}
        />
      )}
    </Box>
  );
}

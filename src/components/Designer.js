import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  GridItem,
  HStack,
  VStack,
  Image,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchCodeGen } from "../redux/codeGenSlice";

const Designer = () => {
  // These come from the result slice (used for constructing the skeleton)
  const { html, css, js } = useSelector((state) => state.result);
  const dispatch = useDispatch();

  // Local state for the fetched data array, loading and error
  const [dataArray, setDataArray] = useState([]);
  const [localLoading, setLocalLoading] = useState(true);
  const [localError, setLocalError] = useState("");
  const [htmlCode, setHtmlCode] = useState("");

  // Construct the skeleton for code generation
  const skel = `
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

  // Helper function to extract the complete HTML code from refined_html
  const extractCompleteHTML = (refinedHtml) => {
    const startIndex = refinedHtml.indexOf("<!DOCTYPE html>");
    const endIndex = refinedHtml.lastIndexOf("</html>");
    if (startIndex !== -1 && endIndex !== -1) {
      // +7 to include the "</html>" tag itself
      return refinedHtml.substring(startIndex, endIndex + 7).trim();
    }
    return refinedHtml; // Fallback: return the whole text if the pattern isn't found
  };

  const handleChange = (e) => {
    setHtmlCode(e);
  };

  useEffect(() => {
    setHtmlCode(skel); // Move this inside useEffect to prevent infinite re-renders
    setLocalLoading(true);
    dispatch(fetchCodeGen(skel))
      .unwrap()
      .then((fetchedData) => {
        // Assume fetchedData is an object with an "options" key that is an array of objects
        // each having a "refined_html" property.
        setDataArray(fetchedData["options"]);
        setLocalLoading(false);
      })
      .catch((err) => {
        setLocalError(err);
        setLocalLoading(false);
      });
  }, [dispatch, skel]);

  return (
    <Grid templateRows="auto 1fr" height="100vh" bg="gray.900" gap={4}>
      {/* Navbar */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        p={4}
        bg="gray.800"
        color="white"
        height="60px"
      >
        <HStack spacing={4}>
          <Link to="/Home">
            <Image src="logo-white.png" alt="Logo" width="180px" />
          </Link>
        </HStack>
      </Box>

      {/* Main Content */}
      <Grid templateColumns="1fr 2fr" gap={4} p={4}>
        {/* Left Column: Three Boxes with extracted complete HTML or Skeleton Loaders */}
        <GridItem>
          <VStack spacing={4} align="stretch">
            {localLoading ? (
              [0, 1, 2].map((index) => (
                <Skeleton key={index} height="200px" borderRadius="md" />
              ))
            ) : localError ? (
              <Text color="red.500">Error: {localError}</Text>
            ) : dataArray && dataArray.length > 0 ? (
              dataArray.map((item, idx) => (
                <Box
                  key={idx}
                  bg={"gray.200"}
                  p={4}
                  borderRadius="md"
                  height="200px"
                  onClick={() =>
                    handleChange(extractCompleteHTML(item.refined_html))
                  }
                  cursor="pointer"
                >
                  <iframe
                    title={`output-${idx}`}
                    srcDoc={extractCompleteHTML(item.refined_html)}
                    style={{ width: "100%", height: "100%", border: "none" }}
                  />
                </Box>
              ))
            ) : (
              <Text>No data available</Text>
            )}
          </VStack>
        </GridItem>

        {/* Right Column: Iframe Output */}
        <GridItem>
          <Box borderRadius="md" overflow="hidden" height="100%">
            <iframe
              title="output"
              srcDoc={htmlCode}
              style={{ width: "100%", height: "100%", border: "none" }}
            />
          </Box>
        </GridItem>
      </Grid>
    </Grid>
  );
};

export default Designer;

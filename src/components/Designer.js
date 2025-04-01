import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Grid,
  GridItem,
  HStack,
  VStack,
  Image,
  Skeleton,
  Text,
  Button,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchCodeGen } from "../redux/codeGenSlice";
import { setHtml, setCss, setJs } from "../redux/resultSlice";

const Designer = () => {
  // These come from the result slice (used for constructing the skeleton)
  const { html, css, js } = useSelector((state) => state.result);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Local state for the fetched data array, loading and error
  const [dataArray, setDataArray] = useState([]);
  const [localLoading, setLocalLoading] = useState(true);
  const [localError, setLocalError] = useState("");
  const [htmlCode, setHtmlCode] = useState("");
  const [selectedIdea, setSelectedIdea] = useState(null); // To track the selected idea

  // Memoize the skeleton object to prevent infinite re-renders
  const skel = useMemo(() => ({ html, css, js }), [html, css, js]);

  useEffect(() => {
    setHtmlCode(html); // Set the initial HTML code
    setLocalLoading(true);
    dispatch(fetchCodeGen({ html, css, js }))
      .unwrap()
      .then((fetchedData) => {
        console.log("Fetched Data Array:", fetchedData); // Debugging
        setDataArray(fetchedData); // Set the design options directly
        setLocalLoading(false);
      })
      .catch((err) => {
        setLocalError(err);
        setLocalLoading(false);
      });
  }, [dispatch, html, css, js]);

  const handleAcceptChanges = () => {
    if (selectedIdea) {
      // Save the selected idea's html, css, and js to Redux
      dispatch(setHtml(selectedIdea.html));
      dispatch(setCss(selectedIdea.css));
      dispatch(setJs(selectedIdea.js));
      // Navigate to the home page
      navigate("/Home");
    }
  };

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
        {/* Left Column: Three Boxes with Design Ideas or Skeleton Loaders */}
        <GridItem>
          <VStack spacing={4} align="stretch">
            {localLoading ? (
              [0, 1, 2].map((index) => (
                <Skeleton key={index} height="200px" borderRadius="md" />
              ))
            ) : localError ? (
              <Text color="red.500">Error: {localError}</Text>
            ) : dataArray && dataArray.length > 0 ? (
              dataArray.map((idea, idx) => {
                const iframeContent = `
                  <!DOCTYPE html>
                  <html lang="en">
                    <head>
                      <meta charset="UTF-8">
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      <style>${idea.css}</style>
                    </head>
                    <body>
                      ${idea.html}
                      <script>${idea.js}</script>
                    </body>
                  </html>
                `;
                console.log("Iframe Content:", iframeContent); // Debugging
                return (
                  <Box
                    key={idx}
                    bg={"gray.200"}
                    p={4}
                    borderRadius="md"
                    height="200px"
                    onClick={() => {
                      setHtmlCode(iframeContent);
                      setSelectedIdea(idea); // Set the selected idea
                    }}
                    cursor="pointer"
                  >
                    <Text fontWeight="bold" mb={2}>
                      {idea.label || `Option ${idx + 1}`}
                    </Text>
                    <iframe
                      title={`idea-${idx}`}
                      srcDoc={iframeContent}
                      style={{ width: "100%", height: "100%", border: "none" }}
                    />
                  </Box>
                );
              })
            ) : (
              <Text>No design ideas available</Text>
            )}
          </VStack>
        </GridItem>

        {/* Right Column: Selected HTML Output */}
        <GridItem>
          <Box borderRadius="md" overflow="hidden" height="100%">
            <iframe
              title="output"
              srcDoc={htmlCode}
              style={{ width: "100%", height: "100%", border: "none" }}
            />
          </Box>
          {selectedIdea && (
            <Button
              mt={4}
              colorScheme="teal"
              onClick={handleAcceptChanges}
              width="100%"
            >
              Accept Changes
            </Button>
          )}
        </GridItem>
      </Grid>
    </Grid>
  );
};

export default Designer;

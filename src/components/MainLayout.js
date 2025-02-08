import React from "react";
import {
  Grid,
  GridItem,
  VStack,
  HStack,
  Box,
  IconButton,
} from "@chakra-ui/react";
import CodeEditor from "./CodeEditor";
import Output from "./Output";
import InputComponent from "./Input";
import { FaExternalLinkAlt } from "react-icons/fa";

export default function MainLayout({
  viewOrientation,
  monaco,
  html,
  css,
  js,
  setIsOutputModalOpen,
}) {
  if (viewOrientation === "vertical") {
    return (
      <>
        <Grid
          templateColumns={["1fr", "1fr 1fr"]}
          gap={4}
          height="calc(100vh - 100px)"
        >
          <GridItem>
            <VStack spacing={4} height="100%">
              {["html", "css", "js"].map((lang) => (
                <Box
                  key={lang}
                  flex="1"
                  width="100%"
                  borderRadius="md"
                  bg="gray.800"
                  overflow="hidden"
                >
                  <CodeEditor monaco={monaco} lang={lang} />
                </Box>
              ))}
            </VStack>
          </GridItem>
          <GridItem>
            <Box
              bg="gray.800"
              p={4}
              borderRadius="md"
              height="100%"
              position="relative"
            >
              <HStack justify="space-between" mb={2}>
                <Box color="white" fontWeight="bold">
                  Output
                </Box>
                <IconButton
                  size="sm"
                  variant="ghost"
                  aria-label="Pop Out Output"
                  icon={<FaExternalLinkAlt color="white" />}
                  onClick={() => setIsOutputModalOpen(true)}
                />
              </HStack>
              <Output html={html} css={css} js={js} />
            </Box>
          </GridItem>
        </Grid>
        <InputComponent />
      </>
    );
  } else {
    return (
      <VStack spacing={4} height="calc(100vh - 100px)" align="stretch">
        <HStack spacing={4}>
          {["html", "css", "js"].map((lang) => (
            <Box
              key={lang}
              flex="1"
              borderRadius="md"
              bg="gray.800"
              overflow="hidden"
            >
              <CodeEditor monaco={monaco} lang={lang} />
            </Box>
          ))}
        </HStack>
        <Box bg="gray.800" p={4} borderRadius="md" position="relative" flex="1">
          <HStack justify="space-between" mb={2}>
            <Box color="white" fontWeight="bold">
              Output
            </Box>
            <IconButton
              size="sm"
              variant="ghost"
              aria-label="Pop Out Output"
              icon={<FaExternalLinkAlt color="white" />}
              onClick={() => setIsOutputModalOpen(true)}
            />
          </HStack>
          <Output html={html} css={css} js={js} />
        </Box>
        <Box>
          <InputComponent />
        </Box>
      </VStack>
    );
  }
}

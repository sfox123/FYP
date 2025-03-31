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
import InputComponent from "./Input";
import Output from "./Output";
import { FaExternalLinkAlt } from "react-icons/fa";
import OutputModal from "./OutputModal";

export default function MainLayout({ viewOrientation }) {
  const [isOutputModalOpen, setIsOutputModalOpen] = React.useState(false);
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
                  <CodeEditor lang={lang} />
                </Box>
              ))}
            </VStack>
          </GridItem>
          <GridItem>
            <Box p={4} borderRadius="md" height="100%" position="relative">
              {/* Render inline output only when modal is closed */}
              {!isOutputModalOpen && (
                <Box w="100%" h="90%" borderRadius="md" overflow="hidden">
                  <Output />
                </Box>
              )}
              {/* Position the button so it stays on top */}
              <HStack
                padding={2}
                justify="space-between"
                mb={2}
                position="absolute"
                top={2}
                right={2}
                zIndex={2}
              >
                <Box color="white" fontWeight="bold"></Box>
                <IconButton
                  size="sm"
                  variant="ghost"
                  aria-label="Pop Out Output"
                  icon={<FaExternalLinkAlt color="black" />}
                  onClick={() => setIsOutputModalOpen(true)}
                />
              </HStack>
              <OutputModal
                isOpen={isOutputModalOpen}
                setIsOutputModalOpen={setIsOutputModalOpen}
              />
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
              <CodeEditor lang={lang} />
            </Box>
          ))}
        </HStack>
        <Box bg="white" p={4} borderRadius="md" position="relative" flex="1">
          <HStack justify="space-between" mb={2}>
            <IconButton
              size="sm"
              variant="ghost"
              aria-label="Pop Out Output"
              icon={<FaExternalLinkAlt color="white" />}
              onClick={() => setIsOutputModalOpen(true)}
            />
          </HStack>
          <OutputModal
            isOpen={isOutputModalOpen}
            setIsOutputModalOpen={setIsOutputModalOpen}
          />
        </Box>
        <Box>
          <InputComponent />
        </Box>
      </VStack>
    );
  }
}

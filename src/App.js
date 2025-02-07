import React, { useState } from "react";
import {
  Box,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  useDisclosure,
  Image,
  Grid,
  GridItem,
  VStack,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Button,
  Text,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import CodeEditor from "./components/CodeEditor";
import Output from "./components/Output";
import InputComponent from "./components/Input";
import { useMonaco } from "@monaco-editor/react";
import { FaBars, FaExternalLinkAlt, FaFileExport } from "react-icons/fa";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import JSZip from "jszip";
import { saveAs } from "file-saver";

function App() {
  const { html, css, js } = useSelector((state) => state.code);
  const monaco = useMonaco();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [viewOrientation, setViewOrientation] = useState("vertical");
  // State for output pop-out modal
  const [isOutputModalOpen, setIsOutputModalOpen] = useState(false);
  // State for export modal
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Function to generate zip file and trigger download
  // ...existing imports and code...
  // Function to generate zip file and trigger download
  const handleDownloadZip = async () => {
    const finalHtml = `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <title>Exported Project</title>
      <link rel="stylesheet" href="styles.css">
    </head>
    <body>
      ${html}
      <script src="script.js"></script>
    </body>
  </html>`;
    const zip = new JSZip();
    zip.file("index.html", finalHtml);
    zip.file("styles.css", css);
    zip.file("script.js", js);
    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, "export.zip");
    setIsExportModalOpen(false);
  };
  // ...rest of code...
  return (
    <Box p={2} height="100vh">
      {/* Header with Hamburger and Logo */}
      <Box display="flex" alignItems="center" mb={4}>
        <IconButton
          icon={<FaBars />}
          onClick={onOpen}
          aria-label="Open Drawer"
          variant="ghost"
          mr={2}
        />
        <Image
          src="/logo-white.png"
          alt="Logo"
          width="180px"
          display="inline-block"
        />
      </Box>

      {/* Drawer Component with Sidebar */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="black">
          <DrawerCloseButton color="white" />
          <Box p={4} textAlign="center">
            <Image src="/logo-white.png" alt="Logo" width="180px" mx="auto" />
          </Box>
          <DrawerBody color="white" pt={0}>
            <Sidebar backgroundColor="transparent">
              <Menu backgroundColor="transparent">
                <MenuItem>Dashboard</MenuItem>
                <SubMenu label="View">
                  <MenuItem
                    onClick={() => {
                      setViewOrientation("vertical");
                      onClose();
                    }}
                  >
                    Vertical (Default)
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setViewOrientation("horizontal");
                      onClose();
                    }}
                  >
                    Horizontal
                  </MenuItem>
                </SubMenu>
                <MenuItem
                  onClick={() => {
                    setIsExportModalOpen(true);
                    onClose();
                  }}
                >
                  <HStack spacing={2}>
                    <span>Export</span>
                    <FaFileExport />
                  </HStack>
                </MenuItem>
              </Menu>
            </Sidebar>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {viewOrientation === "vertical" ? (
        // Vertical View Layout
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
                {/* Pop-out button opens modal */}
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
      ) : (
        // Horizontal View Layout
        <VStack spacing={4} height="calc(100vh - 100px)" align="stretch">
          {/* Editors Row */}
          <HStack spacing={4} flex="none">
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
          {/* Output Panel Row */}
          <Box
            bg="gray.800"
            p={4}
            borderRadius="md"
            position="relative"
            flex="1"
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
          {/* Input Component Row */}
          <Box>
            <InputComponent />
          </Box>
        </VStack>
      )}

      {/* In vertical view, Input remains at the bottom */}
      {viewOrientation === "vertical" && <InputComponent />}

      {/* Output Modal Pop-out */}
      <Modal
        isOpen={isOutputModalOpen}
        onClose={() => setIsOutputModalOpen(false)}
        isCentered
        size="xl"
      >
        <ModalOverlay backdropFilter="blur(8px)" />
        <ModalContent maxW="90vw" maxH="90vh">
          <ModalCloseButton />
          <ModalBody p={0}>
            <Output html={html} css={css} js={js} />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Export Modal */}
      <Modal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        isCentered
        size="lg"
      >
        <ModalOverlay backdropFilter="blur(8px)" />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody p={4}>
            <Text fontSize="xl" mb={4} fontWeight="bold">
              Export Preview
            </Text>
            {/* Preview of each file */}
            <Box mb={4}>
              <Text fontWeight="bold">index.html</Text>
              <Box
                p={2}
                bg="white"
                borderRadius="md"
                maxH="100px"
                overflowY="auto"
              >
                <Text color={"black"} fontSize="sm">
                  {html}
                </Text>
              </Box>
            </Box>
            <Box mb={4}>
              <Text fontWeight="bold">styles.css</Text>
              <Box
                p={2}
                bg="white"
                borderRadius="md"
                maxH="100px"
                overflowY="auto"
              >
                <Text color={"black"} fontSize="sm">
                  {css}
                </Text>
              </Box>
            </Box>
            <Box mb={4}>
              <Text fontWeight="bold">script.js</Text>
              <Box
                p={2}
                bg="white"
                borderRadius="md"
                maxH="100px"
                overflowY="auto"
              >
                <Text color={"black"} fontSize="sm">
                  {js}
                </Text>
              </Box>
            </Box>
            <Button colorScheme="blue" onClick={handleDownloadZip} width="100%">
              Download Zip
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default App;

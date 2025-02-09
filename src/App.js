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
} from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import ExportModal from "./components/ExportModal";
import CustomSidebar from "./components/CustomSidebar";
import MainLayout from "./components/MainLayout";
import OutputModal from "./components/OutputModal";
import { FaBars } from "react-icons/fa";
import { setModel } from "./redux/codeSlice";

function App() {
  const { model } = useSelector((state) => state.code);
  const { html, css, js } = useSelector((state) => state.result);
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [viewOrientation, setViewOrientation] = useState("vertical");
  const [isOutputModalOpen, setIsOutputModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Update Redux model
  const handleModelChange = (selectedModel) => {
    dispatch(setModel(selectedModel));
  };

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

  return (
    <Box p={2} height="100vh">
      {/* Header */}
      <Box display="flex" alignItems="center" mb={4}>
        <IconButton
          icon={<FaBars />}
          onClick={onOpen}
          color={"white"}
          aria-label="Open Drawer"
          variant="ghost"
          mr={2}
        />
        <Image
          src="logo-white.png"
          alt="Logo"
          width="180px"
          display="inline-block"
        />
      </Box>

      {/* Sidebar Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="black">
          <DrawerCloseButton color="white" />
          <Box p={4} textAlign="center">
            <Image src="/logo-white.png" alt="Logo" width="180px" mx="auto" />
          </Box>
          <DrawerBody color="white" pt={0}>
            <CustomSidebar
              onClose={onClose}
              setViewOrientation={setViewOrientation}
              handleModelChange={handleModelChange}
              model={model}
              setIsExportModalOpen={setIsExportModalOpen}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Main Layout */}
      <MainLayout viewOrientation={viewOrientation} />

      {/* Output Modal */}
      <OutputModal
        isOpen={isOutputModalOpen}
        onClose={() => setIsOutputModalOpen(false)}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        handleDownloadZip={handleDownloadZip}
      />
    </Box>
  );
}

export default App;

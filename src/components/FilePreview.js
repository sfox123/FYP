import React from "react";
import { Box, Text } from "@chakra-ui/react";

const FilePreview = ({ title, content }) => {
  return (
    <Box mb={4}>
      <Text fontWeight="bold">{title}</Text>
      <Box p={2} bg="white" borderRadius="md" maxH="100px" overflowY="auto">
        <Text color="black" fontSize="sm">
          {content}
        </Text>
      </Box>
    </Box>
  );
};

export default FilePreview;

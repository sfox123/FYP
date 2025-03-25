import React from "react";
import { Box, Input, VStack, HStack, Button, Text } from "@chakra-ui/react";

export default function StyleEditor({ position, styles, updateStyle, close }) {
  return (
    <Box
      position="absolute"
      top={position.top}
      left={position.left}
      bg="gray.700"
      color="white"
      p={4}
      borderRadius="md"
      boxShadow="lg"
      zIndex={9999}
    >
      <Text fontWeight="bold" mb={2}>
        Edit Styles
      </Text>
      <VStack spacing={2}>
        <HStack>
          <Text fontSize="sm">BG Color:</Text>
          <Input
            size="sm"
            type="color"
            value={rgbToHex(styles.backgroundColor)}
            onChange={(e) => updateStyle("backgroundColor", e.target.value)}
          />
        </HStack>
        <HStack>
          <Text fontSize="sm">Font Color:</Text>
          <Input
            size="sm"
            type="color"
            value={rgbToHex(styles.color)}
            onChange={(e) => updateStyle("color", e.target.value)}
          />
        </HStack>
        <HStack>
          <Text fontSize="sm">Font Size:</Text>
          <Input
            size="sm"
            type="text"
            value={styles.fontSize}
            onChange={(e) => updateStyle("fontSize", e.target.value)}
          />
        </HStack>
        <HStack>
          <Text fontSize="sm">Padding:</Text>
          <Input
            size="sm"
            type="text"
            value={styles.padding}
            onChange={(e) => updateStyle("padding", e.target.value)}
          />
        </HStack>
        <HStack>
          <Text fontSize="sm">Margin:</Text>
          <Input
            size="sm"
            type="text"
            value={styles.margin}
            onChange={(e) => updateStyle("margin", e.target.value)}
          />
        </HStack>
        <HStack>
          <Text fontSize="sm">Border Radius:</Text>
          <Input
            size="sm"
            type="text"
            value={styles.borderRadius}
            onChange={(e) => updateStyle("borderRadius", e.target.value)}
          />
        </HStack>
        <Button size="sm" colorScheme="red" onClick={close}>
          Close
        </Button>
      </VStack>
    </Box>
  );
}

// Helper to convert RGB to HEX
function rgbToHex(rgb) {
  if (!rgb || rgb.indexOf("rgb") === -1) return "#ffffff";
  const rgbArray = rgb.match(/\d+/g);
  const hex = rgbArray
    .map((x) => {
      const hex = parseInt(x).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    })
    .join("");
  return "#" + hex;
}

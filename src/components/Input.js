// src/components/InputComponent.js
import { Input, Button, Box, Flex, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setInput, fetchOpenAICode } from "../redux/codeSlice";
import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";

export default function InputComponent({ onInputReady }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.code);

  const [message, setMessage] = useState("");

  const handleSend = async () => {
    // 1) Update the input in Redux
    dispatch(setInput(message));

    // 2) Call our async thunk to fetch code from OpenAI
    dispatch(fetchOpenAICode(message));

    // 3) Clear the local input box
    setMessage("");
  };


  useEffect(() => {
    if (onInputReady) {
      onInputReady();
    }
  }, [onInputReady]);

  return (
    <Box
      mt={5}
      position="fixed"
      bottom="0"
      width="100%"
      p={4}
      boxShadow="md"
    >
      <Flex direction="column" gap={2}>
        {error && (
          <Text color="red.500" fontWeight="bold">
            Error: {error}
          </Text>
        )}
        <Flex>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe what you want to build or change..."
            flex="1"
            mr={2}
            isDisabled={loading}
            color="black" // text color
            bg="gray.100" // input background
            _placeholder={{ color: "gray.500" }} // placeholder text color
          />
          <Button
            onClick={handleSend}
            colorScheme="blue"
            leftIcon={<FaPaperPlane />}
            isLoading={loading}
          >
            Send
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}

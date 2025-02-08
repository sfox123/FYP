import { Input, Button, Box, Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setInput } from "../redux/codeSlice";
import { fetchOpenAICode } from "../redux/codeSlice";
import { fetchGeminiCode } from "../redux/geminiSlice";
import { FaPaperPlane } from "react-icons/fa";

export default function InputComponent({ onInputReady }) {
  const dispatch = useDispatch();
  // Use centralized result state for loading/error feedback
  const { loading, error } = useSelector((state) => state.result);
  // Get the selected model from code state
  const { model } = useSelector((state) => state.code);
  const [message, setMessage] = useState("");

  const handleSend = () => {
    dispatch(setInput(message));
    // Dispatch the proper thunk based on selected model
    if (model === "Gemini-2.0") {
      dispatch(fetchGeminiCode(message));
    } else {
      dispatch(fetchOpenAICode(message));
    }
    setMessage("");
  };

  useEffect(() => {
    if (onInputReady) onInputReady();
  }, [onInputReady]);

  return (
    <Box mt={5} position="fixed" bottom="0" width="100%" p={4} boxShadow="md">
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
            color="black"
            bg="gray.100"
            _placeholder={{ color: "gray.500" }}
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

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Box, Spinner } from "@chakra-ui/react";

const Animation = () => {
  const FULL_TEXT = "CodeXBuilder";
  const [typedIndex, setTypedIndex] = useState(0);      // Where we are in the word
  const [showCaret, setShowCaret] = useState(true);     // Blinking cursor
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  // Simulate typing, increment one char every 80-100 ms
  useEffect(() => {
    const typingInterval = setInterval(() => {
      setTypedIndex((prev) => {
        if (prev === FULL_TEXT.length) {
          setIsTypingComplete(true);
          return prev;
        }
        return prev + 1;
      });
    }, 100); // Speed of typing

    return () => clearInterval(typingInterval);
  }, []);

  // Blink the caret every 500ms
  useEffect(() => {
    const caretInterval = setInterval(() => {
      setShowCaret((prev) => !prev);
    }, 500);

    return () => clearInterval(caretInterval);
  }, []);

  // The substring we want to show right now
  const typedText = FULL_TEXT.slice(0, typedIndex);

  return (
    <Box
      display="flex"
      flexDir="column"
      alignItems="center"
      justifyContent="center"
      color="#fff"
    >
      {/* Typewriter text */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{
          opacity: 1,
          scale: isTypingComplete ? 1.2 : 1,
        }}
        transition={{
          duration: isTypingComplete ? 0.4 : 1,
          ease: "easeInOut",
          repeat: isTypingComplete ? 1 : 0,
          repeatType: "reverse",
        }}
        style={{
          fontSize: "2rem",
          fontWeight: "bold",
          fontFamily: "monospace",
          padding: "20px",
          borderRadius: "4px",
          userSelect: "none",
        }}
      >
        <span style={{ whiteSpace: "pre" }}>
          {typedText}
          {/* Show blinking caret until typing is done */}
          {!isTypingComplete && showCaret && (
            <span style={{ marginLeft: "3px", color: "#ff4081" }}>|</span>
          )}
        </span>
      </motion.div>

      {/* After the typewriter completes, show a spinner below the text */}
      {isTypingComplete && <Spinner size="xl" mt={4} />}
    </Box>
  );
};

export default Animation;

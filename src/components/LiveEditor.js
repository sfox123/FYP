import React from "react";
import { Box, Grid, GridItem, HStack, Image } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import InteractiveOutput from "./InteractiveOutput";

export default function LiveEditor() {
  return (
    <Grid templateRows="auto 1fr" gap={4} height="100vh" bg="gray.900">
      {/* Navbar */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        p={4}
        bg="gray.800"
        color="white"
        height="60px" // Set a fixed height for the navbar
      >
        <HStack spacing={4}>
          <Link to="/Home">
            <Image src="logo-white.png" alt="Logo" width="180px" />
          </Link>
        </HStack>
      </Box>

      {/* Main Content */}
      <GridItem height="100%" bg="white" p={2} borderRadius="md">
        <Box height="100%">
          <InteractiveOutput />
        </Box>
      </GridItem>
    </Grid>
  );
}

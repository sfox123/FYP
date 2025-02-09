import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from "react-redux";
import store from "./store";
import theme from "./theme";
import "./index.css";
import App from "./App";
import AnimationScreen from "./misc/AnimationScreen";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <Router>
          <Routes>
            <Route path="/" element={<AnimationScreen />} />
            <Route path="/Home" element={<App />} />
          </Routes>
        </Router>
      </ChakraProvider>
    </Provider>
  </React.StrictMode>
);

// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import codeReducer from "./redux/codeSlice";
import geminiReducer from "./redux/geminiSlice";
import resultReducer from "./redux/resultSlice";

const store = configureStore({
  reducer: {
    code: codeReducer,
    gemini: geminiReducer,
    result: resultReducer,
  },
});

export default store;

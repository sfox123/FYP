// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import codeReducer from "./redux/codeSlice";
import geminiReducer from "./redux/geminiSlice";
import resultReducer from "./redux/resultSlice";
import codexReducer from "./redux/codeXSlice";
import codeGenReducer from "./redux/codeGenSlice";

const store = configureStore({
  reducer: {
    code: codeReducer,
    gemini: geminiReducer,
    result: resultReducer,
    codex: codexReducer,
    codegen: codeGenReducer,
  },
});

export default store;

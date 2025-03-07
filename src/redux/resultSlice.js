import { createSlice } from "@reduxjs/toolkit";
import { fetchOpenAICode } from "./codeSlice";
import { fetchGeminiCode } from "./geminiSlice";
import { fetchCodexModel } from "./codeXSlice";

const initialState = {
  html: "",
  css: "",
  js: "",
  lineNumbers: { html: [], css: [], js: [] },
  loading: false,
  error: null,
};

const resultSlice = createSlice({
  name: "result",
  initialState,
  reducers: {
    updateResult: (state, action) => {
      const { html, css, js, lineNumbers } = action.payload;
      state.html = html;
      state.css = css;
      state.js = js;
      state.lineNumbers = lineNumbers;
    },
    setHtml: (state, action) => {
      state.html = action.payload;
    },
    setCss: (state, action) => {
      state.css = action.payload;
    },
    setJs: (state, action) => {
      state.js = action.payload;
    },
  },
  extraReducers: (builder) => {
    // OpenAI Thunk
    builder
      .addCase(fetchOpenAICode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOpenAICode.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const { html, css, js, lineNumbers } = action.payload;
        state.html = html;
        state.css = css;
        state.js = js;
        state.lineNumbers = lineNumbers;
      })
      .addCase(fetchOpenAICode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to call OpenAI.";
      })
      // Gemini‑2.0 Thunk
      .addCase(fetchGeminiCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGeminiCode.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const { html, css, js, lineNumbers } = action.payload;
        state.html = html;
        state.css = css;
        state.js = js;
        state.lineNumbers = lineNumbers;
      })
      .addCase(fetchGeminiCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to call Gemini-2.0 API.";
      })
      // Custom Model Thunk
      .addCase(fetchCodexModel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCodexModel.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const { html, css, js, lineNumbers } = action.payload;
        state.html = html;
        state.css = css;
        state.js = js;
        state.lineNumbers = lineNumbers;
      })
      .addCase(fetchCodexModel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to call custom model API.";
      });
  },
});

export const { updateResult, setHtml, setCss, setJs } = resultSlice.actions;
export default resultSlice.reducer;

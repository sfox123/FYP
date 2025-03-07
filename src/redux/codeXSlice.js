import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk using custom model API
export const fetchCodexModel = createAsyncThunk(
  "codex/fetchCodexModel",
  async (userPrompt, { rejectWithValue }) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: userPrompt }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return rejectWithValue(errorText);
      }

      const data = await response.json();
      const { html } = data;
      return {
        html,
        css: "",
        js: "",
        lineNumbers: { html: [], css: [], js: [] },
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// This slice is now only used to produce the thunk; no state is kept here.
const codexSlice = createSlice({
  name: "codex",
  initialState: {},
  reducers: {},
});

export default codexSlice.reducer;

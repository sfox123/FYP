import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { updateResult } from "./resultSlice";

export const fetchCodexModel = createAsyncThunk(
  "codex/fetchCodexModel",
  async (userPrompt, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userPrompt }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return rejectWithValue(errorText);
      }

      const data = await response.json();

      if (data.error) {
        return rejectWithValue(data.error);
      }

      // Dispatch the result to the resultSlice
      dispatch(
        updateResult({
          html: data.html || "",
          css: data.css || "",
          js: data.js || "",
        })
      );

      return data;
    } catch (error) {
      return rejectWithValue("Error: " + error.message);
    }
  }
);

const codexSlice = createSlice({
  name: "codex",
  initialState: {},
  reducers: {},
});

export default codexSlice.reducer;

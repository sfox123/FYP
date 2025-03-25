import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk using custom model API
export const fetchCodeGen = createAsyncThunk(
  "codex/fetchCodeGen",
  async (skel, { rejectWithValue }) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/auto_generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ skel: skel }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return rejectWithValue(errorText);
      }

      // Assume API returns a full HTML string.
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  code: "", // This will hold the full HTML string returned by the API
  loading: false,
  error: null,
};

const codeGenSlice = createSlice({
  name: "codeGen",
  initialState,
  reducers: {
    setCode: (state, action) => {
      state.code = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCodeGen.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.code = "";
      })
      .addCase(fetchCodeGen.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Store the full HTML string in code
        state.code = action.payload;
      })
      .addCase(fetchCodeGen.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to generate code.";
        state.code = "";
      });
  },
});

export const { setCode } = codeGenSlice.actions;
export default codeGenSlice.reducer;

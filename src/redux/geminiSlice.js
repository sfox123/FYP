import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Async thunk using Gemini‑2.0 API
export const fetchGeminiCode = createAsyncThunk(
  "gemini/fetchGeminiCode",
  async (userPrompt, { rejectWithValue }) => {
    try {
      const apiKey = process.env.REACT_APP_GOOGLE_GENERATIVE_AI_KEY;
      if (!apiKey) {
        return rejectWithValue("No Google Generative AI API key provided.");
      }
      const systemMessage =
        `You are a coding assistant. The user is building an HTML, CSS, and JS project in a single-page environment.

Return your response as valid JSON with exactly 4 keys: "html", "css", "js", and "lineNumbers".

Instructions:
1. In the generated HTML, assign a unique data attribute called "data-line" to every significant UI element (like buttons, navbars, divs, inputs, etc.). The value of "data-line" must match the starting line number of the corresponding HTML code snippet.

Example:
<button data-line="5">Submit</button>

2. The "lineNumbers" key should have an object structure like:
{
  "html": [{ "startLine": int, "startColumn": int, "endLine": int, "endColumn": int }],
  "css": [{ "startLine": int, "startColumn": int, "endLine": int, "endColumn": int }],
  "js": [{ "startLine": int, "startColumn": int, "endLine": int, "endColumn": int }]
}

DO NOT include commentary or explanations outside the JSON response.`.trim();
      const promptMessage = `User request: "${userPrompt}".
Return only JSON with keys "html", "css", "js", and "lineNumbers".`;
      const finalPrompt = `${systemMessage}\n${promptMessage}`;

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(finalPrompt);
      const textResponse = result.response.text();
      // Remove markdown fences if present
      const cleanedText = textResponse
        .replace(/^```(json)?\n?/, "")
        .replace(/\n?```$/, "")
        .trim();
      const parsed = JSON.parse(cleanedText);
      return parsed; // { html, css, js, lineNumbers }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// This slice is now only used to produce the thunk; no state is kept here.
const geminiSlice = createSlice({
  name: "gemini",
  initialState: {},
  reducers: {},
});
export default geminiSlice.reducer;

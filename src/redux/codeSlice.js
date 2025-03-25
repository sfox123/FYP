import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ----- ASYNC THUNK (OpenAI API) ----- //
export const fetchOpenAICode = createAsyncThunk(
  "code/fetchOpenAICode",
  async (userPrompt, { rejectWithValue }) => {
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    if (!apiKey) {
      return rejectWithValue("No OpenAI API key provided.");
    }

    try {
      const url = "https://api.openai.com/v1/chat/completions";
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

      const userMessage = `User request: "${userPrompt}". 
Return only JSON with keys "html", "css", "js", "lineNumbers".`;

      const body = {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: userMessage },
        ],
        temperature: 0,
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return rejectWithValue(errorText);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || "";

      try {
        const parsed = JSON.parse(content);
        return parsed; // { html, css, js, lineNumbers }
      } catch (e) {
        return rejectWithValue(
          "Failed to parse JSON from AI response:\n" + content
        );
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  // Only tracking the user’s request and the selected model here
  input: "",
  model: "GPT-4o",
};

const codeSlice = createSlice({
  name: "code",
  initialState,
  reducers: {
    setInput: (state, action) => {
      state.input = action.payload;
    },
    setModel: (state, action) => {
      state.model = action.payload;
    },
  },
  // No extraReducers here since result state is centralized
});

export const { setInput, setModel } = codeSlice.actions;
export default codeSlice.reducer;

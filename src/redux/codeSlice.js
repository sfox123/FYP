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
      const systemMessage = `
You are a coding assistant. The user is building an HTML, CSS, and JS project in a single-page environment.
Return your response as valid JSON with 4 keys: html, css, js, and lineNumbers.
The "lineNumbers" key should be an object with arrays for each file type: { html: [], css: [], js: [] },
where each array item has: { startLine, startColumn, endLine, endColumn }.
Do NOT include any extra commentary outside the JSON.
      `.trim();

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

// src/store/codeSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// ----- ASYNC THUNK -----
// This calls the OpenAI API from the browser. We embed the system instructions
// and the user prompt, then parse the JSON from the AI’s response.
export const fetchOpenAICode = createAsyncThunk(
  'code/fetchOpenAICode',
  async (userPrompt, { rejectWithValue }) => {
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

    if (!apiKey) {
      return rejectWithValue('No OpenAI API key provided.');
    }

    try {
      const url = 'https://api.openai.com/v1/chat/completions';
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
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: userMessage },
        ],
        temperature: 0,
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return rejectWithValue(errorText);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '';

      // Attempt to parse JSON from the AI’s message
      try {
        const parsed = JSON.parse(content);
        return parsed; // { html, css, js, lineNumbers }
      } catch (e) {
        // If parsing fails, throw an error or return the raw text
        return rejectWithValue('Failed to parse JSON from AI response:\n' + content);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ----- INITIAL STATE -----
const initialState = {
  // The user’s textual request for changes
  input: '',

  // Default code
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>React Code Editor</title>
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>`,
  css: `body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
}
h1 {
  color: blue;
}`,
  js: `document.addEventListener('DOMContentLoaded', () => {
  console.log('Hello World');
});`,

  // lineNumbers is an object with arrays for each file type
  lineNumbers: {
    html: [],
    css: [],
    js: [],
  },

  // For async thunk status & errors
  loading: false,
  error: null,
};

const codeSlice = createSlice({
  name: 'code',
  initialState,
  reducers: {
    setInput: (state, action) => {
      state.input = action.payload;
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
    setLineNumbers: (state, action) => {
      state.lineNumbers = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOpenAICode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOpenAICode.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const { html, css, js, lineNumbers } = action.payload;
        if (html) state.html = html;
        if (css) state.css = css;
        if (js) state.js = js;
        if (lineNumbers) state.lineNumbers = lineNumbers;
      })
      .addCase(fetchOpenAICode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to call OpenAI.';
      });
  },
});

export const {
  setInput,
  setHtml,
  setCss,
  setJs,
  setLineNumbers,
} = codeSlice.actions;

export default codeSlice.reducer;

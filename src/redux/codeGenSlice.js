import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk using OpenAI API
export const fetchCodeGen = createAsyncThunk(
  "codeGen/fetchCodeGen",
  async ({ html, css, js }, { rejectWithValue }) => {
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    if (!apiKey) {
      return rejectWithValue("No OpenAI API key provided.");
    }

    try {
      const url = "https://api.openai.com/v1/chat/completions";
      const systemMessage = `
        You are a creative web design assistant. The user has provided the current HTML, CSS, and JavaScript code for a webpage. 
        Your task is to suggest 3 unique design options for the webpage. 
        Each option should include:
        1. Updated HTML code (if necessary).
        2. Updated or additional CSS code.
        3. Updated or additional JavaScript code.

        Return your response as valid JSON with the following structure:
        {
          "options": [
            {
              "label": "Option 1",
              "html": "Updated HTML code for Option 1",
              "css": "CSS code for Option 1",
              "js": "JavaScript code for Option 1"
            },
            {
              "label": "Option 2",
              "html": "Updated HTML code for Option 2",
              "css": "CSS code for Option 2",
              "js": "JavaScript code for Option 2"
            },
            {
              "label": "Option 3",
              "html": "Updated HTML code for Option 3",
              "css": "CSS code for Option 3",
              "js": "JavaScript code for Option 3"
            }
          ]
        }
      `.trim();

      const userMessage = `
        Current HTML:
        ${html}

        Current CSS:
        ${css}

        Current JavaScript:
        ${js}

        Please provide 3 design options as per the instructions.
      `;

      const body = {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: userMessage },
        ],
        temperature: 0.7,
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
        return parsed.options || [];
      } catch (e) {
        return rejectWithValue(
          "Failed to parse JSON from OpenAI response:\n" + content
        );
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  options: [], // This will hold the 3 design options returned by OpenAI
  loading: false,
  error: null,
};

const codeGenSlice = createSlice({
  name: "codeGen",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCodeGen.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.options = [];
      })
      .addCase(fetchCodeGen.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.options = action.payload; // Store the design options
      })
      .addCase(fetchCodeGen.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch design options.";
        state.options = [];
      });
  },
});

export default codeGenSlice.reducer;

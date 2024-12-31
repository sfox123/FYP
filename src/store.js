// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import codeReducer from './redux/codeSlice';

const store = configureStore({
  reducer: {
    code: codeReducer,
  },
});

export default store;
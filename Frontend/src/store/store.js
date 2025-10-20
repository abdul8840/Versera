// frontend/src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import storyReducer from './slices/storySlice';
import categoryReducer from './slices/categorySlice';
import targetAudienceReducer from './slices/targetAudienceSlice';
import commentReducer from './slices/commentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    story: storyReducer,
    category: categoryReducer,
    targetAudience: targetAudienceReducer,
    comments: commentReducer,
  },
});
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import categoryReducer from './slices/categorySlice';
import targetAudienceReducer from './slices/targetAudienceSlice';
import userReducer from './slices/userSlice';
import storyReducer from './slices/storySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    targetAudience: targetAudienceReducer,
    user: userReducer,
    story: storyReducer,
  },
});

export default store;
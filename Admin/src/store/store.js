import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import categoryReducer from './slices/categorySlice';
import targetAudienceReducer from './slices/targetAudienceSlice';
import userReducer from './slices/userSlice';
import storyReducer from './slices/storySlice';
import dashboardReducer from './slices/dashboardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    targetAudience: targetAudienceReducer,
    user: userReducer,
    story: storyReducer,
    dashboard: dashboardReducer,
  },
});

export default store;
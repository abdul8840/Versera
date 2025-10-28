// frontend/src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import storyReducer from './slices/storySlice';
import categoryReducer from './slices/categorySlice';
import targetAudienceReducer from './slices/targetAudienceSlice';
import commentReducer from './slices/commentSlice';
import myListReducer from './slices/myListSlice';
import dashboardReducer from './slices/dashboardSlice';

import { enableMapSet } from 'immer';

enableMapSet();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    story: storyReducer,
    category: categoryReducer,
    targetAudience: targetAudienceReducer,
    comment: commentReducer,
    myList: myListReducer,
    dashboard: dashboardReducer,
  },
});
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../../components/others/BaseURL';

export const fetchReaderDashboard = createAsyncThunk(
  'dashboard/fetchReaderDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message);
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    stats: {
      storiesRead: 0,
      likesGiven: 0,
      commentsWritten: 0,
      writersFollowed: 0,
    },
    recentlyRead: [],
    recommendedStories: [],
    loading: true,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReaderDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReaderDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats;
        state.recentlyRead = action.payload.recentlyRead;
        state.recommendedStories = action.payload.recommendedStories;
      })
      .addCase(fetchReaderDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
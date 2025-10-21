import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../../components/others/BaseURL';
import { toggleLike } from './storySlice';

export const fetchMyList = createAsyncThunk(
  'myList/fetchMyList',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No token found'); 
      }
      const response = await fetch(`${API_BASE_URL}/api/my-list`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to fetch your list');
      }
      return data.stories;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const toggleStoryInList = createAsyncThunk(
  'myList/toggleStoryInList',
  async (storyId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No token found');
      }
      const response = await fetch(`${API_BASE_URL}/api/my-list/${storyId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to update your list');
      }
      return { storyId, added: data.added, message: data.message };
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

const myListSlice = createSlice({
  name: 'myList',
  initialState: {
    stories: [], 
    loading: false, 
    error: null, 
  },

  reducers: {

    clearMyList: (state) => {
        state.stories = [];
        state.loading = false;
        state.error = null;
    }
  },

  extraReducers: (builder) => {
    builder

      .addCase(fetchMyList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyList.fulfilled, (state, action) => {
        state.loading = false;

        state.stories = action.payload.map(story => ({
            ...story,
            likes: story.likes || [], 
        }));
      })
      .addCase(fetchMyList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; 
      })

      .addCase(toggleStoryInList.fulfilled, (state, action) => {
        const { storyId, added } = action.payload;
        if (!added) {
          state.stories = state.stories.filter((story) => story?._id !== storyId);
        }
        state.error = null; 
      })
      .addCase(toggleStoryInList.rejected, (state, action) => {
        state.error = action.payload;
       })
      .addCase(toggleLike.fulfilled, (state, action) => {
        const { storyId, liked, likesCount } = action.payload; 
        const storyIndex = state.stories.findIndex(story => story?._id === storyId);

        if (storyIndex !== -1) {
          state.stories[storyIndex].likesCount = likesCount;
          state.stories[storyIndex].isLikedByCurrentUser = liked; 
        }
      });
  },
});

export const { clearMyList } = myListSlice.actions;

export default myListSlice.reducer;
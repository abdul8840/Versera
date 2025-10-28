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
  async (storyId, { rejectWithValue, getState }) => {
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
      
      return { storyId, added: data.added, message: data.message, story: data.story };
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
    listStatus: {}, // Track individual story list status
  },

  reducers: {
    clearMyList: (state) => {
      state.stories = [];
      state.loading = false;
      state.error = null;
      state.listStatus = {};
    },
    // New reducer to update list status in real-time
    updateListStatus: (state, action) => {
      const { storyId, isInList } = action.payload;
      state.listStatus[storyId] = isInList;
    },
    // Add story to my list immediately
    addToMyList: (state, action) => {
      const story = action.payload;
      if (!state.stories.some(s => s._id === story._id)) {
        state.stories.unshift(story);
      }
      state.listStatus[story._id] = true;
    },
    // Remove story from my list immediately
    removeFromMyList: (state, action) => {
      const storyId = action.payload;
      state.stories = state.stories.filter(story => story._id !== storyId);
      state.listStatus[storyId] = false;
    },
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
        
        // Initialize list status for all stories in my list
        action.payload.forEach(story => {
          state.listStatus[story._id] = true;
        });
      })
      .addCase(fetchMyList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; 
      })
      .addCase(toggleStoryInList.pending, (state) => {
        state.error = null;
      })
      .addCase(toggleStoryInList.fulfilled, (state, action) => {
        const { storyId, added, story } = action.payload;
        
        // Update list status immediately
        state.listStatus[storyId] = added;
        
        if (added && story) {
          // Add to my list with proper story data
          if (!state.stories.some(s => s._id === storyId)) {
            state.stories.unshift({
              ...story,
              likes: story.likes || [],
            });
          }
        } else {
          // Remove from my list
          state.stories = state.stories.filter(story => story._id !== storyId);
        }
      })
      .addCase(toggleStoryInList.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        const { storyId, liked, likesCount } = action.payload; 
        
        // Update likes in my list stories
        const storyIndex = state.stories.findIndex(story => story?._id === storyId);
        if (storyIndex !== -1) {
          state.stories[storyIndex].likesCount = likesCount;
          state.stories[storyIndex].isLikedByCurrentUser = liked; 
        }
      });
  },
});

export const { clearMyList, updateListStatus, addToMyList, removeFromMyList } = myListSlice.actions;

export default myListSlice.reducer;
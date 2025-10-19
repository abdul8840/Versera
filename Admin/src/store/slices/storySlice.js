import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ADMIN_BASE_URL } from '../../components/others/AdminBaseURL';

export const fetchStories = createAsyncThunk(
  'story/fetchStories',
  async (queryParams = {}, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('adminToken');
      const queryString = new URLSearchParams(queryParams).toString();
      const response = await fetch(`${ADMIN_BASE_URL}/api/stories?${queryString}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to fetch stories');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchStoryById = createAsyncThunk(
  'story/fetchStoryById',
  async (storyId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${ADMIN_BASE_URL}/api/stories/${storyId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to fetch story');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateStoryStatus = createAsyncThunk(
  'story/updateStoryStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${ADMIN_BASE_URL}/api/admin/stories/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to update story status');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteStory = createAsyncThunk(
  'story/deleteStory',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${ADMIN_BASE_URL}/api/admin/stories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to delete story');
      }

      return { id, message: data.message };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const storySlice = createSlice({
  name: 'story',
  initialState: {
    stories: [],
    currentStory: null,
    loading: false,
    error: null,
    success: false,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalStories: 0,
      hasNext: false,
      hasPrev: false,
    },
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    clearCurrentStory: (state) => {
      state.currentStory = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Stories
      .addCase(fetchStories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStories.fulfilled, (state, action) => {
        state.loading = false;
        state.stories = action.payload.stories;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchStories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Story By ID
      .addCase(fetchStoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentStory = action.payload.story;
      })
      .addCase(fetchStoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Story Status
      .addCase(updateStoryStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateStoryStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const index = state.stories.findIndex(story => story._id === action.payload.story._id);
        if (index !== -1) {
          state.stories[index] = action.payload.story;
        }
        if (state.currentStory && state.currentStory._id === action.payload.story._id) {
          state.currentStory = action.payload.story;
        }
      })
      .addCase(updateStoryStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Story
      .addCase(deleteStory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteStory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.stories = state.stories.filter(story => story._id !== action.payload.id);
      })
      .addCase(deleteStory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess, clearCurrentStory } = storySlice.actions;
export default storySlice.reducer;
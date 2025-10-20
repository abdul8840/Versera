import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchWriterStories = createAsyncThunk(
  'story/fetchWriterStories',
  async (queryParams = {}, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const queryString = new URLSearchParams(queryParams).toString();
      const response = await fetch(`/api/writer/stories?${queryString}`, {
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
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/stories/${storyId}`, {
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

export const createStory = createAsyncThunk(
  'story/createStory',
  async (storyData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      // Append all fields
      Object.keys(storyData).forEach(key => {
        if (key === 'coverImage' || key === 'bannerImage') {
          if (storyData[key]) {
            formData.append(key, storyData[key]);
          }
        } else if (key === 'categories' || key === 'tags' || key === 'mainCharacters') {
          formData.append(key, JSON.stringify(storyData[key]));
        } else {
          formData.append(key, storyData[key]);
        }
      });

      const response = await fetch('/api/writer/stories', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to create story');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateStory = createAsyncThunk(
  'story/updateStory',
  async ({ id, storyData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      // Append all fields
      Object.keys(storyData).forEach(key => {
        if (key === 'coverImage' || key === 'bannerImage') {
          if (storyData[key]) {
            formData.append(key, storyData[key]);
          }
        } else if (key === 'categories' || key === 'tags' || key === 'mainCharacters') {
          formData.append(key, JSON.stringify(storyData[key]));
        } else {
          formData.append(key, storyData[key]);
        }
      });

      const response = await fetch(`/api/writer/stories/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to update story');
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
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/writer/stories/${id}`, {
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

export const toggleLike = createAsyncThunk(
  'story/toggleLike',
  async (storyId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/stories/${storyId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to toggle like');
      }

      return { storyId, ...data };
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
      // Fetch Writer Stories
      .addCase(fetchWriterStories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWriterStories.fulfilled, (state, action) => {
        state.loading = false;
        state.stories = action.payload.stories;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchWriterStories.rejected, (state, action) => {
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
      // Create Story
      .addCase(createStory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createStory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.stories.unshift(action.payload.story);
      })
      .addCase(createStory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Story
      .addCase(updateStory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateStory.fulfilled, (state, action) => {
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
      .addCase(updateStory.rejected, (state, action) => {
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
      })
      // Toggle Like
      .addCase(toggleLike.fulfilled, (state, action) => {
        const { storyId, liked, likesCount } = action.payload;
        const story = state.stories.find(s => s._id === storyId);
        if (story) {
          story.likesCount = likesCount;
          story.isLiked = liked;
        }
        if (state.currentStory && state.currentStory._id === storyId) {
          state.currentStory.likesCount = likesCount;
          state.currentStory.isLiked = liked;
        }
      });
  },
});

export const { clearError, clearSuccess, clearCurrentStory } = storySlice.actions;
export default storySlice.reducer;
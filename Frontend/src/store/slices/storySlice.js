import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks
export const createStory = createAsyncThunk(
  'stories/createStory',
  async (storyData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/stories/writer/stories', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: storyData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create story');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getStories = createAsyncThunk(
  'stories/getStories',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          queryParams.append(key, filters[key]);
        }
      });

      const response = await fetch(`/api/stories?${queryParams}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch stories');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getStory = createAsyncThunk(
  'stories/getStory',
  async (storyId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/stories/${storyId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch story');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateStory = createAsyncThunk(
  'stories/updateStory',
  async ({ storyId, storyData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/stories/writer/stories/${storyId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: storyData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update story');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteStory = createAsyncThunk(
  'stories/deleteStory',
  async (storyId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/stories/writer/stories/${storyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete story');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getWriterStories = createAsyncThunk(
  'stories/getWriterStories',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          queryParams.append(key, filters[key]);
        }
      });

      const response = await fetch(`/api/stories/writer/stories?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch writer stories');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleLike = createAsyncThunk(
  'stories/toggleLike',
  async (storyId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/stories/${storyId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to toggle like');
      }

      return { storyId, ...data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const storySlice = createSlice({
  name: 'stories',
  initialState: {
    stories: [],
    currentStory: null,
    writerStories: [],
    loading: false,
    error: null,
    success: false,
    pagination: {},
    writerPagination: {}
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
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Story
      .addCase(createStory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.writerStories.unshift(action.payload.story);
      })
      .addCase(createStory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Stories
      .addCase(getStories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStories.fulfilled, (state, action) => {
        state.loading = false;
        state.stories = action.payload.stories;
        state.pagination = action.payload.pagination;
      })
      .addCase(getStories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Story
      .addCase(getStory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStory.fulfilled, (state, action) => {
        state.loading = false;
        state.currentStory = action.payload.story;
      })
      .addCase(getStory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Story
      .addCase(updateStory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const index = state.writerStories.findIndex(
          story => story._id === action.payload.story._id
        );
        if (index !== -1) {
          state.writerStories[index] = action.payload.story;
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
      })
      .addCase(deleteStory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.writerStories = state.writerStories.filter(
          story => story._id !== action.meta.arg
        );
      })
      .addCase(deleteStory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Writer Stories
      .addCase(getWriterStories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWriterStories.fulfilled, (state, action) => {
        state.loading = false;
        state.writerStories = action.payload.stories;
        state.writerPagination = action.payload.pagination;
      })
      .addCase(getWriterStories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Toggle Like
      .addCase(toggleLike.fulfilled, (state, action) => {
        const { storyId, liked, likesCount } = action.payload;
        
        // Update in stories list
        const storyIndex = state.stories.findIndex(story => story._id === storyId);
        if (storyIndex !== -1) {
          state.stories[storyIndex].likesCount = likesCount;
          if (liked) {
            state.stories[storyIndex].likes.push('current-user');
          } else {
            state.stories[storyIndex].likes = state.stories[storyIndex].likes.filter(
              like => like !== 'current-user'
            );
          }
        }

        // Update in current story
        if (state.currentStory && state.currentStory._id === storyId) {
          state.currentStory.likesCount = likesCount;
          if (liked) {
            state.currentStory.likes.push('current-user');
          } else {
            state.currentStory.likes = state.currentStory.likes.filter(
              like => like !== 'current-user'
            );
          }
        }

        // Update in writer stories
        const writerStoryIndex = state.writerStories.findIndex(story => story._id === storyId);
        if (writerStoryIndex !== -1) {
          state.writerStories[writerStoryIndex].likesCount = likesCount;
        }
      });
  },
});

export const { clearError, clearSuccess, clearCurrentStory } = storySlice.actions;
export default storySlice.reducer;
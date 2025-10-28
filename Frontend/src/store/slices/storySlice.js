import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../../components/others/BaseURL';

export const fetchWriterStories = createAsyncThunk(
  'story/fetchWriterStories',
  async (queryParams = {}, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const queryString = new URLSearchParams(queryParams).toString();
      const response = await fetch(`${API_BASE_URL}/api/stories/writer/stories?${queryString}`, {
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
      const response = await fetch(`${API_BASE_URL}/api/stories/${storyId}`);
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

export const incrementStoryView = createAsyncThunk(
  'story/incrementStoryView',
  async (storyId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stories/${storyId}/view`, {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to increment view');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createStory = createAsyncThunk(
  'story/createStory',
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/api/stories/writer/stories`, {
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
      
      const response = await fetch(`${API_BASE_URL}/api/stories/writer/stories/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: storyData,
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
      const response = await fetch(`${API_BASE_URL}/api/stories/writer/stories/${id}`, {
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
      const response = await fetch(`${API_BASE_URL}/api/stories/${storyId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to toggle like');
      }

      // Store like status in localStorage for persistence
      if (data.liked) {
        localStorage.setItem(`liked_${storyId}`, 'true');
      } else {
        localStorage.removeItem(`liked_${storyId}`);
      }

      return { storyId, ...data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchStories = createAsyncThunk(
  'story/fetchStories',
  async (queryParams = {}, { rejectWithValue }) => {
    try {
      const queryString = new URLSearchParams(queryParams).toString();
      const response = await fetch(`${API_BASE_URL}/api/stories?${queryString}`);

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to fetch public stories');
      }

      return data;
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
    viewedStories: [], // Use array to track viewed stories in current session
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
    markStoryAsViewed: (state, action) => {
      const storyId = action.payload;
      if (!state.viewedStories.includes(storyId)) {
        state.viewedStories.push(storyId);
      }
    },
    initializeLikeStatus: (state, action) => {
      const { storyId } = action.payload;
      const isLiked = localStorage.getItem(`liked_${storyId}`) === 'true';
      
      if (state.currentStory && state.currentStory._id === storyId) {
        state.currentStory.isLikedByCurrentUser = isLiked;
      }
      
      const storyIndex = state.stories.findIndex(story => story._id === storyId);
      if (storyIndex !== -1) {
        state.stories[storyIndex].isLikedByCurrentUser = isLiked;
      }
    },
    // Clear viewed stories when user leaves the app or logs out
    clearViewedStories: (state) => {
      state.viewedStories = [];
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
        state.stories = action.payload.stories.map(story => ({
          ...story,
          isLikedByCurrentUser: localStorage.getItem(`liked_${story._id}`) === 'true'
        }));
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
        state.currentStory = {
          ...action.payload.story,
          isLikedByCurrentUser: localStorage.getItem(`liked_${action.payload.story._id}`) === 'true'
        };
      })
      .addCase(fetchStoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Increment Story View
      .addCase(incrementStoryView.fulfilled, (state, action) => {
        const { story } = action.payload;
        
        // Update current story views
        if (state.currentStory && state.currentStory._id === story._id) {
          state.currentStory.views = story.views;
        }
        
        // Update in stories list
        const storyIndex = state.stories.findIndex(s => s._id === story._id);
        if (storyIndex !== -1) {
          state.stories[storyIndex].views = story.views;
        }
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
      .addCase(fetchStories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStories.fulfilled, (state, action) => {
        state.loading = false;
        state.stories = action.payload.stories.map(story => ({
          ...story,
          isLikedByCurrentUser: localStorage.getItem(`liked_${story._id}`) === 'true'
        }));
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchStories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Toggle Like
      .addCase(toggleLike.fulfilled, (state, action) => {
        const { storyId, liked, likesCount } = action.payload;
        
        if (state.currentStory && state.currentStory._id === storyId) {
          state.currentStory.likesCount = likesCount;
          state.currentStory.isLikedByCurrentUser = liked;
        }
        const listIndex = state.stories.findIndex(s => s._id === storyId);
        if (listIndex !== -1) {
          state.stories[listIndex].likesCount = likesCount;
          state.stories[listIndex].isLikedByCurrentUser = liked;
        }
      });
  },
});

export const { clearError, clearSuccess, clearCurrentStory, markStoryAsViewed, initializeLikeStatus, clearViewedStories } = storySlice.actions;
export default storySlice.reducer;
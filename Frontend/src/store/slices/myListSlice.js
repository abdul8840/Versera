import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../../components/others/BaseURL';

// Thunk to fetch the user's list
export const fetchMyList = createAsyncThunk(
  'myList/fetchMyList',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/my-list`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message);
      return data.stories; // Return array of story objects
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk to add/remove a story
export const toggleStoryInList = createAsyncThunk(
  'myList/toggleStoryInList',
  async (storyId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/my-list/${storyId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message);
      
      // Return the action (added/removed) and the storyId
      return { storyId, added: data.added, message: data.message }; 
    } catch (error) {
      return rejectWithValue(error.message);
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
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch My List
      .addCase(fetchMyList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyList.fulfilled, (state, action) => {
        state.loading = false;
        state.stories = action.payload;
      })
      .addCase(fetchMyList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Toggle Story (Add/Remove)
      .addCase(toggleStoryInList.fulfilled, (state, action) => {
        const { storyId, added } = action.payload;
        if (added) {
          // We only have the ID, so we can't push the full story object.
          // We'll rely on the user refetching their list.
          // Or, you could have the thunk return the full story object.
          // For now, we'll just handle the remove case for instant UI update.
        } else {
          // Remove the story from the list immediately
          state.stories = state.stories.filter((story) => story._id !== storyId);
        }
        // You could also show a success toast here using action.payload.message
      })
      .addCase(toggleStoryInList.rejected, (state, action) => {
        state.error = action.payload; // Show error
      });
  },
});

export default myListSlice.reducer;
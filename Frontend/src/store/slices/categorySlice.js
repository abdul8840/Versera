import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../../components/others/BaseURL';

export const fetchCategories = createAsyncThunk(
  'category/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching categories from:', `${API_BASE_URL}/api/categories`);
      const response = await fetch(`${API_BASE_URL}/api/categories`);
      
      console.log('Categories response status:', response.status);
      console.log('Categories response ok:', response.ok);

      const data = await response.json();
      console.log('Categories data:', data);

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to fetch categories');
      }

      return data;
    } catch (error) {
      console.error('Categories fetch error:', error);
      return rejectWithValue(error.message);
    }
  }
);

const categorySlice = createSlice({
  name: 'category',
  initialState: {
    categories: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.categories;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = categorySlice.actions;
export default categorySlice.reducer;
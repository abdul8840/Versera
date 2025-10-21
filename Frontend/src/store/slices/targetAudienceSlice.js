import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../../components/others/BaseURL';

export const fetchTargetAudiences = createAsyncThunk(
  'targetAudience/fetchTargetAudiences',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/target-audiences`);

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to fetch target audiences');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const targetAudienceSlice = createSlice({
  name: 'targetAudience',
  initialState: {
    targetAudiences: [],
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
      .addCase(fetchTargetAudiences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTargetAudiences.fulfilled, (state, action) => {
        state.loading = false;
        state.targetAudiences = action.payload.targetAudiences;
      })
      .addCase(fetchTargetAudiences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = targetAudienceSlice.actions;
export default targetAudienceSlice.reducer;
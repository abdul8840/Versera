import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchTargetAudiences = createAsyncThunk(
  'targetAudience/fetchTargetAudiences',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${ADMIN_BASE_URL}/api/target-audiences`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

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

export const createTargetAudience = createAsyncThunk(
  'targetAudience/createTargetAudience',
  async (audienceData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${ADMIN_BASE_URL}/api/admin/target-audiences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(audienceData),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to create target audience');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateTargetAudience = createAsyncThunk(
  'targetAudience/updateTargetAudience',
  async ({ id, audienceData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${ADMIN_BASE_URL}/api/admin/target-audiences/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(audienceData),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to update target audience');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteTargetAudience = createAsyncThunk(
  'targetAudience/deleteTargetAudience',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${ADMIN_BASE_URL}/api/admin/target-audiences/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to delete target audience');
      }

      return { id, message: data.message };
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
    success: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Target Audiences
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
      })
      // Create Target Audience
      .addCase(createTargetAudience.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createTargetAudience.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.targetAudiences.push(action.payload.targetAudience);
      })
      .addCase(createTargetAudience.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Target Audience
      .addCase(updateTargetAudience.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateTargetAudience.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const index = state.targetAudiences.findIndex(aud => aud._id === action.payload.targetAudience._id);
        if (index !== -1) {
          state.targetAudiences[index] = action.payload.targetAudience;
        }
      })
      .addCase(updateTargetAudience.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Target Audience
      .addCase(deleteTargetAudience.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteTargetAudience.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.targetAudiences = state.targetAudiences.filter(aud => aud._id !== action.payload.id);
      })
      .addCase(deleteTargetAudience.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess } = targetAudienceSlice.actions;
export default targetAudienceSlice.reducer;
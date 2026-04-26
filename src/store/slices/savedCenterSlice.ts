import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/client';
import type { ServiceProvider } from '../../types';

export interface SavedCenterState {
  savedCenters: ServiceProvider[];
  loading: boolean;
  error: string | null;
}

const initialState: SavedCenterState = {
  savedCenters: [],
  loading: false,
  error: null,
};

export const fetchSavedCentersThunk = createAsyncThunk(
  'savedCenters/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/saved-centers');
      // Response is an array of Provider objects
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch saved centers');
    }
  }
);

export const saveCenterThunk = createAsyncThunk(
  'savedCenters/save',
  async (providerId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/saved-centers/${providerId}`);
      return { providerId, saved: response.data.saved };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to save center');
    }
  }
);

export const unsaveCenterThunk = createAsyncThunk(
  'savedCenters/unsave',
  async (providerId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`/saved-centers/${providerId}`);
      return { providerId, saved: response.data.saved };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to unsave center');
    }
  }
);

const savedCenterSlice = createSlice({
  name: 'savedCenters',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch
    builder.addCase(fetchSavedCentersThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchSavedCentersThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.savedCenters = action.payload;
    });
    builder.addCase(fetchSavedCentersThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Save
    builder.addCase(saveCenterThunk.fulfilled, (state, action) => {
      // Typically we'd need to fetch again, or append the provider manually if we had it.
      // For now, if we don't have the provider object, we just ignore appending it to state here,
      // and let the UI refetch if needed. Or we can just leave it as is.
    });

    // Unsave
    builder.addCase(unsaveCenterThunk.fulfilled, (state, action) => {
      state.savedCenters = state.savedCenters.filter(p => p.id !== action.payload.providerId && (p as any)._id !== action.payload.providerId);
    });
  },
});

export default savedCenterSlice.reducer;

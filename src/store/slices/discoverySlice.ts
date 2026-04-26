import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/client';
import type { Category, ServiceProvider, ServiceProviderDetail } from '../../types';

export interface DiscoveryState {
  categories: Category[];
  providers: ServiceProvider[];
  currentProvider: ServiceProviderDetail | null;
  liveQueue: {
    nowServing: number;
    nextToken: number;
    peopleAhead: number;
    estimatedWaitMinutes: number;
  } | null;
  providerReviews: any[];
  loading: boolean;
  error: string | null;
}

const initialState: DiscoveryState = {
  categories: [],
  providers: [],
  currentProvider: null,
  liveQueue: null,
  providerReviews: [],
  loading: false,
  error: null,
};

// 1. Fetch all categories
export const fetchCategoriesThunk = createAsyncThunk(
  'discovery/fetchCategories',
  async (_, { rejectWithValue }) => { 
    try {
      const response = await apiClient.get('/categories');
      return response.data as Category[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

// 1.5 Search providers
export const searchProvidersThunk = createAsyncThunk(
  'discovery/searchProviders',
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/providers/search?q=${encodeURIComponent(query)}`);
      return response.data as ServiceProvider[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search providers');
    }
  }
);

// 2. Fetch providers by category
export const fetchProvidersByCategoryThunk = createAsyncThunk(
  'discovery/fetchProvidersByCategory',
  async (categoryId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/categories/${categoryId}/providers`);
      return response.data as ServiceProvider[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch providers');
    }
  }
);

// 3. Fetch single provider detail
export const fetchProviderDetailThunk = createAsyncThunk(
  'discovery/fetchProviderDetail',
  async (providerId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/providers/${providerId}`);
      return response.data as ServiceProviderDetail;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch provider detail');
    }
  }
);

// 4. Fetch live queue info for a provider
export const fetchLiveQueueThunk = createAsyncThunk(
  'discovery/fetchLiveQueue',
  async (providerId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/providers/${providerId}/queue`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch live queue');
    }
  }
);

// 5. Fetch provider reviews
export const fetchProviderReviewsThunk = createAsyncThunk(
  'discovery/fetchProviderReviews',
  async (providerId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/reviews/${providerId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch provider reviews');
    }
  }
);

const discoverySlice = createSlice({
  name: 'discovery',
  initialState,
  reducers: {
    clearCurrentProvider(state) {
      state.currentProvider = null;
      state.liveQueue = null;
      state.providerReviews = [];
    },
  },
  extraReducers: (builder) => {
    // Categories
    builder.addCase(fetchCategoriesThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCategoriesThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.categories = action.payload;
    });
    builder.addCase(fetchCategoriesThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Search Providers
    builder.addCase(searchProvidersThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(searchProvidersThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.providers = action.payload;
    });
    builder.addCase(searchProvidersThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Providers by Category
    builder.addCase(fetchProvidersByCategoryThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProvidersByCategoryThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.providers = action.payload;
    });
    builder.addCase(fetchProvidersByCategoryThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Provider Detail
    builder.addCase(fetchProviderDetailThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProviderDetailThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.currentProvider = action.payload;
    });
    builder.addCase(fetchProviderDetailThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Live Queue
    builder.addCase(fetchLiveQueueThunk.fulfilled, (state, action) => {
      state.liveQueue = action.payload;
    });

    // Provider Reviews
    builder.addCase(fetchProviderReviewsThunk.fulfilled, (state, action) => {
      state.providerReviews = action.payload;
    });
  },
});

export const { clearCurrentProvider } = discoverySlice.actions;
export default discoverySlice.reducer;

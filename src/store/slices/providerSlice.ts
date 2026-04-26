import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/client';
import type { Booking, ServiceProviderDetail } from '../../types';

export interface ProviderState {
  myProviderDetails: ServiceProviderDetail | null;
  activeQueue: Booking[];
  stats: { tokensServed: number; avgWaitMinutes: number; peakHour: string } | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProviderState = {
  myProviderDetails: null,
  activeQueue: [],
  stats: null,
  loading: false,
  error: null,
};

// 0. Fetch the current logged in provider's venue details
export const fetchMyVenueThunk = createAsyncThunk(
  'provider/fetchMyVenue',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/providers/my-venue');
      // The backend toJSON deletes _id and adds a virtual `id` field.
      // Always use p.id (the virtual), NOT p._id (undefined after transform).
      const p = response.data;
      const venue: ServiceProviderDetail = {
        id: p.id ?? p._id,       // id virtual is set by toJSON; _id fallback for safety
        name: p.name,
        categoryId: p.categoryId,
        image: p.imageUrl || '',
        rating: p.rating,
        location: p.location,
        busyness: p.busyness,
        currentVisitors: p.currentVisitors,
        services: (p.services ?? []).map((s: any) => ({
          ...s,
          id: s.id ?? s._id,    // same pattern for sub-documents
        })),
      };
      return venue;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch my venue');
    }
  }
);

// 1. Fetch provider's active waiting queue
export const fetchProviderQueueListThunk = createAsyncThunk(
  'provider/fetchQueueList',
  async (providerId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/providers/${providerId}/queue/list`);
      
      const mappedQueue: Booking[] = response.data.map((b: any) => ({
        id: b.id ?? b._id,
        name: b.providerName,
        subtitle: b.serviceName,
        status: b.status,
        imageUrl: b.providerImage,
        bookedAt: b.bookedAt,
        address: b.providerLocation,
        referenceCode: b.referenceCode,
        tokenNumber: b.tokenNumber,
        queuePosition: b.queuePosition,
        // userId may be an ObjectId or string — normalise to string for display
        userId: typeof b.userId === 'object' ? b.userId?.toString() : b.userId,
      }));

      return mappedQueue;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch queue list');
    }
  }
);

// 2. Advance the queue (Call Next)
export const advanceQueueThunk = createAsyncThunk(
  'provider/advanceQueue',
  async (providerId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/providers/${providerId}/queue/advance`);
      return response.data; // { message, nowServing }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to advance queue');
    }
  }
);

// 3. Get Provider Stats
export const fetchProviderStatsThunk = createAsyncThunk(
  'provider/fetchStats',
  async (providerId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/providers/${providerId}/stats`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
    }
  }
);

// 4. Update Provider Venue Settings
export const updateMyVenueThunk = createAsyncThunk(
  'provider/updateMyVenue',
  async (
    data: { busyness?: string; currentVisitors?: number; name?: string; location?: string; imageUrl?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.post(`/providers/my-venue`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update provider');
    }
  }
);

// 5. Add Service
export const addServiceThunk = createAsyncThunk(
  'provider/addService',
  async (
    data: { providerId: string; name: string; duration: string; price: string; description: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.post(`/providers/${data.providerId}/services`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add service');
    }
  }
);

// 6. Update Service
export const updateServiceThunk = createAsyncThunk(
  'provider/updateService',
  async (
    data: { providerId: string; serviceId: string; name?: string; duration?: string; price?: string; description?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.patch(`/providers/${data.providerId}/services/${data.serviceId}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update service');
    }
  }
);

// 7. Delete Service
export const deleteServiceThunk = createAsyncThunk(
  'provider/deleteService',
  async (
    data: { providerId: string; serviceId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.delete(`/providers/${data.providerId}/services/${data.serviceId}`);
      return { serviceId: data.serviceId, deleted: response.data.deleted };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete service');
    }
  }
);

const providerSlice = createSlice({
  name: 'provider',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch My Venue
    builder.addCase(fetchMyVenueThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchMyVenueThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.myProviderDetails = action.payload;
    });
    builder.addCase(fetchMyVenueThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch Queue List
    builder.addCase(fetchProviderQueueListThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProviderQueueListThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.activeQueue = action.payload;
    });
    builder.addCase(fetchProviderQueueListThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Advance Queue
    builder.addCase(advanceQueueThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(advanceQueueThunk.fulfilled, (state, action) => {
      state.loading = false;
      // Ideally we would update the nowServing in state and refetch the list
    });
    builder.addCase(advanceQueueThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch Stats
    builder.addCase(fetchProviderStatsThunk.fulfilled, (state, action) => {
      state.stats = action.payload;
    });

    // Update Provider — optimistically patch the cached venue details
    builder.addCase(updateMyVenueThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateMyVenueThunk.fulfilled, (state, action) => {
      state.loading = false;
      // Patch whichever fields the backend returns into local state immediately
      if (state.myProviderDetails && action.payload) {
        const p = action.payload;
        if (p.name) state.myProviderDetails.name = p.name;
        if (p.location) state.myProviderDetails.location = p.location;
        if (p.busyness) state.myProviderDetails.busyness = p.busyness;
        if (p.imageUrl) state.myProviderDetails.image = p.imageUrl;
      }
    });
    builder.addCase(updateMyVenueThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export default providerSlice.reducer;

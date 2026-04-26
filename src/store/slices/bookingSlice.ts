import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/client';
import type { Booking, TokenConfirmationData } from '../../types';

export interface BookingState {
  myBookings: Booking[];
  loading: boolean;
  error: string | null;
  userStats: { stats: { activeBookings: number; timeSavedMinutes: number } } | null;
}

const initialState: BookingState = {
  myBookings: [],
  loading: false,
  error: null,
  userStats: null,
};

// Create a new booking
export const bookTokenThunk = createAsyncThunk(
  'bookings/bookToken',
  async (
    data: { providerId: string; serviceId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.post('/bookings', data);
      
      const b = response.data.booking;
      const mappedBooking: Booking = {
        id: b.id,
        providerId: b.providerId,
        name: b.providerName,
        subtitle: b.serviceName,
        status: b.status,
        imageUrl: b.providerImage,
        bookedAt: b.bookedAt,
        address: b.providerLocation,
        referenceCode: b.referenceCode,
        tokenNumber: b.tokenNumber,
        queuePosition: b.queuePosition,
      };

      return { booking: mappedBooking, tokenConfirmation: response.data.tokenConfirmation };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to book token'
      );
    }
  }
);

// Load user's bookings (Phase 4)
export const loadBookingsThunk = createAsyncThunk(
  'bookings/loadBookings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/bookings');
      
      // Map backend booking shape to frontend Booking shape
      const mappedBookings: Booking[] = response.data.map((b: any) => ({
        id: b.id,
        providerId: b.providerId,
        name: b.providerName,
        subtitle: b.serviceName,
        status: b.status,
        imageUrl: b.providerImage,
        bookedAt: b.bookedAt,
        address: b.providerLocation,
        referenceCode: b.referenceCode,
        tokenNumber: b.tokenNumber,
        queuePosition: b.queuePosition,
      }));
      
      return mappedBookings;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to load bookings'
      );
    }
  }
);

// Load user stats (Phase 4)
export const fetchUserStatsThunk = createAsyncThunk(
  'bookings/fetchUserStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/profile');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to load user stats'
      );
    }
  }
);

// Submit Review
export const submitReviewThunk = createAsyncThunk(
  'bookings/submitReview',
  async (
    data: { providerId: string; bookingId: string; rating: number; comment: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.post('/reviews', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to submit review'
      );
    }
  }
);

const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Book Token
    builder.addCase(bookTokenThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(bookTokenThunk.fulfilled, (state, action) => {
      state.loading = false;
      // Optionally push the newly created booking to state
      state.myBookings.unshift(action.payload.booking);
    });
    builder.addCase(bookTokenThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Load Bookings
    builder.addCase(loadBookingsThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loadBookingsThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.myBookings = action.payload;
    });
    builder.addCase(loadBookingsThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch User Stats
    builder.addCase(fetchUserStatsThunk.fulfilled, (state, action) => {
      state.userStats = action.payload;
    });
  },
});

export default bookingSlice.reducer;

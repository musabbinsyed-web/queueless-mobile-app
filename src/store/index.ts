console.log('[Store] Initializing...');
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import bookingReducer from './slices/bookingSlice';
import discoveryReducer from './slices/discoverySlice';
import providerReducer from './slices/providerSlice';
import savedCenterReducer from './slices/savedCenterSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    bookings: bookingReducer,
    discovery: discoveryReducer,
    provider: providerReducer,
    savedCenters: savedCenterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

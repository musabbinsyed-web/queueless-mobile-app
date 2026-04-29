console.log('[Store] Initializing...');
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import bookingReducer from './slices/bookingSlice';
import discoveryReducer from './slices/discoverySlice';
import providerReducer from './slices/providerSlice';
import savedCenterReducer from './slices/savedCenterSlice';

const appReducer = combineReducers({
  auth: authReducer,
  bookings: bookingReducer,
  discovery: discoveryReducer,
  provider: providerReducer,
  savedCenters: savedCenterReducer,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === 'auth/logout/fulfilled') {
    // Clear entire Redux state on logout
    state = undefined;
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof appReducer>;
export type AppDispatch = typeof store.dispatch;

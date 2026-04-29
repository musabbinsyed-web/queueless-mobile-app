import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../../api/client';
import { UserProfile } from '../../types';

export interface AuthState {
  user: UserProfile | null;
  role: 'customer' | 'provider' | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  role: null,
  isAuthenticated: false,
  loading: true, // starts true while we check storage
  error: null,
};

// --- Thunks ---

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      const { user, accessToken, refreshToken } = response.data;
      
      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      
      return user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const signupThunk = createAsyncThunk(
  'auth/signup',
  async (data: { fullName: string; email: string; password: string; role?: string }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/auth/signup', data);
      const { user, accessToken, refreshToken } = response.data;
      
      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      
      return user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Signup failed');
    }
  }
);

export const loadUserThunk = createAsyncThunk(
  'auth/loadUser',
  async (_, { rejectWithValue }) => {
    console.log('[loadUserThunk] Starting...');
    try {
      const token = await AsyncStorage.getItem('accessToken');
      console.log('[loadUserThunk] Token found:', !!token);
      if (!token) return rejectWithValue('No token');
      
      const response = await apiClient.get('/auth/me');
      return response.data.user;
    } catch (error: any) {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      return rejectWithValue('Session expired');
    }
  }
);

export const logoutThunk = createAsyncThunk(
  'auth/logout',
  async () => {
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
    return null;
  }
);

export const updateProfileThunk = createAsyncThunk(
  'auth/updateProfile',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await apiClient.put('/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

// --- Slice ---

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = {
        displayName: action.payload.fullName,
        avatarUrl: action.payload.avatarUrl,
        email: action.payload.email,
        role: action.payload.role,
      };
      state.role = action.payload.role;
    });
    builder.addCase(loginThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Signup
    builder.addCase(signupThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(signupThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = {
        displayName: action.payload.fullName,
        avatarUrl: action.payload.avatarUrl,
        email: action.payload.email,
        role: action.payload.role,
      };
      state.role = action.payload.role;
    });
    builder.addCase(signupThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Load User
    builder.addCase(loadUserThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loadUserThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = {
        displayName: action.payload.fullName,
        avatarUrl: action.payload.avatarUrl,
        email: action.payload.email,
        role: action.payload.role,
      };
      state.role = action.payload.role;
    });
    builder.addCase(loadUserThunk.rejected, (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.role = null;
    });

    // Update Profile
    builder.addCase(updateProfileThunk.fulfilled, (state, action) => {
      if (state.user) {
        state.user.displayName = action.payload.displayName;
        state.user.avatarUrl = action.payload.avatarUrl;
      }
    });

    // Logout
    builder.addCase(logoutThunk.fulfilled, (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.role = null;
      state.loading = false;
    });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;

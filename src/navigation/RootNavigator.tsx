import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loadUserThunk } from '../store/slices/authSlice';
import { AppDispatch, RootState } from '../store';

import LoginScreen from '../screens/LoginScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import SignUpScreen from '../screens/SignUpScreen';
import {
  BookingDetailsScreen,
  CategoryProvidersScreen,
  HomeScreen,
  LiveQueueScreen,
  ProfileScreen,
  ProviderDetailScreen,
  QueueScreen,
  TokenConfirmationScreen,
  ProviderDashboardScreen,
  QueueManagementScreen,
  ServiceManagerScreen,
  ProviderSettingsScreen,
  SavedCentersScreen,
} from '../screens';
import { colors } from '../theme/colors';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, loading, user } = useSelector((state: RootState) => state.auth);

  console.log('[RootNavigator] Auth state:', { isAuthenticated, loading, userRole: user?.role });

  useEffect(() => {
    dispatch(loadUserThunk());
  }, [dispatch]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: colors.background },
        }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen
              name="Onboarding"
              component={OnboardingScreen}
              options={{ contentStyle: { backgroundColor: 'transparent' } }}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ contentStyle: { backgroundColor: 'transparent' } }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{ contentStyle: { backgroundColor: 'transparent' } }}
            />
          </>
        ) : user?.role !== 'provider' ? (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{
                headerShown: false,
                contentStyle: { backgroundColor: '#f4f6f9' },
              }}
            />
            <Stack.Screen
              name="CategoryProviders"
              component={CategoryProvidersScreen}
              options={{
                headerShown: true,
                title: 'Providers',
                headerStyle: { backgroundColor: '#ffffff' },
                headerTintColor: '#111827',
                headerTitleStyle: { fontWeight: '600' },
                headerShadowVisible: false,
                contentStyle: { backgroundColor: '#f4f6f9' },
              }}
            />
            <Stack.Screen
              name="ProviderDetail"
              component={ProviderDetailScreen}
              options={{
                headerShown: false,
                contentStyle: { backgroundColor: '#f4f6f9' },
              }}
            />
            <Stack.Screen
              name="LiveQueue"
              component={LiveQueueScreen}
              options={{
                headerShown: false,
                contentStyle: { backgroundColor: '#f4f6f9' },
              }}
            />
            <Stack.Screen
              name="TokenConfirmation"
              component={TokenConfirmationScreen}
              options={{
                headerShown: false,
                contentStyle: { backgroundColor: '#f4f6f9' },
              }}
            />
            <Stack.Screen
              name="Queue"
              component={QueueScreen}
              options={{
                headerShown: false,
                contentStyle: { backgroundColor: '#f4f6f9' },
              }}
            />
            <Stack.Screen
              name="BookingDetails"
              component={BookingDetailsScreen}
              options={{
                headerShown: true,
                title: 'Booking details',
                headerStyle: { backgroundColor: '#ffffff' },
                headerTintColor: '#111827',
                headerTitleStyle: { fontWeight: '600' },
                headerShadowVisible: false,
                contentStyle: { backgroundColor: '#f4f6f9' },
              }}
            />
            <Stack.Screen
              name="SavedCenters"
              component={SavedCentersScreen}
              options={{
                headerShown: true,
                title: 'Saved Centers',
                headerStyle: { backgroundColor: '#ffffff' },
                headerTintColor: '#111827',
                headerTitleStyle: { fontWeight: '600' },
                headerShadowVisible: false,
                contentStyle: { backgroundColor: '#f4f6f9' },
              }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{
                headerShown: false,
                contentStyle: { backgroundColor: '#F8F9FB' },
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="ProviderDashboard"
              component={ProviderDashboardScreen}
              options={{
                headerShown: false,
                contentStyle: { backgroundColor: '#f4f6f9' },
              }}
            />
            <Stack.Screen
              name="QueueManagement"
              component={QueueManagementScreen}
              options={{
                headerShown: false,
                contentStyle: { backgroundColor: '#f4f6f9' },
              }}
            />
            <Stack.Screen
              name="ServiceManager"
              component={ServiceManagerScreen}
              options={{
                headerShown: false,
                contentStyle: { backgroundColor: '#f4f6f9' },
              }}
            />
            <Stack.Screen
              name="ProviderSettings"
              component={ProviderSettingsScreen}
              options={{
                headerShown: false,
                contentStyle: { backgroundColor: '#f4f6f9' },
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

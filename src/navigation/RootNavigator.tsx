import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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
} from '../screens';
import { colors } from '../theme/colors';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Onboarding"
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: colors.background },
        }}>
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
          name="Profile"
          component={ProfileScreen}
          options={{
            headerShown: false,
            contentStyle: { backgroundColor: '#F8F9FB' },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

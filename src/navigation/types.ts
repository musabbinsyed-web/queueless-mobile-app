import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { TokenConfirmationData } from '../types';

export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  SignUp: undefined;
  Home: undefined;
  CategoryProviders: { categoryId: string; categoryName: string };
  ProviderDetail: { providerId: string };
  LiveQueue: { providerId: string; serviceId: string };
  TokenConfirmation: {
    bookingId?: string;
    snapshot?: TokenConfirmationData;
  };
  Queue: undefined;
  BookingDetails: { bookingId: string };
  Profile: undefined;
  SavedCenters: undefined;
  
  // Provider Flow
  ProviderDashboard: undefined;
  QueueManagement: undefined;
  ServiceManager: undefined;
  ProviderSettings: undefined;
};

export type OnboardingScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Onboarding'
>;
export type LoginScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Login'
>;
export type SignUpScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'SignUp'
>;
export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type CategoryProvidersScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'CategoryProviders'
>;
export type ProviderDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ProviderDetail'
>;
export type LiveQueueScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'LiveQueue'
>;
export type TokenConfirmationScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'TokenConfirmation'
>;
export type QueueScreenProps = NativeStackScreenProps<RootStackParamList, 'Queue'>;
export type BookingDetailsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'BookingDetails'
>;
export type ProfileScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Profile'
>;

// Provider Props
export type ProviderDashboardScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ProviderDashboard'
>;
export type QueueManagementScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'QueueManagement'
>;
export type ServiceManagerScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ServiceManager'
>;
export type ProviderSettingsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ProviderSettings'
>;

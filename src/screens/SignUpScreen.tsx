import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signupThunk, clearError } from '../store/slices/authSlice';
import { AppDispatch, RootState } from '../store';
import {
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import LoaderMark from '../assets/icons/loader_ison.svg';
import {
  AuthElevatedCard,
  AuthGradientBackground,
  BrandWordmark,
  EyeIcon,
  EyeOffIcon,
  GradientPillButton,
  LabeledAuthInput,
  LockIcon,
  MailIcon,
  UserIcon,
} from '../components/auth';
import { signUpCopy } from '../constants/authCopy';
import type { RootStackParamList } from '../navigation/types';
import { authColors, authDesign } from '../theme/authDesign';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

const LOADER_SIZE = 64;

function SignUpScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'provider'>('customer');
  const [securePassword, setSecurePassword] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);

  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);

  const onSignUp = useCallback(async () => {
    dispatch(clearError());
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    
    const resultAction = await dispatch(signupThunk({ fullName, email, password, role }));
    
    if (signupThunk.rejected.match(resultAction)) {
      Alert.alert('Sign Up Failed', resultAction.payload as string);
    }
  }, [dispatch, fullName, email, password, confirmPassword, role]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#D8EBFF" />
      <AuthGradientBackground bottomInsetExtra={insets.bottom}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, 16) },
          ]}>
          <View style={styles.header}>
            <View style={styles.logoCircle}>
              <LoaderMark width={LOADER_SIZE * 0.6} height={LOADER_SIZE * 0.6} />
            </View>
            <View style={styles.headerTitles}>
              <BrandWordmark size="medium" tone="brand" />
              <Text style={styles.headerSubtitle}>
                {signUpCopy.brandSubtitle}
              </Text>
            </View>
          </View>

          <AuthElevatedCard style={styles.card}>
            <View style={styles.roleContainer}>
              <Text style={styles.roleLabel}>I am a...</Text>
              <View style={styles.roleRow}>
                <Pressable 
                  onPress={() => setRole('customer')}
                  style={[styles.roleOption, role === 'customer' && styles.roleOptionActive]}
                >
                  <Text style={[styles.roleText, role === 'customer' && styles.roleTextActive]}>Customer</Text>
                </Pressable>
                <Pressable 
                  onPress={() => setRole('provider')}
                  style={[styles.roleOption, role === 'provider' && styles.roleOptionActive]}
                >
                  <Text style={[styles.roleText, role === 'provider' && styles.roleTextActive]}>Provider</Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.fields}>
              <LabeledAuthInput
                label={signUpCopy.fullNameLabel}
                leading={<UserIcon />}
                placeholder={signUpCopy.fullNamePlaceholder}
                autoCapitalize="words"
                autoCorrect={false}
                value={fullName}
                onChangeText={setFullName}
              />
              <LabeledAuthInput
                label={signUpCopy.emailLabel}
                leading={<MailIcon />}
                placeholder={signUpCopy.emailPlaceholder}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
              />
              <LabeledAuthInput
                label={signUpCopy.passwordLabel}
                leading={<LockIcon />}
                inputTrailing={
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={securePassword ? 'Show password' : 'Hide password'}
                    hitSlop={10}
                    onPress={() => setSecurePassword(s => !s)}>
                    {securePassword ? <EyeIcon /> : <EyeOffIcon />}
                  </Pressable>
                }
                placeholder="••••••••"
                secureTextEntry={securePassword}
                value={password}
                onChangeText={setPassword}
              />
              <LabeledAuthInput
                label={signUpCopy.confirmPasswordLabel}
                leading={<LockIcon />}
                inputTrailing={
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={secureConfirm ? 'Show password' : 'Hide password'}
                    hitSlop={10}
                    onPress={() => setSecureConfirm(s => !s)}>
                    {secureConfirm ? <EyeIcon /> : <EyeOffIcon />}
                  </Pressable>
                }
                placeholder="••••••••"
                secureTextEntry={secureConfirm}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>

            <GradientPillButton onPress={onSignUp} style={styles.primaryBtn}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </GradientPillButton>
          </AuthElevatedCard>

          <View style={styles.loginSection}>
            <Text style={styles.loginRow}>
              {signUpCopy.alreadyPrompt}{' '}
              <Text
                onPress={() => navigation.navigate('Login')}
                style={styles.loginLink}>
                {signUpCopy.loginLink}
              </Text>
            </Text>
            <Text style={styles.copyright}>{signUpCopy.copyright}</Text>
          </View>
        </ScrollView>
      </AuthGradientBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingTop: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: authDesign.sectionGap,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: authColors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: authColors.brandBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  headerTitles: {
    alignItems: 'center',
    marginTop: 16,
    gap: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: authColors.bodyGray,
    letterSpacing: 0.2,
  },
  card: {
    marginBottom: 24,
  },
  roleContainer: {
    marginBottom: 20,
  },
  roleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: authColors.bodyGray,
    marginBottom: 8,
  },
  roleRow: {
    flexDirection: 'row',
    backgroundColor: authColors.inputBg,
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  roleOption: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  roleOptionActive: {
    backgroundColor: authColors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  roleText: {
    fontSize: 14,
    fontWeight: '600',
    color: authColors.bodyGray,
  },
  roleTextActive: {
    color: authColors.brandBlue,
  },
  fields: {
    marginBottom: 8,
  },
  primaryBtn: {
    marginTop: 8,
  },
  loginSection: {
    marginTop: 8,
    alignItems: 'center',
  },
  loginRow: {
    fontSize: 15,
    color: authColors.bodyGray,
    marginBottom: 20,
  },
  loginLink: {
    fontWeight: '700',
    color: authColors.brandBlue,
  },
  copyright: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: authColors.taglineGray,
    textAlign: 'center',
    opacity: 0.6,
  },
});

export default SignUpScreen;

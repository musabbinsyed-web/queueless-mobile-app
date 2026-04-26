import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginThunk, clearError } from '../store/slices/authSlice';
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
  InlineLink,
} from '../components/auth';
import { loginCopy, loginDummyUser } from '../constants/authCopy';
import type { RootStackParamList } from '../navigation/types';
import { authColors, authDesign } from '../theme/authDesign';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LOADER_SIZE = 64;

function LoginScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState<string>(loginDummyUser.email);
  const [password, setPassword] = useState('password123');
  const [secure, setSecure] = useState(true);

  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);

  const onLogin = useCallback(async () => {
    dispatch(clearError());
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    const resultAction = await dispatch(loginThunk({ email, password }));
    
    if (loginThunk.rejected.match(resultAction)) {
      Alert.alert('Login Failed', resultAction.payload as string);
    }
  }, [dispatch, email, password]);

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
              <Text style={styles.headerSubtitle}>{loginCopy.brandSubtitle}</Text>
            </View>
          </View>

          <AuthElevatedCard style={styles.card}>
            <View style={styles.fields}>
              <LabeledAuthInput
                label={loginCopy.emailLabel}
                leading={<MailIcon />}
                placeholder={loginCopy.emailPlaceholder}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
              />
              <LabeledAuthInput
                label={loginCopy.passwordLabel}
                leading={<LockIcon />}
                inputTrailing={
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={secure ? 'Show password' : 'Hide password'}
                    hitSlop={10}
                    onPress={() => setSecure(s => !s)}>
                    {secure ? <EyeIcon /> : <EyeOffIcon />}
                  </Pressable>
                }
                placeholder="••••••••"
                secureTextEntry={secure}
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <GradientPillButton onPress={onLogin} style={styles.loginBtn}>
              {loading ? 'Logging in...' : loginCopy.loginCta}
            </GradientPillButton>
          </AuthElevatedCard>

          <View style={styles.signupSection}>
            <Text style={styles.signupRow}>
              {loginCopy.createAccountPrompt}{' '}
              <Text
                onPress={() => navigation.navigate('SignUp')}
                style={styles.signupLink}>
                {loginCopy.createAccountCta}
              </Text>
            </Text>

            <View style={styles.footerLinks}>
              <Text style={styles.footerLink}>Privacy Policy</Text>
              <Text style={styles.footerSep}>•</Text>
              <Text style={styles.footerLink}>Terms of Service</Text>
              <Text style={styles.footerSep}>•</Text>
              <Text style={styles.footerLink}>Help Center</Text>
            </View>

            <Text style={styles.copyright}>{loginCopy.copyright}</Text>
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
  fields: {
    marginBottom: 8,
  },
  loginBtn: {
    marginTop: 8,
  },
  signupSection: {
    marginTop: 8,
    alignItems: 'center',
  },
  signupRow: {
    fontSize: 15,
    color: authColors.bodyGray,
    marginBottom: 24,
  },
  signupLink: {
    fontWeight: '700',
    color: authColors.brandBlue,
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    opacity: 0.7,
  },
  footerLink: {
    fontSize: 12,
    fontWeight: '600',
    color: authColors.taglineGray,
  },
  footerSep: {
    fontSize: 12,
    color: authColors.taglineGray,
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

export default LoginScreen;

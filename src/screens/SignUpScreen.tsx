import { useCallback, useState } from 'react';
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
  AppleMark,
  AuthElevatedCard,
  AuthGradientBackground,
  BrandWordmark,
  EyeIcon,
  EyeOffIcon,
  FormDivider,
  GoogleMark,
  GradientPillButton,
  LabeledAuthInput,
  LockIcon,
  MailIcon,
  SocialAuthButton,
  UserIcon,
} from '../components/auth';
import { signUpCopy } from '../constants/authCopy';
import type { RootStackParamList } from '../navigation/types';
import { authColors, authDesign } from '../theme/authDesign';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

const LOADER_SIZE = 68;

function SignUpScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securePassword, setSecurePassword] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);

  const onSignUp = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  }, [navigation]);

  const onSocial = useCallback((provider: string) => {
    Alert.alert('Coming soon', `${provider} sign-up is not wired yet.`);
  }, []);

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
            <LoaderMark width={LOADER_SIZE} height={LOADER_SIZE} />
            <View style={styles.headerTitles}>
              <BrandWordmark size="medium" tone="mono" />
              <Text style={styles.headerSubtitle}>
                {signUpCopy.brandSubtitle}
              </Text>
            </View>
          </View>

          <AuthElevatedCard style={styles.card}>
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
                    accessibilityLabel={
                      securePassword ? 'Show password' : 'Hide password'
                    }
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
                    accessibilityLabel={
                      secureConfirm ? 'Show password' : 'Hide password'
                    }
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
              {signUpCopy.signUpCta}
            </GradientPillButton>

            <FormDivider label={signUpCopy.divider} />

            <View style={styles.socialRow}>
              <SocialAuthButton
                label={signUpCopy.googleLabel}
                onPress={() => onSocial('Google')}
                leading={<GoogleMark />}
              />
              <View style={styles.socialGap} />
              <SocialAuthButton
                label={signUpCopy.appleLabel}
                onPress={() => onSocial('Apple')}
                leading={<AppleMark />}
              />
            </View>
          </AuthElevatedCard>

          <Text style={styles.loginRow}>
            {signUpCopy.alreadyPrompt}{' '}
            <Text
              onPress={() => navigation.navigate('Login')}
              style={styles.loginLink}>
              {signUpCopy.loginLink}
            </Text>
          </Text>

          <Text style={styles.copyright}>{signUpCopy.copyright}</Text>
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
    paddingTop: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: authDesign.sectionGap,
  },
  headerTitles: {
    alignItems: 'center',
    marginTop: 16,
    gap: 6,
  },
  headerSubtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: authColors.bodyGray,
  },
  card: {
    marginBottom: 20,
  },
  fields: {
    marginBottom: 4,
  },
  primaryBtn: {
    marginTop: 8,
  },
  socialRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  socialGap: {
    width: 12,
  },
  loginRow: {
    textAlign: 'center',
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
    fontWeight: '600',
    letterSpacing: 0.8,
    color: authColors.taglineGray,
    textAlign: 'center',
  },
});

export default SignUpScreen;

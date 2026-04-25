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
import LoginMark from '../assets/icons/login_ison.svg';
import {
  AppleMark,
  AuthElevatedCard,
  AuthGradientBackground,
  BrandWordmark,
  EyeIcon,
  EyeOffIcon,
  FormDivider,
  GoogleMark,
  InlineLink,
  LabeledAuthInput,
  LockIcon,
  MailIcon,
  PillButton,
  SocialAuthButton,
} from '../components/auth';
import { loginCopy, loginDummyUser } from '../constants/authCopy';
import type { RootStackParamList } from '../navigation/types';
import { authColors, authDesign } from '../theme/authDesign';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

function LoginScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState<string>(loginDummyUser.email);
  const [password, setPassword] = useState('password123');
  const [secure, setSecure] = useState(true);

  const onLogin = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  }, [navigation]);

  const onSocial = useCallback((provider: string) => {
    Alert.alert('Coming soon', `${provider} sign-in is not wired yet.`);
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
            <LoginMark
              width={authDesign.loginHeaderIconSize}
              height={authDesign.loginHeaderIconSize * (93 / 104)}
            />
            <View style={styles.headerTitles}>
              <BrandWordmark size="medium" tone="mono" />
              <Text style={styles.headerTagline}>{loginCopy.tagline}</Text>
            </View>
          </View>

          <AuthElevatedCard style={styles.card}>
            <Text style={styles.welcome}>{loginCopy.welcomeTitle}</Text>
            <Text style={styles.welcomeSub}>{loginCopy.welcomeSubtitle}</Text>

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
                trailing={
                  <InlineLink
                    title={loginCopy.forgotPassword}
                    onPress={() =>
                      Alert.alert('Reset', 'Forgot password flow not wired yet.')
                    }
                  />
                }
                inputTrailing={
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={
                      secure ? 'Show password' : 'Hide password'
                    }
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

            <PillButton onPress={onLogin} style={styles.loginBtn}>
              {loginCopy.loginCta}
            </PillButton>

            <FormDivider label={loginCopy.divider} />

            <View style={styles.socialRow}>
              <SocialAuthButton
                label={loginCopy.googleLabel}
                onPress={() => onSocial('Google')}
                leading={<GoogleMark />}
              />
              <View style={styles.socialGap} />
              <SocialAuthButton
                label={loginCopy.appleLabel}
                onPress={() => onSocial('Apple')}
                leading={<AppleMark />}
              />
            </View>
          </AuthElevatedCard>

          <Text style={styles.signupRow}>
            {loginCopy.createAccountPrompt}{' '}
            <Text
              onPress={() => navigation.navigate('SignUp')}
              style={styles.signupLink}>
              {loginCopy.createAccountCta}
            </Text>
          </Text>

          <View style={styles.footerLinks}>
            <Pressable
              onPress={() =>
                Alert.alert('Privacy Policy', 'Static placeholder link.')
              }>
              <Text style={styles.footerLink}>Privacy Policy</Text>
            </Pressable>
            <Text style={styles.footerSep}> · </Text>
            <Pressable
              onPress={() =>
                Alert.alert('Terms of Service', 'Static placeholder link.')
              }>
              <Text style={styles.footerLink}>Terms of Service</Text>
            </Pressable>
            <Text style={styles.footerSep}> · </Text>
            <Pressable
              onPress={() =>
                Alert.alert('Help Center', 'Static placeholder link.')
              }>
              <Text style={styles.footerLink}>Help Center</Text>
            </Pressable>
          </View>

          <Text style={styles.copyright}>{loginCopy.copyright}</Text>
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
  headerTagline: {
    fontSize: 15,
    color: authColors.bodyGray,
  },
  card: {
    marginBottom: 20,
  },
  welcome: {
    fontSize: 24,
    fontWeight: '800',
    color: authColors.titleGray,
    marginBottom: 8,
  },
  welcomeSub: {
    fontSize: 14,
    color: authColors.bodyGray,
    marginBottom: 24,
    lineHeight: 20,
  },
  fields: {
    marginBottom: 4,
  },
  loginBtn: {
    marginTop: 8,
  },
  socialRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  socialGap: {
    width: 12,
  },
  signupRow: {
    textAlign: 'center',
    fontSize: 15,
    color: authColors.bodyGray,
    marginBottom: 20,
  },
  signupLink: {
    fontWeight: '700',
    color: authColors.brandBlue,
  },
  footerLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  footerLink: {
    fontSize: 11,
    color: authColors.taglineGray,
  },
  footerSep: {
    fontSize: 11,
    color: authColors.taglineGray,
  },
  copyright: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.8,
    color: authColors.taglineGray,
    textAlign: 'center',
  },
});

export default LoginScreen;

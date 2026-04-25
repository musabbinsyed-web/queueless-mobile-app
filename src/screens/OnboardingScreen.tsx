import { useCallback, useEffect, useMemo } from 'react';
import {
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import LogoMark from '../assets/icons/logo.svg';
import {
  AuthGradientBackground,
  BrandWordmark,
  OnboardingLiveCard,
  OnboardingPagination,
  PillButton,
} from '../components/auth';
import { onboardingCopy } from '../constants/authCopy';
import type { RootStackParamList } from '../navigation/types';
import { authColors, authDesign } from '../theme/authDesign';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

function OnboardingScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const logoSize = useMemo(() => {
    const cap = Math.min(width * 0.28, authDesign.logoSize);
    return Math.max(88, cap);
  }, [width]);

  const goToLogin = useCallback(() => {
    navigation.replace('Login');
  }, [navigation]);

  useEffect(() => {
    const t = setTimeout(goToLogin, onboardingCopy.autoAdvanceMs);
    return () => clearTimeout(t);
  }, [goToLogin]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#D8EBFF" />
      <AuthGradientBackground>
        <View style={styles.column}>
          <View style={styles.topBar}>
            <View style={styles.topBarSpacer} />
            <PillButton variant="ghost" onPress={goToLogin}>
              Skip
            </PillButton>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={goToLogin}
            style={styles.pressableMain}>
            <View style={styles.brandBlock}>
              <LogoMark width={logoSize} height={logoSize} />
              <View style={styles.titleGap}>
                <BrandWordmark size="large" />
              </View>
              <Text style={styles.tagline}>{onboardingCopy.tagline}</Text>
            </View>

            <View style={styles.mid}>
              <OnboardingPagination activeIndex={1} />
              <Text style={styles.loading}>{onboardingCopy.loadingMessage}</Text>
            </View>

            <View style={styles.cardWrap}>
              <OnboardingLiveCard copy={onboardingCopy.liveCard} />
            </View>
          </Pressable>
        </View>
      </AuthGradientBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  column: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  topBarSpacer: {
    flex: 1,
  },
  pressableMain: {
    flex: 1,
  },
  brandBlock: {
    alignItems: 'center',
    marginTop: 8,
  },
  titleGap: {
    marginTop: 16,
  },
  tagline: {
    marginTop: 12,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2.4,
    color: authColors.taglineGray,
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  mid: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 16,
  },
  loading: {
    fontSize: 14,
    fontStyle: 'italic',
    color: authColors.bodyGray,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  cardWrap: {
    paddingBottom: 20,
    alignItems: 'center',
  },
});

export default OnboardingScreen;

import { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  Animated,
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

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim, slideAnim]);

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
            
            <Animated.View style={[styles.brandBlock, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
              <View style={[styles.logoCircle, { width: logoSize * 1.4, height: logoSize * 1.4, borderRadius: logoSize * 0.7 }]}>
                <LogoMark width={logoSize} height={logoSize} />
              </View>
              <View style={styles.titleGap}>
                <BrandWordmark size="large" />
              </View>
              <Text style={styles.tagline}>{onboardingCopy.tagline}</Text>
            </Animated.View>

            <Animated.View style={[styles.mid, { opacity: fadeAnim }]}>
              <OnboardingPagination activeIndex={1} />
              <Text style={styles.loading}>{onboardingCopy.loadingMessage}</Text>
            </Animated.View>

            <Animated.View style={[styles.cardWrap, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
              <OnboardingLiveCard copy={onboardingCopy.liveCard} />
            </Animated.View>
            
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
  logoCircle: {
    backgroundColor: authColors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: authColors.brandBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
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

import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import OnboardingIllustration from '../../assets/icons/onboarding-screen_icon.svg';
import { authColors, authDesign } from '../../theme/authDesign';

const FEATURE_ASPECT = 316 / 192;

export type LiveVenueCopy = {
  badgeLabel: string;
  venueName: string;
  statusLine: string;
};

type OnboardingLiveCardProps = {
  copy: LiveVenueCopy;
};

export function OnboardingLiveCard({ copy }: OnboardingLiveCardProps) {
  const { width: windowWidth } = useWindowDimensions();
  const maxWidth = windowWidth - authDesign.screenPaddingH * 2;
  const cardWidth = maxWidth;
  const cardHeight = cardWidth / FEATURE_ASPECT;

  return (
    <View style={[styles.clip, { width: cardWidth, height: cardHeight }]}>
      <OnboardingIllustration
        width={cardWidth}
        height={cardHeight}
        preserveAspectRatio="xMidYMid slice"
      />
      <View style={styles.badge}>
        <Text style={styles.badgeEyebrow}>{copy.badgeLabel}</Text>
        <View style={styles.badgeRow}>
          <Text style={styles.badgeTitle}>
            {copy.venueName} — {copy.statusLine}
          </Text>
          <View style={styles.verified}>
            <Text style={styles.check}>{'\u2713'}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  clip: {
    borderRadius: authDesign.featureCardRadius,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  badge: {
    position: 'absolute',
    left: 14,
    bottom: 14,
    maxWidth: '88%',
    backgroundColor: authColors.white,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  badgeEyebrow: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.1,
    color: authColors.liveGreen,
    marginBottom: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badgeTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: authColors.titleGray,
  },
  verified: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    color: authColors.liveGreenMuted,
    fontSize: 12,
    fontWeight: '800',
  },
});

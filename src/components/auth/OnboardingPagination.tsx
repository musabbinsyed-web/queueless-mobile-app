import { StyleSheet, View } from 'react-native';
import { authColors, authDesign } from '../../theme/authDesign';

type OnboardingPaginationProps = {
  total?: number;
  activeIndex: number;
};

export function OnboardingPagination({
  total = 3,
  activeIndex,
}: OnboardingPaginationProps) {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            i === activeIndex ? styles.dotActive : styles.dotIdle,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: authDesign.dotGap,
  },
  dot: {
    width: authDesign.dotSize,
    height: authDesign.dotSize,
    borderRadius: authDesign.dotSize / 2,
  },
  dotActive: {
    backgroundColor: authColors.brandBlue,
    transform: [{ scale: 1.05 }],
  },
  dotIdle: {
    backgroundColor: '#C8DCF5',
  },
});

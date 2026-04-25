import { StyleSheet, Text, View } from 'react-native';
import { authColors } from '../../theme/authDesign';

type BrandWordmarkProps = {
  size?: 'large' | 'medium';
  /** Login header: both parts use primary gray per design */
  tone?: 'brand' | 'mono';
};

export function BrandWordmark({
  size = 'large',
  tone = 'brand',
}: BrandWordmarkProps) {
  const isLarge = size === 'large';
  const mono = tone === 'mono';

  return (
    <View style={styles.row}>
      <Text
        style={[
          styles.queue,
          isLarge && styles.queueLarge,
          mono && styles.mono,
        ]}>
        Queue
      </Text>
      <Text
        style={[styles.less, isLarge && styles.lessLarge, mono && styles.mono]}>
        Less
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  queue: {
    fontWeight: '800',
    color: authColors.brandBlue,
    fontSize: 28,
  },
  queueLarge: {
    fontSize: 36,
  },
  less: {
    fontWeight: '800',
    color: authColors.titleGray,
    fontSize: 28,
  },
  lessLarge: {
    fontSize: 36,
  },
  mono: {
    color: authColors.titleGray,
  },
});

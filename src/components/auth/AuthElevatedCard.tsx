import type { PropsWithChildren } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { authColors, authDesign } from '../../theme/authDesign';

type AuthElevatedCardProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
}>;

export function AuthElevatedCard({ children, style }: AuthElevatedCardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: authColors.white,
    borderRadius: authDesign.cardRadius,
    padding: authDesign.cardPadding,
    ...Platform.select({
      ios: {
        shadowColor: authColors.shadowBlue,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.35,
        shadowRadius: 24,
      },
      android: {
        elevation: 10,
      },
    }),
  },
});

import type { PropsWithChildren } from 'react';
import { StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authDesign } from '../../theme/authDesign';

type AuthGradientBackgroundProps = PropsWithChildren<{
  bottomInsetExtra?: number;
}>;

export function AuthGradientBackground({
  children,
  bottomInsetExtra = 0,
}: AuthGradientBackgroundProps) {
  return (
    <LinearGradient
      colors={['#D8EBFF', '#EFF6FF', '#FFFFFF']}
      locations={[0, 0.38, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}>
      <SafeAreaView
        style={[styles.safe, { paddingBottom: bottomInsetExtra }]}
        edges={['top', 'left', 'right']}>
        {children}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safe: {
    flex: 1,
    paddingHorizontal: authDesign.screenPaddingH,
    paddingTop: authDesign.screenPaddingTop,
  },
});

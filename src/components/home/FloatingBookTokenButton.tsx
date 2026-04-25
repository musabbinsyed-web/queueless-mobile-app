import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import BookTokenIcon from '../../assets/icons/book_token_ison.svg';
import { homeSpacing } from '../../theme/homeTheme';

const GRADIENT = {
  start: '#0052D0',
  end: '#799DFF',
};

/** Space between the bottom nav and this button. */
export const BOOK_TOKEN_GAP_ABOVE_TAB = 12;

export const BOOK_TOKEN_BUTTON_HEIGHT = 56;

type FloatingBookTokenButtonProps = {
  onPress: () => void;
  /** Offset from the bottom edge of the screen (positions the bar above the nav). */
  bottom: number;
  style?: ViewStyle;
};

export function FloatingBookTokenButton({
  onPress,
  bottom,
  style,
}: FloatingBookTokenButtonProps) {
  return (
    <View style={[styles.floater, { bottom }, style]} pointerEvents="box-none">
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [pressed && styles.pressed]}>
        <LinearGradient
          colors={[GRADIENT.start, GRADIENT.end]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}>
          <View style={styles.inner}>
            <BookTokenIcon width={22} height={18} />
            <Text style={[styles.label, styles.labelAfterIcon]}>Book Token</Text>
          </View>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const BUTTON_HEIGHT = 56;
const HORIZONTAL = homeSpacing.screenHorizontal;

const styles = StyleSheet.create({
  floater: {
    position: 'absolute',
    left: HORIZONTAL,
    right: HORIZONTAL,
    bottom: 0,
    zIndex: 10,
  },
  gradient: {
    borderRadius: 50,
    minHeight: BUTTON_HEIGHT,
    width: '60%',
    alignSelf: 'center',
    justifyContent: 'center',
    shadowColor: '#0052D0',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 10,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: BUTTON_HEIGHT,
    paddingHorizontal: 40,
  },
  label: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  labelAfterIcon: {
    marginLeft: 10,
  },
  pressed: {
    opacity: 0.92,
  },
});

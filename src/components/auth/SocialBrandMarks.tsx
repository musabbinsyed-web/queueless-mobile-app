import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export function GoogleMark() {
  return (
    <View style={styles.googleBadge}>
      <Text style={styles.googleG}>G</Text>
    </View>
  );
}

export function AppleMark() {
  return (
    <View style={styles.appleBadge}>
      <Svg width={14} height={14} viewBox="0 0 24 24">
        <Path
          fill="#FFFFFF"
          d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  googleBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E2E8F0',
  },
  googleG: {
    fontSize: 14,
    fontWeight: '800',
    color: '#4285F4',
  },
  appleBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

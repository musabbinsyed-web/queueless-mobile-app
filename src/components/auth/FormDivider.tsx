import { StyleSheet, Text, View } from 'react-native';
import { authColors, authDesign } from '../../theme/authDesign';

type FormDividerProps = {
  label: string;
};

export function FormDivider({ label }: FormDividerProps) {
  return (
    <View style={styles.row}>
      <View style={styles.line} />
      <Text style={styles.text}>{label}</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: authDesign.sectionGap,
    gap: 12,
  },
  line: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: authColors.dividerLine,
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.2,
    color: authColors.taglineGray,
  },
});

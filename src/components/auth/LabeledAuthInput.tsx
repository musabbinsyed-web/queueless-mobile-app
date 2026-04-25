import type { ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { authColors, authDesign } from '../../theme/authDesign';

type LabeledAuthInputProps = {
  label: string;
  leading: ReactNode;
  trailing?: ReactNode;
  inputTrailing?: ReactNode;
  containerStyle?: object;
} & TextInputProps;

export function LabeledAuthInput({
  label,
  leading,
  trailing,
  inputTrailing,
  containerStyle,
  style,
  ...inputProps
}: LabeledAuthInputProps) {
  return (
    <View style={[styles.field, containerStyle]}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {trailing}
      </View>
      <View style={styles.inputShell}>
        <View style={styles.leading}>{leading}</View>
        <TextInput
          placeholderTextColor={authColors.taglineGray}
          style={[styles.input, style]}
          {...inputProps}
        />
        {inputTrailing ? (
          <View style={styles.inputTrailing}>{inputTrailing}</View>
        ) : null}
      </View>
    </View>
  );
}

type InlineLinkProps = {
  title: string;
  onPress: () => void;
};

export function InlineLink({ title, onPress }: InlineLinkProps) {
  return (
    <Pressable onPress={onPress} hitSlop={8}>
      <Text style={styles.link}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: authColors.bodyGray,
  },
  link: {
    fontSize: 14,
    fontWeight: '600',
    color: authColors.brandBlue,
  },
  inputShell: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: authDesign.inputHeight,
    borderRadius: authDesign.inputRadius,
    backgroundColor: authColors.inputBg,
    paddingHorizontal: 14,
  },
  leading: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: authColors.titleGray,
  },
  inputTrailing: {
    marginLeft: 8,
  },
});

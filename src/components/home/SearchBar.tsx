import { StyleSheet, Text, TextInput, View } from 'react-native';
import { homeSpacing, homeTheme } from '../../theme/homeTheme';

type SearchBarProps = {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
};

export function SearchBar({
  value = '',
  onChangeText,
  placeholder = 'Search for service centers...',
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon} accessibilityLabel="Search">
        🔍
      </Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={homeTheme.textMuted}
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
        autoCorrect={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: homeTheme.searchBg,
    borderRadius: homeSpacing.searchRadius,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: homeSpacing.sectionGap,
  },
  icon: {
    fontSize: 16,
    marginRight: 10,
    opacity: 0.85,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '400',
    color: homeTheme.text,
    paddingVertical: 0,
  },
});

import type { FC } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { SvgProps } from 'react-native-svg';
import { homeSpacing, homeTheme } from '../../theme/homeTheme';

export type CategoryItem = {
  id: string;
  name: string;
  Icon: FC<SvgProps>;
};

type CategoryCardProps = {
  item: CategoryItem;
  width: number;
  onPress?: () => void;
};

export function CategoryCard({ item, width, onPress }: CategoryCardProps) {
  const Icon = item.Icon;
  const inner = (
    <>
      <View style={styles.iconWrap}>
        <Icon width={48} height={48} />
      </View>
      <Text style={styles.label} numberOfLines={2}>
        {item.name}
      </Text>
    </>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityHint="Opens providers for this category"
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          { width },
          pressed && styles.pressed,
        ]}>
        {inner}
      </Pressable>
    );
  }

  return <View style={[styles.card, { width }]}>{inner}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: homeTheme.surface,
    borderRadius: homeSpacing.cardRadius,
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: homeTheme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15, 23, 42, 0.04)',
  },
  pressed: {
    opacity: 0.92,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: homeTheme.text,
    textAlign: 'center',
    lineHeight: 18,
  },
});

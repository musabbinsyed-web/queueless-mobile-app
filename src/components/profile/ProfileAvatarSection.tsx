import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { profileTheme } from '../../theme/profileTheme';
import { PencilEditIcon } from './ProfileMenuIcons';

type ProfileAvatarSectionProps = {
  avatarUrl: string;
  name: string;
  email: string;
  onEditPress?: () => void;
};

export function ProfileAvatarSection({
  avatarUrl,
  name,
  email,
  onEditPress,
}: ProfileAvatarSectionProps) {
  return (
    <>
      <View style={styles.avatarBlock}>
        <View style={styles.portraitWrap}>
          <Image source={{ uri: avatarUrl }} style={styles.portrait} />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Edit profile photo"
            onPress={onEditPress}
            style={({ pressed }) => [
              styles.editFab,
              pressed && styles.editFabPressed,
            ]}>
            <PencilEditIcon />
          </Pressable>
        </View>
      </View>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.email}>{email}</Text>
    </>
  );
}

const PORTRAIT_WIDTH = 148;

const styles = StyleSheet.create({
  avatarBlock: {
    alignItems: 'center',
    marginBottom: 18,
  },
  portraitWrap: {
    width: PORTRAIT_WIDTH,
    height: PORTRAIT_WIDTH * 1.22,
    position: 'relative',
  },
  portrait: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
    backgroundColor: '#e5e7eb',
  },
  editFab: {
    position: 'absolute',
    right: -4,
    bottom: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: profileTheme.editFab,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: profileTheme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  editFabPressed: {
    opacity: 0.9,
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: profileTheme.text,
    textAlign: 'center',
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  email: {
    fontSize: 15,
    fontWeight: '500',
    color: profileTheme.textMuted,
    textAlign: 'center',
    marginBottom: 26,
  },
});

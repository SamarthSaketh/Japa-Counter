import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { DimensionValue, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii } from '../constants/theme';
import LotusMark from './LotusMark';

export type MantraProfileSummary = {
  id: string;
  name: string;               // e.g. "Gayatri Mantra"
  defaultTarget: number;      // 108 / 1008 / custom
  progressLabel?: string;     // e.g. "12,480 / 1,25,000"
  deityImageUri?: string;     // user-supplied deity/background image
  gradient: readonly [string, string, string]; // fallback if no image
};

/**
 * A single profile tile, styled after the tilted affirmation cards in the
 * reference: full-bleed image (or gradient), a soft dark scrim for text
 * legibility, a lotus divider, and a short line of copy pinned low.
 */
export default function ProfileCard({
  profile,
  onPress,
  width = 168,
  height = 236,
}: {
  profile: MantraProfileSummary;
  onPress?: () => void;
  width?: DimensionValue;
  height?: DimensionValue;
}) {
  const content = (
    <View style={[styles.scrim, { justifyContent: 'flex-end', padding: 16 }]}>
      <LotusMark size={16} />
      <Text style={styles.name} numberOfLines={2}>
        {profile.name}
      </Text>
      <Text style={styles.meta}>
        Target {profile.defaultTarget.toLocaleString('en-IN')}
        {profile.progressLabel ? ` · ${profile.progressLabel}` : ''}
      </Text>
    </View>
  );

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        { width, height, borderRadius: radii.card, overflow: 'hidden' },
        { transform: [{ scale: pressed ? 0.97 : 1 }] },
        styles.shadow,
      ]}
    >
      {profile.deityImageUri ? (
        <ImageBackground
          source={{ uri: profile.deityImageUri }}
          style={{ flex: 1 }}
          imageStyle={{ borderRadius: radii.card }}
        >
          {content}
        </ImageBackground>
      ) : (
        <LinearGradient
          colors={profile.gradient}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={{ flex: 1, borderRadius: radii.card }}
        >
          {content}
        </LinearGradient>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    backgroundColor: colors.cardOverlay,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radii.card,
  },
  name: {
    color: colors.textOnDark,
    fontSize: 17,
    fontWeight: '600',
    marginTop: 8,
  },
  meta: {
    color: colors.textOnDarkMuted,
    fontSize: 12,
    marginTop: 4,
  },
  shadow: {
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
});

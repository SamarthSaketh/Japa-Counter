import React from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Plus, Settings, History } from 'lucide-react-native';
import ProfileCard, { MantraProfileSummary } from '../../components/ProfileCard';
import LotusMark from '../../components/LotusMark';
import { colors, gradients, spacing } from '../../constants/theme';

// Replace with your real `useProfiles()` hook — shown here with sample data
// matching the shape in your README's MantraProfile interface.
const SAMPLE_PROFILES: MantraProfileSummary[] = [
  { id: '1', name: 'Gayatri Mantra', defaultTarget: 108, progressLabel: '12,480 total', gradient: gradients.dusk },
  { id: '2', name: 'Mahamrityunjaya', defaultTarget: 1008, progressLabel: '3,240 total', gradient: gradients.night },
  { id: '3', name: 'Hanuman Chalisa', defaultTarget: 108, progressLabel: '860 total', gradient: gradients.forest },
  { id: '4', name: 'Hare Krishna', defaultTarget: 1008, progressLabel: '21 malas', gradient: gradients.ocean },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={gradients.homeBg} style={StyleSheet.absoluteFill} />

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: 64 }}>
        {/* Header */}
        <View style={{ alignItems: 'center', marginBottom: spacing.xl }}>
          <LotusMark size={28} color={colors.primaryDeep} opacity={1} />
          <Text style={styles.title}>Your Japa</Text>
          <Text style={styles.subtitle}>Select a mantra to begin your session</Text>
        </View>

        {/* Staggered profile grid — alternating offset per column, like the
           tilted collage in the reference */}
        <View style={{ flexDirection: 'row', gap: spacing.md }}>
          <View style={{ flex: 1, gap: spacing.md, marginTop: 0 }}>
            {SAMPLE_PROFILES.filter((_, i) => i % 2 === 0).map((p) => (
              <ProfileCard
                key={p.id}
                profile={p}
                width="100%"
                onPress={() => router.push(`/session/${p.id}`)}
              />
            ))}
          </View>
          <View style={{ flex: 1, gap: spacing.md, marginTop: spacing.xl }}>
            {SAMPLE_PROFILES.filter((_, i) => i % 2 === 1).map((p) => (
              <ProfileCard
                key={p.id}
                profile={p}
                width="100%"
                onPress={() => router.push(`/session/${p.id}`)}
              />
            ))}
          </View>
        </View>

        {/* Add profile CTA */}
        <Pressable
          onPress={() => router.push('/profile/create')}
          style={({ pressed }) => [styles.addCard, pressed && { opacity: 0.85 }]}
        >
          <Plus size={20} color={colors.primaryDeep} />
          <Text style={styles.addCardText}>New mantra profile</Text>
        </Pressable>
      </ScrollView>

      {/* Bottom quick actions */}
      <View style={styles.bottomBar}>
        <Pressable style={styles.bottomBtn} onPress={() => router.push('/history')}>
          <History size={20} color={colors.textOnLightMuted} />
          <Text style={styles.bottomBtnText}>History</Text>
        </Pressable>
        <Pressable style={styles.bottomBtn} onPress={() => router.push('/settings')}>
          <Settings size={20} color={colors.textOnLightMuted} />
          <Text style={styles.bottomBtnText}>Settings</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: colors.textOnLight,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textOnLightMuted,
    marginTop: 4,
  },
  addCard: {
    marginTop: spacing.lg,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: 'rgba(91,78,158,0.35)',
    borderStyle: 'dashed',
    paddingVertical: 22,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  addCardText: {
    color: colors.primaryDeep,
    fontWeight: '600',
    fontSize: 14,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 14,
    paddingBottom: 28,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.08)',
  },
  bottomBtn: { alignItems: 'center', gap: 2 },
  bottomBtnText: { fontSize: 11, color: colors.textOnLightMuted },
});

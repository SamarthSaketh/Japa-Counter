import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Undo2, X } from 'lucide-react-native';
import React, { useCallback, useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors, gradients } from '../../constants/theme';

const RING_SIZE = 260;
const STROKE = 10;
const RADIUS = (RING_SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// Swap for real profile lookup via useProfiles()/profileId
const MOCK_PROFILE = {
  name: 'Gayatri Mantra',
  target: 108,
  milestoneInterval: 50,
  deityImageUri: undefined as string | undefined,
};

export default function SessionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [count, setCount] = useState(0);
  const [malas, setMalas] = useState(0);

  const target = MOCK_PROFILE.target;
  const progress = useMemo(() => Math.min(count / target, 1), [count, target]);
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);
  const isComplete = count >= target;

  const handleTap = useCallback(() => {
    if (isComplete) return;
    const next = count + 1;
    setCount(next);

    if (next % 108 === 0) {
      setMalas((m) => m + 1);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else if (next % MOCK_PROFILE.milestoneInterval === 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    if (next === target) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [count, isComplete, target]);

  const handleUndo = useCallback(() => {
    setCount((c) => Math.max(0, c - 1));
  }, []);

  return (
    <Pressable style={{ flex: 1 }} onPress={handleTap}>
      <LinearGradient colors={gradients.screenBg} style={StyleSheet.absoluteFill} />

      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable hitSlop={12} onPress={() => router.back()}>
          <X size={22} color={colors.textOnDarkMuted} />
        </Pressable>
        <Text style={styles.profileName}>{MOCK_PROFILE.name}</Text>
        <Pressable hitSlop={12} onPress={handleUndo}>
          <Undo2 size={20} color={colors.textOnDarkMuted} />
        </Pressable>
      </View>

      {/* Deity image anchor, shown above the ring per the reference app */}
      {MOCK_PROFILE.deityImageUri && (
        <Image source={{ uri: MOCK_PROFILE.deityImageUri }} style={styles.deityImage} />
      )}

      {/* Center: ring + count */}
      <View style={styles.center}>
        <View>
          <Svg width={RING_SIZE} height={RING_SIZE}>
            <Circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RADIUS}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={STROKE}
              fill="none"
            />
            <Circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RADIUS}
              stroke={isComplete ? colors.success : colors.primary}
              strokeWidth={STROKE}
              strokeLinecap="round"
              fill="none"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={strokeDashoffset}
              rotation="-90"
              origin={`${RING_SIZE / 2}, ${RING_SIZE / 2}`}
            />
          </Svg>
          <View style={styles.ringCenterText}>
            <Text style={styles.countText}>{count}</Text>
            <Text style={styles.targetText}>/ {target}</Text>
          </View>
        </View>

        {malas > 0 && (
          <Text style={styles.malaText}>
            {malas} {malas === 1 ? 'mala' : 'malas'} complete
          </Text>
        )}

        <Text style={styles.hint}>
          {isComplete ? 'Session complete — tap outside to finish' : 'Tap anywhere to count'}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  topBar: {
    position: 'absolute',
    top: 56,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileName: {
    color: colors.textOnDarkMuted,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  deityImage: {
    position: 'absolute',
    top: 110,
    alignSelf: 'center',
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  ringCenterText: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    color: colors.textOnDark,
    fontSize: 72,
    fontWeight: '200',
  },
  targetText: {
    color: colors.textOnDarkMuted,
    fontSize: 15,
    marginTop: 2,
  },
  malaText: {
    color: colors.accentGold,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  hint: {
    color: 'rgba(247,245,251,0.4)',
    fontSize: 12,
    letterSpacing: 0.3,
  },
});

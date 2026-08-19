import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Undo2, X } from 'lucide-react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import uuid from 'react-native-uuid';
import { colors, gradients } from '../../constants/theme';
import { getProfileById, saveSession } from '../../lib/storage';
import { MantraProfile, SessionLog } from '../../lib/types';

const RING_SIZE = 260;
const STROKE = 10;
const RADIUS = (RING_SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function getPeriod(): SessionLog['period'] {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

export default function SessionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [profile, setProfile] = useState<MantraProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [count, setCount] = useState(0);
  const [malas, setMalas] = useState(0);
  const [startedAt] = useState(() => Date.now());
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let mounted = true;
    getProfileById(id).then((p) => {
      if (mounted) {
        setProfile(p ?? null);
        setLoadingProfile(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [id]);

  // Target ALWAYS from profile.defaultTarget. 108 fallback only if profile
  // predates the field (old/migrated profile) - never as unconditional default.
  const target = profile?.defaultTarget ?? 108;
  const milestoneInterval = profile?.milestoneInterval ?? 50;

  const progress = useMemo(() => Math.min(count / target, 1), [count, target]);
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);
  const isComplete = count >= target;

  const handleTap = useCallback(() => {
    if (isComplete) return;
    const next = count + 1;
    setCount(next);

    const vibrate = profile?.vibrationEnabled ?? true;

    if (next % 108 === 0) {
      setMalas((m) => m + 1);
      if (vibrate) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else if (next % milestoneInterval === 0) {
      if (vibrate) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      if (vibrate) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    if (next === target && vibrate) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [count, isComplete, target, milestoneInterval, profile]);

  const handleUndo = useCallback(() => {
    setCount((c) => Math.max(0, c - 1));
  }, []);

  const finishSession = useCallback(async () => {
    if (saved || count === 0 || !id) {
      router.back();
      return;
    }
    setSaved(true); // guard against double-save on rapid double-tap
    const completedAt = Date.now();
    const log: SessionLog = {
      id: uuid.v4() as string,
      profileId: id,
      date: new Date().toISOString().slice(0, 10),
      period: getPeriod(),
      count,
      target,
      completed: count >= target,
      startedAt,
      completedAt,
      durationSec: Math.round((completedAt - startedAt) / 1000),
    };
    await saveSession(log);
    router.back();
  }, [saved, count, id, target, startedAt, router]);

  const handleOverlayPress = useCallback(() => {
    if (isComplete) {
      finishSession();
    } else {
      handleTap();
    }
  }, [isComplete, finishSession, handleTap]);

  if (loadingProfile) {
    return (
      <View style={[StyleSheet.absoluteFill, styles.center]}>
        <LinearGradient colors={gradients.screenBg} style={StyleSheet.absoluteFill} />
        <ActivityIndicator color={colors.textOnDark} />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={[StyleSheet.absoluteFill, styles.center]}>
        <LinearGradient colors={gradients.screenBg} style={StyleSheet.absoluteFill} />
        <Text style={styles.profileName}>Profile not found</Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={styles.hint}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <Pressable style={{ flex: 1 }} onPress={handleOverlayPress}>
      <LinearGradient colors={gradients.screenBg} style={StyleSheet.absoluteFill} />

      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable hitSlop={12} onPress={finishSession}>
          <X size={22} color={colors.textOnDarkMuted} />
        </Pressable>
        <Text style={styles.profileName}>{profile.name}</Text>
        <Pressable hitSlop={12} onPress={handleUndo}>
          <Undo2 size={20} color={colors.textOnDarkMuted} />
        </Pressable>
      </View>

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
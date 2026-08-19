import { View, Text, Pressable, BackHandler } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState, useCallback } from "react";
import * as Speech from "expo-speech";
import * as Haptics from "expo-haptics";
import { useKeepAwake } from "expo-keep-awake";
import uuid from "react-native-uuid";
import { getProfiles, saveSession } from "../../lib/storage";
import { MantraProfile, SessionLog } from "../../lib/types";

function getPeriod(hour: number): 'morning' | 'afternoon' | 'evening' {
  if (hour >= 4 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  return 'evening';
}

export default function Session() {
  useKeepAwake();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [profile, setProfile] = useState<MantraProfile | null>(null);
  const [count, setCount] = useState(0);
  const [completed, setCompleted] = useState(false);
  const countRef = useRef(0);
  const startedAtRef = useRef(0);
  const lastMilestoneRef = useRef(0);
  const lockRef = useRef(false);

  useEffect(() => {
    getProfiles().then((all) => {
      const found = all.find((p) => p.id === id);
      if (found) {
        setProfile(found);
        startedAtRef.current = Date.now();
      }
    });
  }, [id]);

  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => true);
    return () => sub.remove();
  }, []);

  const finishSession = useCallback(async () => {
    if (!profile) return;
    const now = Date.now();
    const log: SessionLog = {
      id: uuid.v4() as string,
      profileId: profile.id,
      date: new Date(startedAtRef.current).toISOString().slice(0, 10),
      period: getPeriod(new Date(startedAtRef.current).getHours()),
      count: countRef.current,
      target: profile.defaultTarget,
      completed: true,
      startedAt: startedAtRef.current,
      completedAt: now,
      durationSec: Math.round((now - startedAtRef.current) / 1000),
    };
    await saveSession(log);

    if (profile.audioMode === "voice" || profile.audioMode === "both") {
      Speech.speak(`${profile.defaultTarget} ${profile.milestonePhrase}, chanting finished`);
    }
    if (profile.vibrationEnabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setCompleted(true);
  }, [profile]);

  const handleTap = useCallback(() => {
    if (!profile || completed || lockRef.current) return;

    countRef.current += 1;
    const newCount = countRef.current;
    setCount(newCount);

    if (profile.vibrationEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    if (
      newCount % profile.milestoneInterval === 0 &&
      newCount !== lastMilestoneRef.current &&
      newCount < profile.defaultTarget
    ) {
      lastMilestoneRef.current = newCount;
      if (profile.audioMode === "voice" || profile.audioMode === "both") {
        Speech.speak(`${newCount} ${profile.milestonePhrase}`);
      }
      if (profile.vibrationEnabled) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
    }

    if (newCount >= profile.defaultTarget) {
      lockRef.current = true;
      finishSession();
    }
  }, [profile, completed, finishSession]);

  if (!profile) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <Text className="text-white">Loading...</Text>
      </View>
    );
  }

  if (completed) {
    return (
      <View className="flex-1 bg-black items-center justify-center px-6">
        <Text className="text-white text-3xl font-bold mb-2">Session Complete</Text>
        <Text className="text-gray-400 text-lg mb-8">
          {count} / {profile.defaultTarget} — {profile.name}
        </Text>
        <Pressable
          onPress={() => router.replace("/")}
          className="bg-orange-600 rounded-xl px-8 py-4"
        >
          <Text className="text-white font-semibold text-base">Done</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <Pressable
      onPress={handleTap}
      style={{ flex: 1 }}
      className="bg-black items-center justify-center"
    >
      <Text className="text-gray-600 text-sm mb-2">{profile.name}</Text>
      <Text className="text-white text-7xl font-bold">{count}</Text>
      <Text className="text-gray-500 text-lg mt-2">/ {profile.defaultTarget}</Text>
    </Pressable>
  );
}
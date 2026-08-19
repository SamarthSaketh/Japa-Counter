import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { getProfiles, getSessions } from "../../lib/storage";
import { MantraProfile, SessionLog } from "../../lib/types";

interface DayGroup {
  date: string;
  sessions: SessionLog[];
  total: number;
}

function computeStreak(sessions: SessionLog[]): number {
  const dates = [...new Set(sessions.filter((s) => s.completed).map((s) => s.date))].sort().reverse();
  let streak = 0;
  const cursor = new Date();
  for (const d of dates) {
    const expected = cursor.toISOString().slice(0, 10);
    if (d !== expected) break;
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export default function History() {
  const [sessions, setSessions] = useState<SessionLog[]>([]);
  const [profiles, setProfiles] = useState<MantraProfile[]>([]);

  useFocusEffect(
    useCallback(() => {
      Promise.all([getSessions(), getProfiles()]).then(([s, p]) => {
        setSessions(s);
        setProfiles(p);
      });
    }, [])
  );

  const profileMap = useMemo(() => {
    const map: Record<string, MantraProfile> = {};
    profiles.forEach((p) => (map[p.id] = p));
    return map;
  }, [profiles]);

  const grouped: DayGroup[] = useMemo(() => {
    const map: Record<string, SessionLog[]> = {};
    sessions.forEach((s) => {
      if (!map[s.date]) map[s.date] = [];
      map[s.date].push(s);
    });
    return Object.entries(map)
      .map(([date, list]) => ({ date, sessions: list, total: list.reduce((sum, s) => sum + s.count, 0) }))
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [sessions]);

  const streak = useMemo(() => computeStreak(sessions), [sessions]);
  const allTimeTotal = useMemo(() => sessions.reduce((sum, s) => sum + s.count, 0), [sessions]);

  return (
    <View className="flex-1 bg-black px-4 pt-16">
      <Text className="text-white text-2xl font-bold mb-6">History</Text>

      <View className="flex-row justify-between mb-6 bg-neutral-900 rounded-xl p-4">
        <View className="items-center flex-1">
          <Text className="text-white text-2xl font-bold">{streak}</Text>
          <Text className="text-gray-400 text-xs mt-1">Day Streak</Text>
        </View>
        <View className="items-center flex-1">
          <Text className="text-white text-2xl font-bold">{allTimeTotal}</Text>
          <Text className="text-gray-400 text-xs mt-1">All-Time Count</Text>
        </View>
        <View className="items-center flex-1">
          <Text className="text-white text-2xl font-bold">{sessions.length}</Text>
          <Text className="text-gray-400 text-xs mt-1">Sessions</Text>
        </View>
      </View>

      <FlatList
        data={grouped}
        keyExtractor={(item) => item.date}
        ListEmptyComponent={
          <Text className="text-gray-400 text-center mt-10">No sessions yet. Complete a japa to see it here.</Text>
        }
        renderItem={({ item }) => (
          <View className="bg-neutral-900 rounded-xl p-4 mb-3">
            <View className="flex-row justify-between mb-2">
              <Text className="text-white font-semibold">{item.date}</Text>
              <Text className="text-gray-400">{item.total} total</Text>
            </View>
            {item.sessions.map((s) => (
              <View key={s.id} className="flex-row justify-between py-1">
                <Text className="text-gray-400 capitalize">
                  {s.period} — {profileMap[s.profileId]?.name ?? "Unknown"}
                </Text>
                <Text className="text-gray-300">{s.count}/{s.target}</Text>
              </View>
            ))}
          </View>
        )}
      />
    </View>
  );
}
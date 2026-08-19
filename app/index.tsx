import { View, Text, FlatList, Pressable } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { getProfiles } from "../lib/storage";
import { MantraProfile } from "../lib/types";

export default function Home() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<MantraProfile[]>([]);

  useFocusEffect(
    useCallback(() => {
      getProfiles().then((all) => setProfiles(all.filter((p) => !p.archived)));
    }, [])
  );

  return (
    <View className="flex-1 bg-black px-4 pt-16">
      <Text className="text-white text-2xl font-bold mb-6">Japa Counter</Text>

      <FlatList
        data={profiles}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text className="text-gray-400 text-center mt-10">
            No profiles yet. Create one to start.
          </Text>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/session/${item.id}`)}
            className="bg-neutral-900 rounded-xl p-4 mb-3"
          >
            <Text className="text-white text-lg font-semibold">
              {item.icon} {item.name}
            </Text>
            <Text className="text-gray-400 text-sm mt-1">
              Target: {item.defaultTarget}
            </Text>
          </Pressable>
        )}
      />

        <View className="flex-row gap-3 mt-4">
          <Pressable
            onPress={() => router.push("/profile/new")}
            className="bg-orange-600 rounded-xl p-4 items-center flex-1"
          >
            <Text className="text-white font-semibold text-base">+ New Profile</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push("/history")}
            className="bg-neutral-800 rounded-xl p-4 items-center flex-1"
          >
            <Text className="text-white font-semibold text-base">History</Text>
          </Pressable>
        </View>
    </View>
  );
}
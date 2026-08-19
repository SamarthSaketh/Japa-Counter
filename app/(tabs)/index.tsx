import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Dimensions, FlatList, Pressable, Text, View } from "react-native";
import { getProfiles, getViewMode, setViewMode } from "../../lib/storage";
import { MantraProfile } from "../../lib/types";

const SCREEN_WIDTH = Dimensions.get("window").width;
const GRID_COLUMNS = 3;
const GRID_GAP = 10;
const SCREEN_PADDING = 16;
const TILE_SIZE =
  (SCREEN_WIDTH - SCREEN_PADDING * 2 - GRID_GAP * (GRID_COLUMNS - 1)) / GRID_COLUMNS;

export default function Home() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<MantraProfile[]>([]);
  const [viewMode, setViewModeState] = useState<"list" | "grid">("list");

  useFocusEffect(
    useCallback(() => {
      getProfiles().then((all) => setProfiles(all.filter((p) => !p.archived)));
      getViewMode().then(setViewModeState);
    }, [])
  );

  async function toggleViewMode() {
    const next = viewMode === "list" ? "grid" : "list";
    setViewModeState(next);
    await setViewMode(next);
  }

  return (
    <View className="flex-1 bg-black px-4 pt-16">
      <View className="flex-row items-center justify-between mb-6">
        <Text className="text-white text-2xl font-bold">Japa Counter</Text>
        <Pressable onPress={toggleViewMode} className="bg-neutral-800 rounded-lg px-3 py-2">
          <Text className="text-gray-300 text-xs font-medium">
            {viewMode === "list" ? "☰ List" : "▦ Grid"}
          </Text>
        </Pressable>
      </View>

      <FlatList
        key={viewMode}
        data={profiles}
        keyExtractor={(item) => item.id}
        numColumns={viewMode === "grid" ? GRID_COLUMNS : 1}
        columnWrapperStyle={viewMode === "grid" ? { gap: GRID_GAP } : undefined}
        contentContainerStyle={{ gap: GRID_GAP }}
        ListEmptyComponent={
          <Text className="text-gray-400 text-center mt-10">
            No profiles yet. Create one to start.
          </Text>
        }
        renderItem={({ item }) =>
          viewMode === "list" ? (
            <Pressable
              onPress={() => router.push(`/session/${item.id}`)}
              className="bg-neutral-900 rounded-xl p-4"
            >
              <Text className="text-white text-lg font-semibold">
                {item.icon} {item.name}
              </Text>
              <Text className="text-gray-400 text-sm mt-1">Target: {item.defaultTarget}</Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => router.push(`/session/${item.id}`)}
              style={{ width: TILE_SIZE, height: TILE_SIZE }}
              className="bg-neutral-900 rounded-xl items-center justify-center px-1"
            >
              <Text className="text-3xl mb-1">{item.icon}</Text>
              <Text className="text-white text-xs font-semibold text-center" numberOfLines={2}>
                {item.name}
              </Text>
              <Text className="text-gray-500 text-[10px] mt-1">{item.defaultTarget}</Text>
            </Pressable>
          )
        }
      />

      <Pressable
        onPress={() => router.push("/mantra-profile/new")}
        className="bg-orange-600 rounded-xl p-4 items-center mt-4"
      >
        <Text className="text-white font-semibold text-base">+ New Profile</Text>
      </Pressable>
    </View>
  );
}
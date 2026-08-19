import { View, Text, TextInput, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import uuid from "react-native-uuid";
import { saveProfile } from "../../lib/storage";
import { MantraProfile } from "../../lib/types";

export default function NewProfile() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [target, setTarget] = useState("108");

  async function handleCreate() {
    if (!name.trim()) return;

    const profile: MantraProfile = {
      id: uuid.v4() as string,
      name: name.trim(),
      icon: "🕉️",
      defaultTarget: parseInt(target, 10) || 108,
      milestoneInterval: 50,
      milestonePhrase: "sankhya completed",
      audioMode: "voice",
      vibrationEnabled: true,
      ambienceEnabled: false,
      createdAt: Date.now(),
      archived: false,
    };

    await saveProfile(profile);
    router.back();
  }

  return (
    <View className="flex-1 bg-black px-4 pt-16">
      <Text className="text-white text-2xl font-bold mb-6">New Profile</Text>

      <Text className="text-gray-400 mb-2">Mantra Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="e.g. Gayatri Mantra"
        placeholderTextColor="#666"
        className="bg-neutral-900 text-white rounded-lg p-3 mb-4"
      />

      <Text className="text-gray-400 mb-2">Default Target</Text>
      <TextInput
        value={target}
        onChangeText={setTarget}
        keyboardType="number-pad"
        placeholderTextColor="#666"
        className="bg-neutral-900 text-white rounded-lg p-3 mb-6"
      />

      <Pressable
        onPress={handleCreate}
        className="bg-orange-600 rounded-xl p-4 items-center"
      >
        <Text className="text-white font-semibold text-base">Create Profile</Text>
      </Pressable>
    </View>
  );
}
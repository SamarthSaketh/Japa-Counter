import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Image, Pressable, Text, TextInput, View } from "react-native";
import { useAuth } from "../lib/auth-context";
import { saveUserAccount } from "../lib/storage";

export default function CompleteProfile() {
  const router = useRouter();
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [photoUri, setPhotoUri] = useState<string | undefined>();

  async function pickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission needed", "Allow photo access to set a profile picture.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) setPhotoUri(result.assets[0].uri);
  }

  async function handleSave() {
    if (!user) return;
    if (!name.trim()) {
      Alert.alert("Name required", "Please enter your name to continue.");
      return;
    }
    await saveUserAccount({
      uid: user.uid,
      phoneNumber: user.phoneNumber ?? "",
      displayName: name.trim(),
      photoUri,
      createdAt: Date.now(),
    });
    router.replace("/(tabs)");
  }

  return (
    <View className="flex-1 bg-black px-6 justify-center">
      <Text className="text-white text-2xl font-bold mb-2 text-center">Welcome!</Text>
      <Text className="text-gray-400 text-center mb-8">Let's set up your profile</Text>

      <Pressable onPress={pickImage} className="self-center mb-6">
        {photoUri ? (
          <Image source={{ uri: photoUri }} className="w-24 h-24 rounded-full" />
        ) : (
          <View className="w-24 h-24 rounded-full bg-neutral-800 items-center justify-center">
            <Text className="text-gray-500 text-xs">Add Photo</Text>
          </View>
        )}
      </Pressable>

      <Text className="text-gray-400 mb-2">Your Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
        placeholderTextColor="#666"
        className="bg-neutral-900 text-white rounded-lg p-4 mb-6 text-base"
      />

      <Pressable onPress={handleSave} className="bg-orange-600 rounded-xl p-4 items-center">
        <Text className="text-white font-semibold text-base">Continue</Text>
      </Pressable>
    </View>
  );
}
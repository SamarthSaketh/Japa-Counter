import { getApp } from "@react-native-firebase/app";
import { getAuth, signOut } from "@react-native-firebase/auth";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Image, Pressable, Text, TextInput, View } from "react-native";
import { useAuth } from "../../lib/auth-context";
import { getUserAccount, saveUserAccount } from "../../lib/storage";
import { UserAccount } from "../../lib/types";

const authInstance = getAuth(getApp());

export default function Profile() {
  const { user } = useAuth();
  const router = useRouter();
  const [account, setAccount] = useState<UserAccount | null>(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");

  useFocusEffect(
    useCallback(() => {
      if (user) {
        getUserAccount(user.uid).then((acc) => {
          setAccount(acc);
          setName(acc?.displayName ?? "");
        });
      }
    }, [user])
  );

  async function pickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission needed", "Allow photo access to change your profile picture.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && account) {
      const updated = { ...account, photoUri: result.assets[0].uri };
      await saveUserAccount(updated);
      setAccount(updated);
    }
  }

  async function saveName() {
    if (!account || !name.trim()) return;
    const updated = { ...account, displayName: name.trim() };
    await saveUserAccount(updated);
    setAccount(updated);
    setEditing(false);
  }

  async function handleSignOut() {
    await signOut(authInstance);
    router.replace("/login");
  }

  if (!account) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <Text className="text-white">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black px-6 pt-16">
      <Text className="text-white text-2xl font-bold mb-8">Profile</Text>

      <Pressable onPress={pickImage} className="self-center mb-6">
        {account.photoUri ? (
          <Image source={{ uri: account.photoUri }} className="w-28 h-28 rounded-full" />
        ) : (
          <View className="w-28 h-28 rounded-full bg-neutral-800 items-center justify-center">
            <Text className="text-gray-500 text-xs">Add Photo</Text>
          </View>
        )}
        <Text className="text-orange-500 text-xs text-center mt-2">Change Photo</Text>
      </Pressable>

      {editing ? (
        <View className="mb-6">
          <TextInput
            value={name}
            onChangeText={setName}
            className="bg-neutral-900 text-white rounded-lg p-4 text-base mb-3"
            placeholderTextColor="#666"
          />
          <Pressable onPress={saveName} className="bg-orange-600 rounded-xl p-3 items-center">
            <Text className="text-white font-semibold">Save Name</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable onPress={() => setEditing(true)} className="mb-6 items-center">
          <Text className="text-white text-xl font-semibold">{account.displayName}</Text>
          <Text className="text-orange-500 text-xs mt-1">Edit</Text>
        </Pressable>
      )}

      <Text className="text-gray-500 text-sm text-center mb-8">{account.phoneNumber}</Text>

      <Pressable onPress={handleSignOut} className="bg-neutral-800 rounded-xl p-4 items-center">
        <Text className="text-white font-semibold text-base">Sign Out</Text>
      </Pressable>
    </View>
  );
}
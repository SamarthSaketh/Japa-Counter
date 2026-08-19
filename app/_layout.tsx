import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import "../global.css";
import { AuthProvider, useAuth } from "../lib/auth-context";
import { getUserAccount } from "../lib/storage";

function RootNavigation() {
  const { user, initializing } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [checkingProfile, setCheckingProfile] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);

useEffect(() => {
  if (!user) {
    setCheckingProfile(false);
    return;
  }
  if (hasProfile) return; // already confirmed — no need to re-check
  setCheckingProfile(true);
  getUserAccount(user.uid).then((acc) => {
    setHasProfile(!!acc?.displayName);
    setCheckingProfile(false);
  });
}, [user, segments, hasProfile]);

  useEffect(() => {
    if (initializing || checkingProfile) return;

    const inAuthGroup = segments[0] === "login";
    const inCompleteProfile = segments[0] === "complete-profile";

    if (!user && !inAuthGroup) {
      router.replace("/login");
    } else if (user && !hasProfile && !inCompleteProfile) {
      router.replace("/complete-profile");
    } else if (user && hasProfile && (inAuthGroup || inCompleteProfile)) {
      router.replace("/(tabs)");
    }
  }, [user, initializing, checkingProfile, hasProfile, segments]);

  if (initializing || checkingProfile) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <ActivityIndicator color="#fff" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigation />
    </AuthProvider>
  );
}
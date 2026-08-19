import { Redirect, Stack, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import "../global.css";
import { AuthProvider, useAuth } from "../lib/auth-context";
import { getUserAccount } from "../lib/storage";
import { ToastProvider } from "../lib/toast-context";

function RootNavigation() {
  const { user, initializing } = useAuth();
  const pathname = usePathname();

  const [checkingProfile, setCheckingProfile] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkProfile = async () => {
      if (!user) {
        if (mounted) {
          setHasProfile(false);
          setCheckingProfile(false);
        }
        return;
      }

      setCheckingProfile(true);

      try {
        const account = await getUserAccount(user.uid);

        if (mounted) {
          setHasProfile(!!account?.displayName);
        }
      } catch (error) {
        console.error("Failed to check profile:", error);

        if (mounted) {
          setHasProfile(false);
        }
      } finally {
        if (mounted) {
          setCheckingProfile(false);
        }
      }
    };

    checkProfile();

    return () => {
      mounted = false;
    };
  }, [user]);

  if (initializing || checkingProfile) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator color="#fff" />
      </View>
    );
  }

  const inAuth = pathname === "/login";
  const inCompleteProfile = pathname === "/complete-profile";

  if (!user && !inAuth) {
    return <Redirect href="/login" />;
  }

  if (user && !hasProfile && !inCompleteProfile) {
    return <Redirect href="/complete-profile" />;
  }

  if (user && hasProfile && (inAuth || inCompleteProfile)) {
    return <Redirect href="/(tabs)" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ToastProvider>
        <RootNavigation />
      </ToastProvider>
    </AuthProvider>
  );
}
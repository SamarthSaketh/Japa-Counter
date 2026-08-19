import { getApp } from "@react-native-firebase/app";
import { getAuth, onAuthStateChanged, User } from "@react-native-firebase/auth";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

const authInstance = getAuth(getApp());

interface AuthContextValue {
  user: User | null;
  initializing: boolean;
}

const AuthContext = createContext<AuthContextValue>({ user: null, initializing: true });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authInstance, (u) => {
      setUser(u);
      if (initializing) setInitializing(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, initializing }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
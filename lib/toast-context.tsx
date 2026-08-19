import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react-native";
import React, { createContext, useCallback, useContext, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

type ToastType = "success" | "error" | "warning";

interface ToastState {
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
}

const ACCENT: Record<ToastType, string> = {
  success: "#22c55e",
  error: "#ef4444",
  warning: "#eab308",
};

const ICON: Record<ToastType, React.ComponentType<{ size: number; color: string }>> = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
};

const DURATION_MS = 2800;

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback(
    (message: string, type: ToastType) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setToast({ message, type });
      opacity.setValue(0);
      translateY.setValue(24);
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.spring(translateY, {
          toValue: 0,
          friction: 8,
          tension: 90,
          useNativeDriver: true,
        }),
      ]).start();

      timerRef.current = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
          Animated.timing(translateY, { toValue: 12, duration: 200, useNativeDriver: true }),
        ]).start(() => setToast(null));
      }, DURATION_MS);
    },
    [opacity, translateY]
  );

  const value: ToastContextValue = {
    success: (m) => show(m, "success"),
    error: (m) => show(m, "error"),
    warning: (m) => show(m, "warning"),
  };

  const Icon = toast ? ICON[toast.type] : null;

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast && (
        <Animated.View
          pointerEvents="none"
          style={[styles.container, { opacity, transform: [{ translateY }] }]}
        >
          <View style={[styles.accent, { backgroundColor: ACCENT[toast.type] }]} />
          {Icon && <Icon size={18} color={ACCENT[toast.type]} />}
          <Text style={styles.text} numberOfLines={2}>
            {toast.message}
          </Text>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 48,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingLeft: 0,
    paddingRight: 18,
    paddingVertical: 12,
    borderRadius: 16,
    maxWidth: "88%",
    backgroundColor: "#1c1c1e",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  accent: {
    width: 4,
    alignSelf: "stretch",
    marginRight: 12,
  },
  text: {
    color: "#f5f5f5",
    fontSize: 14,
    fontWeight: "600",
    flexShrink: 1,
  },
});
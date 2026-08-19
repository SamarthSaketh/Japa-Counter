import { getApp } from "@react-native-firebase/app";
import { ConfirmationResult, getAuth, signInWithPhoneNumber } from "@react-native-firebase/auth";
import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, TextInput, View } from "react-native";

const authInstance = getAuth(getApp());

export default function Login() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function sendOtp() {
    const trimmed = phone.trim();
    if (!trimmed.startsWith("+")) {
      Alert.alert("Invalid number", "Include country code, e.g. +91XXXXXXXXXX");
      return;
    }
    setLoading(true);
    try {
      const result = await signInWithPhoneNumber(authInstance, trimmed);
      setConfirmation(result);
    } catch (err: any) {
      Alert.alert("Failed to send OTP", err.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp() {
    if (!confirmation) return;
    setLoading(true);
    try {
      await confirmation.confirm(otp.trim());
    } catch (err: any) {
      Alert.alert("Invalid OTP", err.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 bg-black px-6 justify-center">
      <Text className="text-white text-3xl font-bold mb-8 text-center">Japa Counter</Text>

      {!confirmation ? (
        <>
          <Text className="text-gray-400 mb-2">Phone Number</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="+91XXXXXXXXXX"
            placeholderTextColor="#666"
            keyboardType="phone-pad"
            className="bg-neutral-900 text-white rounded-lg p-4 mb-4 text-base"
          />
          <Pressable onPress={sendOtp} disabled={loading} className="bg-orange-600 rounded-xl p-4 items-center">
            {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-semibold text-base">Send OTP</Text>}
          </Pressable>
        </>
      ) : (
        <>
          <Text className="text-gray-400 mb-2">Enter OTP</Text>
          <TextInput
            value={otp}
            onChangeText={setOtp}
            placeholder="6-digit code"
            placeholderTextColor="#666"
            keyboardType="number-pad"
            maxLength={6}
            className="bg-neutral-900 text-white rounded-lg p-4 mb-4 text-base"
          />
          <Pressable onPress={verifyOtp} disabled={loading} className="bg-orange-600 rounded-xl p-4 items-center">
            {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-semibold text-base">Verify & Continue</Text>}
          </Pressable>
          <Pressable onPress={() => setConfirmation(null)} className="mt-4 items-center">
            <Text className="text-gray-500 text-sm">Change phone number</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { Bell, Camera, Sparkles, Target as TargetIcon } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import uuid from "react-native-uuid";
import { saveProfile } from "../../lib/storage";
import { useToast } from "../../lib/toast-context";
import { MantraProfile } from "../../lib/types";

const AUDIO_OPTIONS: { value: MantraProfile["audioMode"]; label: string }[] = [
  { value: "voice", label: "Voice" },
  { value: "bell", label: "Bell" },
  { value: "both", label: "Both" },
  { value: "off", label: "Off" },
];

const MILESTONE_PRESETS = [10, 25, 50, 108];
const TARGET_PRESETS = [11, 32, 64, 108, 1008];
const MIN_TARGET = 1;

const ICON_OPTIONS = ["🕉️", "🙏", "📿", "🔱", "🪷", "✨", "🐚", "🔔"];

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <View className="flex-row items-center gap-2 mb-3">
      {icon}
      <Text className="text-white text-base font-semibold">{title}</Text>
    </View>
  );
}

export default function NewProfile() {
  const router = useRouter();
  const toast = useToast();
  const insets = useSafeAreaInsets();

  const [name, setName] = useState("");
  const [icon, setIcon] = useState(ICON_OPTIONS[0]);
  const [imageUri, setImageUri] = useState<string | null>(null);

  const [target, setTarget] = useState(108);
  const [targetText, setTargetText] = useState("108");

  const [milestonesEnabled, setMilestonesEnabled] = useState(true);
  const [audioMode, setAudioMode] = useState<MantraProfile["audioMode"]>("voice");
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [milestoneInterval, setMilestoneInterval] = useState(50);

  const [saving, setSaving] = useState(false);

  function syncTargetFromText(text: string) {
    setTargetText(text);
    const parsed = parseInt(text, 10);
    if (Number.isFinite(parsed) && parsed >= MIN_TARGET) {
      setTarget(parsed);
    }
  }

  function applyTarget(next: number) {
    const clamped = Math.max(MIN_TARGET, next);
    setTarget(clamped);
    setTargetText(String(clamped));
  }

  async function pickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      toast.warning("Allow photo access to add a profile image.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  }

  function removeImage() {
    setImageUri(null);
  }

  async function handleCreate() {
    if (!name.trim()) {
      toast.error("Please enter a name for this mantra.");
      return;
    }

    const parsedTarget = parseInt(targetText, 10);
    const validTarget =
      Number.isFinite(parsedTarget) && parsedTarget >= MIN_TARGET ? parsedTarget : null;
    if (!validTarget) {
      toast.warning("Target must be a whole number of 1 or more.");
      return;
    }

    setSaving(true);
    try {
      const profile: MantraProfile = {
        id: uuid.v4() as string,
        name: name.trim(),
        icon,
        imageUri: imageUri ?? null,
        defaultTarget: validTarget,
        milestoneInterval: milestonesEnabled ? milestoneInterval : 0,
        milestonePhrase: "sankhya completed",
        audioMode: milestonesEnabled ? audioMode : "off",
        vibrationEnabled: milestonesEnabled ? vibrationEnabled : false,
        ambienceEnabled: false,
        createdAt: Date.now(),
        archived: false,
      };

      await saveProfile(profile);
      toast.success(`${profile.name} created`);
      setTimeout(() => router.back(), 400); // let toast register before unmount
    } catch {
      setSaving(false);
      toast.error("Couldn't save profile. Try again.");
    }
  }

  return (
    <ScrollView
      className="flex-1 bg-black px-4 pt-16"
      contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
    >
      <Text className="text-white text-2xl font-bold mb-6">New Profile</Text>

      {/* Photo + icon */}
      <View className="bg-neutral-950 rounded-2xl p-4 mb-4">
        <SectionHeader icon={<Camera size={16} color="#9ca3af" />} title="Appearance" />

        <View className="items-center mb-4">
          <Pressable onPress={pickImage}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} className="w-24 h-24 rounded-full" />
            ) : (
              <View className="w-24 h-24 rounded-full bg-neutral-800 items-center justify-center">
                <Text className="text-3xl">{icon}</Text>
                <Text className="text-gray-500 text-[10px] mt-1">Add Photo</Text>
              </View>
            )}
          </Pressable>

          {imageUri && (
            <View className="flex-row gap-4 mt-3">
              <Pressable onPress={pickImage}>
                <Text className="text-orange-500 text-xs font-medium">Change Photo</Text>
              </Pressable>
              <Pressable onPress={removeImage}>
                <Text className="text-gray-500 text-xs font-medium">Remove Photo</Text>
              </Pressable>
            </View>
          )}
        </View>

        {!imageUri && (
          <>
            <Text className="text-gray-500 text-xs mb-2">Or pick an icon</Text>
            <View className="flex-row flex-wrap gap-2">
              {ICON_OPTIONS.map((opt) => (
                <Pressable
                  key={opt}
                  onPress={() => setIcon(opt)}
                  className={`w-11 h-11 rounded-lg items-center justify-center ${
                    icon === opt ? "bg-orange-600" : "bg-neutral-900"
                  }`}
                >
                  <Text className="text-lg">{opt}</Text>
                </Pressable>
              ))}
            </View>
          </>
        )}
      </View>

      {/* Name */}
      <View className="bg-neutral-950 rounded-2xl p-4 mb-4">
        <SectionHeader icon={<Sparkles size={16} color="#9ca3af" />} title="Mantra Name" />
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="e.g. Gayatri Mantra"
          placeholderTextColor="#666"
          maxLength={40}
          className="bg-neutral-900 text-white rounded-lg p-3"
        />
        <Text className="text-gray-600 text-[10px] mt-1 text-right">{name.length}/40</Text>
      </View>

      {/* Target */}
      <View className="bg-neutral-950 rounded-2xl p-4 mb-4">
        <SectionHeader icon={<TargetIcon size={16} color="#9ca3af" />} title="Target per Session" />

        <View className="flex-row items-center justify-center gap-4 mb-4">
          <Pressable
            onPress={() => applyTarget(target - 1)}
            className="bg-neutral-900 rounded-lg w-12 h-12 items-center justify-center"
          >
            <Text className="text-white text-xl">−</Text>
          </Pressable>

          <TextInput
            value={targetText}
            onChangeText={syncTargetFromText}
            keyboardType="number-pad"
            className="text-white text-2xl font-bold text-center w-24"
          />

          <Pressable
            onPress={() => applyTarget(target + 1)}
            className="bg-neutral-900 rounded-lg w-12 h-12 items-center justify-center"
          >
            <Text className="text-white text-xl">+</Text>
          </Pressable>
        </View>

        <View className="flex-row gap-2">
          {TARGET_PRESETS.map((val) => (
            <Pressable
              key={val}
              onPress={() => applyTarget(val)}
              className={`flex-1 rounded-lg p-3 items-center ${
                target === val ? "bg-orange-600" : "bg-neutral-900"
              }`}
            >
              <Text className="text-white text-xs font-medium">{val}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Milestone settings */}
      <View className="bg-neutral-950 rounded-2xl p-4 mb-8">
        <View className="flex-row items-center justify-between mb-1">
          <View className="flex-row items-center gap-2">
            <Bell size={16} color="#9ca3af" />
            <Text className="text-white text-base font-semibold">Milestone Alerts</Text>
          </View>
          <Switch
            value={milestonesEnabled}
            onValueChange={setMilestonesEnabled}
            trackColor={{ true: "#ea580c" }}
          />
        </View>

        {milestonesEnabled ? (
          <View className="mt-4">
            <Text className="text-gray-400 mb-2">Sound</Text>
            <View className="flex-row gap-2 mb-6">
              {AUDIO_OPTIONS.map((opt) => (
                <Pressable
                  key={opt.value}
                  onPress={() => setAudioMode(opt.value)}
                  className={`flex-1 rounded-lg p-3 items-center ${
                    audioMode === opt.value ? "bg-orange-600" : "bg-neutral-900"
                  }`}
                >
                  <Text className="text-white text-xs font-medium">{opt.label}</Text>
                </Pressable>
              ))}
            </View>

            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-gray-400">Vibration</Text>
              <Switch
                value={vibrationEnabled}
                onValueChange={setVibrationEnabled}
                trackColor={{ true: "#ea580c" }}
              />
            </View>

            <Text className="text-gray-400 mb-2">Milestone every</Text>
            <View className="flex-row gap-2">
              {MILESTONE_PRESETS.map((val) => (
                <Pressable
                  key={val}
                  onPress={() => setMilestoneInterval(val)}
                  className={`flex-1 rounded-lg p-3 items-center ${
                    milestoneInterval === val ? "bg-orange-600" : "bg-neutral-900"
                  }`}
                >
                  <Text className="text-white text-xs font-medium">{val}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : (
          <Text className="text-gray-600 text-xs mt-2">
            Off — no sound or vibration during sessions.
          </Text>
        )}
      </View>

      <Pressable
        onPress={handleCreate}
        disabled={saving}
        className={`rounded-xl p-4 items-center ${saving ? "bg-orange-800" : "bg-orange-600"}`}
      >
        {saving ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-semibold text-base">Create Profile</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}
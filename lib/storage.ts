import AsyncStorage from '@react-native-async-storage/async-storage';
import { MantraProfile, SessionLog, UserAccount } from './types';

const PROFILES_KEY = 'japa_profiles';
const SESSIONS_KEY = 'japa_sessions';

export async function getProfiles(): Promise<MantraProfile[]> {
  const raw = await AsyncStorage.getItem(PROFILES_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function getProfileById(id: string): Promise<MantraProfile | undefined> {
  const profiles = await getProfiles();
  return profiles.find((p) => p.id === id);
}

export async function saveProfile(profile: MantraProfile): Promise<void> {
  const profiles = await getProfiles();
  const index = profiles.findIndex((p) => p.id === profile.id);
  if (index >= 0) profiles[index] = profile;
  else profiles.push(profile);
  await AsyncStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
}

export async function archiveProfile(id: string): Promise<void> {
  const profiles = await getProfiles();
  const index = profiles.findIndex((p) => p.id === id);
  if (index >= 0) {
    profiles[index].archived = true;
    await AsyncStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
  }
}

export async function getSessions(): Promise<SessionLog[]> {
  const raw = await AsyncStorage.getItem(SESSIONS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function saveSession(log: SessionLog): Promise<void> {
  const sessions = await getSessions();
  sessions.unshift(log);
  await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

const VIEW_MODE_KEY = 'japa_view_mode';

export async function getViewMode(): Promise<'list' | 'grid'> {
  const raw = await AsyncStorage.getItem(VIEW_MODE_KEY);
  return raw === 'grid' ? 'grid' : 'list';
}

export async function setViewMode(mode: 'list' | 'grid'): Promise<void> {
  await AsyncStorage.setItem(VIEW_MODE_KEY, mode);
}
const USER_ACCOUNT_PREFIX = 'japa_user_account_';

export async function getUserAccount(uid: string): Promise<UserAccount | null> {
  const raw = await AsyncStorage.getItem(USER_ACCOUNT_PREFIX + uid);
  return raw ? JSON.parse(raw) : null;
}

export async function saveUserAccount(account: UserAccount): Promise<void> {
  await AsyncStorage.setItem(USER_ACCOUNT_PREFIX + account.uid, JSON.stringify(account));
}
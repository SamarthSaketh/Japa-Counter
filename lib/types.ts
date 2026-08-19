export interface MantraProfile {
  id: string;
  name: string;
  icon: string;
  imageUri?: string | null;
  defaultTarget: number;
  milestoneInterval: number;
  milestonePhrase: string;
  audioMode: 'voice' | 'bell' | 'both' | 'off';
  vibrationEnabled: boolean;
  ambienceEnabled: boolean;
  createdAt: number;
  archived: boolean;
}

export interface SessionLog {
  id: string;
  profileId: string;
  date: string;
  period: 'morning' | 'afternoon' | 'evening';
  count: number;
  target: number;
  completed: boolean;
  startedAt: number;
  completedAt: number;
  durationSec: number;
}

export interface UserAccount {
  uid: string;
  phoneNumber: string;
  displayName: string;
  photoUri?: string;
  createdAt: number;
}
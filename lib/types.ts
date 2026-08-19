export interface MantraProfile {
  id: string;
  name: string;
  icon: string;
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
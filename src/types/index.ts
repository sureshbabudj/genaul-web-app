export interface VaultSession {
  access_token: string;
  expires_at: number; // Absolute timestamp
  scope: string;
}

export interface VaultAccountInfo {
  email: string;
  name: string;
  avatarUrl?: string;
}

export type Grade = 1 | 2 | 3 | 4; // 1: Very Hard, 2: Hard, 3: Good, 4: Easy

export interface Echo {
  id: string;
  hallId: string;
  front: string;
  back: string;
  stability: number; // Days
  difficulty: number; // 1-10
  lastReview: number; // Timestamp
  nextReview: number; // Timestamp
  reps: number;
  updatedAt: ISODateTime;
}

export type ISODateTime = string;

export interface Stats {
  lastUpdated: ISODateTime;
  cardsReviewed?: number;
  retentionRate?: number;
  [k: string]: number | string | undefined;
}

export interface Reminder {
  id: string;
  message: string;
  at: ISODateTime;
  enabled: boolean;
  updatedAt: ISODateTime;
}

export interface Streak {
  current: number;
  longest: number;
  updatedAt: ISODateTime;
}

export interface Hall {
  id: string;
  name: string;
  echoIds: string[];
  createdAt?: ISODateTime;
  updatedAt: ISODateTime;
}

export interface GenaulData {
  halls: Hall[];
  echoes: Echo[];
  stats: Stats;
  reminders: Reminder[];
  streak: Streak;
  activeHallId: string | null;
}

export type ProviderName = "indexeddb" | "google-drive" | "cloudkit";

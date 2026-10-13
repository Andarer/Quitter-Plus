/**
 * Quitter Plus Types
 * Author: Andárer
 */

export type TrackerCategory = 
  | 'smoking' 
  | 'vaping' 
  | 'alcohol' 
  | 'drugs' 
  | 'gambling' 
  | 'sugar' 
  | 'caffeine' 
  | 'shopping' 
  | 'gaming' 
  | 'social_media' 
  | 'custom';

export interface ResetRecord {
  id: string;
  date: string; // ISO
  reason: string;
  notes?: string;
  streakDays: number;
}

export interface Tracker {
  id: string;
  name: string;
  category: TrackerCategory;
  iconName: string;
  startDate: string; // ISO date string
  costPerDay: number;
  currency: string;
  itemsPerDay: number;
  itemUnitName: string; // e.g. "сигарет", "порций", "стиков", "чашек"
  timeSavedPerItemMin: number; // minutes saved per item avoided
  motivationQuote?: string;
  color: string;
  resets: ResetRecord[];
}

export type CravingTrigger = 
  | 'Стресс' 
  | 'Скука' 
  | 'Компания / Социальное окружение' 
  | 'Привычный ритуал' 
  | 'Усталость' 
  | 'Злость' 
  | 'Одиночество' 
  | 'Другое';

export interface CravingLog {
  id: string;
  trackerId: string;
  timestamp: string; // ISO
  intensity: number; // 1 - 10
  trigger: CravingTrigger;
  copingStrategy: string;
  notes?: string;
  overcame: boolean;
}

export type HabitCategory = 'health' | 'mind' | 'sport' | 'focus' | 'selfcare';

export interface Habit {
  id: string;
  name: string;
  category: HabitCategory;
  icon: string;
  color: string;
  targetPerWeek: number;
  // completions map: 'YYYY-MM-DD' -> boolean
  completions: Record<string, boolean>;
  createdAt: string;
}

export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'streak' | 'habits' | 'cravings' | 'savings' | 'zen';
  icon: string;
  tier: AchievementTier;
  targetValue: number;
  unlockedAt?: string; // ISO when unlocked
}

export interface HealthMilestone {
  id: string;
  hours: number;
  title: string;
  description: string;
  category: TrackerCategory | 'general';
}

export type WidgetId = 
  | 'sober_clock' 
  | 'quick_metrics' 
  | 'urge_sos' 
  | 'habits_daily' 
  | 'quote_daily' 
  | 'health_next' 
  | 'craving_pulse' 
  | 'heatmap_30d';

export interface WidgetSettings {
  id: WidgetId;
  enabled: boolean;
  order: number;
}

export type AppTheme = 'system' | 'dark' | 'oled' | 'light' | 'emerald' | 'cyber' | 'sunset';

export interface UserPreferences {
  theme: AppTheme;
  activeTrackerId: string;
  enableSound: boolean;
  dailyReminderTime?: string;
  widgets: WidgetSettings[];
}

export interface SyncDataPayload {
  version: string;
  exportedAt: string;
  author: string;
  trackers: Tracker[];
  cravings: CravingLog[];
  habits: Habit[];
  unlockedAchievements: string[]; // IDs
  preferences: UserPreferences;
}

export interface ChangelogRelease {
  version: string;
  date: string;
  title: string;
  badge?: string;
  commits: {
    type: 'feat' | 'fix' | 'perf' | 'ci' | 'docs';
    text: string;
  }[];
}

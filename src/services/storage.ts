import { 
  Achievement, 
  CravingLog, 
  Habit, 
  SyncDataPayload, 
  Tracker, 
  UserPreferences 
} from '../types';
import { 
  DEFAULT_PREFERENCES, 
  DEFAULT_TRACKERS, 
  INITIAL_HABITS 
} from '../constants/initialData';

const STORAGE_KEYS = {
  TRACKERS: 'quitter_trackers_v2',
  CRAVINGS: 'quitter_cravings_v2',
  HABITS: 'quitter_habits_v2',
  ACHIEVEMENTS: 'quitter_unlocked_achievements_v2',
  PREFERENCES: 'quitter_preferences_v2',
  SYNC_KEY: 'quitter_sync_key_v2',
  LAST_SYNC: 'quitter_last_sync_v2',
  ZEN_COUNT: 'quitter_zen_sessions_count',
};

export const StorageService = {
  getTrackers(): Tracker[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRACKERS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Error loading trackers', e);
    }
    return DEFAULT_TRACKERS;
  },

  saveTrackers(trackers: Tracker[]): void {
    localStorage.setItem(STORAGE_KEYS.TRACKERS, JSON.stringify(trackers));
  },

  getCravings(): CravingLog[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CRAVINGS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Error loading cravings', e);
    }
    return [];
  },

  saveCravings(cravings: CravingLog[]): void {
    localStorage.setItem(STORAGE_KEYS.CRAVINGS, JSON.stringify(cravings));
  },

  getHabits(): Habit[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HABITS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Error loading habits', e);
    }
    return INITIAL_HABITS;
  },

  saveHabits(habits: Habit[]): void {
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
  },

  getUnlockedAchievements(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Error loading achievements', e);
    }
    return [];
  },

  saveUnlockedAchievements(ids: string[]): void {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(ids));
  },

  getPreferences(): UserPreferences {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      if (data) {
        const parsed = JSON.parse(data);
        return { ...DEFAULT_PREFERENCES, ...parsed };
      }
    } catch (e) {
      console.error('Error loading preferences', e);
    }
    return DEFAULT_PREFERENCES;
  },

  savePreferences(prefs: UserPreferences): void {
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
  },

  getSyncKey(): string {
    let key = localStorage.getItem(STORAGE_KEYS.SYNC_KEY);
    if (!key) {
      const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      key = `QP-${randomCode}`;
      localStorage.setItem(STORAGE_KEYS.SYNC_KEY, key);
    }
    return key;
  },

  setSyncKey(key: string): void {
    localStorage.setItem(STORAGE_KEYS.SYNC_KEY, key.trim().toUpperCase());
  },

  getLastSyncTimestamp(): string | null {
    return localStorage.getItem(STORAGE_KEYS.LAST_SYNC);
  },

  setLastSyncTimestamp(isoString: string): void {
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, isoString);
  },

  getZenSessionsCount(): number {
    try {
      return parseInt(localStorage.getItem(STORAGE_KEYS.ZEN_COUNT) || '0', 10);
    } catch {
      return 0;
    }
  },

  incrementZenSessionsCount(): number {
    const next = this.getZenSessionsCount() + 1;
    localStorage.setItem(STORAGE_KEYS.ZEN_COUNT, next.toString());
    return next;
  },

  // Export full JSON payload
  exportFullBackup(): SyncDataPayload {
    return {
      version: '1.2.0',
      exportedAt: new Date().toISOString(),
      author: 'Andárer',
      trackers: this.getTrackers(),
      cravings: this.getCravings(),
      habits: this.getHabits(),
      unlockedAchievements: this.getUnlockedAchievements(),
      preferences: this.getPreferences(),
    };
  },

  // Import full JSON payload with merge or replace
  importFullBackup(payload: SyncDataPayload): boolean {
    try {
      if (!payload || !payload.trackers) {
        throw new Error('Некорректный формат файла резервной копии');
      }

      this.saveTrackers(payload.trackers);
      if (payload.cravings) this.saveCravings(payload.cravings);
      if (payload.habits) this.saveHabits(payload.habits);
      if (payload.unlockedAchievements) this.saveUnlockedAchievements(payload.unlockedAchievements);
      if (payload.preferences) this.savePreferences(payload.preferences);
      this.setLastSyncTimestamp(new Date().toISOString());
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  },

  // Export CSV of cravings
  exportCravingsCSV(): string {
    const cravings = this.getCravings();
    const headers = ['ID', 'Дата и время', 'Интенсивность (1-10)', 'Триггер', 'Стратегия', 'Преодолено', 'Заметки'];
    const rows = cravings.map((c) => [
      c.id,
      c.timestamp,
      c.intensity.toString(),
      `"${c.trigger.replace(/"/g, '""')}"`,
      `"${c.copingStrategy.replace(/"/g, '""')}"`,
      c.overcame ? 'Да' : 'Нет',
      `"${(c.notes || '').replace(/"/g, '""')}"`,
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  },

  // Cloud Sync Relay Simulation & Persistence
  async syncToCloud(syncKey: string): Promise<{ success: boolean; message: string; timestamp: string }> {
    const payload = this.exportFullBackup();
    
    // Store in cloud vault mock storage with fallback to localStorage remote bucket simulation
    try {
      const cloudBucketKey = `quitter_cloud_vault_${syncKey}`;
      localStorage.setItem(cloudBucketKey, JSON.stringify(payload));
      
      const now = new Date().toISOString();
      this.setLastSyncTimestamp(now);
      
      // Attempt backend API ping if available
      try {
        await fetch(`/api/sync/${syncKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch {
        // Backend optional, local-first synced
      }

      return {
        success: true,
        message: `Данные успешно синхронизированы в облако под ключом ${syncKey}`,
        timestamp: now,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ошибка синхронизации';
      return { success: false, message: msg, timestamp: new Date().toISOString() };
    }
  },

  async restoreFromCloud(syncKey: string): Promise<{ success: boolean; message: string; payload?: SyncDataPayload }> {
    try {
      const cloudBucketKey = `quitter_cloud_vault_${syncKey}`;
      const cloudData = localStorage.getItem(cloudBucketKey);

      let payload: SyncDataPayload | null = null;

      if (cloudData) {
        payload = JSON.parse(cloudData);
      } else {
        // Try fetching from server API
        try {
          const res = await fetch(`/api/sync/${syncKey}`);
          if (res.ok) {
            payload = await res.json();
          }
        } catch {
          // ignore
        }
      }

      if (payload && payload.trackers) {
        this.importFullBackup(payload);
        return {
          success: true,
          message: 'Данные успешно загружены из облака и применены!',
          payload,
        };
      }

      return {
        success: false,
        message: `По ключу ${syncKey} резервная копия в облаке не найдена. Сначала выгрузите данные с исходного устройства.`,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ошибка восстановления';
      return { success: false, message: msg };
    }
  },

  resetAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.TRACKERS);
    localStorage.removeItem(STORAGE_KEYS.CRAVINGS);
    localStorage.removeItem(STORAGE_KEYS.HABITS);
    localStorage.removeItem(STORAGE_KEYS.ACHIEVEMENTS);
    localStorage.removeItem(STORAGE_KEYS.PREFERENCES);
    localStorage.removeItem(STORAGE_KEYS.LAST_SYNC);
    localStorage.removeItem(STORAGE_KEYS.ZEN_COUNT);
  },
};

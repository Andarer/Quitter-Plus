import React, { useState, useEffect, useCallback } from 'react';
import { 
  Achievement, 
  AppTheme, 
  CravingLog, 
  CravingTrigger, 
  Habit, 
  Tracker, 
  UserPreferences, 
  WidgetSettings 
} from './types';
import { StorageService } from './services/storage';
import { ACHIEVEMENTS } from './constants/initialData';
import { fireAchievementConfetti, fireCelebrationConfetti } from './services/confetti';
import { soundService } from './services/audio';

import { Header } from './components/Header';
import { Navigation, TabId } from './components/Navigation';
import { SoberTimerCard } from './components/SoberTimerCard';
import { WidgetsBoard } from './components/WidgetsBoard';
import { HabitsTracker } from './components/HabitsTracker';
import { AchievementsView } from './components/AchievementsView';
import { HelpCenter } from './components/HelpCenter';
import { CiCdReleaseCenter } from './components/CiCdReleaseCenter';
import { UrgeSurfingModal } from './components/UrgeSurfingModal';
import { HealthMilestonesModal } from './components/HealthMilestonesModal';
import { SyncModal } from './components/SyncModal';
import { AddEditTrackerModal } from './components/AddEditTrackerModal';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import { CravingLogModal } from './components/CravingLogModal';

export default function App() {
  // Load initial persistent state
  const [trackers, setTrackers] = useState<Tracker[]>(() => StorageService.getTrackers());
  const [activeTrackerId, setActiveTrackerId] = useState<string>(() => {
    const prefs = StorageService.getPreferences();
    return prefs.activeTrackerId || trackers[0]?.id || 'tracker_nicotine';
  });
  const [cravings, setCravings] = useState<CravingLog[]>(() => StorageService.getCravings());
  const [habits, setHabits] = useState<Habit[]>(() => StorageService.getHabits());
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>(() => 
    StorageService.getUnlockedAchievements()
  );
  const [preferences, setPreferences] = useState<UserPreferences>(() => StorageService.getPreferences());
  const [lastSynced, setLastSynced] = useState<string | null>(() => StorageService.getLastSyncTimestamp());

  // Navigation tab
  const [currentTab, setCurrentTab] = useState<TabId>('dashboard');

  // Modals state
  const [isUrgeSosOpen, setIsUrgeSosOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isNewTrackerModalOpen, setIsNewTrackerModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isMilestonesModalOpen, setIsMilestonesModalOpen] = useState(false);
  const [isCravingModalOpen, setIsCravingModalOpen] = useState(false);

  // New Achievement Toast
  const [recentlyUnlockedToast, setRecentlyUnlockedToast] = useState<Achievement | null>(null);

  const activeTracker = trackers.find((t) => t.id === activeTrackerId) || trackers[0];

  // System theme preference detection (Dark / Light)
  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      setSystemPrefersDark(e.matches);
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const resolvedTheme: AppTheme = React.useMemo(() => {
    if (preferences.theme === 'system') {
      return systemPrefersDark ? 'dark' : 'light';
    }
    return preferences.theme;
  }, [preferences.theme, systemPrefersDark]);

  // Theme application and dynamic meta theme-color update for Android / iOS
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-system', 'theme-dark', 'theme-oled', 'theme-light', 'theme-emerald', 'theme-cyber', 'theme-sunset');
    root.classList.add(`theme-${resolvedTheme}`);
    if (resolvedTheme === 'light') {
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
    }

    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      const colors: Record<string, string> = {
        dark: '#090d16',
        oled: '#000000',
        light: '#f5f5f4',
        emerald: '#031d16',
        cyber: '#090b14',
        sunset: '#150d11',
      };
      metaThemeColor.setAttribute('content', colors[resolvedTheme] || '#090d16');
    }
  }, [resolvedTheme]);

  // Save trackers when updated
  const updateTrackers = (next: Tracker[]) => {
    setTrackers(next);
    StorageService.saveTrackers(next);
  };

  // Save cravings when updated
  const updateCravings = (next: CravingLog[]) => {
    setCravings(next);
    StorageService.saveCravings(next);
  };

  // Save habits when updated
  const updateHabits = (next: Habit[]) => {
    setHabits(next);
    StorageService.saveHabits(next);
  };

  // Save preferences
  const updatePreferences = (next: Partial<UserPreferences>) => {
    const merged = { ...preferences, ...next };
    setPreferences(merged);
    StorageService.savePreferences(merged);
  };

  // Total completed habits count
  const totalHabitsCompletedCount = habits.reduce((acc, h) => {
    return acc + Object.values(h.completions).filter(Boolean).length;
  }, 0);

  // Check achievements unlock conditions
  const checkAchievements = useCallback(() => {
    if (!activeTracker) return;

    const elapsedHours = (Date.now() - new Date(activeTracker.startDate).getTime()) / (1000 * 60 * 60);
    const moneySaved = Math.max(0, (elapsedHours / 24) * (activeTracker.costPerDay || 0));
    const cravingsOvercome = cravings.filter((c) => c.overcame).length;
    const zenSessions = StorageService.getZenSessionsCount();

    const currentUnlocked = new Set(unlockedAchievements);
    let newlyFound: Achievement | null = null;

    ACHIEVEMENTS.forEach((ach) => {
      if (currentUnlocked.has(ach.id)) return;

      let qualified = false;
      if (ach.category === 'streak' && elapsedHours >= ach.targetValue) qualified = true;
      if (ach.category === 'cravings' && cravingsOvercome >= ach.targetValue) qualified = true;
      if (ach.category === 'savings' && moneySaved >= ach.targetValue) qualified = true;
      if (ach.category === 'habits' && totalHabitsCompletedCount >= ach.targetValue) qualified = true;
      if (ach.category === 'zen' && zenSessions >= ach.targetValue) qualified = true;

      if (qualified) {
        currentUnlocked.add(ach.id);
        if (!newlyFound) newlyFound = ach;
      }
    });

    if (newlyFound) {
      const updatedArray = Array.from(currentUnlocked);
      setUnlockedAchievements(updatedArray);
      StorageService.saveUnlockedAchievements(updatedArray);
      setRecentlyUnlockedToast(newlyFound);
      fireAchievementConfetti();
      soundService.playAchievementFanfare();

      setTimeout(() => {
        setRecentlyUnlockedToast(null);
      }, 5000);
    }
  }, [activeTracker, cravings, totalHabitsCompletedCount, unlockedAchievements]);

  useEffect(() => {
    checkAchievements();
  }, [checkAchievements]);

  // Habit toggle handler
  const handleToggleHabitDate = (habitId: string, dateKey: string) => {
    const updated = habits.map((h) => {
      if (h.id === habitId) {
        const nextComp = { ...h.completions, [dateKey]: !h.completions[dateKey] };
        return { ...h, completions: nextComp };
      }
      return h;
    });
    updateHabits(updated);
    if (!habits.find((h) => h.id === habitId)?.completions[dateKey]) {
      fireCelebrationConfetti();
    }
  };

  const handleToggleHabitToday = (habitId: string) => {
    const today = new Date().toISOString().split('T')[0];
    handleToggleHabitDate(habitId, today);
  };

  const handleAddHabit = (data: Omit<Habit, 'id' | 'createdAt' | 'completions'>) => {
    const newHabit: Habit = {
      ...data,
      id: `habit_${Date.now()}`,
      createdAt: new Date().toISOString(),
      completions: {},
    };
    updateHabits([...habits, newHabit]);
  };

  const handleDeleteHabit = (habitId: string) => {
    updateHabits(habits.filter((h) => h.id !== habitId));
  };

  // Craving save handler
  const handleSaveCraving = (data: {
    intensity: number;
    trigger: CravingTrigger;
    copingStrategy: string;
    notes: string;
    overcame: boolean;
  }) => {
    if (!activeTracker) return;
    const newEntry: CravingLog = {
      id: `crav_${Date.now()}`,
      trackerId: activeTracker.id,
      timestamp: new Date().toISOString(),
      intensity: data.intensity,
      trigger: data.trigger,
      copingStrategy: data.copingStrategy,
      notes: data.notes,
      overcame: data.overcame,
    };
    updateCravings([...cravings, newEntry]);
    StorageService.incrementZenSessionsCount();
  };

  // Reset tracker handler
  const handleConfirmReset = (reason: string, notes: string) => {
    if (!activeTracker) return;
    const elapsedDays = Math.floor(
      (Date.now() - new Date(activeTracker.startDate).getTime()) / (1000 * 60 * 60 * 24)
    );

    const resetRecord = {
      id: `reset_${Date.now()}`,
      date: new Date().toISOString(),
      reason,
      notes,
      streakDays: elapsedDays,
    };

    const updatedTrackers = trackers.map((t) => {
      if (t.id === activeTracker.id) {
        return {
          ...t,
          startDate: new Date().toISOString(),
          resets: [resetRecord, ...(t.resets || [])],
        };
      }
      return t;
    });

    updateTrackers(updatedTrackers);
  };

  // Create new tracker handler
  const handleCreateTracker = (data: Omit<Tracker, 'id' | 'resets'>) => {
    const newId = `tracker_${Date.now()}`;
    const newTracker: Tracker = {
      ...data,
      id: newId,
      resets: [],
    };
    const next = [...trackers, newTracker];
    updateTrackers(next);
    setActiveTrackerId(newId);
    updatePreferences({ activeTrackerId: newId });
  };

  // Reload data from cloud/file
  const handleReloadAllData = () => {
    setTrackers(StorageService.getTrackers());
    setCravings(StorageService.getCravings());
    setHabits(StorageService.getHabits());
    setUnlockedAchievements(StorageService.getUnlockedAchievements());
    setPreferences(StorageService.getPreferences());
    setLastSynced(StorageService.getLastSyncTimestamp());
  };

  // Theme root styles helper
  const getThemeBackground = (theme: AppTheme) => {
    switch (theme) {
      case 'oled':
        return 'bg-black text-neutral-100';
      case 'light':
        return 'bg-stone-100 text-stone-900';
      case 'emerald':
        return 'bg-[#031d16] text-emerald-100';
      case 'cyber':
        return 'bg-[#090b14] text-cyan-100';
      case 'sunset':
        return 'bg-[#150d11] text-amber-100';
      case 'dark':
      default:
        return 'bg-slate-950 text-slate-100';
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 flex flex-col justify-between ${getThemeBackground(resolvedTheme)}`}>
      
      {/* Top Header */}
      <div>
        <Header
          trackers={trackers}
          activeTracker={activeTracker}
          onSelectTracker={(id) => {
            setActiveTrackerId(id);
            updatePreferences({ activeTrackerId: id });
          }}
          onOpenNewTrackerModal={() => setIsNewTrackerModalOpen(true)}
          theme={preferences.theme}
          resolvedTheme={resolvedTheme}
          systemPrefersDark={systemPrefersDark}
          onChangeTheme={(th) => updatePreferences({ theme: th })}
          onOpenSyncModal={() => setIsSyncModalOpen(true)}
          lastSynced={lastSynced}
          onOpenUrgeSos={() => setIsUrgeSosOpen(true)}
        />

        {/* Desktop Navigation Tabs */}
        <Navigation
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          unlockedCount={unlockedAchievements.length}
          totalAchievements={ACHIEVEMENTS.length}
        />

        {/* Main Content Viewport */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 sm:pb-12 w-full">
          {currentTab === 'dashboard' && activeTracker && (
            <div className="space-y-6">
              {/* Hero Sober Live Counter Card */}
              <SoberTimerCard
                tracker={activeTracker}
                onOpenResetModal={() => setIsResetModalOpen(true)}
                onOpenMilestonesModal={() => setIsMilestonesModalOpen(true)}
                onOpenCravingModal={() => setIsCravingModalOpen(true)}
              />

              {/* Customizable Dashboard Widgets */}
              <WidgetsBoard
                tracker={activeTracker}
                habits={habits}
                cravings={cravings}
                widgets={preferences.widgets}
                onUpdateWidgets={(w) => updatePreferences({ widgets: w })}
                onToggleHabitToday={handleToggleHabitToday}
                onOpenUrgeSos={() => setIsUrgeSosOpen(true)}
                onOpenMilestones={() => setIsMilestonesModalOpen(true)}
                onOpenCravingModal={() => setIsCravingModalOpen(true)}
                onNavigateToHabits={() => setCurrentTab('habits')}
              />
            </div>
          )}

          {currentTab === 'habits' && (
            <HabitsTracker
              habits={habits}
              onToggleHabitDate={handleToggleHabitDate}
              onAddHabit={handleAddHabit}
              onDeleteHabit={handleDeleteHabit}
            />
          )}

          {currentTab === 'achievements' && (
            <AchievementsView
              tracker={activeTracker}
              unlockedIds={unlockedAchievements}
              cravingsCount={cravings.filter((c) => c.overcame).length}
              habitsCompletedCount={totalHabitsCompletedCount}
              zenCount={StorageService.getZenSessionsCount()}
            />
          )}

          {currentTab === 'help' && (
            <HelpCenter />
          )}

          {currentTab === 'cicd' && (
            <CiCdReleaseCenter />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-950/70 py-6 px-4 sm:px-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-200">Quitter Plus</span>
            <span>·</span>
            <span>Версия 1.2.0</span>
            <span>·</span>
            <span className="text-emerald-400 font-medium">Автор: Andárer</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <button onClick={() => setIsSyncModalOpen(true)} className="hover:text-slate-200 transition">
              Облако и экспорт
            </button>
            <span>·</span>
            <button onClick={() => setCurrentTab('cicd')} className="hover:text-slate-200 transition">
              Релизы APK (Android 5.0+) & GitHub
            </button>
            <span>·</span>
            <button onClick={() => setCurrentTab('help')} className="hover:text-slate-200 transition">
              Справка и контакты
            </button>
          </div>
        </div>
      </footer>

      {/* Floating Achievement Unlocked Notification */}
      {recentlyUnlockedToast && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 p-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-2xl flex items-center gap-3 animate-bounce">
          <div className="text-2xl">🏆</div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-900/80">
              Новое достижение разблокировано!
            </div>
            <div className="text-sm font-extrabold">{recentlyUnlockedToast.title}</div>
            <div className="text-xs text-slate-900">{recentlyUnlockedToast.description}</div>
          </div>
        </div>
      )}

      {/* Modals Container */}
      <UrgeSurfingModal
        tracker={activeTracker}
        isOpen={isUrgeSosOpen}
        onClose={() => setIsUrgeSosOpen(false)}
        onSaveCraving={handleSaveCraving}
      />

      <HealthMilestonesModal
        tracker={activeTracker}
        isOpen={isMilestonesModalOpen}
        onClose={() => setIsMilestonesModalOpen(false)}
      />

      <SyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        onDataReload={handleReloadAllData}
        lastSynced={lastSynced}
      />

      <AddEditTrackerModal
        isOpen={isNewTrackerModalOpen}
        onClose={() => setIsNewTrackerModalOpen(false)}
        onSave={handleCreateTracker}
      />

      <ResetConfirmModal
        tracker={activeTracker}
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirmReset={handleConfirmReset}
      />

      <CravingLogModal
        tracker={activeTracker}
        isOpen={isCravingModalOpen}
        onClose={() => setIsCravingModalOpen(false)}
        onSave={handleSaveCraving}
      />

    </div>
  );
}

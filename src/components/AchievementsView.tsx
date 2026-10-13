import React, { useState } from 'react';
import { 
  Trophy, 
  Sparkles, 
  Lock, 
  CheckCircle, 
  Flame, 
  ShieldCheck, 
  Coins, 
  Compass, 
  Waves,
  Sun,
  Shield,
  Award,
  Zap,
  Crown,
  Anchor,
  Wallet,
  CheckCircle2,
  HeartHandshake
} from 'lucide-react';
import { Achievement, AchievementTier, Tracker } from '../types';
import { ACHIEVEMENTS } from '../constants/initialData';
import { useTracker } from '../hooks/useTracker';

interface AchievementsViewProps {
  tracker: Tracker | undefined;
  unlockedIds: string[];
  cravingsCount: number;
  habitsCompletedCount: number;
  zenCount: number;
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({
  tracker,
  unlockedIds,
  cravingsCount,
  habitsCompletedCount,
  zenCount,
}) => {
  const stats = useTracker(tracker);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  // Compute live progress for any achievement
  const getProgress = (ach: Achievement) => {
    const isUnlocked = unlockedIds.includes(ach.id);
    if (isUnlocked) return { current: ach.targetValue, percent: 100, isUnlocked: true };

    let current = 0;
    if (ach.category === 'streak') {
      const elapsedHours = stats.elapsedMs / (1000 * 60 * 60);
      current = Math.floor(elapsedHours);
    } else if (ach.category === 'cravings') {
      current = cravingsCount;
    } else if (ach.category === 'savings') {
      current = Math.floor(stats.moneySaved);
    } else if (ach.category === 'habits') {
      current = habitsCompletedCount;
    } else if (ach.category === 'zen') {
      current = zenCount;
    }

    const percent = Math.min(100, Math.floor((current / ach.targetValue) * 100));
    return { current, percent, isUnlocked: false };
  };

  const tierStyles: Record<AchievementTier, { badge: string; border: string; glow: string }> = {
    bronze: {
      badge: 'bg-amber-900/40 text-amber-300 border-amber-600/30',
      border: 'border-amber-700/30',
      glow: 'shadow-amber-900/20',
    },
    silver: {
      badge: 'bg-slate-700/50 text-slate-200 border-slate-400/30',
      border: 'border-slate-500/30',
      glow: 'shadow-slate-700/20',
    },
    gold: {
      badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
      border: 'border-yellow-500/30',
      glow: 'shadow-yellow-500/20',
    },
    platinum: {
      badge: 'bg-cyan-500/20 text-cyan-200 border-cyan-400/40',
      border: 'border-cyan-400/30',
      glow: 'shadow-cyan-500/20',
    },
    diamond: {
      badge: 'bg-fuchsia-500/20 text-fuchsia-200 border-fuchsia-400/50',
      border: 'border-fuchsia-500/40',
      glow: 'shadow-fuchsia-500/30',
    },
  };

  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Sparkles,
    Sun,
    Shield,
    Flame,
    Castle: ShieldCheck,
    Award,
    Zap,
    Trophy,
    Crown,
    Waves,
    Anchor,
    Coins,
    Wallet,
    CheckCircle2,
    Compass,
    HeartHandshake,
  };

  const filteredAchievements = ACHIEVEMENTS.filter((ach) => {
    const isUnlocked = unlockedIds.includes(ach.id);
    if (selectedFilter === 'unlocked') return isUnlocked;
    if (selectedFilter === 'locked') return !isUnlocked;
    return true;
  });

  const totalCount = ACHIEVEMENTS.length;
  const unlockedCount = unlockedIds.length;
  const totalPercent = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className="space-y-6">
      {/* Hero Stats Card */}
      <div className="rounded-2xl p-6 bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 border border-amber-500/20 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Trophy className="w-4 h-4" />
            Зал славы и триумфа воли
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Система достижений
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-1 leading-relaxed">
            Каждый час чистоты, каждый побежденный импульс и каждая выполненная привычка приносят вам заслуженные награды и укрепляют уверенность в себе.
          </p>
        </div>

        <div className="bg-slate-950/70 border border-white/10 p-4 rounded-xl min-w-[200px] text-center">
          <div className="text-2xl font-extrabold font-mono text-amber-400 tabular-nums">
            {unlockedCount} / {totalCount}
          </div>
          <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">
            Получено ({totalPercent}%)
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-amber-500 to-yellow-300 h-1.5 rounded-full transition-all"
              style={{ width: `${totalPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter Segmented Control */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 bg-slate-900/90 rounded-xl border border-white/10">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              selectedFilter === 'all'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Все ({totalCount})
          </button>
          <button
            onClick={() => setSelectedFilter('unlocked')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              selectedFilter === 'unlocked'
                ? 'bg-emerald-600/30 text-emerald-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Открытые ({unlockedCount})
          </button>
          <button
            onClick={() => setSelectedFilter('locked')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              selectedFilter === 'locked'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            В процессе ({totalCount - unlockedCount})
          </button>
        </div>
      </div>

      {/* Achievements Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((ach) => {
          const { current, percent, isUnlocked } = getProgress(ach);
          const style = tierStyles[ach.tier] || tierStyles.bronze;
          const IconComponent = iconMap[ach.icon] || Trophy;

          return (
            <div
              key={ach.id}
              className={`rounded-2xl p-5 border transition-all relative overflow-hidden flex flex-col justify-between ${
                isUnlocked
                  ? `bg-slate-900/90 ${style.border} ${style.glow} shadow-lg`
                  : 'bg-slate-950/60 border-white/5 opacity-80'
              }`}
            >
              {isUnlocked && (
                <div className="absolute top-0 right-0 transform translate-x-3 -translate-y-3 w-16 h-16 bg-gradient-to-bl from-amber-500/20 to-transparent rounded-full pointer-events-none" />
              )}

              <div>
                {/* Header with Icon & Tier Badge */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                      isUnlocked
                        ? 'bg-gradient-to-br from-amber-500/20 to-yellow-500/10 text-amber-300 border border-amber-500/30'
                        : 'bg-slate-900 text-slate-500 border border-white/5'
                    }`}
                  >
                    {isUnlocked ? (
                      <IconComponent className="w-5 h-5" />
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                  </div>

                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${style.badge}`}
                  >
                    {ach.tier}
                  </span>
                </div>

                <h3 className={`text-sm font-bold mb-1 ${isUnlocked ? 'text-white' : 'text-slate-300'}`}>
                  {ach.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {ach.description}
                </p>
              </div>

              {/* Progress Bar & Status */}
              <div className="pt-3 border-t border-white/5">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-[11px] text-slate-400">
                    {isUnlocked ? (
                      <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Получено
                      </span>
                    ) : (
                      <span>Прогресс: {current} / {ach.targetValue}</span>
                    )}
                  </span>
                  <span className="font-mono text-xs text-slate-300">{percent}%</span>
                </div>

                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      isUnlocked
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-300'
                        : 'bg-emerald-500/60'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

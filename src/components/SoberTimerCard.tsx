import React from 'react';
import { 
  Flame, 
  RotateCcw, 
  Heart, 
  Wallet, 
  Clock, 
  Compass, 
  AlertCircle,
  Share2,
  Calendar
} from 'lucide-react';
import { Tracker } from '../types';
import { useTracker } from '../hooks/useTracker';

interface SoberTimerCardProps {
  tracker: Tracker;
  onOpenResetModal: () => void;
  onOpenMilestonesModal: () => void;
  onOpenCravingModal: () => void;
}

export const SoberTimerCard: React.FC<SoberTimerCardProps> = ({
  tracker,
  onOpenResetModal,
  onOpenMilestonesModal,
  onOpenCravingModal,
}) => {
  const stats = useTracker(tracker);
  const [copiedShare, setCopiedShare] = React.useState(false);

  const startDateFormatted = new Date(tracker.startDate).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleShare = async () => {
    const text = `Я свободен от "${tracker.name}" уже ${stats.totalDays} дн. ${stats.hours} ч. ${stats.minutes} мин.! Сэкономлено ${Math.round(stats.moneySaved)} ${tracker.currency}. Отслеживаю в Quitter Plus (by Andárer)`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Мой прогресс в Quitter Plus', text });
      } catch {
        // ignore
      }
    } else {
      navigator.clipboard.writeText(text);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-white/10 p-5 sm:p-7 shadow-xl">
      {/* Background ambient radial glow */}
      <div 
        className="absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ backgroundColor: tracker.color || '#10b981' }}
      />

      {/* Header strip */}
      <div className="flex items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-inner"
            style={{ backgroundColor: `${tracker.color}25`, color: tracker.color }}
          >
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {tracker.name}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Старт: {startDateFormatted}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 text-xs transition"
            title="Поделиться прогрессом"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenResetModal}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-transparent hover:border-rose-500/30 text-xs transition"
            title="Сбросить счетчик (зафиксировать срыв)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {copiedShare && (
        <div className="mb-4 text-xs font-medium text-emerald-400 bg-emerald-950/50 border border-emerald-500/20 px-3 py-1.5 rounded-lg text-center animate-fade-in">
          Текст прогресса скопирован в буфер обмена!
        </div>
      )}

      {/* Main Live Digital Counter */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3 my-4">
        <div className="bg-slate-900/90 border border-white/5 rounded-xl p-3 text-center">
          <div className="text-2xl sm:text-4xl font-extrabold font-mono text-white tabular-nums tracking-tight">
            {stats.totalDays}
          </div>
          <div className="text-[10px] sm:text-xs font-medium text-slate-400 uppercase tracking-wider mt-1">
            Дней
          </div>
        </div>

        <div className="bg-slate-900/90 border border-white/5 rounded-xl p-3 text-center">
          <div className="text-2xl sm:text-4xl font-extrabold font-mono text-emerald-400 tabular-nums tracking-tight">
            {String(stats.hours).padStart(2, '0')}
          </div>
          <div className="text-[10px] sm:text-xs font-medium text-slate-400 uppercase tracking-wider mt-1">
            Часов
          </div>
        </div>

        <div className="bg-slate-900/90 border border-white/5 rounded-xl p-3 text-center">
          <div className="text-2xl sm:text-4xl font-extrabold font-mono text-cyan-400 tabular-nums tracking-tight">
            {String(stats.minutes).padStart(2, '0')}
          </div>
          <div className="text-[10px] sm:text-xs font-medium text-slate-400 uppercase tracking-wider mt-1">
            Минут
          </div>
        </div>

        <div className="bg-slate-900/90 border border-white/5 rounded-xl p-3 text-center">
          <div className="text-2xl sm:text-4xl font-extrabold font-mono text-amber-400 tabular-nums tracking-tight">
            {String(stats.seconds).padStart(2, '0')}
          </div>
          <div className="text-[10px] sm:text-xs font-medium text-slate-400 uppercase tracking-wider mt-1">
            Секунд
          </div>
        </div>
      </div>

      {/* Next Health Milestone Progress Bar */}
      <div className="mt-5 p-3.5 rounded-xl bg-slate-900/60 border border-white/5">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            {stats.nextMilestone ? (
              <span>Следующая веха: <strong className="text-slate-200">{stats.nextMilestone.title}</strong></span>
            ) : (
              <span className="text-emerald-400 font-semibold">Все основные вехи здоровья достигнуты!</span>
            )}
          </span>
          <button
            onClick={onOpenMilestonesModal}
            className="text-xs font-medium text-emerald-400 hover:text-emerald-300 transition"
          >
            Все вехи →
          </button>
        </div>

        {stats.nextMilestone && (
          <>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${stats.milestoneProgressPercent}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1 tabular-nums">
              <span>Цель: {stats.nextMilestone.hours < 24 ? `${stats.nextMilestone.hours} ч.` : `${Math.round(stats.nextMilestone.hours / 24)} дн.`}</span>
              <span>{stats.milestoneProgressPercent}% завершено</span>
            </div>
          </>
        )}
      </div>

      {/* Quick Metrics Trio */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
        {/* Money saved */}
        <div className="p-3 rounded-xl bg-slate-900/50 border border-white/5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
            <Wallet className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400">Сэкономлено</div>
            <div className="text-sm sm:text-base font-bold font-mono text-white tabular-nums">
              {Math.round(stats.moneySaved).toLocaleString('ru-RU')} {tracker.currency}
            </div>
          </div>
        </div>

        {/* Units avoided */}
        <div className="p-3 rounded-xl bg-slate-900/50 border border-white/5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400">Не потреблено</div>
            <div className="text-sm sm:text-base font-bold font-mono text-white tabular-nums">
              {stats.itemsAvoided.toLocaleString('ru-RU')} {tracker.itemUnitName}
            </div>
          </div>
        </div>

        {/* Life hours regained */}
        <div className="p-3 rounded-xl bg-slate-900/50 border border-white/5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400">Времени спасено</div>
            <div className="text-sm sm:text-base font-bold font-mono text-white tabular-nums">
              ~{stats.timeRegainedHours} ч. жизни
            </div>
          </div>
        </div>
      </div>

      {/* Motivation Pledge Quote */}
      {tracker.motivationQuote && (
        <div className="mt-4 pt-3 border-t border-white/5 flex items-start gap-2 text-xs text-slate-400 italic">
          <AlertCircle className="w-4 h-4 text-emerald-400/80 shrink-0 mt-0.5" />
          <span>«{tracker.motivationQuote}»</span>
        </div>
      )}
    </div>
  );
};

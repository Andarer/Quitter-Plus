import React from 'react';
import { 
  X, 
  Heart, 
  CheckCircle, 
  Clock, 
  Sparkles,
  Activity
} from 'lucide-react';
import { Tracker } from '../types';
import { HEALTH_MILESTONES } from '../constants/initialData';
import { useTracker } from '../hooks/useTracker';

interface HealthMilestonesModalProps {
  tracker: Tracker | undefined;
  isOpen: boolean;
  onClose: () => void;
}

export const HealthMilestonesModal: React.FC<HealthMilestonesModalProps> = ({
  tracker,
  isOpen,
  onClose,
}) => {
  const stats = useTracker(tracker);

  if (!isOpen || !tracker) return null;

  const elapsedHours = stats.elapsedMs / (1000 * 60 * 60);

  const relevantMilestones = HEALTH_MILESTONES.filter(
    (m) => m.category === 'general' || m.category === tracker.category
  ).sort((a, b) => a.hours - b.hours);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-white/10 p-6 text-slate-200 shadow-2xl relative flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Шкала восстановления организма
              </h3>
              <p className="text-xs text-slate-400">
                Физиологические вехи исцеления вашего тела
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="overflow-y-auto flex-1 py-4 space-y-4 pr-1">
          {relevantMilestones.map((m) => {
            const isCompleted = elapsedHours >= m.hours;
            const progress = Math.min(100, Math.round((elapsedHours / m.hours) * 100));

            return (
              <div
                key={m.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isCompleted
                    ? 'bg-slate-900/90 border-emerald-500/30'
                    : 'bg-slate-950/60 border-white/5 opacity-80'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    {isCompleted ? (
                      <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                        <CheckCircle className="w-4 h-4" />
                      </span>
                    ) : (
                      <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center shrink-0 font-mono text-[10px]">
                        <Clock className="w-3.5 h-3.5" />
                      </span>
                    )}
                    <h4 className={`text-sm font-bold ${isCompleted ? 'text-white' : 'text-slate-300'}`}>
                      {m.title}
                    </h4>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 shrink-0">
                    {m.hours < 24 ? `${m.hours} ч.` : `${Math.round(m.hours / 24)} дн.`}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed pl-8 mb-3">
                  {m.description}
                </p>

                {!isCompleted && (
                  <div className="pl-8">
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-teal-400 h-1.5 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1">
                      <span>Осталось ~{Math.max(1, Math.round(m.hours - elapsedHours))} ч.</span>
                      <span className="font-mono">{progress}%</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition shrink-0"
        >
          Закрыть
        </button>
      </div>
    </div>
  );
};

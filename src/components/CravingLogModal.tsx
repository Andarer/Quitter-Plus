import React, { useState } from 'react';
import { X, Activity, CheckCircle, Sparkles } from 'lucide-react';
import { CravingTrigger, Tracker } from '../types';

interface CravingLogModalProps {
  tracker: Tracker | undefined;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    intensity: number;
    trigger: CravingTrigger;
    copingStrategy: string;
    notes: string;
    overcame: boolean;
  }) => void;
}

export const CravingLogModal: React.FC<CravingLogModalProps> = ({
  tracker,
  isOpen,
  onClose,
  onSave,
}) => {
  const [intensity, setIntensity] = useState(6);
  const [trigger, setTrigger] = useState<CravingTrigger>('Стресс');
  const [copingStrategy, setCopingStrategy] = useState('Прогулка и стакан воды');
  const [notes, setNotes] = useState('');
  const [overcame, setOvercame] = useState(true);

  if (!isOpen || !tracker) return null;

  const triggersList: CravingTrigger[] = [
    'Стресс',
    'Скука',
    'Компания / Социальное окружение',
    'Привычный ритуал',
    'Усталость',
    'Злость',
    'Одиночество',
    'Другое',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      intensity,
      trigger,
      copingStrategy,
      notes,
      overcame,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-white/10 p-6 text-slate-200 shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Журнал тяги</h3>
              <p className="text-xs text-slate-400">{tracker.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 my-4">
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Интенсивность импульса:</span>
              <span className="font-bold text-amber-400 font-mono">{intensity} из 10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Что вызвало импульс (триггер)?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {triggersList.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTrigger(t)}
                  className={`p-2 rounded-xl text-xs font-medium text-left transition truncate ${
                    trigger === t
                      ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 font-bold'
                      : 'bg-slate-950/60 border border-white/5 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Что помогло справиться?
            </label>
            <input
              type="text"
              value={copingStrategy}
              onChange={(e) => setCopingStrategy(e.target.value)}
              placeholder="Дыхание, прогулка, звонок другу, чай"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Личные заметки
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Мысли или контекст ситуации"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="overcame_check"
              checked={overcame}
              onChange={(e) => setOvercame(e.target.checked)}
              className="w-4 h-4 rounded accent-emerald-500"
            />
            <label htmlFor="overcame_check" className="text-xs text-slate-300 cursor-pointer">
              Я успешно преодолел(а) этот импульс и остался чист
            </label>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md"
            >
              Зафиксировать
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

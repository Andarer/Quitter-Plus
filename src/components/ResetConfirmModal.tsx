import React, { useState } from 'react';
import { X, RotateCcw, AlertTriangle, HeartHandshake } from 'lucide-react';
import { Tracker } from '../types';

interface ResetConfirmModalProps {
  tracker: Tracker | undefined;
  isOpen: boolean;
  onClose: () => void;
  onConfirmReset: (reason: string, notes: string) => void;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  tracker,
  isOpen,
  onClose,
  onConfirmReset,
}) => {
  const [reason, setReason] = useState('Сильный стресс');
  const [notes, setNotes] = useState('');

  if (!isOpen || !tracker) return null;

  const reasonsList = [
    'Сильный эмоциональный стресс',
    'Употребление в компании друзей',
    'Алкоголь ослабил контроль',
    'Скука и отсутствие альтернативных занятий',
    'Ложная уверенность («только один раз»)',
    'Другая причина',
  ];

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmReset(reason, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-rose-500/30 p-6 text-slate-200 shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Сброс счетчика серии</h3>
              <p className="text-xs text-slate-400">{tracker.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="my-4 p-3.5 rounded-2xl bg-slate-950/70 border border-white/5 flex items-start gap-3">
          <HeartHandshake className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 leading-relaxed">
            <strong>Помните:</strong> Срыв — это не поражение, а точка данных. Ваш предыдущий опыт трезвости никуда не исчез, ваши нейроны уже начали перестраиваться. Поднимитесь и продолжайте путь прямо сейчас!
          </div>
        </div>

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Что послужило причиной?
            </label>
            <div className="space-y-1.5">
              {reasonsList.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setReason(r)}
                  className={`w-full p-2.5 rounded-xl text-xs font-medium text-left border transition ${
                    reason === r
                      ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                      : 'bg-slate-950/60 border-white/5 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Чему вас научил этот опыт? (Заметки)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Что я сделаю по-другому в следующий раз..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-rose-500"
            />
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
              className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md"
            >
              Начать заново с этой секунды
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  CheckCircle, 
  Heart, 
  HelpCircle,
  Clock,
  Compass
} from 'lucide-react';
import { CravingTrigger, Tracker } from '../types';
import { soundService } from '../services/audio';
import { fireAchievementConfetti } from '../services/confetti';

interface UrgeSurfingModalProps {
  tracker: Tracker | undefined;
  isOpen: boolean;
  onClose: () => void;
  onSaveCraving: (data: {
    intensity: number;
    trigger: CravingTrigger;
    copingStrategy: string;
    notes: string;
    overcame: boolean;
  }) => void;
}

export const UrgeSurfingModal: React.FC<UrgeSurfingModalProps> = ({
  tracker,
  isOpen,
  onClose,
  onSaveCraving,
}) => {
  const [activeStep, setActiveStep] = useState<'breathe' | 'ground' | 'halt' | 'complete'>('breathe');
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [breathTimer, setBreathTimer] = useState(4);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [intensity, setIntensity] = useState(7);
  const [trigger, setTrigger] = useState<CravingTrigger>('Стресс');
  const [notes, setNotes] = useState('');
  const [elapsedSessionSec, setElapsedSessionSec] = useState(0);

  // Breath pacing cycle: 4s inhale, 4s hold, 4s exhale, 4s pause
  useEffect(() => {
    if (!isOpen || activeStep !== 'breathe') return;

    if (isAudioOn) {
      soundService.startAmbientWaves();
    }

    const interval = setInterval(() => {
      setBreathTimer((prev) => {
        if (prev <= 1) {
          setBreathPhase((curr) => {
            if (curr === 'inhale') {
              if (isAudioOn) soundService.playChime(440);
              return 'hold';
            }
            if (curr === 'hold') {
              if (isAudioOn) soundService.playChime(392);
              return 'exhale';
            }
            if (curr === 'exhale') {
              return 'pause';
            }
            if (isAudioOn) soundService.playChime(528);
            return 'inhale';
          });
          return 4;
        }
        return prev - 1;
      });
      setElapsedSessionSec((s) => s + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
      soundService.stopAmbientWaves();
    };
  }, [isOpen, activeStep, isAudioOn]);

  if (!isOpen) return null;

  const toggleAudio = () => {
    if (isAudioOn) {
      soundService.stopAmbientWaves();
      setIsAudioOn(false);
    } else {
      soundService.startAmbientWaves();
      setIsAudioOn(true);
    }
  };

  const handleFinishVictory = () => {
    onSaveCraving({
      intensity,
      trigger,
      copingStrategy: 'Urge Surfing (Дыхание 4-4-4 и заземление)',
      notes,
      overcame: true,
    });
    fireAchievementConfetti();
    soundService.playAchievementFanfare();
    onClose();
  };

  const breathInstructions = {
    inhale: { text: 'Вдох через нос', sub: 'Наполняйте живот и легкие воздухом' },
    hold: { text: 'Задержка дыхания', sub: 'Почувствуйте паузу и внутренний покой' },
    exhale: { text: 'Медленный выдох', sub: 'Отпускайте напряжение через рот' },
    pause: { text: 'Пауза', sub: 'Тело расслабляется, волна спадает' },
  };

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-emerald-500/30 p-6 text-slate-200 shadow-2xl relative overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Control Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
              SOS
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Urge Surfing · Серфинг влечения
              </h3>
              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-400" />
                Сессия: {Math.floor(elapsedSessionSec / 60)} мин {elapsedSessionSec % 60} сек
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleAudio}
              className={`p-2 rounded-xl transition ${
                isAudioOn
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'bg-slate-800 text-slate-400'
              }`}
              title="Шум океанской волны"
            >
              {isAudioOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step Selector Tabs */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-950/70 rounded-xl my-4 text-center shrink-0">
          <button
            onClick={() => setActiveStep('breathe')}
            className={`py-1.5 text-xs font-semibold rounded-lg transition ${
              activeStep === 'breathe'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            1. Дыхание 4-4-4
          </button>
          <button
            onClick={() => setActiveStep('ground')}
            className={`py-1.5 text-xs font-semibold rounded-lg transition ${
              activeStep === 'ground'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            2. Заземление 5-4-3
          </button>
          <button
            onClick={() => setActiveStep('complete')}
            className={`py-1.5 text-xs font-semibold rounded-lg transition ${
              activeStep === 'complete'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            3. Зафиксировать победу
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto flex-1 pr-1 py-1">
          {activeStep === 'breathe' && (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              {/* Dynamic breathing orb */}
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center mb-6">
                <div
                  className={`absolute inset-0 rounded-full transition-all duration-1000 ${
                    breathPhase === 'inhale'
                      ? 'scale-100 bg-gradient-to-tr from-emerald-500/30 to-teal-400/20 shadow-2xl shadow-emerald-500/20'
                      : breathPhase === 'hold'
                      ? 'scale-95 bg-gradient-to-tr from-cyan-500/30 to-teal-400/20'
                      : breathPhase === 'exhale'
                      ? 'scale-75 bg-gradient-to-tr from-emerald-900/40 to-slate-900'
                      : 'scale-70 bg-slate-950'
                  }`}
                />
                <div className="relative z-10 flex flex-col items-center">
                  <span className="text-4xl sm:text-5xl font-mono font-extrabold text-white tabular-nums">
                    {breathTimer}
                  </span>
                  <span className="text-xs uppercase font-bold tracking-wider text-emerald-300 mt-2">
                    {breathInstructions[breathPhase].text}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 max-w-sm mb-4">
                {breathInstructions[breathPhase].sub}
              </p>

              <div className="text-[11px] text-slate-400 max-w-xs italic mb-4">
                «Тяга похожа на морскую волну. Вы не можете остановить океан, но можете научиться на нем серфить».
              </div>

              <button
                onClick={() => setActiveStep('ground')}
                className="py-2.5 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition"
              >
                Перейти к заземлению →
              </button>
            </div>
          )}

          {activeStep === 'ground' && (
            <div className="space-y-4 py-2">
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-white/5">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-cyan-400" />
                  Техника заземления «5-4-3-2-1»
                </h4>
                <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                  Переключите внимание с внутренних навязчивых мыслей на физическую реальность вокруг:
                </p>
                <ul className="text-xs space-y-2 text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="font-mono text-cyan-400 font-bold">5.</span>
                    <span>Найдите глазами <strong>5 предметов</strong> определенного цвета (например, синего или зеленого).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-mono text-cyan-400 font-bold">4.</span>
                    <span>Почувствуйте <strong>4 физических ощущения</strong> (опора стула, ткань рубашки, дыхание, пол под ногами).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-mono text-cyan-400 font-bold">3.</span>
                    <span>Услышьте <strong>3 звука</strong> вокруг вас (звук за окном, гул техники, тишина).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-mono text-cyan-400 font-bold">2.</span>
                    <span>Вдохните <strong>2 запаха</strong> (воздух, кофе, мыло, дерево).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-mono text-cyan-400 font-bold">1.</span>
                    <span>Осознайте <strong>1 вкус</strong> во рту или сделайте глоток чистой прохладной воды.</span>
                  </li>
                </ul>
              </div>

              {/* HALT check */}
              <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/20 text-xs">
                <h5 className="font-bold text-amber-300 mb-1 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4" />
                  Быстрый тест H.A.L.T.
                </h5>
                <p className="text-slate-300 mb-2">
                  Часто тяга маскирует базовые физиологические дефициты. Проверьте себя:
                </p>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded bg-slate-900/80 border border-white/5">
                    <strong>H — Hungry?</strong> Голодны ли вы? (Перекусите сложными углеводами)
                  </div>
                  <div className="p-2 rounded bg-slate-900/80 border border-white/5">
                    <strong>A — Angry?</strong> Злы ли вы? (Выразите эмоцию на бумаге или глубоко выдохните)
                  </div>
                  <div className="p-2 rounded bg-slate-900/80 border border-white/5">
                    <strong>L — Lonely?</strong> Одиноко? (Позвоните другу или напишите в чат)
                  </div>
                  <div className="p-2 rounded bg-slate-900/80 border border-white/5">
                    <strong>T — Tired?</strong> Устали? (Сделайте паузу, отдохните 15 минут)
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveStep('complete')}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition"
              >
                Волна отступила. Зафиксировать победу →
              </button>
            </div>
          )}

          {activeStep === 'complete' && (
            <div className="space-y-4 py-2">
              <div className="text-center pb-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white">Вы справились с волной!</h4>
                <p className="text-xs text-slate-400">
                  Зафиксируйте параметры этого приступа, чтобы накапливать статистику и побеждать в будущем.
                </p>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Сила приступа тяги:</span>
                  <span className="font-bold text-amber-400 font-mono">{intensity} из 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={intensity}
                  onChange={(e) => setIntensity(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Главный триггер:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {triggersList.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTrigger(t)}
                      className={`p-2 rounded-xl text-xs font-medium text-left transition ${
                        trigger === t
                          ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                          : 'bg-slate-950/60 border border-white/5 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Короткая заметка (что помогло?):
                </label>
                <input
                  type="text"
                  placeholder="Например: выпил стакан воды, подышал 4-4-4 и отвлекся"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                onClick={handleFinishVictory}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Зафиксировать победу и закрыть</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

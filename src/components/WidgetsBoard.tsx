import React, { useState } from 'react';
import { 
  Heart, 
  Quote, 
  Activity, 
  CheckCircle2, 
  Waves, 
  SlidersHorizontal, 
  Eye, 
  EyeOff, 
  Sparkles,
  ArrowRight,
  RefreshCw,
  PlusCircle,
  TrendingDown
} from 'lucide-react';
import { CravingLog, Habit, Tracker, WidgetId, WidgetSettings } from '../types';
import { MOTIVATIONAL_QUOTES } from '../constants/initialData';
import { useTracker } from '../hooks/useTracker';

interface WidgetsBoardProps {
  tracker: Tracker;
  habits: Habit[];
  cravings: CravingLog[];
  widgets: WidgetSettings[];
  onUpdateWidgets: (widgets: WidgetSettings[]) => void;
  onToggleHabitToday: (habitId: string) => void;
  onOpenUrgeSos: () => void;
  onOpenMilestones: () => void;
  onOpenCravingModal: () => void;
  onNavigateToHabits: () => void;
}

export const WidgetsBoard: React.FC<WidgetsBoardProps> = ({
  tracker,
  habits,
  cravings,
  widgets,
  onUpdateWidgets,
  onToggleHabitToday,
  onOpenUrgeSos,
  onOpenMilestones,
  onOpenCravingModal,
  onNavigateToHabits,
}) => {
  const stats = useTracker(tracker);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);

  const todayKey = new Date().toISOString().split('T')[0];
  const activeWidgets = widgets.filter((w) => w.enabled).sort((a, b) => a.order - b.order);

  const toggleWidget = (id: WidgetId) => {
    const updated = widgets.map((w) => (w.id === id ? { ...w, enabled: !w.enabled } : w));
    onUpdateWidgets(updated);
  };

  const handleNextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
  };

  const currentQuote = MOTIVATIONAL_QUOTES[quoteIndex] || MOTIVATIONAL_QUOTES[0];

  // 30 days history data calculation for heatmap widget
  const past30Days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const key = d.toISOString().split('T')[0];
    const isClean = new Date(tracker.startDate) <= d;
    return { date: key, isClean, dayNum: d.getDate() };
  });

  return (
    <div className="space-y-4">
      {/* Widget Toolbar */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-slate-200">Виджеты дашборда</h3>
        </div>
        <button
          onClick={() => setShowConfigModal(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/10 text-xs text-slate-300 font-medium transition"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
          <span>Настроить виджеты</span>
        </button>
      </div>

      {/* Grid of Modular Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeWidgets.map((widget) => {
          switch (widget.id) {
            case 'urge_sos':
              return (
                <div
                  key={widget.id}
                  className="rounded-2xl p-5 bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-950 border border-rose-500/20 shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Waves className="w-4 h-4" />
                        Антикризис · Urge Surfing
                      </span>
                      <span className="text-[10px] text-slate-400">3-мин сессия</span>
                    </div>
                    <h4 className="text-base font-bold text-white mb-1">
                      Чувствуете сильную тягу?
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed mb-4">
                      Волна влечения длится 10–15 минут. Научитесь скользить по ней с помощью дыхания и осознанности.
                    </p>
                  </div>
                  <button
                    onClick={onOpenUrgeSos}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-semibold text-xs shadow-md shadow-rose-950/50 flex items-center justify-center gap-2 transition active:scale-[0.98]"
                  >
                    <Waves className="w-4 h-4 animate-urge-pulse" />
                    <span>Запустить экстренный серфинг</span>
                  </button>
                </div>
              );

            case 'habits_daily':
              return (
                <div
                  key={widget.id}
                  className="rounded-2xl p-5 bg-slate-900/80 border border-white/10 shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        Полезные привычки сегодня
                      </span>
                      <button
                        onClick={onNavigateToHabits}
                        className="text-[11px] text-slate-400 hover:text-emerald-300 transition"
                      >
                        Все ({habits.length}) →
                      </button>
                    </div>

                    <div className="space-y-2 mb-3">
                      {habits.slice(0, 3).map((h) => {
                        const isDone = !!h.completions[todayKey];
                        return (
                          <div
                            key={h.id}
                            onClick={() => onToggleHabitToday(h.id)}
                            className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                              isDone
                                ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
                                : 'bg-slate-950/40 border-white/5 text-slate-300 hover:border-white/15'
                            }`}
                          >
                            <span className="text-xs font-medium truncate pr-2">{h.name}</span>
                            <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                              isDone ? 'bg-emerald-500 text-slate-950' : 'border border-slate-600'
                            }`}>
                              {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    onClick={onNavigateToHabits}
                    className="w-full py-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium border border-white/5 flex items-center justify-center gap-1.5 transition"
                  >
                    <span>Управление привычками</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );

            case 'health_next':
              return (
                <div
                  key={widget.id}
                  className="rounded-2xl p-5 bg-slate-900/80 border border-white/10 shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Heart className="w-4 h-4 text-rose-400" />
                        Регенерация организма
                      </span>
                      <button
                        onClick={onOpenMilestones}
                        className="text-[11px] text-slate-400 hover:text-teal-300 transition"
                      >
                        Шкала вех →
                      </button>
                    </div>

                    {stats.nextMilestone ? (
                      <div className="space-y-2">
                        <h4 className="text-sm font-bold text-white">
                          {stats.nextMilestone.title}
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                          {stats.nextMilestone.description}
                        </p>
                        <div className="pt-2">
                          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-teal-400 h-2 rounded-full transition-all"
                              style={{ width: `${stats.milestoneProgressPercent}%` }}
                            />
                          </div>
                          <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                            <span>Цель: {stats.nextMilestone.hours < 24 ? `${stats.nextMilestone.hours} ч.` : `${Math.round(stats.nextMilestone.hours / 24)} дн.`}</span>
                            <span className="font-mono">{stats.milestoneProgressPercent}%</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="py-6 text-center text-xs text-slate-400">
                        Поздравляем! Все ключевые этапы восстановления пройдены!
                      </div>
                    )}
                  </div>

                  <button
                    onClick={onOpenMilestones}
                    className="w-full mt-3 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium border border-white/5 transition"
                  >
                    Посмотреть все стадии выздоровления
                  </button>
                </div>
              );

            case 'quote_daily':
              return (
                <div
                  key={widget.id}
                  className="rounded-2xl p-5 bg-gradient-to-br from-slate-900/90 to-amber-950/20 border border-white/10 shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Quote className="w-4 h-4" />
                        Стоическая мудрость
                      </span>
                      <button
                        onClick={handleNextQuote}
                        className="p-1 rounded text-slate-400 hover:text-amber-300 transition"
                        title="Следующая цитата"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <blockquote className="text-xs sm:text-sm text-slate-200 italic leading-relaxed mb-3">
                      «{currentQuote.quote}»
                    </blockquote>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <span className="text-xs font-semibold text-amber-400">
                      — {currentQuote.author}
                    </span>
                    <button
                      onClick={handleNextQuote}
                      className="text-[11px] text-slate-400 hover:text-slate-200 transition"
                    >
                      Обновить цитату
                    </button>
                  </div>
                </div>
              );

            case 'craving_pulse':
              return (
                <div
                  key={widget.id}
                  className="rounded-2xl p-5 bg-slate-900/80 border border-white/10 shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Activity className="w-4 h-4" />
                        Журнал импульсов тяги
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {cravings.length} записей
                      </span>
                    </div>

                    {cravings.length === 0 ? (
                      <div className="py-4 text-center">
                        <p className="text-xs text-slate-400 mb-2">
                          Вы пока не зафиксировали ни одной тяги.
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Фиксация импульсов помогает обнаружить скрытые паттерны и триггеры.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2 mb-3">
                        {cravings.slice(-2).reverse().map((c) => (
                          <div
                            key={c.id}
                            className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5 flex items-center justify-between text-xs"
                          >
                            <div>
                              <span className="text-slate-200 font-medium">{c.trigger}</span>
                              <div className="text-[10px] text-slate-400">
                                {new Date(c.timestamp).toLocaleDateString('ru-RU', {
                                  day: 'numeric',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="font-mono text-amber-400 text-xs">
                                Интенсивность: {c.intensity}/10
                              </span>
                              <div className="text-[10px] text-emerald-400 font-semibold">
                                {c.overcame ? '✓ Преодолено' : 'Зафиксировано'}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={onOpenCravingModal}
                    className="w-full py-2 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 text-xs font-semibold border border-cyan-500/20 flex items-center justify-center gap-1.5 transition"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Зафиксировать импульс</span>
                  </button>
                </div>
              );

            case 'heatmap_30d':
              return (
                <div
                  key={widget.id}
                  className="rounded-2xl p-5 bg-slate-900/80 border border-white/10 shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                        <TrendingDown className="w-4 h-4" />
                        Карта трезвости (30 дней)
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {stats.totalDays} дн. в серии
                      </span>
                    </div>

                    <div className="grid grid-cols-10 gap-1.5 my-3">
                      {past30Days.map((d, i) => (
                        <div
                          key={i}
                          title={`${d.date}: ${d.isClean ? 'Чистый день' : 'До старта'}`}
                          className={`aspect-square rounded flex items-center justify-center text-[9px] font-mono transition-transform hover:scale-125 ${
                            d.isClean
                              ? 'bg-emerald-500 text-slate-950 font-bold'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {d.dayNum}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-white/5">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block" />
                      Свободен
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded bg-slate-800 inline-block" />
                      Прошлые дни
                    </span>
                  </div>
                </div>
              );

            default:
              return null;
          }
        })}
      </div>

      {/* Widget Settings Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-white/10 p-6 text-slate-200 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">Настройка виджетов</h3>
            <p className="text-xs text-slate-400 mb-4">
              Включайте и отключайте виджеты дашборда для индивидуальной настройки рабочего экрана:
            </p>

            <div className="space-y-2 mb-6">
              {widgets.map((w) => {
                const widgetNames: Record<WidgetId, string> = {
                  sober_clock: 'Таймер трезвости',
                  quick_metrics: 'Краткие метрики и экономия',
                  urge_sos: 'Антикризис: Urge Surfing SOS',
                  habits_daily: 'Чеклист полезных привычек на сегодня',
                  health_next: 'Следующая веха восстановления здоровья',
                  quote_daily: 'Ежедневная цитата стоиков',
                  craving_pulse: 'Журнал приступов тяги',
                  heatmap_30d: '30-дневная тепловая карта серии',
                };
                return (
                  <div
                    key={w.id}
                    onClick={() => toggleWidget(w.id)}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-white/5 hover:border-white/20 cursor-pointer transition"
                  >
                    <span className="text-xs font-medium text-slate-200">
                      {widgetNames[w.id] || w.id}
                    </span>
                    <button className="text-slate-400 hover:text-white transition">
                      {w.enabled ? (
                        <Eye className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-slate-600" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setShowConfigModal(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition"
            >
              Сохранить и закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

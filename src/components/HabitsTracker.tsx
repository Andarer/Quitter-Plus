import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Flame, 
  Sparkles, 
  Calendar,
  X
} from 'lucide-react';
import { Habit, HabitCategory } from '../types';

interface HabitsTrackerProps {
  habits: Habit[];
  onToggleHabitDate: (habitId: string, dateKey: string) => void;
  onAddHabit: (newHabit: Omit<Habit, 'id' | 'createdAt' | 'completions'>) => void;
  onDeleteHabit: (habitId: string) => void;
}

export const HabitsTracker: React.FC<HabitsTrackerProps> = ({
  habits,
  onToggleHabitDate,
  onAddHabit,
  onDeleteHabit,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<HabitCategory>('health');
  const [newTarget, setNewTarget] = useState(7);

  // Generate current week dates (Monday through Sunday)
  const currentWeekDays = React.useMemo(() => {
    const today = new Date();
    const dayOfWeek = (today.getDay() + 6) % 7; // Monday = 0
    const monday = new Date(today);
    monday.setDate(today.getDate() - dayOfWeek);

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dateKey = d.toISOString().split('T')[0];
      const dayShort = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'][i];
      const isToday = dateKey === today.toISOString().split('T')[0];
      return {
        dateKey,
        dayShort,
        dayNum: d.getDate(),
        isToday,
      };
    });
  }, []);

  const todayKey = new Date().toISOString().split('T')[0];
  const totalToday = habits.length;
  const completedToday = habits.filter((h) => h.completions[todayKey]).length;
  const percentToday = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

  // Calculate streak for a habit
  const getHabitStreak = (habit: Habit) => {
    let streak = 0;
    const d = new Date();
    // Check if completed today, if not start from yesterday
    let checkDate = new Date(d);
    const todayStr = checkDate.toISOString().split('T')[0];
    if (!habit.completions[todayStr]) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (true) {
      const key = checkDate.toISOString().split('T')[0];
      if (habit.completions[key]) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const categoryColors: Record<HabitCategory, string> = {
      health: '#06b6d4',
      mind: '#8b5cf6',
      sport: '#10b981',
      focus: '#f59e0b',
      selfcare: '#ec4899',
    };

    onAddHabit({
      name: newTitle.trim(),
      category: newCategory,
      icon: 'Activity',
      color: categoryColors[newCategory] || '#10b981',
      targetPerWeek: Number(newTarget) || 7,
    });

    setNewTitle('');
    setShowAddModal(false);
  };

  const categoryNames: Record<HabitCategory, string> = {
    health: 'Здоровье',
    mind: 'Осознанность',
    sport: 'Спорт и тело',
    focus: 'Продуктивность',
    selfcare: 'Забота о себе',
  };

  return (
    <div className="space-y-6">
      {/* Header Banner & Stats */}
      <div className="rounded-2xl p-6 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-white/10 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            Замещение зависимостей здоровыми ритуалами
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Трекер полезных привычек
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-1 leading-relaxed">
            Мозг не терпит пустоты: избавляясь от деструктивных привычек, заменяйте их созидательными ритуалами, укрепляющими волю и тело.
          </p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="bg-slate-950/60 border border-white/5 p-3 rounded-xl text-center min-w-[110px]">
            <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
              {completedToday}/{totalToday}
            </div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">
              Сегодня ({percentToday}%)
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex-1 md:flex-initial py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Новая привычка</span>
          </button>
        </div>
      </div>

      {/* Week Grid Header on Desktop */}
      <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-5 shadow-lg overflow-x-auto">
        <div className="min-w-[580px]">
          {/* Calendar Day Labels */}
          <div className="grid grid-cols-12 gap-2 pb-3 border-b border-white/10 text-xs text-slate-400 font-medium">
            <div className="col-span-5">Привычка и серия</div>
            <div className="col-span-7 grid grid-cols-7 gap-1 text-center">
              {currentWeekDays.map((d) => (
                <div
                  key={d.dateKey}
                  className={`py-1 rounded-lg ${
                    d.isToday ? 'bg-emerald-500/20 text-emerald-300 font-bold' : ''
                  }`}
                >
                  <div className="text-[10px] uppercase">{d.dayShort}</div>
                  <div className="text-xs font-mono">{d.dayNum}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Habit Rows */}
          <div className="divide-y divide-white/5">
            {habits.map((habit) => {
              const streak = getHabitStreak(habit);
              return (
                <div key={habit.id} className="grid grid-cols-12 gap-2 py-3.5 items-center">
                  <div className="col-span-5 flex items-center justify-between pr-3">
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-white">
                        {habit.name}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span style={{ color: habit.color }}>
                          {categoryNames[habit.category] || habit.category}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1 font-mono text-amber-400">
                          <Flame className="w-3 h-3 text-amber-400" />
                          {streak} дн. подряд
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => onDeleteHabit(habit.id)}
                      className="p-1 rounded text-slate-500 hover:text-rose-400 transition"
                      title="Удалить привычку"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* 7-day checkboxes */}
                  <div className="col-span-7 grid grid-cols-7 gap-1 text-center">
                    {currentWeekDays.map((d) => {
                      const isDone = !!habit.completions[d.dateKey];
                      return (
                        <button
                          key={d.dateKey}
                          onClick={() => onToggleHabitDate(habit.id, d.dateKey)}
                          className={`h-9 rounded-xl flex items-center justify-center transition-all ${
                            isDone
                              ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-950/40'
                              : d.isToday
                              ? 'bg-slate-800/90 hover:bg-slate-700 border border-emerald-500/30 text-slate-400'
                              : 'bg-slate-950/50 hover:bg-slate-800/70 border border-white/5 text-slate-600'
                          }`}
                          title={`${habit.name} — ${d.dateKey}: ${isDone ? 'Выполнено' : 'Не выполнено'}`}
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <span className="text-[10px] font-mono text-slate-500">
                              {d.dayNum}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Habit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-white/10 p-6 text-slate-200 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">Добавить полезную привычку</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateHabit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Название привычки
                </label>
                <input
                  type="text"
                  required
                  placeholder="Например: 20 минут чтения или планка"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Категория
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(categoryNames) as HabitCategory[]).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setNewCategory(cat)}
                      className={`p-2.5 rounded-xl text-xs font-medium text-left border transition ${
                        newCategory === cat
                          ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300'
                          : 'bg-slate-950/40 border-white/5 text-slate-400 hover:border-white/15'
                      }`}
                    >
                      {categoryNames[cat]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Цель в неделю (дней)
                </label>
                <select
                  value={newTarget}
                  onChange={(e) => setNewTarget(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
                >
                  <option value={7}>Каждый день (7 дней)</option>
                  <option value={5}>Будни (5 дней)</option>
                  <option value={4}>4 дня в неделю</option>
                  <option value={3}>3 дня в неделю</option>
                </select>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition"
                >
                  Создать
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

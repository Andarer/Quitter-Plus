import React, { useState } from 'react';
import { X, Flame, Shield, Calendar, DollarSign, Clock } from 'lucide-react';
import { Tracker, TrackerCategory } from '../types';

interface AddEditTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (trackerData: Omit<Tracker, 'id' | 'resets'>) => void;
}

export const AddEditTrackerModal: React.FC<AddEditTrackerModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<TrackerCategory>('smoking');
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 16));
  const [costPerDay, setCostPerDay] = useState(300);
  const [currency, setCurrency] = useState('₽');
  const [itemsPerDay, setItemsPerDay] = useState(20);
  const [itemUnitName, setItemUnitName] = useState('сигарет / порций');
  const [timeSavedPerItemMin, setTimeSavedPerItemMin] = useState(5);
  const [motivationQuote, setMotivationQuote] = useState('Я выбираю свободу, здоровье и самообладание.');
  const [color, setColor] = useState('#10b981');

  if (!isOpen) return null;

  const categoryPresets: Record<TrackerCategory, { defaultName: string; unit: string; cost: number; color: string; items: number }> = {
    smoking: { defaultName: 'Курение сигарет', unit: 'сигарет', cost: 250, color: '#10b981', items: 20 },
    vaping: { defaultName: 'Вейпинг / Электронные сигареты', unit: 'затяжек / стиков', cost: 350, color: '#06b6d4', items: 50 },
    alcohol: { defaultName: 'Алкоголь', unit: 'порций', cost: 500, color: '#3b82f6', items: 2 },
    drugs: { defaultName: 'Психоактивные вещества', unit: 'доз', cost: 1000, color: '#ec4899', items: 1 },
    gambling: { defaultName: 'Азартные игры / Ставки', unit: 'сессий ставок', cost: 1500, color: '#f59e0b', items: 1 },
    sugar: { defaultName: 'Сахар и фастфуд', unit: 'сладких перекусов', cost: 300, color: '#8b5cf6', items: 4 },
    caffeine: { defaultName: 'Кофеин / Энергетики', unit: 'банок / чашек', cost: 200, color: '#d97706', items: 3 },
    shopping: { defaultName: 'Импульсивные покупки', unit: 'лишних покупок', cost: 800, color: '#14b8a6', items: 1 },
    gaming: { defaultName: 'Игровая зависимость', unit: 'часов в играх', cost: 0, color: '#6366f1', items: 4 },
    social_media: { defaultName: 'Думскроллинг соцсетей', unit: 'часов в ленте', cost: 0, color: '#ef4444', items: 3 },
    custom: { defaultName: 'Моя цель', unit: 'раз', cost: 200, color: '#10b981', items: 5 },
  };

  const handleSelectCategory = (cat: TrackerCategory) => {
    setCategory(cat);
    const preset = categoryPresets[cat];
    if (preset) {
      if (!name || Object.values(categoryPresets).some((p) => p.defaultName === name)) {
        setName(preset.defaultName);
      }
      setItemUnitName(preset.unit);
      setCostPerDay(preset.cost);
      setColor(preset.color);
      setItemsPerDay(preset.items);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      category,
      iconName: 'Flame',
      startDate: new Date(startDate).toISOString(),
      costPerDay: Number(costPerDay) || 0,
      currency,
      itemsPerDay: Number(itemsPerDay) || 1,
      itemUnitName,
      timeSavedPerItemMin: Number(timeSavedPerItemMin) || 0,
      motivationQuote,
      color,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-white/10 p-6 text-slate-200 shadow-2xl relative flex flex-col max-h-[92vh]">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Новая цель отказа</h3>
              <p className="text-xs text-slate-400">Начните новую главу свободы</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 py-4 space-y-4 pr-1">
          {/* Preset Buttons */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Выберите категорию зависимости
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(Object.keys(categoryPresets) as TrackerCategory[]).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleSelectCategory(cat)}
                  className={`p-2 rounded-xl text-[11px] font-medium text-left border transition truncate ${
                    category === cat
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold'
                      : 'bg-slate-950/60 border-white/5 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {categoryPresets[cat].defaultName.split(' / ')[0]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Название цели
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например: Полный отказ от курения"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Дата и время старта
            </label>
            <input
              type="datetime-local"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Расходы в день ({currency})
              </label>
              <input
                type="number"
                min="0"
                value={costPerDay}
                onChange={(e) => setCostPerDay(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Штук / раз в день
              </label>
              <input
                type="number"
                min="0"
                value={itemsPerDay}
                onChange={(e) => setItemsPerDay(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Единица измерения (для счетчика)
            </label>
            <input
              type="text"
              value={itemUnitName}
              onChange={(e) => setItemUnitName(e.target.value)}
              placeholder="сигарет, стиков, чашек, порций"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Ваша главная мотивация (Зачем?)
            </label>
            <textarea
              rows={2}
              value={motivationQuote}
              onChange={(e) => setMotivationQuote(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
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
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md"
            >
              Сохранить трекер
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

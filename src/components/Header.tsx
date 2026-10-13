import React from 'react';
import { 
  ShieldCheck, 
  Cloud, 
  CloudOff, 
  Download, 
  Palette, 
  Plus, 
  Flame, 
  Smartphone,
  ChevronDown,
  Moon,
  Sun,
  Laptop
} from 'lucide-react';
import { AppTheme, Tracker } from '../types';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface HeaderProps {
  trackers: Tracker[];
  activeTracker: Tracker | undefined;
  onSelectTracker: (trackerId: string) => void;
  onOpenNewTrackerModal: () => void;
  theme: AppTheme;
  resolvedTheme: AppTheme;
  systemPrefersDark: boolean;
  onChangeTheme: (theme: AppTheme) => void;
  onOpenSyncModal: () => void;
  lastSynced: string | null;
  onOpenUrgeSos: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  trackers,
  activeTracker,
  onSelectTracker,
  onOpenNewTrackerModal,
  theme,
  resolvedTheme,
  systemPrefersDark,
  onChangeTheme,
  onOpenSyncModal,
  lastSynced,
  onOpenUrgeSos,
}) => {
  const { isInstallable, isIOS, install } = usePWAInstall();
  const [showThemeMenu, setShowThemeMenu] = React.useState(false);
  const [showTrackerMenu, setShowTrackerMenu] = React.useState(false);
  const [showIOSModal, setShowIOSModal] = React.useState(false);

  const themeLabels: Record<AppTheme, { name: string; sub?: string; iconColor: string }> = {
    system: { 
      name: 'Системная (Авто)', 
      sub: systemPrefersDark ? 'По устройству: Темная' : 'По устройству: Светлая',
      iconColor: 'bg-gradient-to-r from-slate-700 to-amber-400' 
    },
    dark: { name: 'Темная (Dark Slate)', sub: 'Глубокий ночной стиль', iconColor: 'bg-slate-700' },
    oled: { name: 'OLED Pure Black', sub: 'AMOLED экономия батареи', iconColor: 'bg-black border border-neutral-700' },
    light: { name: 'Светлая (Clean Light)', sub: 'Дневной режим', iconColor: 'bg-stone-200 border border-stone-300' },
    emerald: { name: 'Изумрудный лес', sub: 'Исцеляющий зеленый', iconColor: 'bg-emerald-600' },
    cyber: { name: 'Киберпанк Неон', sub: 'Неоновый футуризм', iconColor: 'bg-cyan-500' },
    sunset: { name: 'Теплый закат', sub: 'Янтарный уют', iconColor: 'bg-amber-600' },
  };

  // Header quick theme icon
  const getThemeIcon = () => {
    if (theme === 'system') return <Laptop className="w-3.5 h-3.5 text-emerald-400" />;
    if (resolvedTheme === 'light') return <Sun className="w-3.5 h-3.5 text-amber-400" />;
    return <Moon className="w-3.5 h-3.5 text-cyan-400" />;
  };

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/85 backdrop-blur-md px-4 sm:px-6 py-3 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Zone 1: Wordmark & Author */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-950/40">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg tracking-tight text-white whitespace-nowrap">
                  Quitter<span className="text-emerald-400 font-extrabold">+</span>
                </span>
                <span className="text-[11px] font-medium text-emerald-400/90 tracking-wide px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/20">
                  by Andárer
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Отказ от зависимостей · Трекинг привычек · Облако
              </p>
            </div>
          </div>

          {/* Zone 2: Tracker Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowTrackerMenu(!showTrackerMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800/90 border border-white/10 text-xs font-medium text-slate-200 transition-colors"
            >
              <Flame className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="max-w-[110px] sm:max-w-[160px] truncate">
                {activeTracker ? activeTracker.name : 'Выберите трекер'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showTrackerMenu && (
              <div className="absolute left-0 sm:right-0 sm:left-auto top-full mt-1.5 w-56 rounded-xl bg-slate-900 border border-white/10 shadow-2xl p-1.5 z-50">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-2 py-1">
                  Активные цели
                </div>
                {trackers.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      onSelectTracker(t.id);
                      setShowTrackerMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium text-left transition-colors ${
                      activeTracker?.id === t.id
                        ? 'bg-emerald-500/15 text-emerald-300'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="truncate">{t.name}</span>
                    <span className="text-[10px] text-slate-400 tabular-nums">
                      {Math.floor((Date.now() - new Date(t.startDate).getTime()) / (1000 * 60 * 60 * 24))} дн.
                    </span>
                  </button>
                ))}
                <div className="border-t border-white/5 my-1" />
                <button
                  onClick={() => {
                    setShowTrackerMenu(false);
                    onOpenNewTrackerModal();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium text-emerald-400 hover:bg-emerald-950/50 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Добавить новую цель</span>
                </button>
              </div>
            )}
          </div>

          {/* Zone 3: Quick Action Affordances */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Urge SOS Emergency Trigger */}
            <button
              onClick={onOpenUrgeSos}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 text-xs font-semibold shadow-sm transition active:scale-95"
              title="Экстренная помощь при тяге (Urge Surfing)"
            >
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping hidden sm:inline-block" />
              <span>SOS Тяга</span>
            </button>

            {/* Cloud Sync Status */}
            <button
              onClick={onOpenSyncModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-xs text-slate-300 transition"
              title={lastSynced ? `Синхронизировано: ${new Date(lastSynced).toLocaleTimeString()}` : 'Облачная синхронизация'}
            >
              {lastSynced ? (
                <Cloud className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <CloudOff className="w-3.5 h-3.5 text-slate-400" />
              )}
              <span className="hidden md:inline text-[11px]">
                {lastSynced ? 'Облако' : 'Синхр.'}
              </span>
            </button>

            {/* Theme & Dark Mode Selector */}
            <div className="relative">
              <button
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-slate-300 transition"
                title={`Тема: ${themeLabels[theme]?.name || theme} (${theme === 'system' ? 'Авто' : 'Вручную'})`}
              >
                {getThemeIcon()}
                <span className="text-[11px] font-medium hidden lg:inline">
                  {theme === 'system' ? 'Авто' : themeLabels[theme]?.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400 hidden lg:inline" />
              </button>

              {showThemeMenu && (
                <div className="absolute right-0 top-full mt-1.5 w-60 rounded-2xl bg-slate-900 border border-white/10 shadow-2xl p-2 z-50">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-2.5 py-1 flex items-center justify-between">
                    <span>Тема оформления</span>
                    {theme === 'system' && (
                      <span className="text-emerald-400 font-mono">Авто: {systemPrefersDark ? 'Dark' : 'Light'}</span>
                    )}
                  </div>
                  
                  <div className="space-y-1 mt-1">
                    {(Object.keys(themeLabels) as AppTheme[]).map((thm) => {
                      const item = themeLabels[thm];
                      const isSelected = theme === thm;
                      return (
                        <button
                          key={thm}
                          onClick={() => {
                            onChangeTheme(thm);
                            setShowThemeMenu(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium text-left transition-colors ${
                            isSelected
                              ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                              : 'text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className={`w-3 h-3 rounded-full shrink-0 ${item.iconColor}`} />
                            <div>
                              <div className="leading-tight">{item.name}</div>
                              {item.sub && (
                                <div className="text-[10px] text-slate-400 font-normal leading-tight mt-0.5">
                                  {item.sub}
                                </div>
                              )}
                            </div>
                          </div>
                          {isSelected && (
                            <span className="text-emerald-400 text-xs">✓</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* PWA Install Button */}
            {isInstallable && (
              <button
                onClick={install}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Установить</span>
              </button>
            )}

            {isIOS && (
              <button
                onClick={() => setShowIOSModal(true)}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-white/10"
              >
                <Smartphone className="w-3 h-3 text-slate-400" />
                <span>PWA iOS</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* iOS Safari Guide Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-white/10 p-6 text-slate-200">
            <h3 className="text-base font-bold text-white mb-2">Установка на iPhone / iPad</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              1. Нажмите иконку <strong>«Поделиться»</strong> (квадрат со стрелкой вверх) в нижней панели Safari.<br />
              2. Прокрутите список вниз и выберите <strong>«На экран Домой»</strong>.<br />
              3. Нажмите «Добавить». Quitter Plus будет работать автономно как нативное приложение!
            </p>
            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition"
            >
              Понятно
            </button>
          </div>
        </div>
      )}
    </>
  );
};

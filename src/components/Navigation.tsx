import React from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Trophy, 
  HelpCircle, 
  GitBranch 
} from 'lucide-react';

export type TabId = 'dashboard' | 'habits' | 'achievements' | 'help' | 'cicd';

interface NavigationProps {
  currentTab: TabId;
  onSelectTab: (tab: TabId) => void;
  unlockedCount: number;
  totalAchievements: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  unlockedCount,
  totalAchievements,
}) => {
  const tabs: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: 'dashboard', label: 'Дашборд', icon: LayoutDashboard },
    { id: 'habits', label: 'Привычки', icon: CheckSquare },
    { 
      id: 'achievements', 
      label: 'Достижения', 
      icon: Trophy, 
      badge: `${unlockedCount}/${totalAchievements}` 
    },
    { id: 'help', label: 'Справка & SOS', icon: HelpCircle },
    { id: 'cicd', label: 'CI/CD & APK', icon: GitBranch, badge: 'v1.2' },
  ];

  return (
    <>
      {/* Desktop / Tablet Top Tabs Bar */}
      <div className="hidden sm:block border-b border-white/10 bg-slate-900/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center gap-1 sm:gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`relative flex items-center gap-2 py-3 px-3.5 text-xs sm:text-sm font-semibold transition-colors ${
                    isActive
                      ? 'text-emerald-400'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                      isActive 
                        ? 'bg-emerald-500/20 text-emerald-300' 
                        : 'bg-white/5 text-slate-400'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-400" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Fixed Bottom Navigation Bar (thumb-zone ergonomics) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-white/10 pb-safe">
        <div className="grid grid-cols-5 items-center h-14">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`relative flex flex-col items-center justify-center h-full transition-colors ${
                  isActive ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                  {tab.id === 'achievements' && unlockedCount > 0 && (
                    <span className="absolute -top-1 -right-2 text-[9px] font-bold text-amber-300 bg-amber-950/90 border border-amber-500/30 rounded-full px-1">
                      {unlockedCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium tracking-tight mt-1 leading-none">
                  {tab.label.split(' ')[0]}
                </span>
                {isActive && (
                  <span className="absolute top-0 w-8 h-0.5 bg-emerald-400 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

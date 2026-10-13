import React from 'react';
import { 
  GitBranch, 
  ExternalLink, 
  Download, 
  Smartphone, 
  CheckCircle, 
  Github, 
  Bug, 
  BookOpen, 
  Sparkles, 
  Layers,
  ShieldCheck,
  Cpu,
  GitCommit
} from 'lucide-react';
import { APP_CHANGELOG } from '../constants/initialData';

export const CiCdReleaseCenter: React.FC = () => {
  const GITHUB_REPO_URL = 'https://github.com/andarer/quitter-plus';
  const GITHUB_RELEASES_URL = 'https://github.com/andarer/quitter-plus/releases';
  const GITHUB_ISSUES_URL = 'https://github.com/andarer/quitter-plus/issues';
  const ORIGINAL_PROJECT_URL = 'https://github.com/brandonp2412/Quitter';

  return (
    <div className="space-y-6">
      {/* Hero: Ready APK Release Banner */}
      <div className="rounded-2xl p-6 bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Smartphone className="w-4 h-4" />
            Официальные сборки для Android 5.0+ (API 21+)
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Готовые релизы в GitHub Репозитории
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-1 leading-relaxed">
            Скомпилированные установочные файлы <strong>.APK</strong> собираются автоматическими пайплайнами GitHub Actions и публикуются прямо в релизах репозитория.
          </p>

          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 font-semibold flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" />
              Android 5.0 Lollipop и новее
            </span>
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-800 border border-white/10 text-slate-300 font-semibold">
              Версия: v1.2.0 (Ascent)
            </span>
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-800 border border-white/10 text-slate-300 font-semibold">
              Автор: Andárer
            </span>
          </div>
        </div>

        {/* Big Action Button */}
        <div className="w-full md:w-auto shrink-0 flex flex-col gap-2.5">
          <a
            href={GITHUB_RELEASES_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-950/60 flex items-center justify-center gap-2.5 transition active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Скачать APK в GitHub Releases</span>
            <ExternalLink className="w-4 h-4 opacity-75" />
          </a>

          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-white/10 flex items-center justify-center gap-2 transition"
          >
            <Github className="w-4 h-4" />
            <span>Открыть репозиторий GitHub</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </a>
        </div>
      </div>

      {/* Official Links & Resources Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <a
          href={GITHUB_RELEASES_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 border border-white/10 hover:border-emerald-500/30 transition shadow-lg flex flex-col justify-between group"
        >
          <div>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Download className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">GitHub Releases</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Готовые APK для загрузки на Android смартфон.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
            <span>Перейти к релизам</span>
            <ExternalLink className="w-3 h-3" />
          </div>
        </a>

        <a
          href={GITHUB_REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 border border-white/10 hover:border-white/20 transition shadow-lg flex flex-col justify-between group"
        >
          <div>
            <div className="w-9 h-9 rounded-xl bg-slate-800 text-slate-200 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Github className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Исходный код</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Полный открытый репозиторий, README, CHANGELOG и документация.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-300 font-semibold">
            <span>github.com/andarer</span>
            <ExternalLink className="w-3 h-3" />
          </div>
        </a>

        <a
          href={GITHUB_ISSUES_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 border border-white/10 hover:border-white/20 transition shadow-lg flex flex-col justify-between group"
        >
          <div>
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Bug className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Баг-трекер и идеи</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Сообщите об ошибке или предложите новую функцию напрямую разработчику.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
            <span>GitHub Issues</span>
            <ExternalLink className="w-3 h-3" />
          </div>
        </a>

        <a
          href={ORIGINAL_PROJECT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 border border-white/10 hover:border-white/20 transition shadow-lg flex flex-col justify-between group"
        >
          <div>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Оригинал Quitter</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Открытый проект brandonp2412/Quitter, вдохновивший концепцию.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-cyan-400 font-semibold">
            <span>GitHub Quitter</span>
            <ExternalLink className="w-3 h-3" />
          </div>
        </a>
      </div>

      {/* How GitHub Actions Builds APK (Visual Explainer) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-white/10 shadow-lg space-y-4">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white">
            Как устроен конвейер CI/CD и релизы в репозитории:
          </h3>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Все готовые сборки генерируются облачными раннерами GitHub Actions в репозитории проекта без необходимости ручной компиляции:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold font-mono">
              01
            </div>
            <h4 className="text-xs font-bold text-white">Коммит и тег релиза</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Разработчик отправляет тег версии (<code className="text-emerald-300 font-mono">git tag v1.2.0</code>). Пайплайн <code className="text-slate-300 font-mono">release-apk.yml</code> активируется автоматически.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center text-xs font-bold font-mono">
              02
            </div>
            <h4 className="text-xs font-bold text-white">Сборка Android 5.0+ APK</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Node.js компилирует веб-приложение, а Gradle собирает нативный Android APK с <code className="text-teal-300 font-mono">minSdkVersion = 21</code> для поддержки старых и новых устройств.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold font-mono">
              03
            </div>
            <h4 className="text-xs font-bold text-white">Авто-Changelog & Публикация</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Скрипт формирует описание релиза на основе Conventional Commits и прикрепляет готовый файл <code className="text-emerald-300 font-mono">.apk</code> в раздел GitHub Releases.
            </p>
          </div>
        </div>
      </div>

      {/* Changelog & Releases Timeline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitCommit className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-200">
              История версий и изменений
            </h3>
          </div>
          <a
            href={GITHUB_RELEASES_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition"
          >
            <span>Все релизы на GitHub</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="space-y-4">
          {APP_CHANGELOG.map((rel) => (
            <div
              key={rel.version}
              className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 shadow-lg space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-bold text-white">
                    {rel.version}
                  </span>
                  {rel.badge && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {rel.badge}
                    </span>
                  )}
                  <span className="text-[11px] text-slate-400 font-mono">
                    Android 5.0+ Compatible
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {rel.date}
                </span>
              </div>

              <h4 className="text-xs font-semibold text-slate-200">
                {rel.title}
              </h4>

              <div className="space-y-1.5 pt-1">
                {rel.commits.map((c, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs">
                    <span className="font-mono uppercase font-bold text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 shrink-0 mt-0.5">
                      {c.type}
                    </span>
                    <span className="text-slate-300 leading-relaxed">
                      {c.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

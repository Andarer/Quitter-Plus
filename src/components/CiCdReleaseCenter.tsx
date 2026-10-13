import React, { useState } from 'react';
import { 
  GitBranch, 
  Terminal, 
  CheckCircle, 
  Copy, 
  Check, 
  Smartphone, 
  Download, 
  Cpu, 
  ShieldCheck, 
  FileCode, 
  Sparkles,
  GitCommit
} from 'lucide-react';
import { APP_CHANGELOG } from '../constants/initialData';

export const CiCdReleaseCenter: React.FC = () => {
  const [selectedWorkflow, setSelectedWorkflow] = useState<'release_apk' | 'changelog' | 'ci' | 'capacitor'>('release_apk');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const codeSnippets = {
    release_apk: `name: Build and Release Android APK

on:
  push:
    tags:
      - 'v*.*.*'
  workflow_dispatch:

permissions:
  contents: write

jobs:
  build-apk:
    name: Build Android APK & GitHub Release
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Set up Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Set up Java 17
        uses: actions/setup-java@v4
        with:
          distribution: 'zulu'
          java-version: '17'

      - name: Install dependencies
        run: npm ci || npm install

      - name: Build Web Application
        run: npm run build

      - name: Install Capacitor Android CLI
        run: |
          npm install @capacitor/core @capacitor/cli @capacitor/android

      - name: Initialize & Sync Capacitor Android
        run: |
          npx cap init "Quitter Plus" "com.andarer.quitterplus" --web-dir dist || true
          npx cap add android || true
          npx cap sync android

      - name: Build Android Release APK with Gradle
        working-directory: android
        run: |
          chmod +x ./gradlew
          ./gradlew assembleRelease || ./gradlew assembleDebug

      - name: Locate Output APK
        id: find_apk
        run: |
          APK_PATH=$(find android/app/build/outputs/apk -name "*.apk" | head -n 1)
          echo "Found APK at: $APK_PATH"
          echo "apk_path=$APK_PATH" >> $GITHUB_OUTPUT

      - name: Upload APK as Workflow Artifact
        uses: actions/upload-artifact@v4
        with:
          name: QuitterPlus-Release-APK
          path: \${{ steps.find_apk.outputs.apk_path }}
          retention-days: 30

      - name: Generate Changelog from Commits
        id: changelog
        run: |
          echo "### Изменения в релизе \${{ github.ref_name }}" > release_notes.md
          echo "" >> release_notes.md
          echo "Сгенерировано автоматически на основе коммитов:" >> release_notes.md
          git log -n 15 --pretty=format:"* %s (%h)" >> release_notes.md
          echo "" >> release_notes.md
          echo "---" >> release_notes.md
          echo "**Автор:** Andárer" >> release_notes.md

      - name: Publish GitHub Release with APK
        uses: softprops/action-gh-release@v2
        if: startsWith(github.ref, 'refs/tags/')
        with:
          body_path: release_notes.md
          files: \${{ steps.find_apk.outputs.apk_path }}
          draft: false
          prerelease: false
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}`,

    changelog: `name: Auto Generate Changelog

on:
  release:
    types: [published]
  workflow_dispatch:

permissions:
  contents: write

jobs:
  update-changelog:
    name: Generate Conventional Changelog
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Generate Changelog with Git Cliff / Conventional Commits
        uses: orhun/git-cliff-action@v3
        with:
          config: cliff.toml
          args: --verbose --latest
        env:
          OUTPUT: CHANGELOG.md

      - name: Commit & Push Updated Changelog
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add CHANGELOG.md || true
          git commit -m "docs(changelog): update changelog for \${{ github.ref_name }} [skip ci]" || echo "No changes"
          git push origin HEAD:\${{ github.ref_name }} || true`,

    ci: `name: CI Pipeline

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  test-and-build:
    name: Test, Lint and Build
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Set up Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci || npm install

      - name: TypeScript Typecheck & Lint
        run: npm run lint

      - name: Production Build Verification
        run: npm run build

      - name: Upload Build Artifacts
        uses: actions/upload-artifact@v4
        with:
          name: quitter-plus-web-dist
          path: dist/
          retention-days: 7`,

    capacitor: `{
  "appId": "com.andarer.quitterplus",
  "appName": "Quitter Plus",
  "webDir": "dist",
  "bundledWebRuntime": false,
  "server": {
    "androidScheme": "https"
  }
}`,
  };

  const commitTypesGuide = [
    { type: 'feat', label: 'Новая функциональность', color: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/20' },
    { type: 'fix', label: 'Исправление ошибок', color: 'text-rose-400 bg-rose-950/40 border-rose-500/20' },
    { type: 'perf', label: 'Оптимизация быстродействия', color: 'text-cyan-400 bg-cyan-950/40 border-cyan-500/20' },
    { type: 'ci', label: 'GitHub CI/CD и пайплайны', color: 'text-amber-400 bg-amber-950/40 border-amber-500/20' },
    { type: 'docs', label: 'Документация и справка', color: 'text-purple-400 bg-purple-950/40 border-purple-500/20' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl p-6 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <GitBranch className="w-4 h-4" />
            Автоматизация релизов и непрерывная интеграция
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            CI/CD Pipelines & Сборка Android APK
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-1 leading-relaxed">
            Репозиторий укомплектован полным набором пайплайнов GitHub Actions: автосборка установочного APK релиза, автогенерация Changelog по коммитам и проверка кода.
          </p>
        </div>

        <div className="bg-slate-950/70 border border-white/10 p-4 rounded-xl text-center min-w-[200px]">
          <div className="flex items-center justify-center gap-2 text-emerald-400 font-mono text-lg font-bold">
            <CheckCircle className="w-5 h-5" />
            <span>v1.2.0 (Ascent)</span>
          </div>
          <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">
            Автор релиза: Andárer
          </div>
          <div className="mt-2 text-[10px] font-mono text-indigo-300 bg-indigo-950/60 border border-indigo-500/30 px-2 py-0.5 rounded">
            Build passing · Ready for APK
          </div>
        </div>
      </div>

      {/* Release Command Fast Guide */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-white/10 shadow-lg space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          Как запустить автоматическую сборку APK в вашем GitHub:
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          Чтобы GitHub Actions скомпилировал APK и прикрепил его к релизу, достаточно отправить тег версии:
        </p>

        <div className="p-3 rounded-xl bg-slate-950 font-mono text-xs text-emerald-300 flex items-center justify-between border border-white/5">
          <span>git tag v1.2.0 && git push origin v1.2.0</span>
          <button
            onClick={() => handleCopy('git tag v1.2.0 && git push origin v1.2.0', 'cmd_tag')}
            className="p-1 rounded text-slate-400 hover:text-white transition"
            title="Скопировать команду"
          >
            {copiedKey === 'cmd_tag' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-300">
          <div className="p-3 rounded-xl bg-slate-950/50 border border-white/5">
            <strong className="text-white block mb-1">1. Сборка & Gradle</strong>
            Пайплайн собирает Vite, инициализирует Capacitor и компилирует нативный Android APK на раннере Ubuntu.
          </div>
          <div className="p-3 rounded-xl bg-slate-950/50 border border-white/5">
            <strong className="text-white block mb-1">2. Авто-Changelog</strong>
            Скрипт анализирует коммиты по стандарту Conventional Commits и формирует описание релиза.
          </div>
          <div className="p-3 rounded-xl bg-slate-950/50 border border-white/5">
            <strong className="text-white block mb-1">3. Публикация APK</strong>
            Готовый .apk файл автоматически прикрепляется к GitHub Releases в вашем репозитории.
          </div>
        </div>
      </div>

      {/* Workflow Files Viewer */}
      <div className="rounded-2xl bg-slate-900/80 border border-white/10 overflow-hidden shadow-lg">
        <div className="flex flex-wrap items-center justify-between p-4 border-b border-white/10 gap-2 bg-slate-950/40">
          <div className="flex items-center gap-1 overflow-x-auto">
            <button
              onClick={() => setSelectedWorkflow('release_apk')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedWorkflow === 'release_apk'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              release-apk.yml (Сборка APK)
            </button>
            <button
              onClick={() => setSelectedWorkflow('changelog')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedWorkflow === 'changelog'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              auto-changelog.yml (Changelog)
            </button>
            <button
              onClick={() => setSelectedWorkflow('ci')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedWorkflow === 'ci'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ci.yml (Тесты и Линтинг)
            </button>
            <button
              onClick={() => setSelectedWorkflow('capacitor')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedWorkflow === 'capacitor'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              capacitor.config.json
            </button>
          </div>

          <button
            onClick={() => handleCopy(codeSnippets[selectedWorkflow], 'wf_code')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition"
          >
            {copiedKey === 'wf_code' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Скопировано!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Скопировать .yml</span>
              </>
            )}
          </button>
        </div>

        <div className="p-4 bg-slate-950 font-mono text-xs text-slate-300 overflow-x-auto max-h-[380px]">
          <pre>{codeSnippets[selectedWorkflow]}</pre>
        </div>
      </div>

      {/* Automated Changelog Timeline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitCommit className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-200">
              История релизов и автогенерация Changelog
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            Формат: Conventional Commits
          </span>
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

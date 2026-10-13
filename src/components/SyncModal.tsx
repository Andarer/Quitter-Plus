import React, { useState } from 'react';
import { 
  X, 
  Cloud, 
  Download, 
  Upload, 
  Key, 
  Copy, 
  Check, 
  FileSpreadsheet, 
  RefreshCw, 
  AlertTriangle,
  HardDrive
} from 'lucide-react';
import { StorageService } from '../services/storage';
import { SyncDataPayload } from '../types';

interface SyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataReload: () => void;
  lastSynced: string | null;
}

export const SyncModal: React.FC<SyncModalProps> = ({
  isOpen,
  onClose,
  onDataReload,
  lastSynced,
}) => {
  const [syncKey, setSyncKey] = useState(() => StorageService.getSyncKey());
  const [remoteKeyInput, setRemoteKeyInput] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [showWipeConfirm, setShowWipeConfirm] = useState(false);

  if (!isOpen) return null;

  const handleCopyKey = () => {
    navigator.clipboard.writeText(syncKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handlePushSync = async () => {
    setIsSyncing(true);
    setSyncMessage(null);
    try {
      const res = await StorageService.syncToCloud(syncKey);
      if (res.success) {
        setSyncMessage({ text: res.message, type: 'success' });
        onDataReload();
      } else {
        setSyncMessage({ text: res.message, type: 'error' });
      }
    } catch {
      setSyncMessage({ text: 'Ошибка соединения при синхронизации', type: 'error' });
    } finally {
      setIsSyncing(false);
    }
  };

  const handlePullSync = async () => {
    if (!remoteKeyInput.trim()) return;
    setIsSyncing(true);
    setSyncMessage(null);
    try {
      const res = await StorageService.restoreFromCloud(remoteKeyInput.trim());
      if (res.success) {
        setSyncMessage({ text: res.message, type: 'success' });
        StorageService.setSyncKey(remoteKeyInput.trim());
        setSyncKey(remoteKeyInput.trim().toUpperCase());
        onDataReload();
      } else {
        setSyncMessage({ text: res.message, type: 'error' });
      }
    } catch {
      setSyncMessage({ text: 'Ошибка восстановления данных', type: 'error' });
    } finally {
      setIsSyncing(false);
    }
  };

  // Export JSON file
  const handleExportJSON = () => {
    const payload = StorageService.exportFullBackup();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `quitter-plus-backup-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Export CSV
  const handleExportCSV = () => {
    const csvContent = StorageService.exportCravingsCSV();
    const encodedUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `quitter-cravings-export-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Import JSON file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed: SyncDataPayload = JSON.parse(event.target?.result as string);
        const ok = StorageService.importFullBackup(parsed);
        if (ok) {
          setSyncMessage({ text: 'Резервная копия успешно восстановлена!', type: 'success' });
          onDataReload();
        } else {
          setSyncMessage({ text: 'Не удалось прочитать структуру файла', type: 'error' });
        }
      } catch {
        setSyncMessage({ text: 'Файл поврежден или имеет неверный формат JSON', type: 'error' });
      }
    };
    reader.readAsText(file);
  };

  const handleWipeData = () => {
    StorageService.resetAllData();
    onDataReload();
    setShowWipeConfirm(false);
    setSyncMessage({ text: 'Все локальные данные очищены и сброшены к начальным значениям', type: 'success' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-white/10 p-6 text-slate-200 shadow-2xl relative flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Облачная синхронизация и бэкапы
              </h3>
              <p className="text-xs text-slate-400">
                Синхронизация между телефоном, планшетом и ПК
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Banner */}
        {syncMessage && (
          <div
            className={`my-3 p-3 rounded-xl text-xs font-medium ${
              syncMessage.type === 'success'
                ? 'bg-emerald-950/60 border border-emerald-500/30 text-emerald-300'
                : 'bg-rose-950/60 border border-rose-500/30 text-rose-300'
            }`}
          >
            {syncMessage.text}
          </div>
        )}

        <div className="overflow-y-auto flex-1 py-4 space-y-6 pr-1">
          {/* Section 1: Device Sync Code */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Key className="w-4 h-4 text-emerald-400" />
                Ваш уникальный код синхронизации
              </span>
              <span className="text-[10px] text-slate-400">
                {lastSynced ? `Обновлено: ${new Date(lastSynced).toLocaleTimeString()}` : 'Локально'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={syncKey}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 font-mono text-sm text-emerald-300 font-bold tracking-wider select-all"
              />
              <button
                onClick={handleCopyKey}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition shrink-0"
                title="Скопировать ключ"
              >
                {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Введите этот код на другом устройстве, чтобы объединить данные без регистрации и паролей.
            </p>

            <button
              onClick={handlePushSync}
              disabled={isSyncing}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Синхронизация...' : 'Выгрузить в облако сейчас'}</span>
            </button>
          </div>

          {/* Section 2: Connect another device */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/5 space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Подключить другое устройство
            </h4>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Введите код (например QP-8K4F2L)"
                value={remoteKeyInput}
                onChange={(e) => setRemoteKeyInput(e.target.value.toUpperCase())}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder:text-slate-500 font-mono focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={handlePullSync}
                disabled={isSyncing || !remoteKeyInput.trim()}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white text-xs font-semibold shrink-0 transition"
              >
                Загрузить
              </button>
            </div>
          </div>

          {/* Section 3: File Import / Export */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-cyan-400" />
              Экспорт и Импорт файлов
            </h4>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleExportJSON}
                className="p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-white/5 text-left transition flex flex-col justify-between"
              >
                <Download className="w-4 h-4 text-emerald-400 mb-1" />
                <span className="text-xs font-medium text-white">Скачать JSON бэкап</span>
                <span className="text-[10px] text-slate-400">Полный снимок базы</span>
              </button>

              <button
                onClick={handleExportCSV}
                className="p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-white/5 text-left transition flex flex-col justify-between"
              >
                <FileSpreadsheet className="w-4 h-4 text-cyan-400 mb-1" />
                <span className="text-xs font-medium text-white">Экспорт в CSV</span>
                <span className="text-[10px] text-slate-400">Для Excel и Google Таблиц</span>
              </button>
            </div>

            <label className="block p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/60 border border-dashed border-white/10 cursor-pointer text-center transition">
              <Upload className="w-4 h-4 text-slate-400 mx-auto mb-1" />
              <span className="text-xs font-medium text-slate-300 block">
                Восстановить из файла .JSON
              </span>
              <span className="text-[10px] text-slate-500">
                Нажмите для выбора файла резервной копии
              </span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Section 4: Data Reset */}
          <div className="pt-2 border-t border-white/5">
            {!showWipeConfirm ? (
              <button
                onClick={() => setShowWipeConfirm(true)}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 transition"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Сбросить все локальные данные</span>
              </button>
            ) : (
              <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 space-y-2">
                <p className="text-xs text-rose-300">
                  Вы уверены? Это действие сотрет все трекеры, привычки и журнал тяги.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleWipeData}
                    className="py-1.5 px-3 rounded-lg bg-rose-600 text-white text-xs font-semibold"
                  >
                    Да, удалить всё
                  </button>
                  <button
                    onClick={() => setShowWipeConfirm(false)}
                    className="py-1.5 px-3 rounded-lg bg-slate-800 text-slate-300 text-xs"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition shrink-0"
        >
          Готово
        </button>
      </div>
    </div>
  );
};

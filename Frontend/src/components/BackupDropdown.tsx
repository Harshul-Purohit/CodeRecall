import React, { useState, useRef, useEffect } from 'react';
import {
  Download,
  Upload,
  RotateCcw,
  Database,
  ChevronDown,
  AlertCircle,
  FileCheck,
  X
} from 'lucide-react';
import { useProblemContext } from '../context/ProblemContext';
import { useToast } from '../context/ToastContext';

export const BackupDropdown: React.FC = () => {
  const { problems, exportDeck, importDeck, resetToDefaultDeck } = useProblemContext();
  const { showToast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [importPendingFile, setImportPendingFile] = useState<{
    rawJson: string;
    cardCount: number;
    logCount: number;
    filename: string;
  } | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setShowResetConfirm(false);
        setImportPendingFile(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle Export
  const handleExport = async () => {
    try {
      setIsExporting(true);
      await exportDeck();
      showToast(`Study deck (${problems.length} cards) exported successfully!`, 'success');
      setIsOpen(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Export failed';
      showToast(`Export failed: ${msg}`, 'error');
    } finally {
      setIsExporting(false);
    }
  };

  // Trigger file selection for Import
  const handleTriggerImport = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
    setIsOpen(false);
  };

  // Process chosen JSON file & validate schema
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        let cardCount = 0;
        let logCount = 0;

        if (Array.isArray(parsed)) {
          cardCount = parsed.length;
        } else if (parsed && typeof parsed === 'object') {
          if (Array.isArray(parsed.problems)) {
            cardCount = parsed.problems.length;
          }
          if (Array.isArray(parsed.reviewLogs)) {
            logCount = parsed.reviewLogs.length;
          }
        }

        if (cardCount === 0) {
          showToast('Invalid JSON schema: No problem cards found in payload.', 'error');
          return;
        }

        // Stage for user confirmation
        setImportPendingFile({
          rawJson: text,
          cardCount,
          logCount,
          filename: file.name
        });
      } catch {
        showToast('Invalid JSON format: Could not parse selected file.', 'error');
      }
    };

    reader.onerror = () => {
      showToast('Error reading backup file.', 'error');
    };

    reader.readAsText(file);
  };

  // Confirm and execute import
  const handleConfirmImport = async () => {
    if (!importPendingFile) return;
    try {
      await importDeck(importPendingFile.rawJson);
      showToast(
        `Merged ${importPendingFile.cardCount} cards from ${importPendingFile.filename}!`,
        'success'
      );
      setImportPendingFile(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Import failed';
      showToast(`Import rejected: ${msg}`, 'error');
    }
  };

  // Confirm and execute Reset
  const handleConfirmReset = async () => {
    try {
      await resetToDefaultDeck();
      showToast('Deck successfully restored to default seed cards (Two Sum, Stock, 3Sum, LRU Cache)!', 'success');
      setShowResetConfirm(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Reset failed';
      showToast(`Reset failed: ${msg}`, 'error');
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Hidden file input for import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json,application/json"
        className="hidden"
      />

      {/* Dropdown Toggle Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#4F3B78] hover:bg-[#927FBF] text-[#C4BBF0] hover:text-[#363B4E] border border-[#927FBF] rounded-md text-xs font-mono font-semibold transition-all duration-150 shadow-md focus:outline-none focus:ring-2 focus:ring-[#C4BBF0]"
        title="Backup & Restore Study Deck"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Database className="w-3.5 h-3.5 shrink-0" />
        <span className="hidden sm:inline">Backup & Sync</span>
        <ChevronDown
          className={`w-3 h-3 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu Panel (Strict Slate/Lavender Hierarchy) */}
      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-64 rounded-lg bg-[#363B4E] border border-[#927FBF] shadow-2xl shadow-black/60 py-1.5 z-50 animate-slide-in font-mono text-xs"
        >
          <div className="px-3.5 py-2 border-b border-[#927FBF]/50 mb-1">
            <p className="text-[11px] font-semibold text-[#C4BBF0] uppercase tracking-wider">
              Offline Data & Sync
            </p>
            <p className="text-[10px] text-white/70 mt-0.5">
              IndexedDB Persistent State • {problems.length} total cards
            </p>
          </div>

          {/* 1. Export Deck */}
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full text-left px-3.5 py-2.5 flex items-center gap-2.5 text-white hover:bg-[#4F3B78] hover:text-[#C4BBF0] transition-colors disabled:opacity-50"
            role="menuitem"
          >
            <Download className="w-4 h-4 text-[#C4BBF0] shrink-0" />
            <div className="flex flex-col">
              <span className="font-semibold">Export Study Deck (.json)</span>
              <span className="text-[10px] text-[#C4BBF0]/70">
                Download cards & SM-2 review logs
              </span>
            </div>
          </button>

          {/* 2. Import Deck */}
          <button
            onClick={handleTriggerImport}
            className="w-full text-left px-3.5 py-2.5 flex items-center gap-2.5 text-white hover:bg-[#4F3B78] hover:text-[#C4BBF0] transition-colors"
            role="menuitem"
          >
            <Upload className="w-4 h-4 text-[#C4BBF0] shrink-0" />
            <div className="flex flex-col">
              <span className="font-semibold">Import Study Deck (.json)</span>
              <span className="text-[10px] text-[#C4BBF0]/70">
                Merge external cards with validation
              </span>
            </div>
          </button>

          {/* Divider */}
          <div className="border-t border-[#927FBF]/50 my-1" />

          {/* 3. Reset to Default Seed */}
          <button
            onClick={() => {
              setIsOpen(false);
              setShowResetConfirm(true);
            }}
            className="w-full text-left px-3.5 py-2 flex items-center gap-2.5 text-red-300 hover:bg-[#4F3B78] hover:text-red-200 transition-colors"
            role="menuitem"
          >
            <RotateCcw className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <div className="flex flex-col">
              <span className="font-semibold">Reset to Default Seed</span>
              <span className="text-[10px] text-red-400/80">Reinitialize high-yield deck</span>
            </div>
          </button>
        </div>
      )}

      {/* Confirmation Modal: Import Study Deck */}
      {importPendingFile && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#363B4E] border border-[#927FBF] rounded-xl max-w-md w-full p-6 shadow-2xl font-mono text-xs animate-scale-in">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5 text-[#C4BBF0]">
                <FileCheck className="w-5 h-5 text-[#22C55E]" />
                <h3 className="text-sm font-bold text-white">Import Study Deck</h3>
              </div>
              <button
                onClick={() => setImportPendingFile(null)}
                className="text-[#C4BBF0] hover:text-white p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-white/90 mb-3 leading-relaxed">
              Found valid backup file:{' '}
              <span className="text-[#C4BBF0] font-semibold">{importPendingFile.filename}</span>
            </p>

            <div className="bg-[#4F3B78] border border-[#927FBF] p-3 rounded-lg mb-5 space-y-1 text-white">
              <div className="flex justify-between">
                <span>Problem Cards Detected:</span>
                <strong className="text-[#C4BBF0]">{importPendingFile.cardCount}</strong>
              </div>
              <div className="flex justify-between">
                <span>Review History Logs:</span>
                <strong className="text-[#C4BBF0]">{importPendingFile.logCount}</strong>
              </div>
            </div>

            <p className="text-[11px] text-[#C4BBF0]/80 mb-5">
              Merging will add new cards and update existing cards by ID. Existing cards not in
              the file will be preserved.
            </p>

            <div className="flex justify-end gap-2.5">
              <button
                onClick={() => setImportPendingFile(null)}
                className="px-4 py-2 bg-transparent hover:bg-[#4F3B78] text-white border border-[#927FBF]/60 rounded-md font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmImport}
                className="px-4 py-2 bg-[#4F3B78] hover:bg-[#927FBF] text-[#C4BBF0] hover:text-[#363B4E] border border-[#927FBF] rounded-md font-bold transition-all shadow-md"
              >
                Merge & Import
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Reset to Default Seed */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#363B4E] border border-red-500/80 rounded-xl max-w-md w-full p-6 shadow-2xl font-mono text-xs animate-scale-in">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5 text-red-400">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <h3 className="text-sm font-bold text-white">Reset Study Deck?</h3>
              </div>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="text-[#C4BBF0] hover:text-white p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-white/90 mb-4 leading-relaxed">
              Are you sure you want to reset your study deck?
            </p>

            <div className="bg-[#4F3B78] border border-[#927FBF] p-3 rounded-lg mb-4 text-[11px] text-white/90 space-y-1.5">
              <p>• All custom problem cards will be replaced with standard high-yield problems.</p>
              <p>• Pre-populated seed deck: Two Sum, Best Time to Buy and Sell Stock, 3Sum, LRU Cache, etc.</p>
              <p>• Historical review attempt logs will be reinitialized.</p>
            </div>

            <p className="text-[11px] text-red-300 mb-5">
              Tip: You can use "Export Study Deck (.json)" first to keep a backup before resetting.
            </p>

            <div className="flex justify-end gap-2.5">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 bg-transparent hover:bg-[#4F3B78] text-white border border-[#927FBF]/60 rounded-md font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-md font-bold transition-all shadow-md"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

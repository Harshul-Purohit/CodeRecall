import { Problem, ReviewLogEntry, UserSettings } from '../types/problem';
import { INITIAL_CARDS } from '../data/mockProblems';

/**
 * Strongly typed storage keys for CodeRecall offline persistence
 */
export const STORAGE_KEYS = {
  CODERECALL_PROBLEMS: 'CODERECALL_PROBLEMS',
  CODERECALL_REVIEW_LOGS: 'CODERECALL_REVIEW_LOGS',
  CODERECALL_USER_SETTINGS: 'CODERECALL_USER_SETTINGS',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

export const DEFAULT_USER_SETTINGS: UserSettings = {
  defaultCodeLanguage: 'Python',
  dailyTarget: 5,
  shortcutsEnabled: true,
};

const DB_NAME = 'CodeRecallDB';
const DB_VERSION = 1;
const STORE_NAME = 'coderecall_store';

/**
 * Open IndexedDB connection with schema upgrade handling
 */
function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this environment'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error || new Error('Failed to open IndexedDB'));
    };
  });
}

/**
 * Low-level IndexedDB get helper
 */
async function idbGet<T>(key: StorageKey): Promise<T | null> {
  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);

      req.onsuccess = () => {
        resolve((req.result as T) ?? null);
      };

      req.onerror = () => {
        resolve(null);
      };
    });
  } catch {
    return null;
  }
}

/**
 * Low-level IndexedDB set helper
 */
async function idbSet<T>(key: StorageKey, value: T): Promise<boolean> {
  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(value, key);

      req.onsuccess = () => {
        resolve(true);
      };

      req.onerror = () => {
        resolve(false);
      };
    });
  } catch {
    return false;
  }
}

/**
 * Low-level IndexedDB clear helper
 */
async function idbClear(): Promise<boolean> {
  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.clear();

      req.onsuccess = () => {
        resolve(true);
      };

      req.onerror = () => {
        resolve(false);
      };
    });
  } catch {
    return false;
  }
}

/**
 * LocalStorage Fallback Helpers
 */
function localGet<T>(key: StorageKey): T | null {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function localSet<T>(key: StorageKey, value: T): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`[CodeRecall Storage] LocalStorage write failed for ${key}:`, err);
  }
}

function localRemove(key: StorageKey): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.removeItem(key);
  } catch (err) {
    console.warn(`[CodeRecall Storage] LocalStorage remove failed for ${key}:`, err);
  }
}

/**
 * --------------------------------------------------------------------------
 * Asynchronous Persistence API
 * --------------------------------------------------------------------------
 */

/**
 * Persists the entire problem list to IndexedDB and LocalStorage fallback.
 */
export async function saveProblems(problems: Problem[]): Promise<void> {
  // Always mirror to localStorage as synchronous safety net
  localSet(STORAGE_KEYS.CODERECALL_PROBLEMS, problems);
  // Persist structured clone to IndexedDB
  await idbSet(STORAGE_KEYS.CODERECALL_PROBLEMS, problems);
}

/**
 * Loads problems from IndexedDB with fallback to LocalStorage.
 * If storage is empty, initializes with high-yield seed data (Two Sum, Stock, 3Sum, LRU Cache).
 */
export async function loadProblems(): Promise<Problem[]> {
  // 1. Try IndexedDB
  const idbData = await idbGet<Problem[]>(STORAGE_KEYS.CODERECALL_PROBLEMS);
  if (Array.isArray(idbData) && idbData.length > 0) {
    return idbData;
  }

  // 2. Try LocalStorage fallback
  const localData = localGet<Problem[]>(STORAGE_KEYS.CODERECALL_PROBLEMS);
  if (Array.isArray(localData) && localData.length > 0) {
    // Sync back to IndexedDB asynchronously
    await idbSet(STORAGE_KEYS.CODERECALL_PROBLEMS, localData);
    return localData;
  }

  // 3. Storage empty: seed with INITIAL_CARDS
  const seedProblems = [...INITIAL_CARDS];
  await saveProblems(seedProblems);
  return seedProblems;
}

/**
 * Logs an individual recall attempt to the historical audit trail.
 */
export async function logReviewAttempt(log: ReviewLogEntry): Promise<void> {
  const currentLogs = await loadReviewHistory();
  const updatedLogs = [log, ...currentLogs];

  localSet(STORAGE_KEYS.CODERECALL_REVIEW_LOGS, updatedLogs);
  await idbSet(STORAGE_KEYS.CODERECALL_REVIEW_LOGS, updatedLogs);
}

/**
 * Loads the full historical log of review attempts.
 */
export async function loadReviewHistory(): Promise<ReviewLogEntry[]> {
  const idbLogs = await idbGet<ReviewLogEntry[]>(STORAGE_KEYS.CODERECALL_REVIEW_LOGS);
  if (Array.isArray(idbLogs)) {
    return idbLogs;
  }

  const localLogs = localGet<ReviewLogEntry[]>(STORAGE_KEYS.CODERECALL_REVIEW_LOGS);
  if (Array.isArray(localLogs)) {
    await idbSet(STORAGE_KEYS.CODERECALL_REVIEW_LOGS, localLogs);
    return localLogs;
  }

  return [];
}

/**
 * Saves user settings preferences.
 */
export async function saveUserSettings(settings: UserSettings): Promise<void> {
  localSet(STORAGE_KEYS.CODERECALL_USER_SETTINGS, settings);
  await idbSet(STORAGE_KEYS.CODERECALL_USER_SETTINGS, settings);
}

/**
 * Loads user settings preferences with default fallback.
 */
export async function loadUserSettings(): Promise<UserSettings> {
  const idbSettings = await idbGet<UserSettings>(STORAGE_KEYS.CODERECALL_USER_SETTINGS);
  if (idbSettings && typeof idbSettings === 'object') {
    return idbSettings;
  }

  const localSettings = localGet<UserSettings>(STORAGE_KEYS.CODERECALL_USER_SETTINGS);
  if (localSettings && typeof localSettings === 'object') {
    return localSettings;
  }

  return DEFAULT_USER_SETTINGS;
}

/**
 * Resets storage back to default seed deck (INITIAL_CARDS).
 */
export async function resetToDefaultSeed(): Promise<Problem[]> {
  const seedProblems = [...INITIAL_CARDS];
  localSet(STORAGE_KEYS.CODERECALL_PROBLEMS, seedProblems);
  localSet(STORAGE_KEYS.CODERECALL_REVIEW_LOGS, []);
  localSet(STORAGE_KEYS.CODERECALL_USER_SETTINGS, DEFAULT_USER_SETTINGS);

  await idbSet(STORAGE_KEYS.CODERECALL_PROBLEMS, seedProblems);
  await idbSet(STORAGE_KEYS.CODERECALL_REVIEW_LOGS, []);
  await idbSet(STORAGE_KEYS.CODERECALL_USER_SETTINGS, DEFAULT_USER_SETTINGS);

  return seedProblems;
}

/**
 * Clears all CodeRecall entries from IndexedDB and LocalStorage.
 */
export async function clearAllData(): Promise<void> {
  localRemove(STORAGE_KEYS.CODERECALL_PROBLEMS);
  localRemove(STORAGE_KEYS.CODERECALL_REVIEW_LOGS);
  localRemove(STORAGE_KEYS.CODERECALL_USER_SETTINGS);
  await idbClear();
}

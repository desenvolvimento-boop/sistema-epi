import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { NOMENCLATURE_DEFAULTS } from '../config/nomenclatureKeys';
import { nomenclatureService } from '../services/nomenclatureService';
import { authService } from '../services/authService';
import { useAuth } from './AuthContext';

type NomenclatureMap = Record<string, string>;

interface NomenclatureContextType {
  labels: NomenclatureMap;
  loading: boolean;
  t: (key: string, fallback?: string) => string;
  setLabels: (map: NomenclatureMap) => void;
  refreshNomenclature: () => Promise<void>;
}

const NomenclatureContext = createContext<NomenclatureContextType | undefined>(undefined);

const STORAGE_KEY = 'nomenclature';

function loadSavedNomenclature(): NomenclatureMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveNomenclature(map: NomenclatureMap): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export const NomenclatureProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [labels, setLabelsState] = useState<NomenclatureMap>(() => {
    const saved = loadSavedNomenclature();
    return Object.keys(saved).length
      ? { ...NOMENCLATURE_DEFAULTS, ...saved }
      : { ...NOMENCLATURE_DEFAULTS };
  });
  const [loading, setLoading] = useState(false);

  const setLabels = useCallback((map: NomenclatureMap) => {
    setLabelsState(map);
    saveNomenclature(map);
  }, []);

  const refreshNomenclature = useCallback(async () => {
    const token = authService.getToken();
    if (!token) return;
    setLoading(true);
    try {
      const resolved = await nomenclatureService.getResolved();
      setLabels({ ...NOMENCLATURE_DEFAULTS, ...resolved });
    } catch (err) {
      console.error('Erro ao carregar nomenclatura:', err);
    } finally {
      setLoading(false);
    }
  }, [setLabels]);

  useEffect(() => {
    if (!isAuthenticated) return;
    refreshNomenclature();
  }, [isAuthenticated, refreshNomenclature]);

  useEffect(() => {
    const onFocus = () => {
      if (document.visibilityState === 'visible' && authService.getToken()) {
        refreshNomenclature();
      }
    };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onFocus);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onFocus);
    };
  }, [refreshNomenclature]);

  const t = useCallback(
    (key: string, fallback?: string) => {
      if (labels[key]) return labels[key];
      if (fallback !== undefined) return fallback;
      return NOMENCLATURE_DEFAULTS[key] ?? key;
    },
    [labels]
  );

  const value = useMemo(
    () => ({ labels, loading, t, setLabels, refreshNomenclature }),
    [labels, loading, t, setLabels, refreshNomenclature]
  );

  return (
    <NomenclatureContext.Provider value={value}>
      {children}
    </NomenclatureContext.Provider>
  );
};

export const useNomenclature = () => {
  const ctx = useContext(NomenclatureContext);
  if (!ctx) {
    throw new Error('useNomenclature must be used within NomenclatureProvider');
  }
  return ctx;
};


import { parse } from "@babel/core";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useState, useEffect, useContext, useRef, useCallback, useMemo } from "react";
import { ScreenStack } from "react-native-screens";

const STORAGE_KEY = "apps.prefs.v1";
const SAVE_DEBOUNCE_MS = 150;

type Prefs = {
    showCrypto: boolean;
    theme: "system" | "light" | "dark";
    defaultFromCurrency: string | null; // e.g. USD
    defaultToCurrency: string | null; // e.g. EUR
};

const DEFAULT_PREFS: Prefs = {
    showCrypto: false,
    theme: "system",
    defaultFromCurrency: null,
    defaultToCurrency: null
};

type PrefsContextType = {
    prefs: Prefs;
    isHydrated: boolean;
    // setters
    setShowCrypto: (v: boolean) => void;
    setTheme: (t: Prefs["theme"]) => void;
    setDefaultFromCurrency: (c: string | null) => void;
    setDefaultToCurrency: (c: string | null) => void;
    // generic setter
    updatePrefs: (patch: Partial<Prefs>) => void;
}

const PrefsContext = createContext<PrefsContextType | undefined>(undefined);

export function PrefsProvider({ children }: { children: ReactNode }) {
    const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
    const [isHydrated, setIsHydrated] = useState(false);

    // Load once on mount
    useEffect(() => {
        (async () => {
            try {
                const raw = await AsyncStorage.getItem(STORAGE_KEY);
                if (raw) {
                    const parsed = JSON.parse(raw) as Partial<Prefs>;
                    // merge with defaults
                    setPrefs({ ...DEFAULT_PREFS, ...parsed })
                }
            } catch {

            } finally {
                setIsHydrated(true);
            }
        })();
    }, []);

    // debounced save when prefs changed after hydration
    const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    useEffect(() => {
        if (!isHydrated) return;
        if (saveTimer.current) clearTimeout(saveTimer.current);
        saveTimer.current = setTimeout(() => {
            AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(prefs)).catch(() => { });
        }, SAVE_DEBOUNCE_MS);
        return () => {
            if (saveTimer.current) clearTimeout(saveTimer.current);
        };
    }, [prefs, isHydrated]);

    // Setters
    const updatePrefs = useCallback((patch: Partial<Prefs>) => {
        setPrefs((p) => ({ ...p, ...patch }));
    }, []);

    const setShowCrypto = useCallback((v: boolean) => updatePrefs({ showCrypto: v }), [updatePrefs]);
    const setTheme = useCallback((t: Prefs["theme"]) => updatePrefs({ theme: t }), [updatePrefs]);
    const setDefaultFromCurrency = useCallback(
        (c: string | null) => updatePrefs({ defaultFromCurrency: c }),
        [updatePrefs]
    );
    const setDefaultToCurrency = useCallback(
        (c: string | null) => updatePrefs({ defaultToCurrency: c }),
        [updatePrefs]
    );

    const value = useMemo<PrefsContextType> (
        () => ({
            prefs,
            isHydrated,
            setShowCrypto,
            setTheme,
            setDefaultFromCurrency,
            setDefaultToCurrency,
            updatePrefs
        }),
        [prefs, isHydrated, setShowCrypto, setTheme, setDefaultFromCurrency, setDefaultToCurrency, updatePrefs]
    )

    return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>
};

export function usePrefs() {
  const ctx = useContext(PrefsContext);
  if (!ctx) throw new Error("usePrefs must be used within PrefsProvider");
  return ctx;
}
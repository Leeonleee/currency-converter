import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useState, useEffect, useContext } from "react";

type PrefsContextType = {
    showCrypto: boolean;
    setShowCrypto: (v: boolean) => void;
}

const PrefsContext = createContext<PrefsContextType | undefined>(undefined);
const KEY = "prefs.showCrypto";

export function PrefsProvider({ children }: { children: ReactNode }) {
    const [showCrypto, setShowCrypto] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            try {
                const saved = await AsyncStorage.getItem(KEY);
                if (saved !== null) setShowCrypto(saved === "1");
            } catch { }
        })();
    }, [])

    // persist on change
    useEffect(() => {
        AsyncStorage.setItem(KEY, showCrypto ? "1" : "0").catch(() => { });
    }, [showCrypto])

    return (
        <PrefsContext.Provider value={{ showCrypto, setShowCrypto }}>
            {children}
        </PrefsContext.Provider>
    )
}

export function usePrefs() {
    const ctx = useContext(PrefsContext);
    if (!ctx) throw new Error("usePrefs must be used within PrefsProvider");
    return ctx;
}

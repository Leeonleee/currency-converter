import { useState, useEffect, useMemo, useCallback } from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback, Keyboard } from "react-native";
import { Button, IconButton, List, TextInput } from "react-native-paper";
import CurrencyInput from "../../src/components/CurrencyInput";
import CurrenciesModal from "../../src/components/CurrenciesModal";
import CurrencyField from "../../src/components/CurrencyField";
import { convert } from "../../src/lib/currency";
import { fetchRates } from "../../src/lib/api";
import { getCurrencyDisplayName } from "../../src/lib/currencyNames";
import { isCrypto } from "../../src/lib/crypto";
import { PINNED_CODES } from "../../src/lib/pinnedCurrencies";
import { usePrefs } from "../../src/providers/PrefsProvider";

export default function Home() {
    const [fromCurrency, setFromCurrency] = useState("USD");
    const [toCurrency, setToCurrency] = useState("EUR");
    const [fromValue, setFromValue] = useState("");
    const [toValue, setToValue] = useState("");
    const [rates, setRates] = useState<Record<string, number>>({})
    const [availableCurrencies, setAvailableCurrencies] = useState<string[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selecting, setSelecting] = useState<"from" | "to" | null>(null);
    const [lastEdited, setLastEdited] = useState<"from" | "to" | null>(null);
    const ratesReady = !!rates[fromCurrency] && !!rates[toCurrency];
    const { prefs } = usePrefs();

    // Load available currencies on launch
    useEffect(() => {
        (async () => {
            try {
                const data = await fetchRates();
                setRates(data.rates);
                setAvailableCurrencies(Object.keys(data.rates));
            } catch (error) {
                console.error("Failed to fetch currencies: ", error);
            }
        })();
    }, []);

    // when rates or either currency change, recompute based on the last edited side
    useEffect(() => {
        if (!ratesReady) return;

        if (lastEdited === "from" && fromValue) {
            const n = parseFloat(fromValue);
            if (Number.isNaN(n)) return;
            const res = convert(n, fromCurrency, toCurrency, rates);
            setToValue(Number.isFinite(res) ? res.toFixed(2) : "")
        } else if (lastEdited === "to" && toValue) {
            const n = parseFloat(toValue);
            if (Number.isNaN(n)) return;
            const res = convert(n, toCurrency, fromCurrency, rates);
            setFromValue(Number.isFinite(res) ? res.toFixed(2) : "")
        }
    }, [ratesReady, fromCurrency, toCurrency])

    const options = useMemo(() => {
        const src = availableCurrencies.filter((c) => prefs.showCrypto || !isCrypto(c));
        // pin currencies
        const pinnedSet = new Set(PINNED_CODES);
        const pinned = PINNED_CODES.filter((c) => src.includes(c));

        // sort everything else by display name
        const others = src
            .filter((c) => !pinnedSet.has(c))
            .sort((a, b) =>
                getCurrencyDisplayName(a).localeCompare(getCurrencyDisplayName(b))
            );
        return [...pinned, ...others];
    }, [availableCurrencies, prefs.showCrypto]);

    const pinnedCount = useMemo(
        () => PINNED_CODES.filter((c) => availableCurrencies.includes(c)).length,
        [availableCurrencies]
    )


    const handleFromChange = (val: string) => {
        setLastEdited("from");
        setFromValue(val);
        const n = parseFloat(val);
        if (!val) {
            setToValue("");
            return;
        }
        const res = convert(n, fromCurrency, toCurrency, rates);
        setToValue(Number.isFinite(res) ? res.toFixed(2) : "");
    }

    const handleToChange = (val: string) => {
        setLastEdited("to");
        setToValue(val);
        const n = parseFloat(val)
        if (!val) {
            setFromValue("");
            return;
        }
        const res = convert(n, toCurrency, fromCurrency, rates);
        setFromValue(Number.isFinite(res) ? res.toFixed(2) : "");
    }

    const handleSwap = () => {
        const tempFromCurrency = fromCurrency;
        const tempFromValue = fromValue;
        const tempToCurrency = toCurrency;
        const tempToValue = toValue;

        setFromCurrency(tempToCurrency);
        setToCurrency(tempFromCurrency);
        setFromValue(tempToValue);
        setToValue(tempFromValue);

    }

    const handleToggleCrypto = useCallback((v: boolean) => setShowCrypto(v), []);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.main}>
                <CurrencyField
                    title="From"
                    currency={fromCurrency}
                    value={fromValue}
                    onChangeText={handleFromChange}
                    onPressChangeCurrency={() => {
                        setSelecting("from");
                        setModalVisible(true);
                    }}
                    style={styles.currencyField}
                />

                <CurrencyField
                    title="To"
                    currency={toCurrency}
                    value={toValue}
                    onChangeText={handleToChange}
                    onPressChangeCurrency={() => {
                        setSelecting("to");
                        setModalVisible(true);
                    }}
                    style={styles.currencyField}
                />

                {/* Swap currency order  */}
                <IconButton icon="swap-vertical" onPress={handleSwap} style={styles.swap} />

                <CurrenciesModal
                    visible={modalVisible}
                    onDismiss={() => {
                        setModalVisible(false)
                        setSelecting(null);
                    }}
                    availableCurrencies={options}
                    onSelect={(currency) => {
                        if (selecting === "from") {
                            setFromCurrency(currency);
                            setLastEdited("from");
                            if (fromValue) {
                                const n = parseFloat(fromValue);
                                const res = convert(n, currency, toCurrency, rates);
                                setToValue(Number.isFinite(res) ? res.toFixed(2) : "")
                            } else {
                                setToValue("")
                            }
                        } else if (selecting === "to") {
                            // Ensures that when currency of 2nd field is changed, it doesn't convert the first currency
                            setToCurrency(currency);
                            setLastEdited("from")
                            if (toValue) {
                                const n = parseFloat(toValue);
                                const res = convert(n, currency, toCurrency, rates);
                                setToValue(Number.isFinite(res) ? res.toFixed(2) : "")
                            } else {
                                setToValue("");
                            }
                        }
                    }}
                    pinnedCount={pinnedCount}
                />
            </View>

        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center"
    },
    currencyField: {
        paddingHorizontal: 64
    },
    swap: {
        alignSelf: "center"
    }
})
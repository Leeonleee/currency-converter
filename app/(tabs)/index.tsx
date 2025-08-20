import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback, Keyboard } from "react-native";
import { Button, List, TextInput } from "react-native-paper";
import CurrencyInput from "../../src/components/CurrencyInput";
import CurrenciesModal from "../../src/components/CurrenciesModal";
import CurrencyField from "../../src/components/CurrencyField";
import { convert } from "../../src/lib/currency";
import { fetchRates } from "../../src/lib/api";

export default function Home() {
    const [fromCurrency, setFromCurrency] = useState("USD");
    const [toCurrency, setToCurrency] = useState("EUR");
    const [fromValue, setFromValue] = useState("");
    const [toValue, setToValue] = useState("");
    const [rates, setRates] = useState<Record<string, number>>({})
    const [availableCurrencies, setAvailableCurrencies] = useState<string[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selecting, setSelecting] = useState<"from" | "to" | null>(null);

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



    const handleFromChange = (val: string) => {
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
                <Button onPress={handleSwap}>
                    Swap
                </Button>

                <CurrenciesModal
                    visible={modalVisible}
                    onDismiss={() => {
                        setModalVisible(false)
                        setSelecting(null);
                    }}
                    availableCurrencies={availableCurrencies}
                    onSelect={(currency) => {
                        if (selecting === "from") {
                            setFromCurrency(currency);
                            if (fromValue) {
                                const n = parseFloat(fromValue);
                                const res = convert(n, currency, toCurrency, rates);
                                setToValue(Number.isFinite(res) ? res.toFixed(2) : "")
                            } else {
                                setToValue("")
                            }
                        }
                        if (selecting === "to") {
                            setToCurrency(currency);
                            if (toValue) {
                                const n = parseFloat(toValue);
                                const res = convert(n, currency, fromCurrency, rates);
                                setToValue(Number.isFinite(res) ? res.toFixed(2) : "")
                            }
                        }
                    }}
                    title={
                        selecting === "from" ? "Select source currency" : "Select target currency"
                    }
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
})
import { useState } from "react";
import { View, Text } from "react-native";
import { Button, List, TextInput } from "react-native-paper";
import CurrencyInput from "../../src/components/CurrencyInput";

export default function Home() {
    const [fromCurrency, setFromCurrency] = useState("USD");
    const [toCurrency, setToCurrency] = useState("EUR");
    const [fromValue, setFromValue] = useState("");
    const [toValue, setToValue] = useState("");

    // fake rate for now
    const rate = 0.85;

    const handleFromChange = (val: string) => {
        setFromValue(val);
        if (!val) {
            setToValue("");
            return;
        }
        const converted = (parseFloat(val) * rate).toFixed(2);
        setToValue(converted);
    }

    const handleToChange = (val: string) => {
        setToValue(val);
        if (!val) {
            setFromValue("");
            return;
        }
        const converted = (parseFloat(val) / rate).toFixed(2);
        setFromValue(converted);
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
        <View>
            <Text>Currency Converter</Text>

            <View>
                <List.Section>
                    <List.Accordion
                        title="Currency"

                    >
                        <List.Item title="First" />

                    </List.Accordion>

                </List.Section>
                <CurrencyInput
                    label={fromCurrency} 
                    value={fromValue}
                    onChangeText={handleFromChange}
                />
            </View>

            <View>
                <CurrencyInput
                    label={toCurrency} 
                    value={toValue}
                    onChangeText={handleToChange}
                />

            </View>

            {/* Swap currency order  */}
            <Button onPress={handleSwap}>
                Swap
            </Button>

        </View>
    );
}
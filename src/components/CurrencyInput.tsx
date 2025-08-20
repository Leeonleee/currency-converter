import { StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";

type CurrencyInputProps = {
    label: string;
    value: string;
    onChangeText: (val: string) => void;
}

export default function CurrencyInput({
    label,
    value,
    onChangeText
}: CurrencyInputProps) {

    return (
        <TextInput
            label={`${label}`}
            value={value}
            onChangeText={onChangeText}
            keyboardType="numeric" 
            mode="outlined"
            style={styles.currencyInput}
            outlineStyle={{
                borderRadius: 24
            }}
        />
    )
};

const styles = StyleSheet.create({
    currencyInput: {
    }
})
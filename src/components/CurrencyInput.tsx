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
        />
    )
};
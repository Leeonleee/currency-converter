import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import CurrencyInput from "./CurrencyInput"
import { Text, Button } from "react-native-paper";

type CurrencyFieldProps = {
    title: string;
    currency: string;
    value: string;
    onChangeText: (val: string) => void;
    onPressChangeCurrency: () => void;
    style?: StyleProp<ViewStyle>;
}

export default function CurrencyField({
    title,
    currency,
    value,
    onChangeText,
    onPressChangeCurrency,
    style
}: CurrencyFieldProps) {

    return (
        <View style={[styles.container, style]}>
            <View style={styles.top}>
                <Text>{title}</Text>
                <Button onPress={onPressChangeCurrency}>
                    Change Currency
                </Button>
            </View>

            <CurrencyInput
                label={currency}
                value={value}
                onChangeText={onChangeText}
            />
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 10
    },
    top: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    }
})
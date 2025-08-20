import { useCallback, useState } from "react"
import { View, StyleSheet, FlatList, Pressable, StyleProp, ViewStyle} from "react-native"
import { Divider, List, Modal, Portal, Text, useTheme, IconButton, Switch } from "react-native-paper"
import { getCurrencyDisplayName } from "../lib/currencyNames";

type CurrenciesModalProps = {
    visible: boolean;
    onDismiss: () => void;
    availableCurrencies: string[];
    onSelect: (currency: string) => void;
    title?: string;
    style?: StyleProp<ViewStyle>;
    showCrypto?: boolean;
    onToggleCrypto?: (value: boolean) => void;
}


export default function CurrenciesModal({
    visible,
    onDismiss,
    availableCurrencies,
    onSelect,
    title = "Select currency",
    style,
    showCrypto,
    onToggleCrypto
}: CurrenciesModalProps) {
    const theme = useTheme();

    const render = ({ item }: { item: string }) => {
        const name = getCurrencyDisplayName(item);
        return (
            <List.Item
                title={`${name} (${item})`}
                onPress={() => {
                    onSelect(item);
                    onDismiss();
                }}
                right={(props) => (
                    <List.Icon {...props} icon="chevron-right" />
                )}
            />
        )
    }

    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={onDismiss}
                style={styles.modal}
                contentContainerStyle={[
                    styles.modal,
                    {
                        backgroundColor: theme.colors.surface,
                        borderRadius: theme.roundness
                    }
                ]}
            >

                <View style={styles.header}>
                    <Text variant="titleLarge">{title}</Text>

                  {/*   {typeof showCrypto === "boolean" && onToggleCrypto ? (
                        <View>
                            <Text>Crypto</Text>
                            <Switch value={showCrypto} onValueChange={onToggleCrypto}/>
                        </View>
                    ) : null } */}
                    <Switch value={showCrypto} onValueChange={onToggleCrypto}/>

                    <IconButton
                        onPress={onDismiss}
                        icon="close"
                    />
                </View>
                <FlatList
                    data={availableCurrencies}
                    keyExtractor={(item) => item}
                    ItemSeparatorComponent={Divider}
                    renderItem={(item) => render(item)}
                    style={styles.list}
                    // Performance stuff
               />
            </Modal>
        </Portal>
    )
};

const styles = StyleSheet.create({
    modal: {
        justifyContent: "flex-end",


    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10
    },
    list: {
        maxHeight: 300
    },
    currency: {

    }
});
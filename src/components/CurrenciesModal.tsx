import { useCallback, useState } from "react"
import { View, StyleSheet, FlatList, Pressable, StyleProp, ViewStyle } from "react-native"
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
    pinnedCount: number;
}


export default function CurrenciesModal({
    visible,
    onDismiss,
    availableCurrencies,
    onSelect,
    title = "Select currency",
    style,
    showCrypto,
    onToggleCrypto,
    pinnedCount = 0
}: CurrenciesModalProps) {
    const theme = useTheme();

    const handleToggle = (v: boolean) => {
        onToggleCrypto?.(v); // do nothing if undefined
    }

    const renderItem = useCallback(
        ({ item, index }: { item: string; index: number }) => {
            const name = getCurrencyDisplayName(item);
            const isLast = index === availableCurrencies.length - 1;
            const isAfterPinned = pinnedCount > 0 && index === pinnedCount - 1 && !isLast;

            return (
                <View>
                    <List.Item
                        title={`${name} (${item})`}
                        onPress={() => {
                            onSelect(item);
                            onDismiss();
                        }}
                        right={(props) => <List.Icon {...props} icon="chevron-right" />}
                    />
                    {!isLast && (
                        <Divider
                            style={
                                isAfterPinned
                                    ? { height: 2, backgroundColor: theme.colors.outline }
                                    : undefined
                            }
                            bold={isAfterPinned}
                        />
                    )}
                </View>
            )
        },
        [availableCurrencies.length, pinnedCount, onSelect, onDismiss, theme.colors.outline]
    )

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
                    {/* <Switch value={showCrypto} onValueChange={handleToggle} /> */}
                    <IconButton onPress={onDismiss} icon="close" />
                </View>
                <FlatList
                    data={availableCurrencies}
                    keyExtractor={(item) => item}
                    ItemSeparatorComponent={Divider}
                    renderItem={renderItem}
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
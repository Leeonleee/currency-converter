import { useState } from "react"
import { View, StyleSheet, FlatList, Pressable } from "react-native"
import { Divider, List, Modal, Portal, Text, useTheme } from "react-native-paper"

type CurrenciesModalProps = {
    visible: boolean;
    onDismiss: () => void;
    availableCurrencies: string[];
    onSelect: (currency: string) => void;
    title?: string;
}

export default function CurrenciesModal({
    visible,
    onDismiss,
    availableCurrencies,
    onSelect,
    title = "Select currency"
}: CurrenciesModalProps) {
    const theme = useTheme();

    const render = ({ item }: { item: string }) => {
        return (
            <Pressable
                onPress={() => {
                    onSelect(item);
                    onDismiss();
                }}
            >
                <Text
                    variant="titleLarge"
                >
                    {item}
                </Text>
            </Pressable>
        )
    }

    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={onDismiss}
                contentContainerStyle={[
                    styles.modal,
                    {
                        backgroundColor: theme.colors.surface,
                        borderRadius: theme.roundness
                    }
                ]}
            >

                <View style={styles.header}>
                    <Text variant="titleMedium">{title}</Text>
                    <Pressable
                        onPress={onDismiss}
                    >
                        <Text variant="titleMedium">Close</Text>
                    </Pressable>
                </View>
                <FlatList
                    data={availableCurrencies}
                    keyExtractor={(item) => item}
                    ItemSeparatorComponent={Divider}
                    renderItem={(item) => render(item)}
                    /* renderItem={({ item }) => (
                        <List.Item
                            title={item}
                            onPress={() => {
                                onSelect(item);
                                onDismiss();
                            }}
                            right={(props) => (
                                <List.Icon
                                    {...props}   
                                    icon="chevron-right"
                                />
                            )}
                        />
                    )}    */   
                />
            </Modal>
        </Portal>
    )
};

const styles = StyleSheet.create({
    modal: {
        backgroundColor: "white",
        padding: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    currency: {

    }
});
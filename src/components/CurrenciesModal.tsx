import { useCallback, useState } from "react"
import { View, StyleSheet, FlatList, Pressable, StyleProp, ViewStyle} from "react-native"
import { Divider, List, Modal, Portal, Text, useTheme, IconButton } from "react-native-paper"

type CurrenciesModalProps = {
    visible: boolean;
    onDismiss: () => void;
    availableCurrencies: string[];
    onSelect: (currency: string) => void;
    title?: string;
    style?: StyleProp<ViewStyle>;
}


export default function CurrenciesModal({
    visible,
    onDismiss,
    availableCurrencies,
    onSelect,
    title = "Select currency",
    style
}: CurrenciesModalProps) {
    const theme = useTheme();

    const render = ({ item }: { item: string }) => {
        return (
            <List.Item
                title={item}
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
                    <Text variant="titleMedium">{title}</Text>
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
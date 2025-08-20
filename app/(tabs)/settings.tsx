import { View } from "react-native";
import { List, Switch, Text } from "react-native-paper";
import { usePrefs } from "../../src/providers/PrefsProvider";

export default function Settings() {
  const { showCrypto, setShowCrypto } = usePrefs();
  return (
    <View>
      <Text variant="titleLarge">Settings</Text>
      <List.Item
        title="Show cryptocurrencies"
        description="Enable cryptocurrencies in the picker"
        right={() => (
          <Switch value={showCrypto} onValueChange={setShowCrypto} />
        )}
      />
    </View>
  );
}

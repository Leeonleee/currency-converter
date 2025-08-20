import { View } from "react-native";
import { List, RadioButton, Switch, Text } from "react-native-paper";
import { usePrefs } from "../../src/providers/PrefsProvider";

export default function Settings() {
  const { prefs, setShowCrypto, setTheme } = usePrefs();

  
  return (
    <View>
      <Text variant="titleLarge">Settings</Text>
     {/* Toggle show crypto */}
      <List.Item
        title="Show cryptocurrencies"
        right={() => (
          <Switch value={prefs.showCrypto} onValueChange={setShowCrypto} />
        )}
      />

      <List.Subheader>Theme</List.Subheader>
      <RadioButton.Group
        onValueChange={(v) => setTheme(v as "system" | "light" | "dark")} 
        value={prefs.theme}
      >
        <RadioButton.Item label="System" value="system" />
        <RadioButton.Item label="Light" value="light" />
        <RadioButton.Item label="Dark" value="dark" />
        
      </RadioButton.Group>
    </View>
  );
}

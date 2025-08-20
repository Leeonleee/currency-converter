import { Tabs } from "expo-router";
import { PrefsProvider } from "../../src/providers/PrefsProvider";

export default function TabLayout() {
    return (
        <PrefsProvider>
            <Tabs> <Tabs.Screen
                name="index"
                options={{
                    title: "Home"
                }}
            />
                <Tabs.Screen
                    name="settings"
                    options={{
                        title: "Settings"
                    }}
                />
            </Tabs>
        </PrefsProvider>
    )
}
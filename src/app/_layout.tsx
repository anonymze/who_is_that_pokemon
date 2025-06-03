import "@/styles/app.css";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { View } from "react-native";
import { Slot } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(app)",
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <KeyboardProvider>
        <View className="flex-column flex-1 p-0">
          <Slot />
        </View>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

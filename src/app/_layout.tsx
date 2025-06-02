import "@/styles/app.css";
import { Slot } from "expo-router";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export const unstable_settings = {
  initialRouteName: "(app)",
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <View className="flex-column flex-1 p-0">
        <Slot />
      </View>
    </GestureHandlerRootView>
  );
}

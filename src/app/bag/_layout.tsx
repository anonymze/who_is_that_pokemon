import { Platform } from "react-native";
import { Stack } from "expo-router";

export default function FundesysLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        fullScreenGestureEnabled: true,
      }}
    >
      <Stack.Screen
        options={{
          presentation: "modal",
        }}
        name="index"
      />
    </Stack>
  );
}

import { SafeAreaView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useCallback } from "react";

export default function Login() {
  const router = useRouter();

  const onPress = useCallback(async () => {
    router.replace("/");
  }, [router]);

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 items-center justify-center p-4">
        <Text className="w-full text-center text-lg" onPress={onPress}>
          Login
        </Text>
      </View>
    </SafeAreaView>
  );
}

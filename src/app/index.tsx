import { Button, Text, View } from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";

export default function Page() {
  return (
    <View className="flex-1 pt-safe" style={{ backgroundColor: "red" }}>
      <View className="h-20 w-full items-center justify-center bg-red-900">
        <Text className="text-white font-bold text-2xl">
          Who's that Pokemon ?
        </Text>
      </View>
      <View className="size-32 bg-white rounded-full border-[5px] border-black items-center justify-center self-center mt-6">
        <View className="size-20 border-black border-2 rounded-full items-center justify-center">
          <Image
            source={require("@/assets/images/clefairy-black.png")}
            style={{ width: 40, height: 40 }}
            contentFit="contain"
          />
        </View>
      </View>
      <View className="flex-row items-center justify-center flex-wrap gap-14 my-10">
        <Button title="Languages" />
        <Button title="Nombre de pokémons" />
        <Button title="Générations" />
        <Button
          title="Start the game"
          onPress={() =>
            router.push({
              pathname: "/game",
              params: {
                limit: 10,
                generation: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
                lang: "fr",
              },
            })
          }
        />
      </View>
      <View className="relative flex-1 bg-white border-t-[5px] border-black">
        <View className="absolute -top-0.5 translate-y-[-50%] left-1/2 -translate-x-1/2 size-12 bg-white rounded-full border-[5px] border-black items-center justify-center">
          <View className="size-6 border-black border rounded-full items-center justify-center" />
        </View>
      </View>
    </View>
  );
}

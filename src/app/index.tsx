import RNPickerSelect from "react-native-picker-select";
import { Button, Text, View } from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import { useState } from "react";

const GENERATIONS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
const DEFAULT_LIMIT = 10;
const DEFAULT_LANG = "en";

export default function Page() {
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [generation, setGeneration] = useState(new Set(GENERATIONS));
  const [lang, setLang] = useState(DEFAULT_LANG);

  return (
    <View className="pt-safe flex-1" style={{ backgroundColor: "red" }}>
      <View className="h-20 w-full items-center justify-center bg-red-900">
        <Text className="text-2xl font-bold text-white">
          Who's that Pokemon ?
        </Text>
      </View>
      <View className="mt-6 size-32 items-center justify-center self-center rounded-full border-[5px] border-black bg-white">
        <View className="size-20 items-center justify-center rounded-full border-2 border-black">
          <Image
            source={require("@/assets/images/clefairy-black.png")}
            style={{ width: 40, height: 40 }}
            contentFit="contain"
          />
        </View>
      </View>
      <View className="my-10 flex-row flex-wrap items-center justify-center gap-14">
        <RNPickerSelect
          placeholder={{
            label: "Nombre de pokémons",
          }}
          value={limit}
          onValueChange={(value) => setLimit(value)}
          items={[
            { label: "10", value: "10" },
            { label: "25", value: "25" },
            { label: "50", value: "50" },
            { label: "100", value: "100" },
          ]}
        />
        <RNPickerSelect
          onValueChange={(value) => setGeneration(new Set(value))}
          placeholder={{
            label: "Générations",
            value: generation,
          }}
          items={[
            { label: "1", value: "1" },
            { label: "2", value: "2" },
            { label: "3", value: "3" },
            { label: "4", value: "4" },
            { label: "5", value: "5" },
            { label: "6", value: "6" },
            { label: "7", value: "7" },
            { label: "8", value: "8" },
            { label: "9", value: "9" },
          ]}
        />
        <RNPickerSelect
          placeholder={{
            label: "Language",
          }}
          value={lang}
          onValueChange={(value) => setLang(value)}
          items={[
            { label: "English", value: "en" },
            { label: "French", value: "fr" },
            { label: "German", value: "de" },
            { label: "Italian", value: "it" },
            { label: "Spanish", value: "es" },
          ]}
        />
        <Button
          title="Start the game"
          onPress={() =>
            router.push({
              pathname: "/game",
              params: {
                limit: limit,
                generation: Array.from(generation),
                lang: lang,
              },
            })
          }
        />
      </View>
      <View className="relative flex-1 border-t-[5px] border-black bg-white">
        <View className="absolute -top-0.5 left-1/2 size-12 -translate-x-1/2 translate-y-[-50%] items-center justify-center rounded-full border-[5px] border-black bg-white">
          <View className="size-6 items-center justify-center rounded-full border border-black" />
        </View>
      </View>
    </View>
  );
}

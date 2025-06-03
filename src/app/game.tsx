import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Dimensions, Text, View } from "react-native";
import { Redirect, useLocalSearchParams } from "expo-router";
import InputSearch from "@/components/ui/input-search";
import { getRandomPokemons } from "@/utils/helper";
import * as Progress from "react-native-progress";
import { Image } from "expo-image";
import React from "react";

const width = Dimensions.get("window").width;

export default function Page() {
  const { bottom } = useSafeAreaInsets();
  const { height } = useReanimatedKeyboardAnimation();
  const { limit, generation, lang } = useLocalSearchParams();
  const scrollViewRef = React.useRef<Animated.ScrollView>(null);
  const score = React.useRef(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: height.value ? height.value + bottom : 0 }],
    };
  });

  const animatedStyle2 = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: height.value ? height.value / 2.2 : 0 }],
    };
  });

  if (
    typeof limit !== "string" ||
    typeof generation !== "string" ||
    typeof lang !== "string"
  )
    return <Redirect href="/" />;

  const pokemons = getRandomPokemons({
    limit: limit,
    generation: generation.split(","),
  });

  console.log(pokemons);

  return (
    <Animated.View className="flex-1 pt-safe pb-safe bg-red-600">
      <View className="bg-red-600 px-4 h-20 flex-row w-full items-center justify-between">
        <Text className="text-white text-2xl font-bold">1 / {limit}</Text>
        <Text className="text-white text-2xl font-bold">Score : 0</Text>
        <Text className="text-white text-2xl font-bold">{lang}</Text>
      </View>
      <Progress.Bar
        animated
        progress={0.3}
        width={null}
        height={10}
        borderRadius={0}
        color="yellow"
        unfilledColor="blue"
        borderWidth={0}
      />
      <Animated.View
        className="flex-1 bg-blue-600 justify-center gap-2"
        style={animatedStyle2}
      >
        <Animated.ScrollView
          scrollEnabled={false}
          ref={scrollViewRef}
          horizontal
          style={{ flexGrow: 0 }}
          contentContainerStyle={{ gap: 10 }}
        >
          {pokemons.map((pokemon, index) => (
            <View
              key={index}
              className="items-center justify-center"
              style={{ width: width }}
            >
              <Image
                source={pokemon.image}
                style={{ width: 200, height: 200 }}
                contentFit="contain"
              />
            </View>
          ))}
        </Animated.ScrollView>
        <InputSearch
          autoCorrect={false}
          autoFocus={true}
          autoComplete="off"
          autoCapitalize="none"
          placeholder="Nom du pokemon"
          keyboardType="default"
          textContentType="oneTimeCode"
          enterKeyHint="next"
          onSubmitEditing={() => {
            console.log("submit editing");
          }}
        />
      </Animated.View>

      <View className="absolute bottom-0 pb-safe-offset-20 pb-20 left-0 right-0 flex-row gap-4 items-center justify-center">
        <View className="flex-row gap-2 items-center">
          <View className="size-4 bg-red-900 rounded-full"></View>
          <Text className="text-white text-lg font-semibold">Incorrect</Text>
        </View>
        <View className="flex-row gap-2 items-center">
          <View className="size-4 bg-orange-400 rounded-full"></View>
          <Text className="text-white text-lg font-semibold">2 letters</Text>
        </View>
        <View className="flex-row gap-2 items-center">
          <View className="size-4 bg-yellow-400 rounded-full"></View>
          <Text className="text-white text-lg font-semibold">1 letter</Text>
        </View>
      </View>

      <Animated.View
        className="h-16 bg-white  items-center justify-center w-full"
        style={animatedStyle}
      >
        <Button title="Finish" />
      </Animated.View>
    </Animated.View>
  );
}

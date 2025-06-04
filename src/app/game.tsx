import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getRandomPokemons, verifyString } from "@/utils/helper";
import { Button, Dimensions, Text, View } from "react-native";
import { Redirect, useLocalSearchParams } from "expo-router";
import InputSearch from "@/components/ui/input-search";
import * as Progress from "react-native-progress";
import { Image } from "expo-image";
import React from "react";

const width = Dimensions.get("window").width;

const prefetchNextImage = (url: string) => {
  Image.prefetch(url).catch(() => {});
};

export default function Page() {
  const { bottom } = useSafeAreaInsets();
  const { height } = useReanimatedKeyboardAnimation();
  const { limit, generation, lang } = useLocalSearchParams();
  const scrollViewRef = React.useRef<Animated.ScrollView>(null);
  const [score, setScore] = React.useState(0);
  const [indexScrollView, setIndexScrollView] = React.useState(0);

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

  const pokemons = React.useMemo(() => {
    return getRandomPokemons({
      limit: limit,
      generation: generation.split(","),
    });
  }, [limit, generation]);

  const verifyAnswer = React.useCallback(
    (input: string) => {
      console.log(pokemons[indexScrollView].names[lang]);
      const result = verifyString(input, pokemons[indexScrollView].names[lang]);

      console.log(result);

      if (result.isCorrect) {
        setScore((prev) => prev + 1);
        nextScroll();
      } else if (result.isClose) {
        // You can add visual feedback here for close answers
        console.log(`Close! Only ${result.distance} character(s) off`);
      } else {
        console.log(`Not close enough. ${result.distance} characters off`);
      }
    },
    [indexScrollView, pokemons, lang],
  );

  const nextScroll = React.useCallback(() => {
    console.log(indexScrollView, pokemons.length - 1);
    if (indexScrollView === pokemons.length - 1) return console.log("end");

    prefetchNextImage(pokemons[indexScrollView + 1].image);

    scrollViewRef.current?.scrollTo({
      x: (indexScrollView + 1) * width,
      y: 0,
      animated: false,
    });
  }, [indexScrollView, pokemons]);

  return (
    <Animated.View className="flex-1 pt-safe pb-safe bg-red-600">
      <View className="bg-red-600 px-4 h-20 flex-row w-full items-center justify-between">
        <Text className="text-white text-2xl font-bold">1 / {limit}</Text>
        <Text className="text-white text-2xl font-bold">Score : {score}</Text>
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
        className="flex-1 bg-blue-600 justify-center gap-3"
        style={animatedStyle2}
      >
        <Animated.ScrollView
          onLayout={() => {
            prefetchNextImage(pokemons[indexScrollView + 1].image);
          }}
          onScroll={(event) => {
            setIndexScrollView(
              Math.round(event.nativeEvent.contentOffset.x / width),
            );
          }}
          scrollEnabled={false}
          ref={scrollViewRef}
          horizontal
          style={{ flexGrow: 0 }}
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
          onSubmitEditing={(event) => {
            verifyAnswer(event.nativeEvent.text);
          }}
        />
        <Button
          title="Passer"
          onPress={() => {
            nextScroll();
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

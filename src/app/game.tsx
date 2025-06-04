import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import { getRandomPokemons, handleShake, verifyString } from "@/utils/helper";
import InputSearch, { InputSearchRef } from "@/components/ui/input-search";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Dimensions, Text, View } from "react-native";
import { Redirect, useLocalSearchParams } from "expo-router";
import * as Progress from "react-native-progress";
import { ShieldXIcon } from "lucide-react-native";
import ItFlag from "@/assets/flags/it.svg";
import FrFlag from "@/assets/flags/fr.svg";
import EsFlag from "@/assets/flags/es.svg";
import EnFlag from "@/assets/flags/en.svg";
import DeFlag from "@/assets/flags/de.svg";
import colors from "tailwindcss/colors";
import { Image } from "expo-image";
import React from "react";

const width = Dimensions.get("window").width;

const prefetchNextImage = (url: string) => {
  Image.prefetch(url).catch(() => {});
};

interface ResultGame {
  name: string;
  nameI18n: string;
  input: string;
  lang: string;
  types: string[];
  image: string;
  correct: boolean;
}

export default function Page() {
  const { bottom } = useSafeAreaInsets();
  const { height } = useReanimatedKeyboardAnimation();
  const { limit, generation, lang } = useLocalSearchParams();
  const shakeOffset = useSharedValue(0);

  const scrollViewRef = React.useRef<Animated.ScrollView>(null);
  const inputSearchRef = React.useRef<InputSearchRef>(null);

  const [score, setScore] = React.useState(0);
  const [indexScrollView, setIndexScrollView] = React.useState(0);
  const [state, setState] = React.useState<
    "error" | "almost" | "close" | undefined
  >();
  const results = React.useRef<Map<number, ResultGame>>(new Map());

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

      const id = pokemons[indexScrollView].id;
      const resultGame = {
        name: pokemons[indexScrollView].name,
        nameI18n: pokemons[indexScrollView].names[lang],
        input,
        lang: lang,
        image: pokemons[indexScrollView].image,
        types: pokemons[indexScrollView].types,
      };

      if (result.isCorrect) {
        results.current.set(id, { ...resultGame, correct: true });
        setScore((prev) => prev + 1);
        nextScroll();
      } else if (result.isClose) {
        results.current.set(id, { ...resultGame, correct: false });
        handleShake(shakeOffset);
        setState(result.distance === 1 ? "close" : "almost");
      } else {
        results.current.set(id, { ...resultGame, correct: false });
        handleShake(shakeOffset, "heavy");
        setState("error");
      }
    },
    [indexScrollView, pokemons, lang],
  );

  const nextScroll = React.useCallback(() => {
    if (indexScrollView === pokemons.length - 1) return console.log("end");

    // prefetchNextImage(pokemons[indexScrollView + 1].image);

    scrollViewRef.current?.scrollTo({
      x: (indexScrollView + 1) * width,
      y: 0,
      animated: false,
    });
  }, [indexScrollView, pokemons]);

  return (
    <Animated.View className="flex-1 pt-safe pb-safe bg-red-600">
      <View className="bg-red-600 px-4 h-20 flex-row w-full items-center justify-between">
        <Text className="w-20 text-white text-2xl font-bold">1 / {limit}</Text>
        <Text className="text-white text-2xl font-bold">Score : {score}</Text>
        <View className="w-20 items-end">
          <View className="bg-white rounded-full p-1">
            {lang === "fr" ? (
              <FrFlag width={42} height={42} />
            ) : lang === "es" ? (
              <EsFlag width={42} height={42} />
            ) : lang === "de" ? (
              <DeFlag width={42} height={42} />
            ) : lang === "it" ? (
              <ItFlag width={42} height={42} />
            ) : (
              <EnFlag width={42} height={42} />
            )}
          </View>
        </View>
      </View>
      <Progress.Bar
        animated
        progress={indexScrollView / (pokemons.length - 1)}
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
            // prefetchNextImage(pokemons[indexScrollView + 1].image);
          }}
          onScroll={(event) => {
            setState(undefined);
            inputSearchRef.current?.clear();
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
                style={{ width: 220, height: 220 }}
                contentFit="contain"
              />
            </View>
          ))}
        </Animated.ScrollView>
        <Animated.View
          className="w-9/12 mx-auto"
          style={{ transform: [{ translateX: shakeOffset }] }}
        >
          <InputSearch
            ref={inputSearchRef}
            submitBehavior="submit"
            state={state}
            autoCorrect={false}
            autoFocus={true}
            autoComplete="off"
            autoCapitalize="none"
            placeholder="Nom du pokemon"
            keyboardType="default"
            textContentType="oneTimeCode"
            enterKeyHint="next"
            onSubmitEditing={(event) => {
              if (event.nativeEvent.text.length < 1) return;
              verifyAnswer(event.nativeEvent.text);
            }}
          />
        </Animated.View>
        <Button
          color="white"
          title="Passer"
          onPress={() => {
            nextScroll();
          }}
        />
      </Animated.View>

      <View className="absolute bottom-0 pb-safe-offset-20 pb-20 left-0 right-0 flex-row gap-4 items-center justify-center">
        <View className="flex-row gap-2 items-center">
          <ShieldXIcon size={24} color={colors.red[600]} />
          <Text className="text-white text-lg font-semibold">Incorrect</Text>
        </View>
        <View className="flex-row gap-2 items-center">
          <ShieldXIcon size={24} color={colors.orange[500]} />
          <Text className="text-white text-lg font-semibold">2 letters</Text>
        </View>
        <View className="flex-row gap-2 items-center">
          <ShieldXIcon size={24} color={colors.yellow[400]} />
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

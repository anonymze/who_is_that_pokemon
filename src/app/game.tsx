import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import { getRandomPokemons, handleShake, verifyString } from "@/utils/helper";
import InputSearch, { InputSearchRef } from "@/components/ui/input-search";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Dimensions, Text, View } from "react-native";
import * as Progress from "react-native-progress";
import { ShieldXIcon } from "lucide-react-native";
import ItFlag from "@/assets/flags/it.svg";
import FrFlag from "@/assets/flags/fr.svg";
import EsFlag from "@/assets/flags/es.svg";
import EnFlag from "@/assets/flags/en.svg";
import DeFlag from "@/assets/flags/de.svg";
import { queryClient } from "@/api/config";
import { Pokemon } from "@/mock/pokemon";
import colors from "tailwindcss/colors";
import React, { useId } from "react";
import { Image } from "expo-image";

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
  const id = useId();
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

  console.log(limit, generation, lang);

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
    (input: string, skip: boolean = false) => {
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

      if (skip) {
        results.current.set(id, { ...resultGame, correct: false });
        nextScroll();
        return;
      }

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
    if (indexScrollView === pokemons.length - 1)
      return goToFinish({
        id,
        pokemons,
        lang,
        results: results.current,
        generation: generation,
        limit: limit,
      });

    // prefetchNextImage(pokemons[indexScrollView + 1].image);

    scrollViewRef.current?.scrollTo({
      x: (indexScrollView + 1) * width,
      y: 0,
      animated: false,
    });
  }, [indexScrollView, pokemons]);

  return (
    <Animated.View className="pt-safe pb-safe flex-1 bg-red-600">
      <View className="h-20 w-full flex-row items-center justify-between bg-red-600 px-4">
        <Text className="w-20 text-2xl font-bold text-white">1 / {limit}</Text>
        <Text className="text-2xl font-bold text-white">Score : {score}</Text>
        <View className="w-20 items-end">
          <View className="rounded-full bg-white p-1">
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
        className="flex-1 justify-center gap-3 bg-blue-600"
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
          className="mx-auto w-9/12"
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
            verifyAnswer("", true);
          }}
        />
      </Animated.View>

      <View className="pb-safe-offset-20 absolute bottom-0 left-0 right-0 flex-row items-center justify-center gap-4 pb-20">
        <View className="flex-row items-center gap-2">
          <ShieldXIcon size={24} color={colors.red[600]} />
          <Text className="text-lg font-semibold text-white">Incorrect</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <ShieldXIcon size={24} color={colors.orange[500]} />
          <Text className="text-lg font-semibold text-white">2 letters</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <ShieldXIcon size={24} color={colors.yellow[400]} />
          <Text className="text-lg font-semibold text-white">1 letter</Text>
        </View>
      </View>

      <Animated.View
        className="h-16 w-full items-center justify-center bg-white"
        style={animatedStyle}
      >
        <Button
          title="Finish"
          onPress={() => {
            goToFinish({
              id,
              pokemons,
              lang,
              results: results.current,
              generation: generation,
              limit: limit,
            });
          }}
        />
      </Animated.View>
    </Animated.View>
  );
}

const goToFinish = ({
  pokemons,
  lang,
  results,
  generation,
  id,
  limit,
}: {
  pokemons: Pokemon[];
  lang: string;
  results: Map<number, ResultGame>;
  generation: string;
  id: string;
  limit: string;
}) => {
  const finalresult = {
    pokemons,
    results,
  };
  queryClient.setQueryData(["finish", id], finalresult);
  return router.push({
    pathname: "/result/[id]",
    params: { id, limit, generation, lang },
  });
};

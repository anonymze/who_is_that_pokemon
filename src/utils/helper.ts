import { SharedValue, withTiming } from "react-native-reanimated";
import { withSequence } from "react-native-reanimated";
import { withRepeat } from "react-native-reanimated";
import { allPokemon } from "@/mock/pokemon";
import * as Haptics from "expo-haptics";

export const getRandomPokemons = ({
  limit,
  generation,
}: {
  limit: string;
  generation: string[];
}) => {
  const filteredPokemon = allPokemon.filter((pokemon) =>
    generation?.includes(pokemon.generation.toString()),
  );

  const randomIndexes = Array.from({ length: Number(limit) }, () =>
    Math.floor(Math.random() * filteredPokemon.length),
  );

  return randomIndexes.map((index) => filteredPokemon[index]);
};

const removeAccents = (str: string) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

const normalizeString = (str: string) => {
  return removeAccents(str.toLowerCase().trim());
};

const getLevenshteinDistance = (str1: string, str2: string): number => {
  const matrix = Array(str2.length + 1)
    .fill(null)
    .map(() => Array(str1.length + 1).fill(null));

  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + indicator, // substitution
      );
    }
  }

  return matrix[str2.length][str1.length];
};

export const verifyString = (input: string, pokemonName: string) => {
  const normalizedInput = normalizeString(input);
  const normalizedPokemon = normalizeString(pokemonName);

  if (normalizedInput === normalizedPokemon) {
    return { isCorrect: true, distance: 0 };
  }

  const distance = getLevenshteinDistance(normalizedInput, normalizedPokemon);

  return {
    isCorrect: false,
    distance: distance,
    isClose: distance <= 2, // Consider close if 1 or 2 characters different
  };
};

export const handleShake = (
  shakeOffset: SharedValue<number>,
  type: "light" | "heavy" = "light",
) => {
  const TIME = 65;
  const OFFSET = type === "light" ? 2 : 4;

  if (type === "light") {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } else {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }

  shakeOffset.value = withSequence(
    withTiming(-OFFSET, { duration: TIME / 2 }),
    withRepeat(withTiming(OFFSET, { duration: TIME }), 3, true),
    withTiming(0, { duration: TIME / 2 }),
  );
};

import { allPokemon } from "@/mock/pokemon";

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

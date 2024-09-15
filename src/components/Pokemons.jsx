import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CardView from "./Card";

const Pokemons = () => {
  const [pokemons, setPokemons] = useState([]);
  const [detailedPokemons, setDetailedPokemons] = useState([]);
  const [error, setError] = useState(null); // handle any errors
  const navigate = useNavigate();

  useEffect(() => {
    const getPokemons = async () => {
      try {
        const res = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=20");
        if (!res.ok) {
          throw new Error("Failed to get pokemon list");
        }

        const data = await res.json();
        setPokemons(data.results);
      } catch (error) {
        setError(error.message);
      }
    };

    getPokemons();
  }, []);

  // Fetch detailed Pokémon data once we have the list
  useEffect(() => {
    if (pokemons.length) {
      const getDetailedPokemonData = async () => {
        try {
          const detailedPromise = pokemons.map((pokemon) =>
            fetch(pokemon.url).then((res) => {
              if (!res.ok) {
                throw new Error(`Failed to get details for ${pokemon.name}`);
              }
              return res.json();
            })
          );

          const details = await Promise.all(detailedPromise);
          setDetailedPokemons(details);
        } catch (error) {
          setError(error.message);
        }
      };
      getDetailedPokemonData();
    }
  }, [pokemons]);

  const handleDetailsClick = (id) => {
    navigate(`/pokemons/${id}`);
  };

  // get specific stat value from stat array
  const getStatValue = (stats, statName) => {
    const stat = stats.find((stat) => stat.stat.name === statName);
    return stat ? stat.base_stat : "N/A"; // Default to 'N/A' if not found
  };

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="flex flex-wrap justify-center gap-4 w-full bg-black">
      <p className="text-white">pokemon1</p>
      {detailedPokemons.length > 0 ? (
        detailedPokemons.map((pokemon) => (
          <CardView
            key={pokemon.id}
            title={pokemon.name}
            image={pokemon.sprites.other.dream_world.front_default}
            onDetails={() => handleDetailsClick(pokemon.id)}
            content={`Height: ${pokemon.height}, Weight: ${
              pokemon.weight
            }, Speed: ${getStatValue(pokemon.stats, "speed")}`}
          />
        ))
      ) : (
        <p>Loading Pokemon...</p>
      )}
    </div>
  );
};

export default Pokemons;

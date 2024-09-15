import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CardView from "./Card2";

const PokemonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // fetch pokemon details when component mounts
  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch Pokémon details");
        }
        const data = await res.json();
        setPokemon(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchPokemonDetails();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const imageSrc =
    pokemon.sprites.other.dream_world.front_default ||
    pokemon.sprites.other["official-artwork"].front_default;

  // Extracting stats for progress bars
  const getStatValue = (stats, statName) => {
    const stat = stats.find((stat) => stat.stat.name === statName);
    return stat ? stat.base_stat : "N/A"; // Default to 'N/A' if not found
  };

  // Get the names of all types for the Pokémon
  const getTypeNames = (types) => {
    return types.map((typeObj) => typeObj.type.name).join(", "); // Join multiple types with commas
  };

  if (error) {
    return <p>Error: {error}</p>;
  }

  const stats = [
    { label: "Height", value: pokemon.height, max: 100 },
    { label: "Weight", value: pokemon.weight, max: 1500 },
    { label: "Speed", value: getStatValue(pokemon.stats, "speed"), max: 180 },
    { label: "HP", value: getStatValue(pokemon.stats, "hp"), max: 255 },
    { label: "Attack", value: getStatValue(pokemon.stats, "attack"), max: 190 },
    {
      label: "Defense",
      value: getStatValue(pokemon.stats, "defense"),
      max: 230,
    },
  ];

  return (
    <div className="flex justify-center bg-black">
      <CardView
        title={pokemon.name}
        image={imageSrc}
        content={`Type: ${getTypeNames(pokemon.types)}`}
        types={pokemon.types.map((typeObj) => typeObj.type.name)}
        stats={stats} // Pass stats to CardView
        buttons={[
          { label: "Close", onClick: () => navigate(-1) },
          {
            label: "Select",
            onClick: () => console.log(`Selected Pokemon ID: ${pokemon.id}`),
          },
        ]}
        size="large"
      />
    </div>
  );
};

export default PokemonDetails;

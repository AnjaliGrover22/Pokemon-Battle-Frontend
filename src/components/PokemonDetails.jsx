import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CardView from "./Card";

const PokemonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState(null);
  const [Loading, setLoading] = useState(true);
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
  if (Loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const imageSrc =
    pokemon.sprites.other.dream_world.front_default ||
    "https://via.placeholder.com/150";

  // Extracting stats
  const speed =
    pokemon.stats.find((stat) => stat.stat.name === "speed")?.base_stat ||
    "N/A";

  return (
    <div className="flex justify-center">
      <p className="text-white">
        this is a test to seethat i'm on the details page
      </p>
      <CardView
        title={pokemon.name}
        image={imageSrc}
        content={`height: ${pokemon.height},Weight: ${pokemon.weight}, Speed: ${speed} `}
        showButtons={false} // Hide buttons in detail view
        onClose={() => navigate(-1)}
      />
      <button
        onClick={() => navigate(-1)}
        className="rounded-md bg-slate-700 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        type="button"
      >
        close
      </button>
    </div>
  );
};

export default PokemonDetails;

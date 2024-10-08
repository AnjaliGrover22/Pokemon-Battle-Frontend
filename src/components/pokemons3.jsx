// src/components/Pokemons.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CardView from "./Card2";
import PokemonTypeFilter from "./PokemonTypeFilter.jsx"; // Adjust the path if necessary

const Pokemons = () => {
  const [pokemons, setPokemons] = useState([]);
  const [detailedPokemons, setDetailedPokemons] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const pokemonsPerPage = 96;
  const navigate = useNavigate();

  // Fetch Pokémon data for the current page
  useEffect(() => {
    const getPokemons = async () => {
      try {
        const url = `https://pokeapi.co/api/v2/pokemon?limit=${pokemonsPerPage}&offset=${
          (currentPage - 1) * pokemonsPerPage
        }`;
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error("Failed to get pokemon list");
        }
        const data = await res.json();
        setPokemons(data.results);
        setTotalCount(data.count);
      } catch (error) {
        setError(error.message);
      }
    };
    getPokemons();
  }, [currentPage]);

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

  const handleSelectClick = (id) => {
    console.log(`Selected Pokemon ID: ${id}`);
    navigate(`/battlefield/id/${id}`);
  };

  // Handle type toggle
  const handleTypeToggle = (type) => {
    setSelectedTypes((prevTypes) =>
      prevTypes.includes(type)
        ? prevTypes.filter((t) => t !== type)
        : [...prevTypes, type]
    );
  };

  // Filter Pokémon based on search query and selected types
  const filteredPokemons = detailedPokemons
    .filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(
      (pokemon) =>
        selectedTypes.length === 0 ||
        pokemon.types.some((t) => selectedTypes.includes(t.type.name))
    );

  const clearSearch = () => {
    setSearchQuery("");
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / pokemonsPerPage);

  return (
    <div className="w-full bg-black">
      {/* Search Bar */}
      <div className="flex justify-center my-4">
        <div className="relative w-80">
          <input
            type="text"
            placeholder="Search Pokémon by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 w-80 rounded-md border border-gray-300 pr-10"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center hover:bg-gray-400 focus:outline-none"
              aria-label="Clear search"
            >
              <span className="icon-cross">X</span>
            </button>
          )}
        </div>
      </div>

      {/* Pokémon Type Filter */}
      <PokemonTypeFilter
        selectedTypes={selectedTypes}
        onTypeToggle={handleTypeToggle}
      />

      {/* Pagination Controls */}
      <div className="flex justify-center mb-4">
        {currentPage !== 1 && (
          <button
            onClick={() => setCurrentPage(1)}
            className="mx-1 p-2 bg-gray-700 text-white rounded"
          >
            First
          </button>
        )}
        {Array.from({ length: totalPages }, (_, index) => index + 1)
          .slice(
            Math.max(0, Math.min(currentPage - 2, totalPages - 3)),
            Math.max(3, Math.min(totalPages, currentPage + 1))
          )
          .map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`mx-1 p-2 rounded ${
                currentPage === page
                  ? "bg-blue-500 text-white"
                  : "bg-gray-700 text-white"
              }`}
            >
              {page}
            </button>
          ))}
        <button
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
          className="mx-1 p-2 bg-gray-700 text-white rounded"
        >
          Last
        </button>
      </div>

      {/* Pokémon Cards */}
      <div className="grid grid-cols-6 gap-4 justify-center px-4">
        {filteredPokemons.length > 0 ? (
          filteredPokemons.map((pokemon) => {
            const image =
              pokemon.sprites.other.dream_world.front_default ||
              pokemon.sprites.other["official-artwork"].front_default;
            return (
              <CardView
                key={pokemon.id}
                title={pokemon.name}
                image={image}
                onDetails={() => handleDetailsClick(pokemon.id)}
                buttons={[
                  {
                    label: "Details",
                    onClick: () => handleDetailsClick(pokemon.id),
                  },
                  {
                    label: "Select",
                    onClick: () => handleSelectClick(pokemon.id),
                  },
                ]}
                size="small"
              />
            );
          })
        ) : (
          <p>Loading Pokemon or No Pokémon found...</p>
        )}
      </div>
    </div>
  );
};

export default Pokemons;

import { useState, useEffect } from "react";

const Battle = () => {
  const selectedId = 3; // Player's selected Pokémon ID
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [botPokemon, setBotPokemon] = useState(null);
  const [battleCount, setBattleCount] = useState(0);

  // Helper function to generate a random Pokémon ID
  const getRandomPokemonId = () => Math.floor(Math.random() * 1010) + 1;

  // Helper function to initialize a new game
  const startNewGame = () => {
    const newBotId = getRandomPokemonId();
    localStorage.setItem("botId", newBotId);

    // Update battle count
    const currentCount = Number(localStorage.getItem("battleCount")) || 0;
    localStorage.setItem("battleCount", currentCount + 1);
    setBattleCount(currentCount + 1);
  };

  // Fetch Pokémon data from the API
  useEffect(() => {
    const fetchPokemonData = async (id, setter) => {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const data = await response.json();
      setter(data);
    };

    // Fetch selected Pokémon data
    fetchPokemonData(selectedId, setSelectedPokemon);

    // Fetch or initialize bot Pokémon data
    const initializeGame = async () => {
      const storedBotId = localStorage.getItem("botId");

      if (storedBotId) {
        // Use existing bot ID
        fetchPokemonData(storedBotId, setBotPokemon);
      } else {
        // Start a new game if no bot ID exists
        startNewGame();
        const newBotId = localStorage.getItem("botId");
        fetchPokemonData(newBotId, setBotPokemon);
      }
    };

    initializeGame();
  }, [selectedId]);

  if (!selectedPokemon || !botPokemon) {
    return <div className="text-white text-center">Loading...</div>;
  }

  return (
    <div className="bg-black min-h-screen flex flex-col items-center">
      {/* Title */}
      <div className="text-center text-white text-3xl font-semibold mt-6">
        Battleground
      </div>

      {/* Battleground Area */}
      <div className="bg-black h-96 w-full flex justify-center items-center rounded-lg mb-20 relative">
        {/* Player 1 (Your Pokémon) */}
        <div className="w-1/2 flex flex-col justify-center items-center">
          <h2 className="text-2xl font-bold text-white mt-20 capitalize">
            {selectedPokemon.name}
          </h2>
          <img
            src={selectedPokemon.sprites.other.home.front_default}
            alt={selectedPokemon.name}
            className="w-96 h-96 object-contain mb-2 drop-shadow-glow-red"
          />
        </div>

        {/* VS */}
        <div className="absolute mb-50 items-center text-white text-2xl font-bold">
          V/S
        </div>

        {/* Bot's Pokémon */}
        <div className="w-1/2 flex flex-col justify-center items-center">
          <h2 className="text-2xl font-bold text-white mt-20 capitalize">
            {botPokemon.name}
          </h2>
          <img
            src={botPokemon.sprites.other.home.front_default}
            alt={botPokemon.name}
            className="w-96 h-96 object-contain mb-2 drop-shadow-glow-yellow"
          />
        </div>
      </div>
      <div className="flex justify-between items-center w-full px-80 mt-80 ">
        {/* Player 1 Info */}
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-gray-800"></div>
          <span className="text-white font-semibold mt-2">You</span>
          <div className="relative w-32 h-2 bg-gray-700 rounded-lg mt-2">
            <div className="absolute bg-orange-500 h-full w-1/2 rounded-lg"></div>
          </div>
        </div>

        {/* Bot Info */}
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-gray-800"></div>
          <span className="text-white font-semibold mt-2">Player 2</span>
          <div className="relative w-32 h-2 bg-gray-700 rounded-lg mt-2">
            <div className="absolute bg-blue-600 h-full w-3/4 rounded-lg"></div>
          </div>
        </div>
      </div>

      {/* Battle Count */}
      <div className="text-white text-lg mt-10">
        Number of Battles: {battleCount}
      </div>

      {/* Button to start a new game */}
      <button
        onClick={startNewGame}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Start New Game
      </button>
    </div>
  );
};

export default Battle;

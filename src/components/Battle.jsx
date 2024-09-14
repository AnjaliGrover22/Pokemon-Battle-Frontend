import { useState, useEffect } from "react";
import "../App.css";

const Battle = () => {
  const selectedId = 3; // Player's selected Pokémon ID
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [botPokemon, setBotPokemon] = useState(null);
  const [battleCount, setBattleCount] = useState(0);
  const [winner, setWinner] = useState(null);
  const [isBattleOngoing, setIsBattleOngoing] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [battles_won, setBattles_won] = useState(0);
  const [battles_lost, setBattles_lost] = useState(0);
  const username = "Anjali";
  const [isBattleComplete, setIsBattleComplete] = useState(false);

  // Helper function to generate a random Pokémon ID
  const getRandomPokemonId = () => Math.floor(Math.random() * 1010) + 1;

  //load the initial state from localStorage

  useEffect(() => {
    const storedBattlesWon = Number(localStorage.getItem("battles_won")) || 0;
    const storedBattlesLost = Number(localStorage.getItem("battles_lost")) || 0;

    setBattles_won(storedBattlesWon);
    setBattles_lost(storedBattlesLost);

    const totalBattles = storedBattlesWon + storedBattlesLost;
    setBattleCount(totalBattles);
    localStorage.setItem("battleCount", totalBattles);
  }, []);

  // Helper function to initialize a new game
  const startNewGame = () => {
    setWinner(null);
    setIsBattleOngoing(true);
    setIsAnimating(true); // Start animation

    const newBotId = getRandomPokemonId();
    localStorage.setItem("botId", newBotId);

    // Update battle count
    setBattleCount((prevCount) => {
      const newCount = prevCount + 1;
      localStorage.setItem("battleCount", newCount);
      return newCount;
    });

    // Use setTimeout to delay showing the result by 3 seconds
    setTimeout(() => {
      if (selectedPokemon && botPokemon) {
        const gameWinner = calculateWinner(selectedPokemon, botPokemon);

        setWinner(gameWinner);
        setIsBattleOngoing(false); // Battle has ended
        setIsAnimating(false);
        setIsBattleComplete(true); // Stop animation after battle ends
      }
    }, 3000); // Delay of 3 seconds (3000 ms)
  };

  const getNewPlayer = async () => {
    if (!isBattleComplete) {
      return;
    }

    // Immediately stop animation
    setIsAnimating(false);

    // Prepare for a new battle
    setWinner(null);
    setIsBattleOngoing(true);
    setIsBattleComplete(false);

    const newBotId = getRandomPokemonId();

    // Fetch new Pokémon data
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${newBotId}`
      );
      const data = await response.json();
      setBotPokemon(data);

      // Successfully fetched new bot Pokémon data, resume animation
      setIsAnimating(true);

      // Update battle count
      setBattleCount((prevCount) => {
        const newCount = prevCount + 1;
        localStorage.setItem("battleCount", newCount);
        return newCount;
      });
    } catch (error) {
      console.error("Error fetching new Pokémon data:", error);
    }

    // Use setTimeout to delay showing the result by 3 seconds
    setTimeout(() => {
      if (selectedPokemon && botPokemon) {
        const gameWinner = calculateWinner(selectedPokemon, botPokemon);

        setWinner(gameWinner);
        setIsBattleOngoing(false); // Battle has ended
        setIsAnimating(false); // Stop animation after battle ends
        setIsBattleComplete(true); // Update battle complete state
      }
    }, 3000); // Delay of 3 seconds (3000 ms)
  };

  // Fetch Pokémon data from the API
  useEffect(() => {
    const fetchPokemonData = async (id, setter) => {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const data = await response.json();
      setter(data);
    };

    fetchPokemonData(selectedId, setSelectedPokemon);

    const initializeGame = async () => {
      const storedBotId = localStorage.getItem("botId");

      if (storedBotId) {
        fetchPokemonData(storedBotId, setBotPokemon);
      } else {
        startNewGame();
        const newBotId = localStorage.getItem("botId");
        fetchPokemonData(newBotId, setBotPokemon);
      }
    };

    initializeGame();
  }, [selectedId]);

  // Function to calculate the winner
  const calculateWinner = (player, bot) => {
    const playerStats = {
      hp: player.stats.find((stat) => stat.stat.name === "hp").base_stat,
      attack: player.stats.find((stat) => stat.stat.name === "attack")
        .base_stat,
      defense: player.stats.find((stat) => stat.stat.name === "defense")
        .base_stat,
      speed: player.stats.find((stat) => stat.stat.name === "speed").base_stat,
    };

    const botStats = {
      hp: bot.stats.find((stat) => stat.stat.name === "hp").base_stat,
      attack: bot.stats.find((stat) => stat.stat.name === "attack").base_stat,
      defense: bot.stats.find((stat) => stat.stat.name === "defense").base_stat,
      speed: bot.stats.find((stat) => stat.stat.name === "speed").base_stat,
    };

    // Simple battle formula: hp + (attack * 2) + defense + speed
    const playerScore =
      playerStats.hp +
      playerStats.attack * 2 +
      playerStats.defense +
      playerStats.speed;
    const botScore =
      botStats.hp + botStats.attack * 2 + botStats.defense + botStats.speed;

    if (playerScore > botScore) {
      setBattles_won((prevWins) => {
        const newWins = prevWins + 1;
        localStorage.setItem("battles_won", newWins);
        return newWins;
      });
    } else {
      setBattles_lost((prevLosses) => {
        const newLosses = prevLosses + 1;
        localStorage.setItem("battles_lost", newLosses);
        return newLosses;
      });
    }
    return playerScore > botScore ? "Player" : "Opponent";
  };

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
            id="player-pokemon"
            src={selectedPokemon.sprites.other.home.front_default}
            alt={selectedPokemon.name}
            className={`w-96 h-96 object-contain mb-2 ${
              isAnimating ? "animate-heavy-shake animate-move-right" : ""
            }`}
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
            id="bot-pokemon"
            src={botPokemon.sprites.other.home.front_default}
            alt={botPokemon.name}
            className={`w-96 h-96 object-contain mb-2 ${
              isAnimating ? "animate-heavy-shake animate-move-left" : ""
            }`}
          />
        </div>
      </div>

      {/* Winner Display */}
      <div className="text-white text-3xl font-bold">
        {isBattleOngoing
          ? "Battle Ongoing..."
          : winner
          ? `${winner} Wins!`
          : ""}
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
        Attack
      </button>
      {!isBattleOngoing && winner && (
        <button
          onClick={getNewPlayer}
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Change opponent
        </button>
      )}
    </div>
  );
};

export default Battle;

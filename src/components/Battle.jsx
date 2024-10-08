import { useState, useEffect } from "react";
import { useOutletContext, useNavigate, useParams } from "react-router-dom";
import "../App.css";

const Battle = ({ onUsernameChange }) => {
  const {
    battleCount,
    setBattleCount,
    battles_won,
    setBattles_won,
    battles_lost,
    setBattles_lost,
    username,
  } = useOutletContext();

  const { id } = useParams();
  const selectedId = id || 3;

  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [botPokemon, setBotPokemon] = useState(null);
  const [winner, setWinner] = useState(null);
  const [isBattleOngoing, setIsBattleOngoing] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isBattleComplete, setIsBattleComplete] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (username) onUsernameChange(username);
  }, [onUsernameChange, username]);

  useEffect(() => {
    fetchUserStats();
    fetchPokemonData(selectedId, setSelectedPokemon); // Player's Pokémon
    getNewPlayer(); // Bot's Pokémon
  }, [selectedId]);

  const getRandomPokemonId = () => Math.floor(Math.random() * 1010) + 1;

  const fetchPokemonData = async (id, setter) => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      if (response.ok) {
        const data = await response.json();
        setter(data);
      } else {
        console.error("Failed to fetch Pokémon data.");
      }
    } catch (error) {
      console.error("Error fetching Pokémon data:", error);
    }
  };

  const fetchUserStats = async () => {
    if (!username) return; // Ensure username is defined
    try {
      const response = await fetch(
        `https://pokemon-battle-backend.onrender.com/api/scores/${username}`
      );
      if (response.ok) {
        const data = await response.json();
        setBattles_won(data.battles_won || 0);
        setBattles_lost(data.battles_lost || 0);
        setBattleCount((data.battles_won || 0) + (data.battles_lost || 0));
      } else {
        console.warn("User not found. Initializing scores to 0.");
        setBattles_won(0);
        setBattles_lost(0);
        setBattleCount(0);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

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

    const playerScore =
      playerStats.hp +
      playerStats.attack * 2 +
      playerStats.defense +
      playerStats.speed;
    const botScore =
      botStats.hp + botStats.attack * 2 + botStats.defense + botStats.speed;

    return playerScore > botScore ? "Player" : "Opponent";
  };

  const updateUserData = async (newWins, newLosses) => {
    try {
      const requestBody = {
        battles_won: newWins,
        battles_lost: newLosses,
        total_battles: newWins + newLosses,
      };

      console.log("Request body:", requestBody); // Log request body

      const response = await fetch(
        `https://pokemon-battle-backend.onrender.com/api/scores/${username}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      const responseData = await response.json();
      console.log("Response data:", responseData); // Log response data

      if (response.ok) {
        console.log("User data updated successfully");
      } else {
        console.error("Failed to update user data:", responseData);
      }
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const startNewGame = () => {
    if (!selectedPokemon || !botPokemon) {
      console.error("Pokémon data is not ready");
      return;
    }

    setIsBattleOngoing(true);
    setIsAnimating(true);
    setWinner(null); // Reset winner
    setBattleCount((prevCount) => prevCount + 1);

    setTimeout(() => {
      const gameWinner = calculateWinner(selectedPokemon, botPokemon);
      setWinner(gameWinner);

      if (gameWinner === "Player") {
        setBattles_won((prevWins) => {
          const newWins = prevWins + 1;
          updateUserData(newWins, battles_lost);
          return newWins;
        });
      } else {
        setBattles_lost((prevLosses) => {
          const newLosses = prevLosses + 1;
          updateUserData(battles_won, newLosses);
          return newLosses;
        });
      }

      setIsBattleOngoing(false);
      setIsAnimating(false);
      setIsBattleComplete(true);
    }, 3000); // 3-second delay for battle animation
  };

  const getNewPlayer = async () => {
    const newBotId = getRandomPokemonId();
    setIsBattleComplete(false);

    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${newBotId}`
      );
      if (response.ok) {
        const data = await response.json();
        setBotPokemon(data);
      } else {
        console.error("Error fetching new Pokémon:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching new Pokémon:", error);
    }
  };

  if (!selectedPokemon || !botPokemon) {
    return <div className="text-white text-center">Loading...</div>;
  }

  const getScores = () => {
    navigate(`/battlefield/board/`);
  };

  return (
    <div className="bg-black min-h-screen flex flex-col items-center">
      <div className="my-25 py-5 text-center rounded-lg text-white">
        <h4>Hello, {username}!</h4>
        <h5 className="text-center mt-1">
          Ready to take action? Click "Attack" when you're set to go!
        </h5>
      </div>
      <div className="text-center text-white text-3xl font-semibold mt-6">
        Battleground
      </div>
      <div className="bg-black h-96 w-full flex justify-center items-center rounded-lg mb-20 relative">
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
        <div className="absolute mb-50 items-center text-white text-2xl font-bold">
          V/S
        </div>
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
      <div className="text-white text-3xl font-bold">
        {isBattleOngoing
          ? "Battle Ongoing..."
          : winner
          ? `${winner} Wins!`
          : ""}
      </div>
      <div className="text-white text-lg mt-10">
        Number of played Battles: {battleCount}
      </div>
      <button
        onClick={startNewGame}
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded button"
        disabled={isBattleOngoing}
      >
        Attack
      </button>
      {!isBattleOngoing && winner && (
        <button
          onClick={getNewPlayer}
          className="mt-6 px-4 py-2 bg-red-500 text-white rounded button"
        >
          Change opponent
        </button>
      )}
      {winner && (
        <button
          onClick={getScores}
          className="mt-6 px-4 py-2 bg-red-500 text-white rounded button"
        >
          Check your Scores
        </button>
      )}
    </div>
  );
};

export default Battle;

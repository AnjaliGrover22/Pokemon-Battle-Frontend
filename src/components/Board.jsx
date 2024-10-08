import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import "../App.css";

const Board = () => {
  const { battleCount, battles_won, battles_lost, username } =
    useOutletContext();
  const [scores, setScores] = useState([]);
  const [userScore, setUserScore] = useState(null);
  const [achievement, setAchievement] = useState(null);

  // Fetch all scores when the component mounts
  useEffect(() => {
    fetchAllScores();
  }, []);

  // Fetch or update user score when relevant data changes
  useEffect(() => {
    if (username) {
      checkUserScore();
    }
  }, [username, battleCount, battles_won, battles_lost]);

  // Separate useEffect for calculateAchievement
  useEffect(() => {
    if (battles_won !== null) {
      calculateAchievement();
    }
  }, [battles_won]);

  // Fetch all scores from the server
  const fetchAllScores = async () => {
    try {
      const response = await fetch(
        "https://pokemon-battle-backend.onrender.com/api/scores"
      );
      if (response.ok) {
        const data = await response.json();
        setScores(data); // Set the scores list from the API
      } else {
        console.error("Failed to fetch all scores");
      }
    } catch (error) {
      console.error("Error fetching all scores:", error);
    }
  };

  // Check if user score exists and update or create accordingly
  const checkUserScore = async () => {
    try {
      const response = await fetch(
        `https://pokemon-battle-backend.onrender.com/api/scores/${username}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error(
          "Error fetching user score:",
          errorData.message || "Unknown error"
        );

        return;
      }

      const data = await response.json();

      if (data.username) {
        // User exists, prepare updated score data
        const updatedScoreData = {
          username: data.username,
          total_battles: battleCount,
          battles_won,
          battles_lost,
        };
        const scoreChanged =
          data.total_battles !== battleCount ||
          data.battles_won !== battles_won ||
          data.battles_lost !== battles_lost;

        if (scoreChanged) {
          await updateBattleData(updatedScoreData);
          setUserScore(updatedScoreData); // Update local state with the latest score
        } else {
          setUserScore(data); // Just update the local state if there's no change
        }
      } else {
        // User does not exist, create a new score
        await createNewScore();
      }
    } catch (error) {
      console.error("Error checking user score:", error);
    }
  };

  // Calculate achievements based on battles won
  const calculateAchievement = () => {
    if (battles_won > 30) {
      setAchievement("Diamond Crown");
    } else if (battles_won > 20) {
      setAchievement("Gold Crown");
    } else if (battles_won > 10) {
      setAchievement("Bronze Crown");
    } else {
      setAchievement(null);
    }
  };

  // Update existing user score
  const updateBattleData = async (userScoreData) => {
    try {
      const response = await fetch(
        `https://pokemon-battle-backend.onrender.com/api/scores/${username}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userScoreData),
        }
      );

      if (response.ok) {
        console.log("Score updated successfully");
        await fetchAllScores(); // Refresh the scores list to include updated data
      } else {
        console.error("Failed to update score");
      }
    } catch (error) {
      console.error("Error updating score:", error);
    }
  };

  // Create a new score entry for the user
  const createNewScore = async () => {
    try {
      console.log("Creating new score for:", username);
      const response = await fetch(
        "https://pokemon-battle-backend.onrender.com/api/scores",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            total_battles: 0,
            battles_won: 0,
            battles_lost: 0,
          }),
        }
      );

      if (response.ok) {
        console.log("New score created successfully");
        await fetchAllScores(); // Refresh the scores list to include new data
      } else {
        console.error("Failed to create new score");
      }
    } catch (error) {
      console.error("Error creating new score:", error);
    }
  };

  // Update the scores list when user score or scores change
  useEffect(() => {
    if (userScore) {
      const updatedScores = scores.filter(
        (score) => score.username !== username
      );
      const sortedScores = [userScore, ...updatedScores].sort(
        (a, b) => b.total_battles - a.total_battles
      );
      setScores(sortedScores);
    }
  }, [userScore]);

  return (
    <div className="bg-black min-h-screen p-8 text-white">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-6 border-b-2 border-gray-600 pb-2">
          Score Board
        </h1>

        {/* Achievement Section */}
        {achievement ? (
          <div className="achievement-container mb-4">
            <h2 className="text-3xl font-bold text-yellow-800 animate-blink">
              🎉 {achievement} 🎉
            </h2>
          </div>
        ) : (
          <div className="text-lg text-gray-400 mb-4">
            Play more battles to earn crowns! 🏆
          </div>
        )}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <table className="w-full border-collapse">
            <tbody>
              <tr className="border-b border-gray-600">
                <th className="text-left text-lg font-semibold p-4 bg-gray-700 w-1/4">
                  User:
                </th>
                <td className="p-4 text-lg w-3/4">
                  {username || "Not logged in"}
                </td>
              </tr>
              <tr className="border-b border-gray-600">
                <th className="text-left text-lg font-semibold p-4 bg-gray-700 w-1/4">
                  Total Battles:
                </th>
                <td className="p-4 text-lg w-3/4">{battleCount}</td>
              </tr>
              <tr className="border-b border-gray-600">
                <th className="text-left text-lg font-semibold p-4 bg-gray-700 w-1/4">
                  Battles Won:
                </th>
                <td className="p-4 text-lg w-3/4">{battles_won}</td>
              </tr>
              <tr>
                <th className="text-left text-lg font-semibold p-4 bg-gray-700 w-1/4">
                  Battles Lost:
                </th>
                <td className="p-4 text-lg w-3/4">{battles_lost}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">All Scores</h2>
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                Total Battles
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                Battles Won
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                Battles Lost
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {scores.map((score, index) => {
              const isCurrentUser = score.username === username;
              const userClass = isCurrentUser
                ? achievement
                  ? "blinking-parrot" // If achievement, use blinking
                  : "bg-green-500" // Apply green background if no achievement
                : "";

              return (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-gray-700" : "bg-red-600"
                  } ${userClass}`.trim()}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {score.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {score.total_battles}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {score.battles_won}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {score.battles_lost}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Board;

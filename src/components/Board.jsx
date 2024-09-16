import { useEffect, useState } from "react";
import { useOutletContext, Link } from "react-router-dom";

const Board = () => {
  const { battleCount, battles_won, battles_lost, username } =
    useOutletContext();
  const [scores, setScores] = useState([]);
  const [userScore, setUserScore] = useState(null);

  // Fetch all scores when component mounts
  useEffect(() => {
    fetchAllScores();
  }, []);

  // Update user score and battle data whenever username, battleCount, battles_won, or battles_lost changes
  useEffect(() => {
    if (username) {
      getScoreBoardByUsername();
    }
  }, [username, battleCount, battles_won, battles_lost]);

  const fetchAllScores = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/scores");
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

  const getScoreBoardByUsername = async () => {
    try {
      const response = await fetch(
        `http://localhost:8081/api/scores/${username}`
      );
      const data = await response.json();

      if (response.ok) {
        if (data.user) {
          const userScoreData = {
            username: data.user.username,
            total_battles: battleCount,
            battles_won,
            battles_lost,
          };
          setUserScore(userScoreData); // Update local state with user-specific data
          await updateBattleData(); // Update user-specific data if found
        } else {
          await createNewScore(); // Create new score if user not found
        }
      } else {
        console.error("Error fetching user score:", data.message);
      }
    } catch (error) {
      console.error("Error in checking username:", error);
    }
  };

  const updateBattleData = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/scores", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          total_battles: battleCount,
          battles_won,
          battles_lost,
        }),
      });
      if (response.ok) {
        console.log("Battle data updated successfully");
        // Refresh the scores list to include updated data
        await fetchAllScores();
      } else {
        console.error("Failed to update battle data");
      }
    } catch (error) {
      console.error("Error updating battle data:", error);
    }
  };

  const createNewScore = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/scores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          total_battles: battleCount,
          battles_won,
          battles_lost,
        }),
      });
      if (response.ok) {
        console.log("New score created successfully");
        // Refresh the scores list to include new data
        await fetchAllScores();
      } else {
        console.error("Failed to create new score");
      }
    } catch (error) {
      console.error("Error creating new score:", error);
    }
  };

  useEffect(() => {
    if (userScore) {
      // Remove any old score for the current user
      const updatedScores = scores.filter(
        (score) => score.username !== username
      );

      // Add the current user's score to the top and sort the remaining scores
      const sortedScores = [userScore, ...updatedScores].sort((a, b) => {
        // Define your sorting criteria here
        return b.total_battles - a.total_battles; // Example: Sort by total battles in descending order
      });

      setScores(sortedScores);
    }
  }, [userScore, scores, username]);

  return (
    <div className="bg-black min-h-screen p-8 text-white">
      {/* Current User Stats Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-6 border-b-2 border-gray-600 pb-2">
          Score Board
        </h1>
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <table className="w-full border-collapse">
            <tbody>
              <tr className="border-b border-gray-600">
                <th className="text-left text-lg font-semibold p-4 bg-gray-700 rounded-tl-lg">
                  User:
                </th>
                <td className="p-4 text-lg">{username || "Not logged in"}</td>
              </tr>
              <tr className="border-b border-gray-600">
                <th className="text-left text-lg font-semibold p-4 bg-gray-700">
                  Total Battles:
                </th>
                <td className="p-4 text-lg">{battleCount}</td>
              </tr>
              <tr className="border-b border-gray-600">
                <th className="text-left text-lg font-semibold p-4 bg-gray-700">
                  Battles Won:
                </th>
                <td className="p-4 text-lg">{battles_won}</td>
              </tr>
              <tr>
                <th className="text-left text-lg font-semibold p-4 bg-gray-700 rounded-bl-lg">
                  Battles Lost:
                </th>
                <td className="p-4 text-lg">{battles_lost}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* All Users Scores Table (including current user at the top) */}
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
            {/* Display all scores including the current user */}
            {scores.map((score, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-gray-700" : "bg-red-400"}
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
            ))}
          </tbody>
        </table>
      </div>
      <div className="my-25 py-5 text-right rounded-lg text-white">
        <Link to="/battlefield">
          <button>Back to Battlefield</button>
        </Link>
      </div>
    </div>
  );
};

export default Board;

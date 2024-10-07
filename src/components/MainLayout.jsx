import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import UsernameForm from "./UsernameForm";
import "../App.css";

const MainLayout = ({ username, onUsernameChange }) => {
  const [battleCount, setBattleCount] = useState(0);
  const [battles_won, setBattles_won] = useState(0);
  const [battles_lost, setBattles_lost] = useState(0);
  const [showForm, setShowForm] = useState(!username); // Initial state depends on whether username exists

  // Handle setting the username and form visibility
  const handleSetUsername = (newUsername) => {
    onUsernameChange(newUsername);
    setShowForm(false); // Hide the form after setting the username
  };

  // Function to fetch user data from the API
  useEffect(() => {
    const fetchUserData = async () => {
      // Ensure username exists before trying to fetch data
      if (!username) return;

      try {
        const response = await fetch(
          `https://pokemon-battle-backend.onrender.com/api/scores/${username}`
        );

        if (response.ok) {
          const data = await response.json();
          onUsernameChange(data.username || username);
          setBattles_won(data.battles_won || 0);
          setBattles_lost(data.battles_lost || 0);
          setBattleCount((data.battles_won || 0) + (data.battles_lost || 0));
        } else {
          console.error("Failed to fetch user data.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [username, onUsernameChange]);

  // Update form visibility based on username
  useEffect(() => {
    setShowForm(!username);
  }, [username]);

  return (
    <div className="layout-container">
      <Header loginame={username} />
      <div className={username ? "w-full" : "content-wrapper"}>
        {showForm ? (
          <UsernameForm onSetUsername={handleSetUsername} />
        ) : (
          <Outlet
            context={{
              battleCount,
              setBattleCount,
              battles_won,
              setBattles_won,
              battles_lost,
              setBattles_lost,
              username,
              setUsername: onUsernameChange,
            }}
          />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;

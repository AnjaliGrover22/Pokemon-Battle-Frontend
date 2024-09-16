import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import UsernameForm from "./UsernameForm";
import "../App.css";

const MainLayout = ({ username, onUsernameChange, id }) => {
  const [battleCount, setBattleCount] = useState(0);
  const [battles_won, setBattles_won] = useState(0);
  const [battles_lost, setBattles_lost] = useState(0);
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(!username); // Initial state depends on whether username exists

  // Use the passed in onUsernameChange to update the username state
  const handleSetUsername = (newUsername) => {
    onUsernameChange(newUsername);
    setShowForm(false); // Hide the form after setting the username
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (username) {
        try {
          const response = await fetch(
            `http://localhost:8081/api/scores/${username}`
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
      }
    };

    fetchUserData();
  }, [username, onUsernameChange]);

  // Update `showForm` based on username changes
  useEffect(() => {
    setShowForm(!username);
  }, [username]);

  const loginame = username;
  console.log("login name", loginame);

  return (
    <div className="layout-container">
      <Header loginame={loginame} id={selectedId} />
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
              id, // Use the passed-in function
            }}
          />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;

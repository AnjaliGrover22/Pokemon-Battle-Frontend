import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import UsernameForm from "./UsernameForm";
import "../App.css";

const MainLayout = () => {
  const [battleCount, setBattleCount] = useState(0);
  const [battles_won, setBattles_won] = useState(0);
  const [battles_lost, setBattles_lost] = useState(0);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleSetUsername = (newUsername) => {
    setUsername(newUsername);
    navigate("/battlefield");
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
            setUsername(data.username || username);
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
  }, [username]);

  return (
    <div className="layout-container">
      <Header />
      <div className="content-wrapper">
        {username ? (
          <Outlet
            context={{
              battleCount,
              setBattleCount,
              battles_won,
              setBattles_won,
              battles_lost,
              setBattles_lost,
              username,
              setUsername,
            }}
          />
        ) : (
          <UsernameForm onSetUsername={handleSetUsername} />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;

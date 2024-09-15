// MainLayout.jsx
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";

const MainLayout = () => {
  //Initialize all states here which i need to use in whole app childrens(can update these from any child)
  const [battleCount, setBattleCount] = useState(0);
  const [battles_won, setBattles_won] = useState(0);
  const [battles_lost, setBattles_lost] = useState(0);
  const [username, setUsername] = useState("Anjali");

  useEffect(() => {
    // Load values from localStorage on component mount , otherwise will get incorrect results
    const storedBattlesWon = Number(localStorage.getItem("battles_won")) || 0;
    const storedBattlesLost = Number(localStorage.getItem("battles_lost")) || 0;
    const storedUsername = localStorage.getItem("username") || "";

    setBattles_won(storedBattlesWon);
    setBattles_lost(storedBattlesLost);
    setUsername(storedUsername);

    const totalBattles = storedBattlesWon + storedBattlesLost;
    setBattleCount(totalBattles);
  }, []);

  return (
    <div>
      <Header />
      {/* Context values are defined in outlet */}
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
      <Footer />
    </div>
  );
};

export default MainLayout;

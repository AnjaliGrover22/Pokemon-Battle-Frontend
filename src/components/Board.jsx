// Board.jsx
import { useOutletContext } from "react-router-dom";

const Board = () => {
  const { battleCount, battles_won, battles_lost, username } =
    useOutletContext();

  return (
    <div>
      <h1>Score Board</h1>
      <p>User: {username}</p>
      <p>Total Battles: {battleCount}</p>
      <p>Battles Won: {battles_won}</p>
      <p>Battles Lost: {battles_lost}</p>
    </div>
  );
};

export default Board;

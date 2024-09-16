import { Link } from "react-router-dom";

const Header = ({ loginame, battleid }) => {
  console.log("my header id", battleid);
  const defaultBattleId = 7;
  return (
    <>
      {/* Top bar */}
      <div className=" text-xs py-2 px-24 flex justify-between items-center h-16 bg-red-500 text-white">
        <div className="text-2xl font-bold">
          <Link to="/">{loginame ? `Welcome: ${loginame}` : "PokeArena"}</Link>
        </div>
        <div className="text-right flex gap-6 text-lg">
          <Link to="/">Home</Link>
          <Link
            to={
              battleid
                ? `/battlefield/id/${battleid}`
                : `/battlefield/id/${defaultBattleId}`
            }
          >
            Battle
          </Link>
          <Link to="/battlefield/board">Score Board</Link>
        </div>
      </div>
    </>
  );
};

export default Header;

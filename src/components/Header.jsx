import { Link } from "react-router-dom";

const Header = () => {
  return (
    <>
      {/* Top bar */}
      <div className="bg-gray-100 text-xs py-2 px-24 flex justify-between items-center h-16">
        <div className="text-2xl font-bold">
          <Link to="/">PokeApi</Link>
        </div>
        <div className="text-right flex gap-6">
          <span>Game Fun</span>
          <span>Choose your favourite</span>
          <span>Fantastic playground</span>
        </div>

        <div className="text-right text-2xl rounded mx-16 py-16 font-bold">
          <Link to="/battlefield/board">Score Board</Link>
        </div>
      </div>
    </>
  );
};

export default Header;

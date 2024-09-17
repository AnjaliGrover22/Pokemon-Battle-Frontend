import { Link } from "react-router-dom";

const Header = ({ loginame, battleid }) => {
  return (
    <>
      {/* Top bar */}
      <div className=" text-xs py-2 px-24 flex justify-between items-center h-16 bg-red-500 text-white">
        <div className="text-2xl font-bold">
          <Link to="/">{loginame ? `Welcome: ${loginame}` : "PokeArena"}</Link>
        </div>
        <div className="text-right flex gap-6 text-lg">
          <Link to="/">Home</Link>
          {loginame ? (
            <Link to={`/battlefield/board`}>Scores</Link>
          ) : (
            <span className="text-gray-500 cursor-not-allowed">Scores</span>
          )}
          <Link to="/logout">Logout</Link>
        </div>
      </div>
    </>
  );
};

export default Header;

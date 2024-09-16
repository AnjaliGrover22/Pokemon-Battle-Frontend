import { useOutletContext, useNavigate } from "react-router-dom";

const LogOut = () => {
  const { username, setUsername } = useOutletContext(); // Access both username and setUsername
  const navigate = useNavigate(); // For redirecting after logout

  const handleLogout = () => {
    setUsername(""); // Clear the username state
    navigate("/"); // Redirect to homepage or any other route after logout
  };

  return (
    <div className="text-center text-white mt-6">
      <h1 className="text-4xl font-semibold">Thanks for playing {username}!</h1>
      <p className="text-lg mt-4">Come back soon for more adventures!</p>
      <button
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
        onClick={handleLogout}
      >
        Log Out
      </button>
    </div>
  );
};

export default LogOut;

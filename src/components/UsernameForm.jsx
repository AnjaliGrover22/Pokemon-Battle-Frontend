// components/UsernameForm.jsx
import { useState } from "react";

const UsernameForm = ({ onSetUsername }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      console.log("user", input);
      onSetUsername(input.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="text-center mt-6">
      <label htmlFor="username" className="text-lg text-white">
        Enter your username:
      </label>
      <input
        id="username"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="ml-2 p-2"
        placeholder="Username"
      />
      <button
        type="submit"
        className="ml-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  );
};

export default UsernameForm;

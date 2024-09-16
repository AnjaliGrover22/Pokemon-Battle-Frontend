// UsernameForm.jsx
import { useState } from "react";
import "../App.css";

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
    <div className="centered-component">
      <div className="container">
        <h1 className="title">Welcome to the PokeArena</h1>
        <form onSubmit={handleSubmit} className="form">
          <label htmlFor="username" className="label">
            Please Enter Your Username:
          </label>
          <input
            id="username"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="input"
            placeholder="Your Name"
          />
          <button type="submit" className="button">
            Submit
          </button>
        </form>
        <div className="image-container">
          <img src="/front_img.png" alt="Pikachu" className="pikachu-image" />
        </div>
      </div>
    </div>
  );
};

export default UsernameForm;

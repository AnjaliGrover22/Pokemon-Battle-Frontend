// src/components/PokemonTypeFilter.jsx
import React from "react";
import typeColors from "./typeColors"; // Adjust the path if necessary

const types = Object.keys(typeColors);

const PokemonTypeFilter = ({ selectedTypes, onTypeToggle }) => {
  return (
    <div>
      <div className="flex justify-center mb-4">
        <h1 className=" text-white text-2xl font-bold">Filter by type</h1>
      </div>
      <div className="grid grid-cols-9 gap-x-10 gap-y-2 p-4 max-w-4xl mx-auto">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => onTypeToggle(type)}
            className={`w-24 h-12 rounded text-white ${
              selectedTypes.includes(type) ? "opacity-100" : "opacity-35"
            }`}
            style={{ backgroundColor: typeColors[type] }}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PokemonTypeFilter;

import React from "react";
import "../App.css";
import ProgressBar from "./ProgressBar";
import typeColors from "./typeColors";

const CardView = ({
  title,
  image,
  content,
  stats = [],
  buttons = [],
  types = [],
  size = "small", //size prop with default value "small"
}) => {
  // set card dimentions based on size prop
  const cardWidth = size === "large" ? "w-96" : "w-48";
  const imageHeight = size === "large" ? "h-56" : "h-32";
  const titleFontSize = size === "large" ? "text-xl" : "text-md";
  const contentFontSize = size === "large" ? "text-sm" : "text-xs";
  const buttonPadding = size === "large" ? "py-2 px-4" : "py-1 px-2";

  // determin background style based on pokemon type
  const backgroundStyle =
    types.length === 1
      ? { backgroundColor: typeColors[types[0]] } // single type
      : {
          background: `linear-gradient(to right, ${typeColors[types[0]]} 50%, ${
            typeColors[types[1]]
          } 50%)`, // Two types
        };

  return (
    <div
      className={`relative flex flex-col my-2 mx-1 bg-custom-gray shadow-sm border border-slate-200 rounded-lg ${cardWidth}`}
      style={backgroundStyle} // apply dynamic background style
    >
      <div
        className={`relative ${imageHeight} m-2.5 overflow-hidden text-white rounded-md`}
      >
        <img
          src={image || "https://via.placeholder.com/800"}
          alt={title}
          className="absolute inset-0 w-full h-full object-fill "
        />
      </div>
      <div className="p-4">
        <h6 className={`mb-1 text-white ${titleFontSize} font-semibold`}>
          {title}
        </h6>
        <p
          className={`text-white leading-normal font-light ${contentFontSize}`}
        >
          {content}
        </p>
        {/* Render progress bars for each stat */}
        {stats.map((stat, index) => (
          <ProgressBar
            key={index}
            label={stat.label}
            value={stat.value}
            max={stat.max}
          />
        ))}
      </div>
      <div className="px-4 pb-4 pt-0 mt-2 flex justify-between">
        {buttons.map((button, index) => (
          <button
            key={index}
            onClick={button.onClick}
            className={`rounded-md bg-slate-800 ${buttonPadding} text-xs text-white transition-all shadow-md hover:shadow-lg`}
          >
            {button.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CardView;

import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const ProgressBar = ({ label, value, max }) => {
  const [progress, setProgress] = useState(0);
  const [displayValue, setDisplyValue] = useState(0);

  useEffect(() => {
    const incrementDuration = 1000; // duration of animation time
    const stepTime = incrementDuration / value; // time interval for each step

    // set progress bar value gradually

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        const nextProgress = Math.min(prev + 1, value);
        if (nextProgress === value) {
          clearInterval(progressTimer);
        }
        return nextProgress;
      });
    }, stepTime);

    // set display value gradually
    const valueTimer = setInterval(() => {
      setDisplyValue((prev) => {
        const nextValue = Math.min(prev + 1, value);
        if (nextValue === value) {
          clearInterval(valueTimer);
        }
        return nextValue;
      });
    }, stepTime);

    return () => {
      clearInterval(progressTimer);
      clearInterval(valueTimer);
    };
  }, [value]);

  return (
    <div className="mb-2">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-white">{label}</span>
        <span className="text-sm font-medium text-white">
          {displayValue}/{max}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all  ease-in-out"
          style={{ width: `${(progress / max) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;

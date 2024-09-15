import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const ProgressBar = ({ label, value, max }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(value);
    }, 200);

    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="mb-2">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-white">{label}</span>
        <span className="text-sm font-medium text-white">
          {progress}/{max}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-[3000ms] ease-in-out"
          style={{ width: `${(progress / max) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;

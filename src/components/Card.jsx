import React, { useState } from "react";
//import { useNavigate } from "react-router-dom";
import "../App.css";

const CardView = ({
  title,
  image,
  content,
  mode = "summary",
  onClose,
  onSelect,
  onDetails,
  showButtons = true, // Default to true, so buttons are shown unless explicitly hidden
}) => {
  return (
    <div className="relative flex flex-col my-6 bg-custom-gray shadow-sm border border-slate-200 rounded-lg w-96 ">
      <p className="text-white">test card1</p>
      <div className="relative h-56 m-2.5 overflow-hidden text-white rounded-md">
        <img
          src={image || "https://via.placeholder.com/800"}
          alt={title}
          className="absolute inset-0 w-full h-full object-fill "
        />
      </div>
      <div className="p-4">
        <h6 className="mb-2 text-white text-xl font-semibold text-center">
          {title}
        </h6>
        {mode === "details" && (
          <p className="text-white leading-normal font-light">{content}</p>
        )}
      </div>
      <div className="px-4 pb-4 pt-0 mt-2 flex justify-between">
        {mode === "details" ? (
          <>
            {/*  <button
              onClick={onClose}
              className="rounded-md bg-slate-700 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
            >
              Close
            </button>

           <button
              onClick={onSelect}
              className="rounded-md bg-slate-700 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
            >
              Select
            </button> */}
          </>
        ) : (
          <>
            <button
              onClick={onDetails}
              className="rounded-md bg-slate-700 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
            >
              Details
            </button>
            <button
              onClick={onSelect}
              className="rounded-md bg-slate-700 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
            >
              Select
            </button>
          </>
        )}
      </div>
    </div>
  );
};
export default CardView;

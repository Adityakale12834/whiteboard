import React from "react";

const Toolbar = ({
  color,
  setColor,
  strokeWidth,
  setStrokeWidth,
  onClear,
  tool,
  setTool,
}) => {
  return (
    <div className="flex items-center gap-4 bg-gray-800 p-3 shadow-lg w-full justify-center border-b border-gray-700">
      {/* Tool Buttons */}
      <button
        onClick={() => setTool("pencil")}
        className={`px-4 py-2 rounded-lg transition transform hover:scale-105 font-medium
          ${
            tool === "pencil"
              ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
              : "bg-gray-700 text-gray-200 hover:bg-gray-600"
          }`}
      >
        ✏️ Pencil
      </button>

      <button
        onClick={() => setTool("eraser")}
        className={`px-4 py-2 rounded-lg transition transform hover:scale-105 font-medium
          ${
            tool === "eraser"
              ? "bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-md"
              : "bg-gray-700 text-gray-200 hover:bg-gray-600"
          }`}
      >
        🧽 Eraser
      </button>

      {/* Color Picker */}
      <div className="flex gap-2 items-center">
        {["white", "red", "blue", "green", "yellow", "purple"].map((c) => (
          <button
            key={c}
            className={`w-7 h-7 rounded-full border-2 transition transform hover:scale-110 
              ${
                color === c
                  ? "ring-2 ring-offset-2 ring-offset-gray-800 ring-white"
                  : ""
              }`}
            style={{ backgroundColor: c }}
            onClick={() => setColor(c)}
          ></button>
        ))}
      </div>

      {/* Stroke Width Slider */}
      <div className="flex items-center gap-2 text-gray-200">
        <label className="text-sm font-medium">Stroke</label>
        <input
          type="range"
          min="1"
          max="20"
          value={strokeWidth}
          onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
          className="w-32 accent-blue-500 cursor-pointer"
        />
        <span className="text-xs text-gray-400">{strokeWidth}px</span>
      </div>

      {/* Clear Button */}
      <button
        className="px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-emerald-600 
                   text-white shadow-md hover:scale-105 transition font-semibold"
        onClick={onClear}
      >
        🗑️ Clear
      </button>
    </div>
  );
};

export default Toolbar;

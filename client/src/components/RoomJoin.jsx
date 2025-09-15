import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const isValidRoomCode = (code) => /^[a-zA-Z0-9]{6,8}$/.test(code);

const generateRoomCode = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

const RoomJoin = () => {
  const [roomCode, setRoomCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleJoin = (e) => {
    e.preventDefault();
    const trimmedCode = roomCode.trim();

    if (!isValidRoomCode(trimmedCode)) {
      setError("⚠ Room code must be 6–8 alphanumeric characters");
      return;
    }

    navigate(`/room/${trimmedCode}`);
  };

  const handleCreateRoom = () => {
    const newCode = generateRoomCode();
    navigate(`/room/${newCode}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="bg-gray-800/70 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-700">
        {/* Title */}
        <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent animate-pulse">
          Join a Whiteboard Room
        </h2>

        {/* Form */}
        <form onSubmit={handleJoin} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter Room Code"
            value={roomCode}
            onChange={(e) => {
              setRoomCode(e.target.value);
              setError("");
            }}
            className="border border-gray-600 bg-gray-900 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            maxLength={8}
            required
            disabled={loading}
          />

          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:scale-105 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Joining..." : "🚀 Join Room"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-4 flex items-center">
          <hr className="flex-grow border-gray-600" />
          <span className="px-2 text-gray-400 text-sm">or</span>
          <hr className="flex-grow border-gray-600" />
        </div>

        {/* Create Room Button */}
        <button
          onClick={handleCreateRoom}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg shadow-md hover:scale-105 transition"
        >
          ➕ Create New Room
        </button>

        {/* Error Message */}
        {error && (
          <p className="text-red-400 mt-3 text-sm text-center animate-bounce">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default RoomJoin;

import React, { useState, useEffect, useRef } from "react";
import { Home, User, Settings, Plus, Gamepad } from "lucide-react"; // 👈 Added Gamepad icon
import { motion, AnimatePresence } from "framer-motion";
import "./styles.css";

// ...[rest of the App component remains unchanged]

export default function App() {
  // [existing useStates...]

  const [guessInput, setGuessInput] = useState("");
  const [targetNumber, setTargetNumber] = useState(Math.floor(Math.random() * 100) + 1);
  const [feedback, setFeedback] = useState("");

  const checkGuess = () => {
    const guess = parseInt(guessInput, 10);
    if (isNaN(guess)) {
      setFeedback("Please enter a valid number.");
    } else if (guess < targetNumber) {
      setFeedback("Too low!");
    } else if (guess > targetNumber) {
      setFeedback("Too high!");
    } else {
      setFeedback("🎉 Correct! You guessed it!");
    }
  };

  const resetGame = () => {
    setTargetNumber(Math.floor(Math.random() * 100) + 1);
    setGuessInput("");
    setFeedback("");
  };

  const tabs = [
    { name: "home", icon: <Home size={24} />, label: "Home" },
    { name: "profile", icon: <User size={24} />, label: "Profile" },
    { name: "settings", icon: <Settings size={24} />, label: "Settings" },
    { name: "game", icon: <Gamepad size={24} />, label: "Game" }, // 👈 New tab
  ];

  return (
    <motion.div className="container" style={{ overflow: "hidden", height: "100vh" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      {/* ... toggle button and AnimatePresence for tabs */}

      <AnimatePresence mode="wait">
        {tabsVisible && (
          <motion.div key={activeTab} className="tab-content fade-in" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4, ease: "easeOut" }} style={{ display: "flex", overflow: "hidden", height: "100%" }}>
            
            {/* [existing tabs: home, profile, settings] */}

            {activeTab === "game" && (
              <div style={{ padding: 20 }}>
                <h2>🎮 Number Guessing Game</h2>
                <p>Guess a number between 1 and 100!</p>
                <input
                  type="number"
                  value={guessInput}
                  onChange={(e) => setGuessInput(e.target.value)}
                  placeholder="Enter your guess"
                  style={{ padding: "6px 10px", marginRight: 10, borderRadius: 4 }}
                />
                <button onClick={checkGuess} style={{ padding: "6px 12px", borderRadius: 6, backgroundColor: "#28a745", color: "white", border: "none", cursor: "pointer" }}>
                  Guess
                </button>
                <button onClick={resetGame} style={{ marginLeft: 10, padding: "6px 12px", borderRadius: 6, backgroundColor: "#6c757d", color: "white", border: "none", cursor: "pointer" }}>
                  Reset
                </button>
                <p style={{ marginTop: 20, fontWeight: "bold" }}>{feedback}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* [existing modal preview] */}
    </motion.div>
  );
}

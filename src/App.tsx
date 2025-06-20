import React, { useState } from "react";
import { Home, User, Settings } from "lucide-react"; // <-- Lucide Icons
import { AnimatePresence } from "framer-motion";
import "./styles.css";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="container">
      <div className="tabs">
        <div className="tooltip-wrapper">
          <button
            className={`tab ${activeTab === "home" ? "active" : ""}`}
            onClick={() => setActiveTab("home")}
          >
            <Home size={24} />
          </button>
          <span className="tooltip-text">Home</span>
        </div>

        <div className="tooltip-wrapper">
          <button
            className={`tab ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <User size={24} />
          </button>
          <span className="tooltip-text">Profile</span>
        </div>

        <div className="tooltip-wrapper">
          <button
            className={`tab ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            <Settings size={24} />
          </button>
          <span className="tooltip-text">Settings</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "home" && (
          <div className="tab-content fade-in">This is the Home tab.</div>
        )}
        {activeTab === "profile" && (
          <div className="tab-content fade-in">This is the Profile tab.</div>
        )}
        {activeTab === "settings" && (
          <div className="tab-content fade-in">This is the Settings tab.</div>
        )}
      </AnimatePresence>
    </div>
  );
}

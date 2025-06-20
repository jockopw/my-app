import React, { useState } from "react";
import "./styles.css";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="container">
      <div className="tabs">
        <button
          className={activeTab === "home" ? "tab active" : "tab"}
          onClick={() => setActiveTab("home")}
        >
          Home
        </button>
        <button
          className={activeTab === "profile" ? "tab active" : "tab"}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </button>
        <button
          className={activeTab === "settings" ? "tab active" : "tab"}
          onClick={() => setActiveTab("settings")}
        >
          Settings
        </button>
      </div>

      <div className="tab-content fade-in">
        {activeTab === "home" && <p>Welcome to the Home tab!</p>}
        {activeTab === "profile" && <p>This is your Profile tab.</p>}
        {activeTab === "settings" && <p>Adjust your Settings here.</p>}
      </div>
    </div>
  );
}

import React, { useState } from "react";
import "./styles.css";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="container">
      {/* Tab headers */}
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

      {/* Tab content */}
      <div className="tab-content">
        {activeTab === "home" && <div>Welcome to the Home tab!</div>}
        {activeTab === "profile" && <div>This is your Profile tab.</div>}
        {activeTab === "settings" && <div>Adjust your Settings here.</div>}
      </div>
    </div>
  );
}

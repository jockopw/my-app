import React, { useState } from "react";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div>
      {/* Buttons to switch tabs */}
      <div style={{ marginBottom: 10 }}>
        <button onClick={() => setActiveTab("home")}>Home</button>
        <button onClick={() => setActiveTab("profile")}>Profile</button>
        <button onClick={() => setActiveTab("settings")}>Settings</button>
      </div>

      {/* Content changes based on active tab */}
      <div>
        {activeTab === "home" && <div>This is the Home tab content.</div>}
        {activeTab === "profile" && <div>This is the Profile tab content.</div>}
        {activeTab === "settings" && <div>This is the Settings tab content.</div>}
      </div>
    </div>
  );
}

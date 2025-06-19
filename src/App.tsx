import React, { useState } from "react";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        <button
          onClick={() => setActiveTab("home")}
          style={{ fontWeight: activeTab === "home" ? "bold" : "normal" }}
        >
          Home
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          style={{ fontWeight: activeTab === "profile" ? "bold" : "normal" }}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          style={{ fontWeight: activeTab === "settings" ? "bold" : "normal" }}
        >
          Settings
        </button>
      </div>

      <div>
        {activeTab === "home" && <div>This is the Home tab content.</div>}
        {activeTab === "profile" && <div>This is the Profile tab content.</div>}
        {activeTab === "settings" && <div>This is the Settings tab content.</div>}
      </div>
    </div>
  );
}

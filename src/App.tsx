import React, { useState } from "react";

export default function App() {
  const [message, setMessage] = useState("Click a button");

  function handleHomeClick() {
    setMessage("Home button clicked!");
    // Your home button logic here
  }

  function handleProfileClick() {
    setMessage("Profile button clicked!");
    // Your profile button logic here
  }

  function handleSettingsClick() {
    setMessage("Settings button clicked!");
    // Your settings button logic here
  }

  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        <button onClick={handleHomeClick}>Home</button>
        <button onClick={handleProfileClick}>Profile</button>
        <button onClick={handleSettingsClick}>Settings</button>
      </div>

      <div>
        <p>{message}</p>
      </div>
    </div>
  );
}

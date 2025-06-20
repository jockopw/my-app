import React, { useState, useEffect } from "react";
import { Home, User, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "./styles.css";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [tabsVisible, setTabsVisible] = useState(true);
  const [images, setImages] = useState<string[]>([]);

  const tabs = [
    { name: "home", icon: <Home size={24} />, label: "Home" },
    { name: "profile", icon: <User size={24} />, label: "Profile" },
    { name: "settings", icon: <Settings size={24} />, label: "Settings" },
  ];

  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john@example.com");

  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  useEffect(() => {
    if (darkModeEnabled) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkModeEnabled]);

  const addImage = () => {
    const randomId = Math.floor(Math.random() * 1000);
    const url = `https://source.unsplash.com/collection/190727/200x150?sig=${randomId}`;
    setImages((imgs) => [...imgs, url]);
  };

  return (
    <motion.div
      className="container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <button
        className="toggle-button"
        onClick={() => setTabsVisible((prev) => !prev)}
      >
        {tabsVisible ? "Hide General Settings" : "Show General Settings"}
      </button>

      <AnimatePresence>
        {tabsVisible && (
          <motion.div
            className="tabs"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {tabs.map((tab) => (
              <div key={tab.name} className="tooltip-wrapper">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={activeTab === tab.name ? "tab active" : "tab"}
                  onClick={() => setActiveTab(tab.name)}
                >
                  {tab.icon}
                </motion.button>
                <span className="tooltip-text">{tab.label}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {tabsVisible && (
          <motion.div
            key={activeTab}
            className="tab-content fade-in"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {activeTab === "home" && (
              <div>
                <h2>Welcome Home!</h2>
                <p>This is your dashboard where you can start your day.</p>
                <button
                  style={{
                    padding: "8px 16px",
                    borderRadius: "6px",
                    border: "none",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    cursor: "pointer",
                  }}
                  onClick={addImage}
                >
                  Start Something
                </button>

                {images.length > 0 && (
                  <div className="scroll-container" style={{ marginTop: 20 }}>
                    {images.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt={`Random ${i}`}
                        className="scroll-image"
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "profile" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert(`Profile saved for ${name} (${email})`);
                }}
              >
                <h2>Your Profile</h2>

                <label>
                  Name:
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ marginLeft: 8, padding: 4, borderRadius: 4 }}
                  />
                </label>
                <br />
                <label>
                  Email:
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ marginLeft: 8, padding: 4, borderRadius: 4 }}
                  />
                </label>
                <br />
                <button
                  type="submit"
                  style={{
                    marginTop: 12,
                    padding: "8px 16px",
                    borderRadius: "6px",
                    border: "none",
                    backgroundColor: "#007BFF",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Save Profile
                </button>
              </form>
            )}

            {activeTab === "settings" && (
              <div>
                <h2>Settings</h2>

                <label style={{ display: "block", marginBottom: 20 }}>
                  <span style={{ marginRight: 12, verticalAlign: "middle" }}>
                    White Mode & Dark Mode
                  </span>
                  <div
                    className="toggle-switch"
                    onClick={() => setDarkModeEnabled((d) => !d)}
                    role="switch"
                    aria-checked={darkModeEnabled}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setDarkModeEnabled((d) => !d);
                      }
                    }}
                  >
                    <div
                      className={`toggle-thumb ${
                        darkModeEnabled ? "active" : ""
                      }`}
                    />
                  </div>
                </label>

                <button
                  onClick={() =>
                    alert(
                      `Mode is now ${
                        darkModeEnabled ? "Dark Mode" : "White Mode"
                      }`
                    )
                  }
                  style={{
                    padding: "8px 16px",
                    borderRadius: "6px",
                    border: "none",
                    backgroundColor: "#FF5722",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Save Settings
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

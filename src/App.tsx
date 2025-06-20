import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./styles.css";

export default function App() {
  const [tabs, setTabs] = useState([
    { id: "home", label: "Home" },
    { id: "profile", label: "Profile" },
    { id: "settings", label: "Settings" },
  ]);
  const [activeTab, setActiveTab] = useState("home");

  function addTab() {
    const newId = `tab${tabs.length + 1}`;
    setTabs([...tabs, { id: newId, label: "New Tab" }]);
    setActiveTab(newId);
  }

  return (
    <div className="container">
      <div className="tabs">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={activeTab === tab.id ? "tab active" : "tab"}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </motion.button>
        ))}
        <motion.button
          className="tab add"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={addTab}
        >
          + Add Tab
        </motion.button>
      </div>

      <AnimatePresence exitBeforeEnter>
        {tabs.map(
          (tab) =>
            activeTab === tab.id && (
              <motion.div
                key={tab.id}
                className="tab-content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <h2>{tab.label}</h2>
                <p>This is the content for the "{tab.label}" tab.</p>
              </motion.div>
            )
        )}
      </AnimatePresence>
    </div>
  );
}

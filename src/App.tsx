// src/App.tsx

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./styles.css";

export default function App() {
  const [tabs, setTabs] = useState([
    { id: "home", label: "Home", content: "Welcome to the Home tab!" },
    { id: "profile", label: "Profile", content: "This is your Profile tab." },
    { id: "settings", label: "Settings", content: "Adjust your Settings here." },
  ]);

  const [activeTab, setActiveTab] = useState("home");

  const addTab = () => {
    const newId = `tab-${Date.now()}`;
    const newLabel = prompt("Name your new tab:");
    if (newLabel) {
      setTabs([...tabs, { id: newId, label: newLabel, content: `Content for ${newLabel}` }]);
      setActiveTab(newId);
    }
  };

  const renameTab = (id: string) => {
    const newLabel = prompt("Rename this tab:");
    if (newLabel) {
      setTabs((prevTabs) =>
        prevTabs.map((tab) =>
          tab.id === id ? { ...tab, label: newLabel, content: `Content for ${newLabel}` } : tab
        )
      );
    }
  };

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
            onDoubleClick={() => renameTab(tab.id)}
          >
            {tab.label}
          </motion.button>
        ))}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="tab add"
          onClick={addTab}
        >
          ＋
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        {tabs.map(
          (tab) =>
            tab.id === activeTab && (
              <motion.div
                key={tab.id}
                className="tab-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {tab.content}
              </motion.div>
            )
        )}
      </AnimatePresence>
    </div>
  );
}

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./styles.css";

type Tab = {
  id: string;
  title: string;
  content: string;
};

export default function App() {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: "home", title: "Home", content: "Welcome to the Home tab!" },
    { id: "profile", title: "Profile", content: "This is your Profile tab." },
    { id: "settings", title: "Settings", content: "Adjust your Settings here." },
  ]);
  const [activeTabId, setActiveTabId] = useState("home");

  // Add new tab
  const addTab = () => {
    const newId = `tab-${Date.now()}`;
    const newTab = { id: newId, title: "New Tab", content: "New tab content." };
    setTabs([...tabs, newTab]);
    setActiveTabId(newId);
  };

  // Rename tab handler
  const renameTab = (id: string, newTitle: string) => {
    setTabs(
      tabs.map((tab) =>
        tab.id === id ? { ...tab, title: newTitle } : tab
      )
    );
  };

  return (
    <div className="container">
      <div className="tabs">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={activeTabId === tab.id ? "tab active" : "tab"}
            onClick={() => setActiveTabId(tab.id)}
          >
            <input
              value={tab.title}
              onClick={(e) => e.stopPropagation()} // prevent switching tab when renaming
              onChange={(e) => renameTab(tab.id, e.target.value)}
              className="tab-input"
            />
          </motion.button>
        ))}
        <button className="tab add" onClick={addTab}>
          + Add Tab
        </button>
      </div>

      <AnimatePresence exitBeforeEnter>
        {tabs
          .filter((tab) => tab.id === activeTabId)
          .map((tab) => (
            <motion.div
              key={tab.id}
              className="tab-content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {tab.content}
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  );
}

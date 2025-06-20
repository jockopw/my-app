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
  const [editingTabId, setEditingTabId] = useState<string | null>(null);

  const addTab = () => {
    const newId = `tab-${Date.now()}`;
    const newTab = { id: newId, title: "fugle", content: "New tab content." };
    setTabs([...tabs, newTab]);
    setActiveTabId(newId);
  };

  const renameTab = (id: string, newTitle: string) => {
    setTabs(tabs.map(tab => (tab.id === id ? { ...tab, title: newTitle } : tab)));
  };

  return (
    <div className="container">
      <div className="tabs">
        {tabs.map(tab => (
          <motion.div
            key={tab.id}
            className={`tab ${activeTabId === tab.id ? "active" : ""}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTabId(tab.id)}
            onDoubleClick={() => setEditingTabId(tab.id)}
          >
            {editingTabId === tab.id ? (
              <input
                autoFocus
                className="tab-edit-input"
                value={tab.title}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => renameTab(tab.id, e.target.value)}
                onBlur={() => setEditingTabId(null)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setEditingTabId(null);
                }}
              />
            ) : (
              tab.title
            )}
          </motion.div>
        ))}
        <button className="tab add" onClick={addTab}>
          + Add Tab
        </button>
      </div>

      <AnimatePresence mode="wait">
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

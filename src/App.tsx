// src/App.tsx

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./styles.css";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="container">
      <div className="tabs">
        {["home", "profile", "settings"].map((tab) => (
          <motion.button
            key={tab}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={activeTab === tab ? "tab active" : "tab"}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "home" && (
          <motion.div
            key="home"
            className="tab-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            Welcome to the Home tab!
          </motion.div>
        )}
        {activeTab === "profile" && (
          <motion.div
            key="profile"
            className="tab-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            This is your Profile tab.
          </motion.div>
        )}
        {activeTab === "settings" && (
          <motion.div
            key="settings"
            className="tab-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            Adjust your Settings here.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

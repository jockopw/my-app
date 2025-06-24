import React, { useState, useEffect, useRef } from "react";
import { Home, User, Settings, Plus, Music, Gamepad } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "./styles.css";

import CodeMirror from "@uiw/react-codemirror";
import { lua } from "@codemirror/lang-lua";

export default function App() {
  // === States ===
  const [activeTab, setActiveTab] = useState("home");
  const [tabsVisible, setTabsVisible] = useState(true);
  const [secondVisible, setSecondVisible] = useState(false); // second toggle panel visibility
  const [images, setImages] = useState<string[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState(180);

  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john@example.com");
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const [showPfpSelector, setShowPfpSelector] = useState(false);
  const [selectedPfp, setSelectedPfp] = useState<string | null>(null);
  const [profilePics, setProfilePics] = useState<string[]>([
    "https://static.robloxden.com/xsmall_silly_cat_346a0b5b02.png",
    "https://static.robloxden.com/xsmall_black_man_laughing_at_dark_daaedd189d.png",
    "https://static.robloxden.com/xsmall_funny_dog_face_7fd50d454f.png",
    "https://static.robloxden.com/xsmall_funnyweird_face_228f4cf5c7.png",
  ]);

  // Music Tab States
  const [musicUrl, setMusicUrl] = useState("");
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Game Tab States (ADDED)
  const [gameScore, setGameScore] = useState(0);
  const [gameRunning, setGameRunning] = useState(false);
  const gameIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Lua Editor Code State
  const [luaCode, setLuaCode] = useState("-- Write your Lua code here\nprint('Hello, Lua!')");

  const isDraggingSidebar = useRef(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const imagePool = profilePics;

  // === Effects ===
  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkModeEnabled);
  }, [darkModeEnabled]);

  useEffect(() => {
    return () => {
      if (audioSrc && audioSrc.startsWith("blob:")) {
        URL.revokeObjectURL(audioSrc);
      }
    };
  }, [audioSrc]);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!isDraggingSidebar.current) return;
      const newWidth = e.clientX;
      if (newWidth >= 100 && newWidth <= 500) setSidebarWidth(newWidth);
    };
    const stop = () => (isDraggingSidebar.current = false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", stop);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", stop);
    };
  }, []);

  const startSidebarDrag = () => (isDraggingSidebar.current = true);

  const startModalDrag = (e: React.MouseEvent) => {
    setDragStart({ x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y });
  };
  const onModalDrag = (e: MouseEvent) => {
    if (dragStart) {
      setDragOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };
  const stopModalDrag = () => setDragStart(null);
  useEffect(() => {
    if (dragStart) {
      window.addEventListener("mousemove", onModalDrag);
      window.addEventListener("mouseup", stopModalDrag);
    } else {
      window.removeEventListener("mousemove", onModalDrag);
      window.removeEventListener("mouseup", stopModalDrag);
    }
    return () => {
      window.removeEventListener("mousemove", onModalDrag);
      window.removeEventListener("mouseup", stopModalDrag);
    };
  }, [dragStart]);

  // === Handlers ===
  const addImage = () => {
    const randomImage = imagePool[Math.floor(Math.random() * imagePool.length)];
    setImages((imgs) => [...imgs, randomImage]);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf"];
    if (!allowedTypes.includes(file.type)) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setProfilePics((prev) => [...prev, result]);
    };
    reader.readAsDataURL(file);
  };

  // Music tab handlers
  const handleMusicLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!musicUrl) return;
    setAudioSrc(musicUrl);
  };

  const handleMusicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAudioSrc(url);
    setMusicUrl("");
  };

  // Game Tab handlers (ADDED)
  const startGame = () => {
    if (gameRunning) return;
    setGameScore(0);
    setGameRunning(true);
    gameIntervalRef.current = setInterval(() => {
      setGameScore((score) => score + 1);
    }, 1000);
  };

  const stopGame = () => {
    if (!gameRunning) return;
    setGameRunning(false);
    if (gameIntervalRef.current) {
      clearInterval(gameIntervalRef.current);
      gameIntervalRef.current = null;
    }
  };

  // === Tabs Array (ADDED game tab)
  const tabs = [
    { name: "home", icon: <Home size={24} />, label: "Home" },
    { name: "profile", icon: <User size={24} />, label: "Profile" },
    { name: "settings", icon: <Settings size={24} />, label: "Settings" },
    { name: "music", icon: <Music size={24} />, label: "Music" },
    { name: "game", icon: <Gamepad size={24} />, label: "Game" },
  ];

  // === Animation Variants ===
  const playerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  };

  // === Handlers for toggles to auto-hide other panel ===
  const toggleTabsVisible = () => {
    if (!tabsVisible) {
      setTabsVisible(true);
      setSecondVisible(false);
    } else {
      setTabsVisible(false);
    }
  };

  const toggleSecondVisible = () => {
    if (!secondVisible) {
      setSecondVisible(true);
      setTabsVisible(false);
    } else {
      setSecondVisible(false);
    }
  };

  // === JSX ===
  return (
    <motion.div
      className="container"
      style={{ overflow: "hidden", height: "100vh", backgroundColor: "black", color: "white" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Toggle Buttons */}
      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <button
          className="toggle-button"
          onClick={toggleTabsVisible}
          style={{ backgroundColor: "#007BFF", color: "white" }}
        >
          {tabsVisible ? "Hide General Settings" : "Show General Settings"}
        </button>
        <button
          className="toggle-button"
          onClick={toggleSecondVisible}
          style={{ backgroundColor: "#28a745", color: "white" }}
        >
          {secondVisible ? "Hide Extra Panel" : "Show Extra Panel"}
        </button>
      </div>

      {/* General Settings Tabs */}
      <AnimatePresence>
        {tabsVisible && (
          <motion.div
            className="tabs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{ marginBottom: 20 }}
          >
            {tabs.map((tab) => (
              <div key={tab.name} className="tooltip-wrapper">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={activeTab === tab.name ? "tab active" : "tab"}
                  onClick={() => setActiveTab(tab.name)}
                  aria-label={tab.label}
                >
                  {tab.icon}
                </motion.button>
                <span className="tooltip-text">{tab.label}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Extra Panel (Second Toggle) */}
      <AnimatePresence>
        {secondVisible && (
          <motion.div
            key="extra-panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              padding: 20,
              marginBottom: 20,
              backgroundColor: "#222",
              borderRadius: 12,
              color: "white",
              userSelect: "none",
              height: "400px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h2>Lua Code Editor</h2>
            <p>Edit Lua code below:</p>
            <div style={{ flex: 1, marginTop: 12, borderRadius: 8, overflow: "hidden", border: "1px solid #555" }}>
              <CodeMirror
                value={luaCode}
                height="100%"
                extensions={[lua()]}
                onChange={(value) => setLuaCode(value)}
                theme="dark"
                basicSetup={true}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Tab Content */}
      <AnimatePresence mode="wait">
        {tabsVisible && (
          <motion.div
            key={activeTab}
            className="tab-content fade-in"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{ display: "flex", overflow: "hidden", height: "100%" }}
          >
            {/* Home Tab */}
            {activeTab === "home" && (
              <>
                <div
                  className="scroll-container-vertical"
                  style={{
                    width: sidebarWidth,
                    overflowY: "auto",
                    height: "calc(100vh - 160px)",
                    borderRight: "1px solid #444",
                    paddingRight: 10,
                    position: "relative",
                    flexShrink: 0,
                  }}
                >
                  {images.length === 0 && (
                    <p style={{ color: "#777", fontSize: 14, textAlign: "center" }}>No images yet</p>
                  )}
                  {images.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt={`Image ${i}`}
                      className="scroll-image-vertical"
                      onClick={() => {
                        setPreviewImage(src);
                        setZoom(1);
                        setRotation(0);
                        setDragOffset({ x: 0, y: 0 });
                      }}
                      style={{
                        width: "100%",
                        height: 120,
                        objectFit: "cover",
                        cursor: "pointer",
                        marginBottom: 12,
                        borderRadius: 8,
                      }}
                    />
                  ))}
                  <div
                    onMouseDown={startSidebarDrag}
                    style={{
                      width: 6,
                      cursor: "ew-resize",
                      position: "absolute",
                      right: 0,
                      top: 0,
                      bottom: 0,
                      backgroundColor: "#6666",
                    }}
                  />
                </div>

                <div style={{ flex: 1, paddingLeft: 20 }}>
                  <h2>Welcome Home!</h2>
                  <p>This is your dashboard where you can start your day.</p>
                  <button
                    onClick={addImage}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "6px",
                      border: "none",
                      backgroundColor: "#4CAF50",
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    Get Image
                  </button>
                </div>
              </>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div style={{ width: "100%" }}>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert("Select Your Profile Pic");
                    setShowPfpSelector(true);
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

                <AnimatePresence>
                  {showPfpSelector && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 20 }}
                    >
                      <div style={{ display: "flex", gap: 12 }}>
                        {profilePics.map((src) => (
                          <img
                            key={src}
                            src={src}
                            alt="Profile Pic"
                            onClick={() => setSelectedPfp(src)}
                            style={{
                              width: 80,
                              height: 80,
                              objectFit: "cover",
                              borderRadius: "50%",
                              cursor: "pointer",
                              border: selectedPfp === src ? "3px solid #007BFF" : "2px solid #ccc",
                              boxShadow: selectedPfp === src ? "0 0 8px #007BFF" : "none",
                              transition: "border 0.3s ease, box-shadow 0.3s ease",
                            }}
                          />
                        ))}
                      </div>

                      <label className="upload-icon-button" title="Upload Custom Pic" style={{ cursor: "pointer" }}>
                        <Plus size={20} />
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          style={{ display: "none" }}
                          onChange={handleUpload}
                        />
                      </label>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && tabsVisible && !secondVisible && (
              <div style={{ width: "100%" }}>
                <h2>Settings</h2>
                <label style={{ display: "block", marginBottom: 20 }}>
                  <span style={{ marginRight: 12, verticalAlign: "middle" }}>White Mode & Dark Mode</span>
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
                    <div className={`toggle-thumb ${darkModeEnabled ? "active" : ""}`} />
                  </div>
                </label>

                {/* Additional settings */}
                <label style={{ display: "block", marginBottom: 20, color: darkModeEnabled ? "white" : "black" }}>
                  <span style={{ marginRight: 12, verticalAlign: "middle" }}>Enable Notifications</span>
                  <input
                    type="checkbox"
                    checked={true}
                    onChange={() => alert("Notifications setting toggled!")}
                  />
                </label>

                <label style={{ display: "block", marginBottom: 20, color: darkModeEnabled ? "white" : "black" }}>
                  <span style={{ marginRight: 12, verticalAlign: "middle" }}>Auto Save Profile</span>
                  <input
                    type="checkbox"
                    checked={false}
                    onChange={() => alert("Auto Save toggled!")}
                  />
                </label>

                <p style={{ color: darkModeEnabled ? "white" : "black", fontStyle: "italic" }}>
                  More settings coming soon...
                </p>
              </div>
            )}

            {/* Music Tab */}
            {activeTab === "music" && tabsVisible && !secondVisible && (
              <div style={{ width: "100%" }}>
                <h2>Music Player</h2>

                <form onSubmit={handleMusicLinkSubmit} style={{ marginBottom: 16 }}>
                  <input
                    type="text"
                    placeholder="Enter audio URL"
                    value={musicUrl}
                    onChange={(e) => setMusicUrl(e.target.value)}
                    style={{ width: "60%", padding: 8, marginRight: 8, borderRadius: 6 }}
                  />
                  <button type="submit" style={{ padding: "8px 12px", borderRadius: 6, cursor: "pointer" }}>
                    Play
                  </button>
                </form>

                <input type="file" accept="audio/*" onChange={handleMusicUpload} style={{ marginBottom: 16 }} />

                {audioSrc && (
                  <audio controls ref={audioRef} style={{ width: "100%" }}>
                    <source src={audioSrc} />
                    Your browser does not support the audio element.
                  </audio>
                )}
              </div>
            )}

            {/* Game Tab */}
            {activeTab === "game" && tabsVisible && !secondVisible && (
              <div style={{ width: "100%" }}>
                <h2>Simple Game</h2>
                <p>Score: {gameScore}</p>
                <button
                  onClick={startGame}
                  disabled={gameRunning}
                  style={{
                    marginRight: 12,
                    padding: "8px 16px",
                    backgroundColor: gameRunning ? "#ccc" : "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                    cursor: gameRunning ? "default" : "pointer",
                  }}
                >
                  Start
                </button>
                <button
                  onClick={stopGame}
                  disabled={!gameRunning}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: !gameRunning ? "#ccc" : "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                    cursor: !gameRunning ? "default" : "pointer",
                  }}
                >
                  Stop
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.8)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999,
              userSelect: "none",
            }}
            onClick={() => setPreviewImage(null)}
          >
            <motion.div
              key="modal-image"
              className="modal-image-wrapper"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              style={{
                maxWidth: "90vw",
                maxHeight: "90vh",
                overflow: "hidden",
                position: "relative",
                cursor: "grab",
                userSelect: "none",
              }}
              onMouseDown={startModalDrag}
              ref={modalRef}
            >
              <img
                src={previewImage}
                alt="Preview"
                draggable={false}
                style={{
                  display: "block",
                  maxWidth: "100%",
                  maxHeight: "100%",
                  transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                  userSelect: "none",
                  pointerEvents: "none",
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

import React, { useState, useEffect, useRef } from "react";
import { Home, User, Settings, Plus, Music, Gamepad } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "./styles.css";

export default function App() {
  // === States ===
  const [activeTab, setActiveTab] = useState("home");
  const [tabsVisible, setTabsVisible] = useState(true);
  const [secondToggleVisible, setSecondToggleVisible] = useState(false);
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
    { name: "game", icon: <Gamepad size={24} />, label: "Game" }, // added game tab icon and label
  ];

  // === Animation Variants ===
  const playerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
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
      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <button
          className="toggle-button"
          onClick={() => setTabsVisible((prev) => !prev)}
          style={{ backgroundColor: "#007BFF", color: "white" }}
        >
          {tabsVisible ? "Hide General Settings" : "Show General Settings"}
        </button>

        <button
          className="toggle-button"
          onClick={() => setSecondToggleVisible((prev) => !prev)}
          style={{ backgroundColor: "#007BFF", color: "white" }}
        >
          {secondToggleVisible ? "Hide Second Toggle" : "Show Second Toggle"}
        </button>
      </div>

      <AnimatePresence>
        {(tabsVisible || secondToggleVisible) && (
          <motion.div
            className="tabs"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
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

      <AnimatePresence mode="wait">
        {(tabsVisible || secondToggleVisible) && (
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
            {activeTab === "settings" && (
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

                <label style={{ display: "block", marginBottom: 20, color: darkModeEnabled ? "white" : "black" }}>
                  <span style={{ marginRight: 12, verticalAlign: "middle" }}>Enable Sound Effects</span>
                  <input
                    type="checkbox"
                    checked={true}
                    onChange={() => alert("Sound Effects toggled!")}
                  />
                </label>
              </div>
            )}

            {/* Music Tab */}
            {activeTab === "music" && (
              <motion.div
                key="music-player"
                variants={playerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.5 }}
                style={{ width: "100%", padding: 20 }}
              >
                <h2>Music Player</h2>

                <form onSubmit={handleMusicLinkSubmit} style={{ marginBottom: 16 }}>
                  <label htmlFor="music-url" style={{ display: "block", marginBottom: 8 }}>
                    Paste Audio URL:
                  </label>
                  <input
                    id="music-url"
                    type="url"
                    placeholder="https://example.com/audio.mp3"
                    value={musicUrl}
                    onChange={(e) => setMusicUrl(e.target.value)}
                    style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
                  />
                  <button
                    type="submit"
                    style={{
                      marginTop: 8,
                      padding: "8px 16px",
                      borderRadius: 6,
                      border: "none",
                      backgroundColor: "#007BFF",
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    Play URL
                  </button>
                </form>

                <label
                  style={{
                    display: "inline-block",
                    padding: "8px 16px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    borderRadius: 6,
                    cursor: "pointer",
                    marginBottom: 20,
                    userSelect: "none",
                  }}
                >
                  Upload Audio File
                  <input
                    type="file"
                    accept="audio/*"
                    style={{ display: "none" }}
                    onChange={handleMusicUpload}
                  />
                </label>

                <AnimatePresence>
                  {audioSrc && (
                    <motion.div
                      key="audio-player"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      style={{
                        marginTop: 24,
                        backgroundColor: "#222",
                        padding: 20,
                        borderRadius: 12,
                        color: "white",
                        maxWidth: 480,
                      }}
                    >
                      <audio
                        ref={audioRef}
                        src={audioSrc}
                        controls
                        autoPlay
                        style={{ width: "100%", outline: "none" }}
                        onEnded={() => setAudioSrc(null)}
                      />
                      <button
                        onClick={() => setAudioSrc(null)}
                        style={{
                          marginTop: 12,
                          padding: "6px 12px",
                          borderRadius: 6,
                          border: "none",
                          backgroundColor: "#d33",
                          color: "white",
                          cursor: "pointer",
                        }}
                      >
                        Stop & Clear
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Game Tab (ADDED) */}
            {activeTab === "game" && (
              <motion.div
                key="game-tab"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                style={{ width: "100%", padding: 20, display: "flex", flexDirection: "column", alignItems: "center" }}
              >
                <h2>Simple Increment Game</h2>
                <p>Score: {gameScore}</p>
                <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                  <button
                    onClick={startGame}
                    disabled={gameRunning}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 6,
                      border: "none",
                      backgroundColor: gameRunning ? "#666" : "#28a745",
                      color: "white",
                      cursor: gameRunning ? "not-allowed" : "pointer",
                    }}
                  >
                    Start
                  </button>
                  <button
                    onClick={stopGame}
                    disabled={!gameRunning}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 6,
                      border: "none",
                      backgroundColor: !gameRunning ? "#666" : "#dc3545",
                      color: "white",
                      cursor: !gameRunning ? "not-allowed" : "pointer",
                    }}
                  >
                    Stop
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {previewImage && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.3)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999,
            }}
            onClick={() => setPreviewImage(null)}
          >
            <div
              ref={modalRef}
              style={{
                position: "absolute",
                top: `calc(50% + ${dragOffset.y}px)`,
                left: `calc(50% + ${dragOffset.x}px)`,
                transform: "translate(-50%, -50%)",
                zIndex: 10000,
                cursor: dragStart ? "grabbing" : "grab",
              }}
              onMouseDown={startModalDrag}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img
                src={previewImage}
                alt="Preview"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  maxWidth: "80vw",
                  maxHeight: "80vh",
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  borderRadius: 12,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
                  userSelect: "none",
                  pointerEvents: "none",
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

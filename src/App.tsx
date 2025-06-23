import React, { useState, useEffect, useRef } from "react";
import { Home, User, Settings, Plus, Gamepad, Music } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "./styles.css";

// Type definitions for drag position
type DragPosition = { x: number; y: number } | null;

// Utility function to simulate async delay (for demo purposes)
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// Helper component for tooltip wrapped button with animation
const TabButton = ({
  active,
  onClick,
  icon,
  tooltip,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  tooltip: string;
}) => (
  <div className="tooltip-wrapper">
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={active ? "tab active" : "tab"}
      onClick={onClick}
      aria-label={tooltip}
      type="button"
    >
      {icon}
    </motion.button>
    <span className="tooltip-text">{tooltip}</span>
  </div>
);

// Main App component
export default function App() {
  // ====== State Variables ======

  // Active tab state: home, profile, game, music, settings
  const [activeTab, setActiveTab] = useState<string>("home");

  // Toggle to show/hide general tabs (home/profile/game/music/settings)
  const [tabsVisible, setTabsVisible] = useState<boolean>(true);

  // Images state - stores array of image URLs (string)
  const [images, setImages] = useState<string[]>([]);

  // Preview image modal state and transformations
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);

  // Drag related states for modal and sidebar resizing
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [dragStart, setDragStart] = useState<DragPosition>(null);
  const [sidebarWidth, setSidebarWidth] = useState<number>(180);
  const isDraggingSidebar = useRef<boolean>(false);

  // Profile states
  const [name, setName] = useState<string>("John Doe");
  const [email, setEmail] = useState<string>("john@example.com");
  const [darkModeEnabled, setDarkModeEnabled] = useState<boolean>(true); // Default black bg

  // Profile picture selector states
  const [showPfpSelector, setShowPfpSelector] = useState<boolean>(false);
  const [selectedPfp, setSelectedPfp] = useState<string | null>(null);
  const [profilePics, setProfilePics] = useState<string[]>([
    "https://static.robloxden.com/xsmall_silly_cat_346a0b5b02.png",
    "https://static.robloxden.com/xsmall_black_man_laughing_at_dark_daaedd189d.png",
    "https://static.robloxden.com/xsmall_funny_dog_face_7fd50d454f.png",
    "https://static.robloxden.com/xsmall_funnyweird_face_228f4cf5c7.png",
  ]);

  // Modal reference
  const modalRef = useRef<HTMLDivElement>(null);

  // Audio player state for music tab
  const [audioSrc, setAudioSrc] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioFade, setAudioFade] = useState<boolean>(false);

  // =============================

  // Image pool for random image selection in Home tab
  const imagePool = profilePics;

  // ===== Effects =====

  // Apply dark mode class to body
  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkModeEnabled);
  }, [darkModeEnabled]);

  // Sidebar drag handlers
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingSidebar.current) return;
      const newWidth = e.clientX;
      if (newWidth >= 100 && newWidth <= 500) setSidebarWidth(newWidth);
    };
    const onMouseUp = () => {
      isDraggingSidebar.current = false;
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  // Modal drag handlers
  const onModalDrag = (e: MouseEvent) => {
    if (!dragStart) return;
    setDragOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  useEffect(() => {
    if (dragStart) {
      window.addEventListener("mousemove", onModalDrag);
      window.addEventListener("mouseup", () => setDragStart(null));
    } else {
      window.removeEventListener("mousemove", onModalDrag);
      window.removeEventListener("mouseup", () => setDragStart(null));
    }
    return () => {
      window.removeEventListener("mousemove", onModalDrag);
      window.removeEventListener("mouseup", () => setDragStart(null));
    };
  }, [dragStart]);

  // Audio play/pause effect with fade in/out animation
  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    if (isPlaying) {
      // Fade in volume
      let volume = 0;
      audio.volume = 0;
      audio.play();
      setAudioFade(true);
      const fadeInInterval = setInterval(() => {
        if (volume < 1) {
          volume += 0.05;
          audio.volume = Math.min(volume, 1);
        } else {
          clearInterval(fadeInInterval);
          setAudioFade(false);
        }
      }, 50);
    } else {
      // Fade out volume and pause
      let volume = audio.volume;
      setAudioFade(true);
      const fadeOutInterval = setInterval(() => {
        if (volume > 0) {
          volume -= 0.05;
          audio.volume = Math.max(volume, 0);
        } else {
          clearInterval(fadeOutInterval);
          audio.pause();
          setAudioFade(false);
        }
      }, 50);
    }
  }, [isPlaying]);

  // ===== Event Handlers =====

  // Add random image to Home tab list
  const addImage = () => {
    const randomImage = imagePool[Math.floor(Math.random() * imagePool.length)];
    setImages((imgs) => [...imgs, randomImage]);
  };

  // File upload handler for profile pics
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type)) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setProfilePics((prev) => [...prev, result]);
    };
    reader.readAsDataURL(file);
  };

  // Sidebar drag start handler
  const startSidebarDrag = () => (isDraggingSidebar.current = true);

  // Modal drag start handler
  const startModalDrag = (e: React.MouseEvent) => {
    setDragStart({ x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y });
  };

  // Music link or file input handler
  const handleMusicInput = (input: string | File) => {
    if (typeof input === "string") {
      // Accept YouTube or Spotify links (basic validation)
      if (
        input.includes("youtube.com") ||
        input.includes("youtu.be") ||
        input.includes("spotify.com")
      ) {
        setAudioSrc(input);
        setIsPlaying(true);
      } else {
        alert("Please enter a valid YouTube or Spotify URL.");
      }
    } else if (input instanceof File) {
      const url = URL.createObjectURL(input);
      setAudioSrc(url);
      setIsPlaying(true);
    }
  };

  // Audio file input change handler
  const onAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleMusicInput(file);
  };

  // Music URL paste handler
  const onMusicUrlPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedData = e.clipboardData.getData("Text");
    if (pastedData) {
      handleMusicInput(pastedData);
    }
  };

  // Play/pause toggle
  const togglePlay = () => {
    setIsPlaying((p) => !p);
  };

  // =======================
  // Tabs array with new Music and Game tab included, Game next to Profile, Music next to Settings
  const tabs = [
    { name: "home", icon: <Home size={24} />, label: "Home" },
    { name: "profile", icon: <User size={24} />, label: "Profile" },
    { name: "game", icon: <Gamepad size={24} />, label: "Game" },
    { name: "music", icon: <Music size={24} />, label: "Music" },
    { name: "settings", icon: <Settings size={24} />, label: "Settings" },
  ];

  // =======================
  // Game Tab: Simple clicker game state
  const [gameCount, setGameCount] = useState<number>(0);

  // Game button click handler
  const incrementGame = () => {
    setGameCount((c) => c + 1);
  };

  // ===== Render =====
  return (
    <motion.div
      className="container"
      style={{ overflow: "hidden", height: "100vh" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Toggle to show/hide general tabs */}
      <button
        className="toggle-button"
        onClick={() => setTabsVisible((prev) => !prev)}
      >
        {tabsVisible ? "Hide General Settings" : "Show General Settings"}
      </button>

      {/* Tab buttons */}
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
              <TabButton
                key={tab.name}
                active={activeTab === tab.name}
                onClick={() => setActiveTab(tab.name)}
                icon={tab.icon}
                tooltip={tab.label}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tab content */}
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
                    <p
                      style={{
                        color: "#777",
                        fontSize: 14,
                        textAlign: "center",
                      }}
                    >
                      No images yet
                    </p>
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
                      style={{
                        marginTop: 20,
                        display: "flex",
                        alignItems: "center",
                        gap: 20,
                      }}
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
                              border:
                                selectedPfp === src
                                  ? "3px solid #007BFF"
                                  : "2px solid #ccc",
                              boxShadow:
                                selectedPfp === src
                                  ? "0 0 8px #007BFF"
                                  : "none",
                              transition: "border 0.3s ease, box-shadow 0.3s ease",
                            }}
                          />
                        ))}
                      </div>

                      <label
                        className="upload-icon-button"
                        title="Upload Custom Pic"
                        style={{
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "#000",
                          borderRadius: "50%",
                          width: 48,
                          height: 48,
                          border: "2px solid white",
                          color: "white",
                        }}
                      >
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

            {/* Game Tab */}
            {activeTab === "game" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 20,
                }}
              >
                <h2>Simple Clicker Game</h2>
                <p>Clicks: {gameCount}</p>
                <button
                  onClick={incrementGame}
                  style={{
                    padding: "12px 24px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: "#e91e63",
                    color: "white",
                    cursor: "pointer",
                    fontSize: 18,
                  }}
                >
                  Click Me!
                </button>
              </motion.div>
            )}

            {/* Music Tab */}
            {activeTab === "music" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  width: "100%",
                  padding: 20,
                  display: "flex",
                  flexDirection: "column",
                  gap: 20,
                }}
              >
                <h2>Music Player</h2>

                <label htmlFor="music-url">Paste YouTube or Spotify URL:</label>
                <input
                  id="music-url"
                  type="text"
                  placeholder="https://youtube.com/ or https://spotify.com/..."
                  onPaste={onMusicUrlPaste}
                  style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
                />

                <label htmlFor="music-file-upload" style={{ marginTop: 10 }}>
                  Or upload audio file:
                </label>
                <input
                  id="music-file-upload"
                  type="file"
                  accept="audio/*"
                  onChange={onAudioFileChange}
                />

                {/* Audio Player */}
                {audioSrc && (
                  <div
                    style={{
                      marginTop: 20,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <audio ref={audioRef} src={audioSrc} controls={false} />
                    <button
                      onClick={togglePlay}
                      style={{
                        padding: "8px 16px",
                        borderRadius: 6,
                        border: "none",
                        backgroundColor: "#007BFF",
                        color: "white",
                        cursor: "pointer",
                      }}
                    >
                      {isPlaying ? "Pause" : "Play"}
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div style={{ width: "100%" }}>
                <h2>Settings</h2>

                {/* Dark Mode Toggle */}
                <label
                  style={{
                    display: "block",
                    marginBottom: 20,
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                >
                  <span
                    style={{ marginRight: 12, verticalAlign: "middle" }}
                    aria-label="Toggle Dark Mode"
                  >
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
                    style={{ display: "inline-block", verticalAlign: "middle" }}
                  >
                    <div
                      className={
                        "toggle-thumb " + (darkModeEnabled ? "active" : "")
                      }
                    />
                  </div>
                </label>

                {/* Volume Control */}
                <label style={{ display: "block", marginBottom: 20 }}>
                  <span style={{ marginRight: 12, verticalAlign: "middle" }}>
                    Volume Control
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    defaultValue={100}
                    onChange={(e) => {
                      if (audioRef.current) {
                        audioRef.current.volume = Number(e.target.value) / 100;
                      }
                    }}
                    style={{ verticalAlign: "middle" }}
                    aria-label="Volume control slider"
                  />
                </label>

                {/* Reset Profile Info */}
                <button
                  onClick={() => {
                    setName("John Doe");
                    setEmail("john@example.com");
                    alert("Profile reset to default");
                  }}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "6px",
                    border: "none",
                    backgroundColor: "#dc3545",
                    color: "white",
                    cursor: "pointer",
                    marginTop: 10,
                  }}
                >
                  Reset Profile Info
                </button>

                {/* Additional dummy setting */}
                <div style={{ marginTop: 20 }}>
                  <label>
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        alert(
                          `Extra setting toggled: ${
                            e.target.checked ? "On" : "Off"
                          }`
                        )
                      }
                    />{" "}
                    Enable Extra Feature (demo)
                  </label>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Image Modal */}
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

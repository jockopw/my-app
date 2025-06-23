import React, { useState, useEffect, useRef } from "react";
import { Home, User, Settings, Plus, Gamepad, Music } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "./styles.css";

function GuessingGame() {
  const [target] = useState(Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("Guess a number between 1 and 100");
  const [finished, setFinished] = useState(false);

  const checkGuess = () => {
    const num = Number(guess);
    if (isNaN(num)) {
      setMessage("Please enter a valid number");
      return;
    }
    if (num === target) {
      setMessage(`Correct! The number was ${target}`);
      setFinished(true);
    } else if (num < target) {
      setMessage("Too low!");
    } else {
      setMessage("Too high!");
    }
  };

  const resetGame = () => {
    setGuess("");
    setMessage("Guess a number between 1 and 100");
    setFinished(false);
  };

  return (
    <div style={{ color: "white" }}>
      <p>{message}</p>
      <input
        type="number"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        disabled={finished}
        style={{ padding: 8, borderRadius: 4, border: "none", marginRight: 8 }}
      />
      <button
        onClick={checkGuess}
        disabled={finished}
        style={{
          padding: "8px 16px",
          borderRadius: 4,
          border: "none",
          backgroundColor: "#4CAF50",
          color: "white",
          cursor: "pointer",
        }}
      >
        Guess
      </button>
      {finished && (
        <button
          onClick={resetGame}
          style={{
            padding: "8px 16px",
            marginLeft: 8,
            borderRadius: 4,
            border: "none",
            backgroundColor: "#007BFF",
            color: "white",
            cursor: "pointer",
          }}
        >
          Play Again
        </button>
      )}
    </div>
  );
}

export default function App() {
  // General UI states
  const [activeTab, setActiveTab] = useState("home");
  const [tabsVisible, setTabsVisible] = useState(true);
  const [images, setImages] = useState<string[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [sidebarWidth, setSidebarWidth] = useState(180);

  // Profile info states
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

  // Music Tab State
  const [musicUrl, setMusicUrl] = useState("");
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [embedSrc, setEmbedSrc] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Drag control refs
  const isDraggingSidebar = useRef(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const imagePool = profilePics;

  // Dark mode effect
  useEffect(() => {
    document.body.style.backgroundColor = darkModeEnabled ? "#000" : "#fff";
    document.body.style.color = darkModeEnabled ? "#fff" : "#000";
  }, [darkModeEnabled]);

  // Add image to home tab list
  const addImage = () => {
    const randomImage = imagePool[Math.floor(Math.random() * imagePool.length)];
    setImages((imgs) => [...imgs, randomImage]);
  };

  // Handle profile pic upload
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

  // Sidebar drag handlers
  const startSidebarDrag = () => (isDraggingSidebar.current = true);
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

  // Modal drag handlers
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

  // Music helpers
  const isYouTubeLink = (url: string) => {
    try {
      const u = new URL(url);
      return u.hostname.includes("youtube.com") || u.hostname.includes("youtu.be");
    } catch {
      return false;
    }
  };

  const getYouTubeEmbedUrl = (url: string) => {
    try {
      const u = new URL(url);
      if (u.hostname.includes("youtu.be")) {
        return `https://www.youtube.com/embed/${u.pathname.slice(1)}?autoplay=1`;
      } else if (u.hostname.includes("youtube.com")) {
        const params = u.searchParams;
        const v = params.get("v");
        if (v) return `https://www.youtube.com/embed/${v}?autoplay=1`;
      }
      return null;
    } catch {
      return null;
    }
  };

  const isSpotifyLink = (url: string) => {
    try {
      const u = new URL(url);
      return u.hostname.includes("spotify.com");
    } catch {
      return false;
    }
  };

  const getSpotifyEmbedUrl = (url: string) => {
    try {
      const u = new URL(url);
      const parts = u.pathname.split("/");
      if (u.hostname.includes("spotify.com") && parts.length >= 3) {
        return `https://open.spotify.com/embed/${parts[1]}/${parts[2]}`;
      }
      return null;
    } catch {
      return null;
    }
  };

  // Submit link to play
  const handleMusicLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isYouTubeLink(musicUrl)) {
      const embed = getYouTubeEmbedUrl(musicUrl);
      setEmbedSrc(embed);
      setAudioSrc(null);
    } else if (isSpotifyLink(musicUrl)) {
      const embed = getSpotifyEmbedUrl(musicUrl);
      setEmbedSrc(embed);
      setAudioSrc(null);
    } else {
      setAudioSrc(musicUrl);
      setEmbedSrc(null);
    }
  };

  // Upload audio file
  const handleMusicFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowedAudioTypes = ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp3"];
    if (!allowedAudioTypes.includes(file.type)) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setAudioSrc(result);
      setEmbedSrc(null);
      setMusicUrl("");
    };
    reader.readAsDataURL(file);
  };

  // Stop music playback
  const stopMusic = () => {
    setAudioSrc(null);
    setEmbedSrc(null);
    setMusicUrl("");
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const tabs = [
    { name: "home", icon: <Home size={24} />, label: "Home" },
    { name: "profile", icon: <User size={24} />, label: "Profile" },
    { name: "game", icon: <Gamepad size={24} />, label: "Game" },
    { name: "music", icon: <Music size={24} />, label: "Music" },
    { name: "settings", icon: <Settings size={24} />, label: "Settings" },
  ];

  return (
    <motion.div
      className="container"
      style={{ overflow: "hidden", height: "100vh", backgroundColor: "black", color: "white" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <button
        className="toggle-button"
        onClick={() => setTabsVisible((prev) => !prev)}
        style={{
          margin: 16,
          padding: "10px 20px",
          borderRadius: 6,
          border: "none",
          backgroundColor: "#222",
          color: "white",
          cursor: "pointer",
        }}
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
            style={{ display: "flex", gap: 16, paddingLeft: 20, paddingBottom: 8 }}
          >
            {tabs.map((tab) => (
              <div key={tab.name} className="tooltip-wrapper">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={activeTab === tab.name ? "tab active" : "tab"}
                  onClick={() => setActiveTab(tab.name)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: activeTab === tab.name ? "#00acee" : "#bbb",
                    cursor: "pointer",
                  }}
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
            style={{ display: "flex", overflow: "hidden", height: "calc(100vh - 130px)" }}
          >
            {activeTab === "home" && (
              <>
                <div
                  className="scroll-container-vertical"
                  style={{
                    width: sidebarWidth,
                    overflowY: "auto",
                    height: "100%",
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
                        marginTop: 20,
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

            {activeTab === "profile" && (
              <div style={{ width: "100%", padding: 20 }}>
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
                      style={{
                        marginLeft: 8,
                        padding: 4,
                        borderRadius: 4,
                        border: "1px solid #ccc",
                      }}
                    />
                  </label>
                  <br />
                  <label>
                    Email:
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        marginLeft: 8,
                        padding: 4,
                        borderRadius: 4,
                        border: "1px solid #ccc",
                      }}
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

                      <label
                        className="upload-icon-button"
                        title="Upload Custom Pic"
                        style={{
                          cursor: "pointer",
                          padding: 12,
                          borderRadius: 8,
                          border: "1px solid white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "black",
                          color: "white",
                          fontSize: 24,
                          userSelect: "none",
                        }}
                      >
                        +
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={handleUpload}
                          style={{ display: "none" }}
                        />
                      </label>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {activeTab === "game" && (
              <div style={{ padding: 20 }}>
                <h2>Guessing Game</h2>
                <GuessingGame />
              </div>
            )}

            {activeTab === "music" && (
              <div style={{ padding: 20, width: "100%", color: "white" }}>
                <h2>Music Player</h2>
                <form onSubmit={handleMusicLinkSubmit} style={{ marginBottom: 12 }}>
                  <input
                    type="text"
                    placeholder="Enter YouTube or Spotify link"
                    value={musicUrl}
                    onChange={(e) => setMusicUrl(e.target.value)}
                    style={{
                      width: "70%",
                      padding: 8,
                      borderRadius: 6,
                      border: "1px solid #ccc",
                      marginRight: 8,
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      padding: "8px 16px",
                      borderRadius: 6,
                      border: "none",
                      backgroundColor: "#1DB954",
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    Play Link
                  </button>
                </form>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleMusicFileUpload}
                  style={{ marginBottom: 20 }}
                />
                {embedSrc && (
                  <iframe
                    src={embedSrc}
                    style={{ width: "100%", height: 200, borderRadius: 8 }}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    title="Music Embed"
                  />
                )}
                {audioSrc && (
                  <audio
                    ref={audioRef}
                    src={audioSrc}
                    controls
                    autoPlay
                    style={{ width: "100%", marginTop: 8 }}
                  />
                )}
                {(audioSrc || embedSrc) && (
                  <button
                    onClick={stopMusic}
                    style={{
                      marginTop: 12,
                      padding: "8px 16px",
                      borderRadius: 6,
                      border: "none",
                      backgroundColor: "#FF4C4C",
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    Stop Music
                  </button>
                )}
              </div>
            )}

            {activeTab === "settings" && (
              <div style={{ padding: 20, width: "100%" }}>
                <h2>Settings</h2>
                <label style={{ display: "block", marginBottom: 10 }}>
                  <input
                    type="checkbox"
                    checked={darkModeEnabled}
                    onChange={(e) => setDarkModeEnabled(e.target.checked)}
                  />{" "}
                  Enable Dark Mode
                </label>
                <p>Sidebar width: {sidebarWidth}px</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "black",
              zIndex: 999,
            }}
            onClick={() => setPreviewImage(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {previewImage && (
          <motion.div
            className="modal"
            ref={modalRef}
            onMouseDown={startModalDrag}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "fixed",
              top: `calc(50% + ${dragOffset.y}px)`,
              left: `calc(50% + ${dragOffset.x}px)`,
              transform: "translate(-50%, -50%)",
              backgroundColor: "#111",
              borderRadius: 12,
              padding: 16,
              zIndex: 1000,
              cursor: dragStart ? "grabbing" : "grab",
              maxWidth: "90vw",
              maxHeight: "80vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
            onDoubleClick={() => {
              setZoom(1);
              setRotation(0);
              setDragOffset({ x: 0, y: 0 });
            }}
          >
            <img
              src={previewImage}
              alt="Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "60vh",
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                borderRadius: 8,
                userSelect: "none",
                pointerEvents: "none",
              }}
              draggable={false}
            />
            <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
              <button
                onClick={() => setZoom((z) => Math.min(z + 0.25, 4))}
                style={{
                  backgroundColor: "black",
                  borderRadius: "50%",
                  width: 36,
                  height: 36,
                  border: "1px solid white",
                  color: "white",
                  cursor: "pointer",
                }}
                title="Zoom In"
              >
                +
              </button>
              <button
                onClick={() => setZoom((z) => Math.max(z - 0.25, 0.25))}
                style={{
                  backgroundColor: "black",
                  borderRadius: "50%",
                  width: 36,
                  height: 36,
                  border: "1px solid white",
                  color: "white",
                  cursor: "pointer",
                }}
                title="Zoom Out"
              >
                −
              </button>
              <button
                onClick={() => setRotation((r) => r - 15)}
                style={{
                  backgroundColor: "black",
                  borderRadius: "50%",
                  width: 36,
                  height: 36,
                  border: "1px solid white",
                  color: "white",
                  cursor: "pointer",
                }}
                title="Rotate Left"
              >
                ↺
              </button>
              <button
                onClick={() => setRotation((r) => r + 15)}
                style={{
                  backgroundColor: "black",
                  borderRadius: "50%",
                  width: 36,
                  height: 36,
                  border: "1px solid white",
                  color: "white",
                  cursor: "pointer",
                }}
                title="Rotate Right"
              >
                ↻
              </button>
              <button
                onClick={() => setPreviewImage(null)}
                style={{
                  backgroundColor: "black",
                  borderRadius: "50%",
                  width: 36,
                  height: 36,
                  border: "1px solid white",
                  color: "white",
                  cursor: "pointer",
                }}
                title="Close Preview"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

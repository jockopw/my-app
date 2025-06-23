import React, { useState, useEffect, useRef } from "react";
import { Home, User, Settings, Plus, Gamepad, Music } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "./styles.css";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [tabsVisible, setTabsVisible] = useState(true);
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
    "https://static.robloxden.com/xsmall_funnyweird_face_228f4cf5c7.png"
  ]);

  const isDraggingSidebar = useRef(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const imagePool = profilePics;

  // Music tab states
  const [musicUrl, setMusicUrl] = useState("");
  const [audioSrc, setAudioSrc] = useState<string | null>(null);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkModeEnabled);
  }, [darkModeEnabled]);

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

  // Helpers for music tab embed handling
  function isYouTubeLink(url: string) {
    return /youtu(?:\.be|be\.com)/.test(url);
  }
  function isSpotifyLink(url: string) {
    return /spotify\.com/.test(url);
  }
  function extractYouTubeID(url: string) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  }
  function convertSpotifyUrlToEmbed(url: string) {
    if (!url) return "";
    // convert normal spotify url to embed url
    // example: https://open.spotify.com/track/xyz => https://open.spotify.com/embed/track/xyz
    return url.replace("open.spotify.com/", "open.spotify.com/embed/");
  }

  const handlePlayLink = () => {
    if (!musicUrl) return;
    if (isYouTubeLink(musicUrl) || isSpotifyLink(musicUrl)) {
      setAudioSrc(null);
      // embedded player will show automatically
    } else {
      // treat as direct audio file link
      setAudioSrc(musicUrl);
    }
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setAudioSrc(url);
    setMusicUrl("");
  };

  const tabs = [
    { name: "home", icon: <Home size={24} />, label: "Home" },
    { name: "profile", icon: <User size={24} />, label: "Profile" },
    { name: "music", icon: <Music size={24} />, label: "Music" },
    { name: "game", icon: <Gamepad size={24} />, label: "Game" },
    { name: "settings", icon: <Settings size={24} />, label: "Settings" },
  ];

  return (
    <motion.div
      className="container"
      style={{ overflow: "hidden", height: "100vh", backgroundColor: "#000" }}
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
                  style={{
                    borderRadius: "50%",
                    backgroundColor:
                      activeTab === tab.name ? "#007BFF" : "#222",
                    color: "white",
                    border: "none",
                    width: 48,
                    height: 48,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
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
            style={{ display: "flex", overflow: "hidden", height: "100%" }}
          >
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
                              transition:
                                "border 0.3s ease, box-shadow 0.3s ease",
                            }}
                          />
                        ))}
                      </div>

                      <label
                        className="upload-icon-button"
                        title="Upload Custom Pic"
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

            {activeTab === "music" && (
              <motion.div
                key="music-tab"
                className="tab-content fade-in"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                style={{ width: "100%", padding: 10 }}
              >
                <h2>Music Player</h2>
                <p>
                  Paste a YouTube or Spotify link, or upload an audio file to
                  play.
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <input
                    type="text"
                    placeholder="Paste link here"
                    value={musicUrl}
                    onChange={(e) => setMusicUrl(e.target.value)}
                    style={{
                      flexGrow: 1,
                      padding: 8,
                      borderRadius: 6,
                      border: "1px solid #ccc",
                      fontSize: 14,
                    }}
                  />
                  <button
                    onClick={handlePlayLink}
                    style={{
                      borderRadius: "50%",
                      backgroundColor: activeTab === "music" ? "#007BFF" : "#555",
                      border: "none",
                      width: 40,
                      height: 40,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: "bold",
                      userSelect: "none",
                      boxShadow: "0 0 8px #007BFF",
                      transition: "background-color 0.3s ease",
                    }}
                    title="Play"
                    aria-label="Play Music"
                  >
                    ▶
                  </button>
                  <label
                    htmlFor="music-upload"
                    title="Upload Audio File"
                    style={{
                      borderRadius: "50%",
                      backgroundColor: "black",
                      border: "2px solid white",
                      width: 40,
                      height: 40,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: "white",
                      fontSize: 20,
                      userSelect: "none",
                      transition: "background-color 0.3s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#222")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "black")
                    }
                  >
                    +
                    <input
                      id="music-upload"
                      type="file"
                      accept="audio/*"
                      style={{ display: "none" }}
                      onChange={handleAudioUpload}
                    />
                  </label>
                </div>

                {audioSrc && (
                  <motion.audio
                    key="audio-player"
                    src={audioSrc}
                    controls
                    autoPlay
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ width: "100%", outline: "none", borderRadius: 8 }}
                  />
                )}

                {!audioSrc && musicUrl && (
                  <div
                    style={{ marginTop: 20, fontStyle: "italic", color: "#777" }}
                  >
                    Preview of embedded players will appear here.
                  </div>
                )}

                {/* For YouTube embed */}
                {musicUrl && isYouTubeLink(musicUrl) && (
                  <motion.div
                    key="youtube-embed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ marginTop: 20, borderRadius: 8, overflow: "hidden" }}
                  >
                    <iframe
                      width="100%"
                      height="315"
                      src={`https://www.youtube.com/embed/${extractYouTubeID(
                        musicUrl
                      )}`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ borderRadius: 8 }}
                    />
                  </motion.div>
                )}

                {/* For Spotify embed */}
                {musicUrl && isSpotifyLink(musicUrl) && (
                  <motion.div
                    key="spotify-embed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ marginTop: 20, borderRadius: 8, overflow: "hidden" }}
                  >
                    <iframe
                      src={convertSpotifyUrlToEmbed(musicUrl)}
                      width="100%"
                      height="80"
                      frameBorder="0"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      allowFullScreen
                      style={{ borderRadius: 8 }}
                      title="Spotify Player"
                    />
                  </motion.div>
                )}
              </motion.div>
            )}

            {activeTab === "game" && (
              <motion.div
                key="game-tab"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                style={{
                  width: "100%",
                  padding: 20,
                  color: "white",
                  backgroundColor: "#111",
                  borderRadius: 10,
                }}
              >
                <h2>Game Tab</h2>
                <p>This is the game tab content area.</p>
              </motion.div>
            )}

            {activeTab === "settings" && (
              <motion.div
                key="settings-tab"
                className="tab-content fade-in"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                style={{ width: "100%", padding: 20 }}
              >
                <h2>Settings</h2>
                <div style={{ marginBottom: 20 }}>
                  <label>
                    <input
                      type="checkbox"
                      checked={darkModeEnabled}
                      onChange={() => setDarkModeEnabled((prev) => !prev)}
                    />{" "}
                    Enable Dark Mode
                  </label>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label>
                    Sidebar Width:
                    <input
                      type="range"
                      min={100}
                      max={500}
                      value={sidebarWidth}
                      onChange={(e) => setSidebarWidth(Number(e.target.value))}
                      style={{ width: "100%", marginTop: 5 }}
                    />
                  </label>
                </div>

                <div>
                  <h3>Profile Picture Options</h3>
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                    {profilePics.map((pic) => (
                      <img
                        key={pic}
                        src={pic}
                        alt="Profile option"
                        style={{
                          width: 64,
                          height: 64,
                          borderRadius: "50%",
                          border:
                            selectedPfp === pic
                              ? "3px solid #007BFF"
                              : "2px solid #ccc",
                          cursor: "pointer",
                          transition: "border 0.3s ease",
                        }}
                        onClick={() => setSelectedPfp(pic)}
                      />
                    ))}
                    <label
                      htmlFor="settings-upload"
                      title="Upload Profile Pic"
                      style={{
                        borderRadius: "50%",
                        backgroundColor: "black",
                        border: "2px solid white",
                        width: 64,
                        height: 64,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        color: "white",
                        fontSize: 24,
                        userSelect: "none",
                        fontWeight: "bold",
                      }}
                    >
                      +
                      <input
                        id="settings-upload"
                        type="file"
                        accept="image/*,application/pdf"
                        style={{ display: "none" }}
                        onChange={handleUpload}
                      />
                    </label>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {previewImage && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setPreviewImage(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            cursor: "pointer",
          }}
        >
          <motion.img
            ref={modalRef}
            src={previewImage}
            alt="Preview"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.1}
            dragMomentum={false}
            style={{
              maxWidth: "90vw",
              maxHeight: "90vh",
              borderRadius: 12,
              cursor: dragStart ? "grabbing" : "grab",
              userSelect: "none",
              transformOrigin: "center",
              x: dragOffset.x,
              y: dragOffset.y,
              rotate: rotation + "deg",
              scale: zoom,
              boxShadow: "0 0 15px rgba(0,0,0,0.8)",
            }}
            onMouseDown={startModalDrag}
          />
          <div
            style={{
              position: "fixed",
              bottom: 40,
              display: "flex",
              gap: 12,
              backgroundColor: "rgba(0,0,0,0.5)",
              padding: 10,
              borderRadius: 12,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setZoom((z) => Math.min(z + 0.2, 3))}
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: "none",
                backgroundColor: "#222",
                color: "white",
                cursor: "pointer",
              }}
              title="Zoom In"
            >
              +
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(z - 0.2, 0.4))}
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: "none",
                backgroundColor: "#222",
                color: "white",
                cursor: "pointer",
              }}
              title="Zoom Out"
            >
              –
            </button>
            <button
              onClick={() => setRotation((r) => r - 15)}
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: "none",
                backgroundColor: "#222",
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
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: "none",
                backgroundColor: "#222",
                color: "white",
                cursor: "pointer",
              }}
              title="Rotate Right"
            >
              ↻
            </button>
            <button
              onClick={() => {
                setZoom(1);
                setRotation(0);
                setDragOffset({ x: 0, y: 0 });
              }}
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: "none",
                backgroundColor: "#222",
                color: "white",
                cursor: "pointer",
              }}
              title="Reset"
            >
              ↺↻
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

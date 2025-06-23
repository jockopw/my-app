import React, { useState, useEffect, useRef } from "react";
import { Home, User, Settings, Plus, Gamepad2 } from "lucide-react";
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

  const [targetNumber, setTargetNumber] = useState(() => Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState("");

  const isDraggingSidebar = useRef(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const imagePool = profilePics;

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

  const checkGuess = () => {
    const num = parseInt(guess);
    if (isNaN(num)) {
      setFeedback("Please enter a valid number.");
    } else if (num === targetNumber) {
      setFeedback("🎉 Correct! You guessed the number!");
      setTargetNumber(Math.floor(Math.random() * 100) + 1);
    } else if (num < targetNumber) {
      setFeedback("Too low! Try again.");
    } else {
      setFeedback("Too high! Try again.");
    }
  };

  const tabs = [
    { name: "home", icon: <Home size={24} />, label: "Home" },
    { name: "profile", icon: <User size={24} />, label: "Profile" },
    { name: "settings", icon: <Settings size={24} />, label: "Settings" },
    { name: "game", icon: <Gamepad2 size={24} />, label: "Game" },
  ];

  return (
    <motion.div className="container" style={{ overflow: "hidden", height: "100vh" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <button className="toggle-button" onClick={() => setTabsVisible((prev) => !prev)}>
        {tabsVisible ? "Hide General Settings" : "Show General Settings"}
      </button>

      <AnimatePresence>
        {tabsVisible && (
          <motion.div className="tabs" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
            {tabs.map((tab) => (
              <div key={tab.name} className="tooltip-wrapper">
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className={activeTab === tab.name ? "tab active" : "tab"} onClick={() => setActiveTab(tab.name)}>
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
          <motion.div key={activeTab} className="tab-content fade-in" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4, ease: "easeOut" }} style={{ display: "flex", overflow: "hidden", height: "100%" }}>
            {activeTab === "home" && (
              <>
                <div className="scroll-container-vertical" style={{ width: sidebarWidth, overflowY: "auto", height: "calc(100vh - 160px)", borderRight: "1px solid #444", paddingRight: 10, position: "relative", flexShrink: 0 }}>
                  {images.length === 0 && <p style={{ color: "#777", fontSize: 14, textAlign: "center" }}>No images yet</p>}
                  {images.map((src, i) => (
                    <img key={i} src={src} alt={`Image ${i}`} className="scroll-image-vertical" onClick={() => {
                      setPreviewImage(src);
                      setZoom(1);
                      setRotation(0);
                      setDragOffset({ x: 0, y: 0 });
                    }} style={{ width: "100%", height: 120, objectFit: "cover", cursor: "pointer", marginBottom: 12, borderRadius: 8 }} />
                  ))}
                  <div onMouseDown={startSidebarDrag} style={{ width: 6, cursor: "ew-resize", position: "absolute", right: 0, top: 0, bottom: 0, backgroundColor: "#6666" }} />
                </div>

                <div style={{ flex: 1, paddingLeft: 20 }}>
                  <h2>Welcome Home!</h2>
                  <p>This is your dashboard where you can start your day.</p>
                  <button onClick={addImage} style={{ padding: "8px 16px", borderRadius: "6px", border: "none", backgroundColor: "#4CAF50", color: "white", cursor: "pointer" }}>
                    Get Image
                  </button>
                </div>
              </>
            )}

            {activeTab === "game" && (
              <motion.div
                key="game"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                style={{ padding: 20, width: "100%" }}
              >
                <h2>🎮 Number Guessing Game</h2>
                <p>Guess a number between 1 and 100:</p>
                <input
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  type="number"
                  style={{ padding: 8, borderRadius: 4, marginRight: 10 }}
                />
                <button
                  onClick={checkGuess}
                  style={{
                    padding: 8,
                    borderRadius: 6,
                    backgroundColor: "#28a745",
                    color: "#fff",
                    border: "none",
                  }}
                >
                  Submit
                </button>
                <p style={{ marginTop: 16 }}>{feedback}</p>
              </motion.div>
            )}

            {/* Profile and Settings tabs remain unchanged */}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {previewImage && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.3)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999 }} onClick={() => setPreviewImage(null)}>
            <div ref={modalRef} style={{ position: "absolute", top: `calc(50% + ${dragOffset.y}px)`, left: `calc(50% + ${dragOffset.x}px)`, transform: "translate(-50%, -50%)", zIndex: 10000, cursor: dragStart ? "grabbing" : "grab" }} onMouseDown={startModalDrag} onClick={(e) => e.stopPropagation()}>
              <motion.img src={previewImage} alt="Preview" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ duration: 0.3 }} style={{ maxWidth: "80vw", maxHeight: "80vh", transform: `scale(${zoom}) rotate(${rotation}deg)`, borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.6)", userSelect: "none", pointerEvents: "none" }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// App.tsx
import React, { useState, useEffect, useRef } from "react";
import { Home, User, Settings, Plus } from "lucide-react";
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
  const [uploadedPfps, setUploadedPfps] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isDraggingSidebar = useRef(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const tabs = [
    { name: "home", icon: <Home size={24} />, label: "Home" },
    { name: "profile", icon: <User size={24} />, label: "Profile" },
    { name: "settings", icon: <Settings size={24} />, label: "Settings" },
  ];

  const imagePool = [
    "https://static.robloxden.com/xsmall_silly_cat_346a0b5b02.png",
    "https://static.robloxden.com/xsmall_black_man_laughing_at_dark_daaedd189d.png",
    "https://static.robloxden.com/xsmall_funny_dog_face_7fd50d454f.png",
    "https://static.robloxden.com/xsmall_funnyweird_face_228f4cf5c7.png"
  ];

  const profilePics = [...imagePool, ...uploadedPfps];

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkModeEnabled);
  }, [darkModeEnabled]);

  const addImage = () => {
    const randomImage = imagePool[Math.floor(Math.random() * imagePool.length)];
    setImages((imgs) => [...imgs, randomImage]);
  };

  const startSidebarDrag = () => (isDraggingSidebar.current = true);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingSidebar.current) return;
      const newWidth = e.clientX;
      if (newWidth >= 100 && newWidth <= 500) setSidebarWidth(newWidth);
    };
    const stopDragging = () => (isDraggingSidebar.current = false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", stopDragging);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopDragging);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const supportedTypes = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/bmp", "image/svg+xml", "application/pdf"];
    if (!supportedTypes.includes(file.type)) {
      alert("Only raster image formats and PDFs are supported.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setUploadedPfps((prev) => [...prev, reader.result as string]);
      }
    };

    if (file.type === "application/pdf") {
      // Show a generic PDF icon for PDFs
      setUploadedPfps((prev) => [...prev, "https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg"]);
    } else {
      reader.readAsDataURL(file);
    }

    e.target.value = "";
  };

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

            {activeTab === "profile" && (
              <div style={{ width: "100%" }}>
                <form onSubmit={(e) => { e.preventDefault(); alert("Select Your Profile Pic"); setShowPfpSelector(true); }}>
                  <h2>Your Profile</h2>
                  <label>Name:
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={{ marginLeft: 8, padding: 4, borderRadius: 4 }} />
                  </label>
                  <br />
                  <label>Email:
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ marginLeft: 8, padding: 4, borderRadius: 4 }} />
                  </label>
                  <br />
                  <button type="submit" style={{ marginTop: 12, padding: "8px 16px", borderRadius: "6px", border: "none", backgroundColor: "#007BFF", color: "white", cursor: "pointer" }}>
                    Save Profile
                  </button>
                </form>

                <AnimatePresence>
                  {showPfpSelector && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.4, ease: "easeOut" }} style={{ marginTop: 20 }}>
                      <h3>Select your profile picture:</h3>
                      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        {profilePics.map((src) => (
                          <img key={src} src={src} alt="Profile Pic" onClick={() => setSelectedPfp(src)} style={{
                            width: 80,
                            height: 80,
                            objectFit: "cover",
                            borderRadius: "50%",
                            cursor: "pointer",
                            border: selectedPfp === src ? "3px solid #007BFF" : "2px solid #ccc",
                            boxShadow: selectedPfp === src ? "0 0 8px #007BFF" : "none",
                            transition: "border 0.3s ease, box-shadow 0.3s ease",
                          }} />
                        ))}

                        <div className="tooltip-wrapper">
                          <button
                            type="button"
                            className="upload-icon-btn"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Plus size={20} />
                          </button>
                          <span className="tooltip-text">Upload Custom Pic</span>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".png,.jpg,.jpeg,.webp,.bmp,.gif,.svg,.pdf"
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {activeTab === "settings" && (
              <div style={{ width: "100%" }}>
                <h2>Settings</h2>
                <label style={{ display: "block", marginBottom: 20 }}>
                  <span style={{ marginRight: 12, verticalAlign: "middle" }}>White Mode & Dark Mode</span>
                  <div className="toggle-switch" onClick={() => setDarkModeEnabled((d) => !d)} role="switch" aria-checked={darkModeEnabled} tabIndex={0} onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setDarkModeEnabled((d) => !d);
                    }
                  }}>
                    <div className={`toggle-thumb ${darkModeEnabled ? "active" : ""}`} />
                  </div>
                </label>
              </div>
            )}
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

import React, { useState, useEffect, useRef } from "react";
import { Home, User, Settings, X, ZoomIn, ZoomOut, RefreshCw, RotateCw } from "lucide-react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
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

  const controls = useAnimation();

  const isDraggingSidebar = useRef(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const tabs = [
    { name: "home", icon: <Home size={24} />, label: "Home" },
    { name: "profile", icon: <User size={24} />, label: "Profile" },
    { name: "settings", icon: <Settings size={24} />, label: "Settings" },
  ];

  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john@example.com");
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  useEffect(() => {
    if (darkModeEnabled) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkModeEnabled]);

  const addImage = () => {
    setImages((imgs) => [...imgs, "https://static.robloxden.com/xsmall_silly_cat_346a0b5b02.png"]);
  };

  // Sidebar resize logic
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

  const startSidebarDrag = () => (isDraggingSidebar.current = true);

  // Modal drag logic
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

  const stopModalDrag = () => {
    setDragStart(null);
  };

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

  // Animate zoom, rotate, and dragOffset changes smoothly
  useEffect(() => {
    controls.start({
      scale: zoom,
      rotate: rotation,
      x: dragOffset.x,
      y: dragOffset.y,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    });
  }, [zoom, rotation, dragOffset, controls]);

  return (
    <motion.div
      className="container"
      style={{ overflow: "hidden", height: "100vh" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <button
        className="toggle-button"
        onClick={() => setTabsVisible((prev) => !prev)}
        style={{ marginBottom: 10 }}
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
                    <p style={{ color: "#777", fontSize: 14, textAlign: "center" }}>
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
                    style={{
                      padding: "8px 16px",
                      borderRadius: "6px",
                      border: "none",
                      backgroundColor: "#4CAF50",
                      color: "white",
                      cursor: "pointer",
                    }}
                    onClick={addImage}
                  >
                    Get Image
                  </button>
                </div>
              </>
            )}

            {activeTab === "profile" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert(`Profile saved for ${name} (${email})`);
                }}
                style={{ width: "100%" }}
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
            )}

            {activeTab === "settings" && (
              <div style={{ width: "100%" }}>
                <h2>Settings</h2>
                <label style={{ display: "block", marginBottom: 20 }}>
                  <span style={{ marginRight: 12, verticalAlign: "middle" }}>
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
                  >
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
              <div
                style={{
                  position: "absolute",
                  top: -40,
                  right: -40,
                  display: "flex",
                  gap: 10,
                }}
              >
                <button
                  onClick={() => setZoom((z) => Math.min(z + 0.2, 5))}
                  className="circle-button"
                  aria-label="Zoom In"
                >
                  <ZoomIn />
                </button>
                <button
                  onClick={() => setZoom((z) => Math.max(z - 0.2, 0.1))}
                  className="circle-button"
                  aria-label="Zoom Out"
                >
                  <ZoomOut />
                </button>
                <button
                  onClick={() => setRotation((r) => r + 90)}
                  className="circle-button"
                  aria-label="Rotate"
                >
                  <RotateCw />
                </button>
                <button
                  onClick={() => {
                    setZoom(1);
                    setRotation(0);
                    setDragOffset({ x: 0, y: 0 });
                  }}
                  className="circle-button"
                  aria-label="Reset"
                >
                  <RefreshCw />
                </button>
                <button
                  onClick={() => setPreviewImage(null)}
                  className="circle-button"
                  aria-label="Close"
                >
                  <X />
                </button>
              </div>

              <motion.img
                src={previewImage}
                alt="Preview"
                drag
                dragMomentum={false}
                dragElastic={0.2}
                dragConstraints={{ top: -300, bottom: 300, left: -300, right: 300 }}
                onDoubleClick={() => {
                  setZoom(1);
                  setRotation(0);
                  setDragOffset({ x: 0, y: 0 });
                }}
                animate={controls}
                initial={{ scale: 0.8, opacity: 0 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  maxWidth: "80vw",
                  maxHeight: "80vh",
                  borderRadius: 12,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
                  userSelect: "none",
                  cursor: dragStart ? "grabbing" : "grab",
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

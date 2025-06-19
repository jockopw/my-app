// src/App.tsx

import React, { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="container">
      <h1>Hello from React + Tauri!</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
    </div>
  );
}


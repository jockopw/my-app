import React from "react";

export default function App() {
  return (
    <div>
      <button onClick={() => alert("Button 1 clicked!")}>Button 1</button>
      <button onClick={() => alert("Button 2 clicked!")}>Button 2</button>
      <button onClick={() => alert("Button 3 clicked!")}>Button 3</button>
    </div>
  );
}

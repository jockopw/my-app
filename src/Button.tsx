import React from "react";

type ButtonProps = {
  onClick: () => void;
  label: string;
};

export default function Button({ onClick, label }: ButtonProps) {
  return (
    <button
      style={{
        padding: "10px 20px",
        fontSize: "16px",
        cursor: "pointer",
        borderRadius: "5px",
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
      }}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

import React from "react";

export default function DifficultySelect({ onSelect }) {
  return (
    <div className="difficulty-select">
      <h2>Select Difficulty</h2>
      <div className="difficulty-buttons">
        {["Basic", "Intermediate", "Advanced"].map((level) => (
          <button key={level} onClick={() => onSelect(level)} className="btn primary">
            {level}
          </button>
        ))}
      </div>
    </div>
  );
}
import React from "react";
import { motion } from "framer-motion";
import "../styles/Game.css";

export default function LevelMap({ unlockedLevel, onLevelClick }) {
  const levels = [1, 2, 3, 4, 5];

  return (
    <div className="level-map">
      <h2>🚀 IT Quiz Journey</h2>

      <div className="path-container">
        {levels.map((lvl, index) => {
          // const isUnlocked = lvl <= unlockedLevel;
          // const user = JSON.parse(localStorage.getItem("user"));
          // const isUnlocked = lvl <= user?.progress?.level;
          const isUnlocked = lvl <= unlockedLevel;
          return (
            <motion.div
              key={lvl}
              className={`level-node ${isUnlocked ? "unlocked" : "locked"
                }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => isUnlocked && onLevelClick(lvl)}
            >
              ⭐ {lvl}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
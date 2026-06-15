// import React, { useEffect } from "react";

// export default function WinScreen() {
//  useEffect(() => {
//   const winSound = new Audio(process.env.PUBLIC_URL + "/sounds/win.mp3");
//   winSound.volume = 0.8;

//   winSound.play().catch((err) => {
//     console.log("Sound blocked:", err);
//   });
// }, []);

//   return (
//     <div className="win-screen">

//       {/* 🎉 BIG WIN TEXT */}
//       <div className="win-title">🏆 YOU WIN! 🏆</div>

//       {/* 🎮 ANIMATED CHARACTER / GIF */}
//       <img
//         className="win-gif"
//         src="https://media.giphy.com/media/111ebonMs90YLu/giphy.gif"
//         alt="win"
//       />

//       {/* ✨ SUB TEXT */}
//       <p className="win-sub">
//         Level Completed Successfully 🚀
//       </p>

//     </div>
//   );
// }

import React, { useEffect } from "react";
import { motion } from "framer-motion";

export default function WinScreen({ onFinish }) {
  useEffect(() => {
    const winSound = new Audio(process.env.PUBLIC_URL + "/sounds/win.mp3");
    winSound.volume = 0.8;
    winSound.play().catch(() => {});

    const timer = setTimeout(() => {
      onFinish && onFinish();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="win-screen">

      {/* 🎊 CONFETTI */}
      <div className="confetti-container">
        {Array.from({ length: 80 }).map((_, i) => (
          <span
            key={i}
            className="confetti-piece"
            style={{
              left: Math.random() * 100 + "vw",
              animationDuration: 2 + Math.random() * 3 + "s",
              animationDelay: Math.random() * 2 + "s",
            }}
          />
        ))}
      </div>

      {/* 🏆 WIN CARD */}
      <motion.div
        className="win-card"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1
          className="win-title"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          🏆 YOU WIN 🏆
        </motion.h1>

        <p className="win-sub">
          Level Completed Successfully 🚀
        </p>

        <div className="win-bar">
          <div className="win-fill"></div>
        </div>

        <p className="win-next">Loading Next Level...</p>
      </motion.div>

    </div>
  );
}
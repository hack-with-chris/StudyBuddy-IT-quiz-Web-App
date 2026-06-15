import React from "react";
import { useNavigate } from "react-router-dom";

export default function Hero({ user }) {
  const navigate = useNavigate();

  const handleClick = (path) => {
    if (!user) {
      navigate("/login"); // 🔒 not logged in
    } else {
      navigate(path); // ✅ logged in
    }
  };

  return (
    <section className="hero">
      {/* Left Side */}
      <div className="hero-text">
        <h1 className="animated-text">
          Welcome to StudyBuddy
        </h1>
        <p>
          Boost your IT skills with interactive games. Compete, learn, and track your scores!
        </p>

        <div className="buttons">
          <button
            className="btn primary"
            onClick={() => handleClick("/game")}
          >
            Play Game
          </button>

          <button
            className="btn secondary"
            onClick={() => handleClick("/scores")}
          >
            View Scores
          </button>
        </div>
      </div>

      {/* Right Side */}
      <div className="hero-image">
        <img
          src="https://cdn-icons-png.flaticon.com/512/4196/4196096.png"
          alt="StudyBuddy Hero"
        />
      </div>
    </section>
  );

  <html>
    <body>
      <script src="https://cdn.botpress.cloud/webchat/v3.6/inject.js"></script>
      <script src="https://files.bpcontent.cloud/2026/06/09/16/20260609165157-RD53SWYT.js" defer></script>
    </body>
  </html>
}
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Hero({ user }) {
  const navigate = useNavigate();

  const handleClick = (path) => {
    if (!user) {
      navigate("/login"); // 🔒 redirect if not logged in
    } else {
      navigate(path); // ✅ go to quiz/game
    }
  };

  return (
    <section className="hero">
      <div className="hero-text">
        <h1>Boost Your Knowledge 🚀</h1>
        <p>Practice quizzes, explore topics, and improve your skills.</p>

        <div className="buttons">
          <button
            className="btn primary"
            onClick={() => handleClick("/quiz")}
          >
            Generate Quiz
          </button>

          <button
            className="btn secondary"
            onClick={() => handleClick("/game")}
          >
            Play Quiz
          </button>
        </div>
      </div>

      <div className="hero-image">
        <img
          src="https://cdn-icons-png.flaticon.com/512/1055/1055687.png"
          alt="hero"
        />
      </div>
    </section>
  );
}
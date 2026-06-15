import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";



export default function Login({ setUser }) {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });

  // ✅ ONLY ONCE useEffect
  useEffect(() => {
    const msg = localStorage.getItem("resetMessage");
    if (msg) {
      alert(msg);
      localStorage.removeItem("resetMessage");
    }
  }, []);
  const confettiRef = useRef(null);
  const [showGamePopup, setShowGamePopup] = useState(false);

  // Validation rules
  const usernameRegex = /^(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*()_\-+=<>?]{3,20}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

  const validate = () => {
    let newErrors = {
      username: usernameRegex.test(username)
        ? ""
        : "Username must have 1 capital & valid format",
      password: passwordRegex.test(password)
        ? ""
        : "Password must contain upper, lower & number",
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((e) => e === "");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors((prev) => ({
          ...prev,
          password: data.message || "Login failed",
        }));
        return;
      }

      // localStorage.setItem("user", JSON.stringify(data.user));
      // fetch full profile after login
      const profileRes = await fetch(
        `http://localhost:5000/api/auth/profile/${data.user._id}`
      );

      const fullUser = await profileRes.json();

      localStorage.setItem("user", JSON.stringify(fullUser));
      setUser(fullUser);
      
      setUser(data.user);

      setShowGamePopup(true);
      launchConfetti();

      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (error) {
      console.log(error);
      alert("Something went wrong ❌");
    }
  };


  // Confetti (same as yours)
  const launchConfetti = () => {
    const canvas = confettiRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const confetti = [];
    const colors = ["#38bdf8", "#f472b6", "#34d399", "#facc15", "#fb7185"];
    const W = canvas.width = window.innerWidth;
    const H = canvas.height = window.innerHeight;

    for (let i = 0; i < 150; i++) {
      confetti.push({
        x: Math.random() * W,
        y: Math.random() * H - H,
        r: Math.random() * 6 + 4,
        d: Math.random() * 150,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.random() * 10 - 10,
        tiltAngleIncrement: Math.random() * 0.07 + 0.05,
        tiltAngle: 0,
      });
    }

    let angle = 0;
    function draw() {
      ctx.clearRect(0, 0, W, H);
      confetti.forEach((c) => {
        ctx.beginPath();
        ctx.lineWidth = c.r / 2;
        ctx.strokeStyle = c.color;
        ctx.moveTo(c.x + c.tilt + c.r / 4, c.y);
        ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.r / 4);
        ctx.stroke();
      });
      update();
    }

    function update() {
      angle += 0.01;
      confetti.forEach((c) => {
        c.tiltAngle += c.tiltAngleIncrement;
        c.y += (Math.cos(angle + c.d) + 1 + c.r / 2) / 2;
        c.x += Math.sin(angle);
        c.tilt = Math.sin(c.tiltAngle) * 15;
        if (c.y > H) {
          c.x = Math.random() * W;
          c.y = -10;
        }
      });
    }

    const interval = setInterval(draw, 20);
    setTimeout(() => clearInterval(interval), 1500);
  };

  return (
    <div className="login-page">
      <canvas ref={confettiRef} className="confetti-canvas"></canvas>

      <div className="login-card">
        <h2 className="login-title">
          <span className="animated-text">Login</span>
        </h2>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {errors.username && <div className="error">{errors.username}</div>}

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {errors.password && <div className="error">{errors.password}</div>}

          <button type="submit" className="btn primary login-btn">
            Start Game 🚀
          </button>
        </form>

        <div className="login-links">
          <span onClick={() => navigate("/register")}>Register</span>
          <span onClick={() => navigate("/forgot")}>Forgot Password?</span>
        </div>
      </div>

      {/* 🎮 Game Popup */}
      {showGamePopup && (
        <div className="game-popup">
          <h1>🚀 You’re In the Game!</h1>
          <p>Brains ready? The quiz world is now yours 🎯</p>
          <div className="coins-animation"><br />
            <span>⭐</span>
            <span>🎯</span>
            <span>🔥</span>
            <span>🏆</span>
          </div>
        </div>
      )}
    </div>
  );
}
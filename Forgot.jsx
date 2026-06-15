import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Forgot() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);

  const [isUserVerified, setIsUserVerified] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const [timer, setTimer] = useState(30);
  const [message, setMessage] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ⏳ TIMER
  useEffect(() => {
    if (isUserVerified && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer, isUserVerified]);

  // 🔐 PASSWORD VALIDATION
  const validatePassword = (pass) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(pass);
  };

  // 📩 SEND OTP
  const handleCheckUser = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message);
        return;
      }

      setEmail(data.email);
      setIsUserVerified(true);
      setTimer(30);
      setMessage("OTP sent 📩 Check your email");

    } catch (error) {
      setMessage("Server not responding ❌");
    }
  };

  // 🔁 RESEND OTP
  const handleResendOtp = async () => {
    if (timer > 0) return;

    try {
      const res = await fetch("http://localhost:5000/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message);
        return;
      }

      setTimer(30);
      setMessage("OTP resent 📩");

    } catch {
      setMessage("Error resending OTP ❌");
    }
  };

  // 🔢 OTP INPUT CHANGE
  const handleOtpChange = (value, index) => {
    const val = value.replace(/[^0-9]/g, "");
    if (!val) return;

    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // auto next focus
    if (index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  // 🔍 VERIFY OTP
  const handleVerifyOtp = async () => {
    const finalOtp = otp.join("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp: finalOtp }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message);
        return;
      }

      setIsOtpVerified(true);
      setMessage("OTP verified ✅");

    } catch {
      setMessage("Verification failed ❌");
    }
  };

  // 🔐 RESET PASSWORD
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match ❌");
      return;
    }

    if (!validatePassword(newPassword)) {
      setMessage(
        "Password must have uppercase, lowercase, number, special char & min 8 chars ❌"
      );
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await res.json();

      localStorage.setItem("resetMessage", data.message);
      navigate("/login");

    } catch {
      setMessage("Error updating password ❌");
    }
  };

  const isOtpComplete = otp.every((d) => d !== "");

  return (
  <div className="login-page">

    {/* Background */}
    <div className="bg-animation">
      <i className="fas fa-book"></i>
      <i className="fas fa-brain"></i>
      <i className="fas fa-code"></i>
      <i className="fas fa-calculator"></i>
      <i className="fas fa-pen"></i>
      <i className="fas fa-graduation-cap"></i>
      <i className="fas fa-laptop"></i>
      <i className="fas fa-chart-line"></i>
    </div>

    {/* Floating icons */}
    <div className="floating-it-icons">
      <i className="fas fa-laptop-code it-icon"></i>
      <i className="fas fa-server it-icon"></i>
      <i className="fas fa-database it-icon"></i>
      <i className="fas fa-code it-icon"></i>
      <i className="fas fa-brain it-icon"></i>
    </div>

    {/* Hero image */}
    <div className="hero-bg">
      <img
        src="https://cdn-icons-png.flaticon.com/512/3064/3064197.png"
        alt="forgot"
      />
    </div>

    {/* MAIN CARD */}
    <div className="login-card forgot-card">

      <h2 className="login-title">
        <span className="animated-text">Reset Password</span>
      </h2>

      {message && <p style={{ color: "red" }}>{message}</p>}

      {/* STEP 1 */}
      {!isUserVerified && (
        <form onSubmit={handleCheckUser}>
          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <button className="btn primary">Send OTP</button>
        </form>
      )}

      {/* STEP 2 OTP */}
      {isUserVerified && !isOtpVerified && (
        <div>

          <div className="otp-container">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputsRef.current[i] = el)}
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, i)}
                className="otp-input"
              />
            ))}
          </div>

          <button className="btn primary" onClick={handleVerifyOtp}>
            Verify OTP
          </button><br /><br />

          <p>
            Resend OTP in {timer}s
            {timer === 0 && (
              <span onClick={handleResendOtp} style={{ cursor: "pointer", color: "blue" }}>
                {" "}Resend
              </span>
            )}
          </p>

        </div>
      )}

      {/* STEP 3 */}
      {isOtpVerified && (
        <form onSubmit={handleResetPassword}>
          <input
            type="password"
            placeholder="New Password"
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button className="btn primary">Update Password</button>
        </form>
      )}

      {/* Back */}
      <div className="login-links">
        <span onClick={() => navigate("/login")}>Back to Login</span>
      </div>

    </div>
  </div>
);
}
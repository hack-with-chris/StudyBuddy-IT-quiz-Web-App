import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Registration.css";
import profileImage from "../assets/profile.jpg";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // For eye icon

export default function Registration({ setUser }) {
    const navigate = useNavigate();
    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [profilePic, setProfilePic] = useState(null);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [errors, setErrors] = useState({
        fullName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const confettiRef = useRef(null);
    const [showGamePopup, setShowGamePopup] = useState(false);

    // Regex validators
    const fullNameRegex = /^.{3,50}$/;
    const usernameRegex = /^(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*()_\-+=<>?]{3,20}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

    const validateField = (field, value) => {
        switch (field) {
            case "fullName":
                setErrors((prev) => ({
                    ...prev,
                    fullName: fullNameRegex.test(value)
                        ? ""
                        : "Full Name must be 3-50 characters",
                }));
                break;
            case "username":
                setErrors((prev) => ({
                    ...prev,
                    username: usernameRegex.test(value)
                        ? ""
                        : "Username must have at least 1 capital letter and can include lowercase, numbers & special characters (3-20 chars)",
                }));
                break;
            case "email":
                setErrors((prev) => ({
                    ...prev,
                    email: emailRegex.test(value)
                        ? ""
                        : "Enter a valid email address",
                }));
                break;
            case "password":
                setErrors((prev) => ({
                    ...prev,
                    password: passwordRegex.test(value)
                        ? ""
                        : "Password must have uppercase, lowercase, number, special char, min 8 chars",
                }));
                break;
            case "confirmPassword":
                setErrors((prev) => ({
                    ...prev,
                    confirmPassword:
                        value === password ? "" : "Passwords do not match",
                }));
                break;
            default:
                break;
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        let newErrors = {
            fullName: fullNameRegex.test(fullName)
                ? ""
                : "Full Name must be 3-50 characters",

            username: usernameRegex.test(username)
                ? ""
                : "Username must have at least 1 capital letter and can include lowercase, numbers & special characters (3-20 chars)",

            email: emailRegex.test(email)
                ? ""
                : "Enter a valid email address",

            password: passwordRegex.test(password)
                ? ""
                : "Password must have uppercase, lowercase, number, special char, min 8 chars",

            confirmPassword:
                confirmPassword === password ? "" : "Passwords do not match",
        };

        setErrors(newErrors);

        // STOP if any error
        if (
            !fullName ||
            !username ||
            !email ||
            !password ||
            !confirmPassword ||
            Object.values(newErrors).some((err) => err !== "")
        ) {
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fullName,
                    username,
                    email,
                    password,
                    profilePic,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setErrors((prev) => ({
                    ...prev,
                    email: data.message.includes("exists")
                        ? "Email already registered"
                        : prev.email,
                }));
                return;
            }

            launchConfetti();
            setShowGamePopup(true);

            setTimeout(() => {
                setShowGamePopup(false);
                navigate("/login");
            }, 5000);

        } catch (error) {
            console.error(error);
        }
    };
    const handleProfilePic = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onloadend = () => {
            setProfilePic(reader.result);
        };

        reader.readAsDataURL(file);
    };

    const triggerFileInput = () => {
        document.getElementById("hidden-file-input").click();
    };

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
                    c.tilt = Math.random() * 10 - 10;
                }
            });
        }

        const interval = setInterval(draw, 20);
        setTimeout(() => clearInterval(interval), 1500);
    };

    return (
        <div className="registration-page">
            <canvas ref={confettiRef} className="confetti-canvas"></canvas>

            <div className="registration-container">
                <div className="left-card">
                    <h2 className="animated-text">Choose Your Avatar!</h2>
                    {/* <p>Click on the image to upload your profile picture</p> */}
                    <div className="hero-image profile-clickable" onClick={triggerFileInput}>
                        <img className="hero-image" src={profilePic || profileImage} alt="Profile" />
                    </div>
                    <input
                        type="file"
                        id="hidden-file-input"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleProfilePic}
                    />
                </div>

                <div className="right-card">
                    <h2>Register 🎯</h2>
                    <form onSubmit={handleRegister}>

                        <input
                            type="text"
                            placeholder="Full Name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            onBlur={() => validateField("fullName", fullName)}
                            required
                        />
                        {errors.fullName && <div className="error">{errors.fullName}</div>}

                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onBlur={() => validateField("username", username)}
                            required
                        />
                        {errors.username && <div className="error">{errors.username}</div>}

                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={() => validateField("email", email)}
                            required
                        />
                        {errors.email && <div className="error">{errors.email}</div>}

                        <div className="password-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onBlur={() => validateField("password", password)}
                                required
                            />
                            <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                        {errors.password && <div className="error">{errors.password}</div>}

                        <div className="password-wrapper">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                onBlur={() => validateField("confirmPassword", confirmPassword)}
                                required
                            />
                            <span className="eye-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                        {errors.confirmPassword && <div className="error">{errors.confirmPassword}</div>}

                        <button type="submit" className="btn primary login-btn">Register</button>
                    </form>
                    <div className="login-links">
                        <span onClick={() => navigate("/login")}>Already have an account?</span>
                    </div>
                </div>
            </div>

            {showGamePopup && (
                <div className="game-popup">
                    <h1>🎮 New Player Created!</h1>
                    <p>Your quiz journey begins now... let the challenge start 🚀</p>
                    <div className="coins-animation"><br />
                        <span>💰</span>
                        <span>💎</span>
                        <span>⭐</span>
                        <span>🎯</span>
                    </div>
                </div>
            )}
        </div>
    );
}
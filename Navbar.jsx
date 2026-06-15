import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import studubuddyLogo from "../assets/studybuddylogo_1.png";

export default function Navbar({ user, setUser }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", to: "/", icon: "fa fa-home" },
    { name: "Game", to: "/game", icon: "fa fa-gamepad" },
     { name: "Scores", to: "/scores", icon: "fa fa-trophy" },
    { name: "Profile", to: "/profile", icon: "fa fa-user" },
  ];

  const handleLogout = () => {
  localStorage.removeItem("user"); // 🔥 important
  setUser(null);
  navigate("/");
};

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="logo" onClick={() => navigate("/")}>
        <img src={studubuddyLogo} alt="StudyBuddy Logo" />
      </div>

      {/* Menu */}
      <ul className={menuOpen ? "show" : ""}>
        {navItems.map((item, idx) => (
          <li key={idx}>
            <NavLink
              to={item.to}
              onClick={(e) => {
                if (!user && item.to !== "/") {
                  e.preventDefault();
                  navigate("/login");
                }
              }}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <i className={item.icon}></i>
              <span>{item.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Right Side */}
      <div className="nav-right">
        {user && user.username ? (
          <>
            <button className="login-btn" onClick={handleLogout}>
              Logout
            </button>
            <span className="gradient-username">
              {user.username}
            </span>
          </>
        ) : (
          <button
            className="login-btn"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        )}
      </div>

      {/* Mobile */}
      <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>
    </nav>
  );
}
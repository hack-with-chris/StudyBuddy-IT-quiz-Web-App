import React, { useState, useEffect } from "react"; // ✅ useEffect add
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Game from "./pages/Game";
import Profile from "./pages/Profile";
import Scores from "./pages/Scores";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Forgot from "./pages/Forgot";
import BotpressChat from "./BotpressChat";

import "./style.css";

export default function App() {
  const [user, setUser] = useState(null);

  // 🔥 ADD HERE
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  return (
    <Router>
      <div>
        {/* Background floating icons */}
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

        {/* Navbar with user props */}
        <Navbar user={user} setUser={setUser} />

        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/game" element={<Game />} />
          
          {/* ✅ user props pass karo */}
          <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
          
          <Route path="/scores" element={<Scores />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Registration setUser={setUser} />} />
          <Route path="/forgot" element={<Forgot />} />
        </Routes>

          <BotpressChat />

        <Footer />
      </div>
    </Router>
  );
}
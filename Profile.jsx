import { useNavigate } from "react-router-dom";
import "./Profile.css";
import defaultProfile from "../assets/profile.jpg";
import React, { useState, useRef, useEffect } from "react";

export default function Profile({ user, setUser }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 🔥 FETCH PROFILE (CORRECT API)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/auth/profile/${user._id}`
        );
        const data = await res.json();

        setFullName(data.fullName || "");
        setEmail(data.email || "");
        setProfilePic(data.profilePic || null);
      } catch (err) {
        console.log(err);
      }
    };

    if (user?._id) {
      fetchProfile();
    }
  }, [user]);

  // 🔥 UPDATE PROFILE
  const handleUpdate = async () => {
    if (newPassword || confirmPassword) {
      if (newPassword !== confirmPassword) {
        alert("Passwords do not match ❌");
        return;
      }
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/auth/profile/${user._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName,
            email,
            profilePic,
            password: newPassword || undefined, // ✅ FIX
          }),
        }
      );

      // const updatedUser = await res.json();

      // setUser(updatedUser);
      // setIsEditing(false);

      // alert("Profile updated ✅");
      const updatedUser = await res.json();

      setUser(updatedUser);

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      setIsEditing(false);

      alert("Profile updated ✅");
    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("user"); // ✅ important
    setUser(null);
    navigate("/login");
  };

  // 🔥 IMAGE CLICK
  const handleImageClick = () => {
    if (isEditing) {
      fileInputRef.current.click();
    }
  };

  // 🔥 IMAGE CHANGE
  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setProfilePic(URL.createObjectURL(file));
  //   }
  // };
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setProfilePic(reader.result);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="profile-container">

      {/* ===== Floating Background Images ===== */}
      <img src="https://cdn-icons-png.flaticon.com/512/1946/1946429.png" className="bg-img img1" alt="profile icon" />
      <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" className="bg-img img2" alt="brain icon" />
      <img src="https://cdn-icons-png.flaticon.com/512/2583/2583344.png" className="bg-img img3" alt="quiz icon" />
      <img src="https://cdn-icons-png.flaticon.com/512/4149/4149643.png" className="bg-img img4" alt="trophy icon" />
      <img src="https://cdn-icons-png.flaticon.com/512/3524/3524659.png" className="bg-img img5" alt="idea icon" />
      <img src="https://cdn-icons-png.flaticon.com/512/1828/1828884.png" className="bg-img img6" alt="question icon" />
      <img src="https://cdn-icons-png.flaticon.com/512/2910/2910768.png" className="bg-img img7" alt="lightbulb icon" />
      <img src="https://cdn-icons-png.flaticon.com/512/3081/3081487.png" className="bg-img img8" alt="certificate icon" />
      <img src="https://cdn-icons-png.flaticon.com/512/3412/3412366.png" className="bg-img img9" alt="star icon" />

      {/* ===== Profile Card ===== */}
      <div className="profile-card">

        {/* Profile Image */}
        <div className="profile-image" onClick={handleImageClick}>
          <img src={profilePic || defaultProfile} alt="profile" />
          {isEditing && <div className="overlay">Change</div>}
          <input
            type="file"
            ref={fileInputRef}
            hidden
            onChange={handleImageChange}
          />
        </div>

        <h2>My Profile 👤</h2>

        <input
          type="text"
          placeholder="Username"
          value={user?.username || ""}
          readOnly
        />

        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          readOnly={!isEditing}
        />

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          readOnly={!isEditing}
        />

        {isEditing && (
          <>
            <input
              type="password"
              placeholder="New Password"
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </>
        )}

        {!isEditing ? (
          <button onClick={() => setIsEditing(true)}>Edit Profile</button>
        ) : (
          <button onClick={handleUpdate}>Save Changes</button>
        )}

        <button className="logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
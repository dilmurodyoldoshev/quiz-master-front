import React from "react";
import "../styles/profile.css";

function ProfilePage() {
    // localStorage'dan ma'lumotlarni olish, bo'sh bo'lsa default qiymat
    const firstName = localStorage.getItem("firstName") || "Unknown";
    const lastName = localStorage.getItem("lastName") || "";
    const username = localStorage.getItem("username") || "Unknown";
    const email = localStorage.getItem("email") || "unknown";
    const role = localStorage.getItem("role") || "Guest";
    const phone = localStorage.getItem("phone") || "Not set";

    // Avatar uchun default harflar, agar firstName yoki lastName bo'sh bo'lsa
    const avatarLetters = `${firstName[0] || "U"}${lastName[0] || ""}`;

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/login";
    };

    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-header">
                    <div className="avatar">{avatarLetters.toUpperCase()}</div>
                </div>
                <div className="profile-info">
                    <h2>{firstName} {lastName}</h2>
                    <p><span>Role:</span> <span>{role}</span></p>
                    <p><span>Email:</span> <span>{email}</span></p>
                    <p><span>Username:</span> <span>{username}</span></p>
                    <p><span>Phone:</span> <span>{phone}</span></p>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;

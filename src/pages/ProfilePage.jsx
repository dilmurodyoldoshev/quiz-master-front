// src/pages/ProfilePage.jsx
import React, { useEffect, useState } from "react";
import "../styles/profile.css";

const API_URL = "http://localhost:8080/api/users/me";

function ProfilePage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchUser = async () => {
            if (!token) return;
            try {
                setLoading(true);
                const res = await fetch(API_URL, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);

                const result = await res.json();
                // Backend ichidagi data field’ini olish kerak
                setUser(result.data);
            } catch (err) {
                console.error("Failed to fetch user profile:", err);
                alert("Failed to load profile: " + (err.message || err));
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [token]);

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/login";
    };

    if (loading) return <p className="p-4">⏳ Loading profile...</p>;
    if (!user) return <p className="p-4 text-red-500">Failed to load profile.</p>;

    const { firstName, lastName, username, email, role, phone } = user;
    const avatarLetters = `${firstName?.[0] || "U"}${lastName?.[0] || ""}`.toUpperCase();

    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-header">
                    <div className="avatar">{avatarLetters}</div>
                </div>
                <div className="profile-info">
                    <h2>{firstName} {lastName}</h2>
                    <p><span>Role:</span> <span>{role}</span></p>
                    <p><span>Email:</span> <span>{email}</span></p>
                    <p><span>Username:</span> <span>{username}</span></p>
                    <p><span>Phone:</span> <span>{phone || "Not set"}</span></p>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;

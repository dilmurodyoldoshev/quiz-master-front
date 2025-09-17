// src/pages/AdminLayout.jsx
import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "../styles/adminPage.css";

function AdminLayout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
    };

    return (
        <div className="admin-layout">
            <header className="admin-header">
                <h1 className="logo">👨‍💻 Admin Panel</h1>
                <nav className="admin-nav">
                    <Link to="/admin/userlist">👥 Users</Link>
                    <Link to="/admin/adduser">➕ Add User</Link>
                    <Link to="/admin/profile">👤 Profile</Link>
                    <button onClick={handleLogout} className="logout-btn">🚪 Logout</button>
                </nav>
            </header>
            <main className="admin-main">
                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;

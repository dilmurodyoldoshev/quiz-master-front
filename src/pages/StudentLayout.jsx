// src/pages/StudentLayout.jsx
import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "../styles/studentPage.css";

function StudentLayout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
    };

    return (
        <div className="student-layout">
            <header className="student-header">
                <h1 className="logo">🎓 Student Panel</h1>
                <nav className="student-nav">
                    <Link to="/student/quizzes">📝 Quizzes</Link>
                    <Link to="/student/attempts">📊 My Attempts</Link>
                    <Link to="/student/results">🏆 Results</Link>
                    <Link to="/student/profile">👤 Profile</Link>
                    <button
                        onClick={handleLogout}
                        className="logout-btn"
                    >
                        🚪 Logout
                    </button>
                </nav>
            </header>
            <main className="student-main">
                <Outlet />
            </main>
        </div>
    );
}

export default StudentLayout;

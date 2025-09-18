// src/pages/TeacherLayout.jsx
import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "../styles/teacherPage.css";

function TeacherLayout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
    };

    return (
        <div className="teacher-layout">
            <header className="teacher-header">
                <h1 className="logo">👨‍🏫 Teacher Panel</h1>
                <nav className="teacher-nav">
                    <Link to="/teacher/quizzes">📋 My Quizzes</Link>
                    <Link to="/teacher/create-quiz">➕ Create Quiz</Link>
                    <Link to="/teacher/profile">👤 Profile</Link>
                    <button
                        onClick={handleLogout}
                        className="logout-btn"
                    >
                        🚪 Logout
                    </button>
                </nav>
            </header>
            <main className="teacher-main">
                <Outlet />
            </main>
        </div>
    );
}

export default TeacherLayout;

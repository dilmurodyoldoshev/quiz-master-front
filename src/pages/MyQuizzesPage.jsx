// src/pages/MyQuizzesPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/myQuizzes.css"; // CSS fayliga ulanish

const API_URL = "http://localhost:8080/api/teacher";

export default function MyQuizzesPage() {
    const [quizzes, setQuizzes] = useState([]);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    // Backend response helper
    const handleResponse = async (res) => {
        const contentType = res.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
            const json = await res.json();
            if (!res.ok) throw new Error(json?.message || `HTTP ${res.status}`);
            return json;
        }
        if (!res.ok) throw new Error(res.statusText || `HTTP ${res.status}`);
        return null;
    };

    // Fetch all quizzes
    useEffect(() => {
        const fetchQuizzes = async () => {
            if (!token) return;
            try {
                const res = await fetch(`${API_URL}/quizzes`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await handleResponse(res);
                setQuizzes(data?.data || []);
            } catch (err) {
                console.error("Failed to fetch quizzes:", err.message || err);
                alert("Failed to fetch quizzes: " + (err.message || err));
            }
        };
        fetchQuizzes();
    }, [token]);

    // Toggle quiz active/inactive
    const toggleActive = async (quiz) => {
        if (!token) return;
        const action = quiz.active ? "finish" : "activate";
        try {
            const res = await fetch(`${API_URL}/quizzes/${quiz.id}/${action}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
            });
            await handleResponse(res);
            setQuizzes((prev) =>
                prev.map((q) => (q.id === quiz.id ? { ...q, active: !q.active } : q))
            );
        } catch (err) {
            console.error("Failed to toggle quiz:", err.message || err);
            alert("Failed to toggle quiz: " + (err.message || err));
        }
    };

    // Navigation helpers
    const handleAddQuestion = (quiz) => navigate(`/teacher/quizzes/${quiz.id}/questions`);
    const handleViewQuiz = (quiz) => navigate(`/teacher/quizzes/${quiz.id}/view`);
    const handleViewResults = (quiz) => navigate(`/teacher/quizzes/${quiz.id}/results`);

    return (
        <div className="quizzes-container">
            <h2>My Quizzes</h2>
            {quizzes.length === 0 && <p>No quizzes found.</p>}
            {quizzes.map((q) => (
                <div key={q.id} className="quiz-card">
                    <h3>{q.title}</h3>
                    <p>{q.description}</p>
                    <p>
                        Duration: <span>{q.durationMinutes} min</span> | Cheating:{" "}
                        <span className={q.cheatingControl ? "cheating-on" : "cheating-off"}>
                            {q.cheatingControl ? "ON" : "OFF"}
                        </span>
                    </p>
                    <p>
                        Status:{" "}
                        <span className={q.active ? "status-active" : "status-inactive"}>
                            {q.active ? "Active" : "Inactive"}
                        </span>
                    </p>
                    <div className="quiz-buttons">
                        <button
                            onClick={() => toggleActive(q)}
                            className={q.active ? "btn-deactivate" : "btn-activate"}
                        >
                            {q.active ? "Deactivate" : "Activate"}
                        </button>
                        <button onClick={() => handleAddQuestion(q)} className="btn-add">
                            ➕ Add Question
                        </button>
                        <button onClick={() => handleViewQuiz(q)} className="btn-view">
                            📖 View Quiz
                        </button>
                        <button onClick={() => handleViewResults(q)} className="btn-results">
                            📊 View Results
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

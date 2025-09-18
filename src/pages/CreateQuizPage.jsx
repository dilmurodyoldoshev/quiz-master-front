import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/createQuiz.css";

function CreateQuizPage() {
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState({
        title: "",
        description: "",
        cheatingControl: false,
        durationMinutes: 0
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setQuiz(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:8080/api/teacher/quizzes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(quiz)
            });

            if (!res.ok) throw new Error("Failed to create quiz");
            const data = await res.json();
            navigate(`/teacher/quizzes/${data.data.id}/view`);
        } catch (err) {
            console.error(err);
            alert("Quiz yaratishda xatolik yuz berdi: " + (err.message || err));
        }
    };

    return (
        <div className="create-quiz-container">
            <h2 className="page-title">Create Quiz</h2>
            <form onSubmit={handleSubmit} className="form-grid">
                <label>
                    Title
                    <input
                        name="title"
                        placeholder="Enter quiz title"
                        value={quiz.title}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Description
                    <textarea
                        name="description"
                        placeholder="Enter quiz description"
                        value={quiz.description}
                        onChange={handleChange}
                        rows={4}
                    />
                </label>

                {/* Toggle switch for Cheating Control */}
                <label className="switch">
                    <input
                        type="checkbox"
                        name="cheatingControl"
                        checked={quiz.cheatingControl}
                        onChange={handleChange}
                    />
                    <span className="slider"></span>
                    Cheating Control
                </label>

                <label>
                    Duration (minutes)
                    <input
                        type="number"
                        name="durationMinutes"
                        placeholder="e.g. 30"
                        value={quiz.durationMinutes}
                        onChange={handleChange}
                    />
                </label>

                <button type="submit" className="btn-green">
                    Create Quiz
                </button>
            </form>
        </div>
    );
}

export default CreateQuizPage;

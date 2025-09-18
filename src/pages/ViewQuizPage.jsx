// src/pages/ViewQuizPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/viewQuiz.css";

const API_URL = "http://localhost:8080/api/teacher";

export default function ViewQuizPage() {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        const fetchQuiz = async () => {
            if (!token) return;
            try {
                setLoading(true);

                const resQuiz = await fetch(`${API_URL}/quizzes/${quizId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const quizData = await handleResponse(resQuiz);
                setQuiz(quizData.data);

                const resQuestions = await fetch(`${API_URL}/quizzes/${quizId}/questions`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const questionsData = await handleResponse(resQuestions);
                setQuestions(questionsData.data || []);
            } catch (err) {
                console.error(err);
                alert("Failed to fetch quiz or questions: " + (err.message || err));
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [quizId, token]);

    const handleActivate = async () => {
        if (!quiz) return;
        try {
            const res = await fetch(`${API_URL}/quizzes/${quizId}/${quiz.active ? "finish" : "activate"}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
            });
            await handleResponse(res);
            setQuiz(prev => ({ ...prev, active: !prev.active }));
            alert(`Quiz ${quiz.active ? "deactivated" : "activated"}!`);
        } catch (err) {
            console.error(err);
            alert("Failed to toggle quiz: " + (err.message || err));
        }
    };

    const handleToggleCheating = async () => {
        if (!quiz) return;
        try {
            const enabled = !quiz.cheatingControl;
            const res = await fetch(`${API_URL}/quizzes/${quizId}/cheating?enabled=${enabled}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
            });
            await handleResponse(res);
            setQuiz(prev => ({ ...prev, cheatingControl: enabled }));
        } catch (err) {
            console.error(err);
            alert("Failed to toggle cheating: " + (err.message || err));
        }
    };

    const handleViewResults = () => {
        navigate(`/teacher/quizzes/${quizId}/results`);
    };

    if (loading) return <p className="p-4">⏳ Loading quiz...</p>;
    if (!quiz) return <p className="p-4 text-red-500">Quiz not found.</p>;

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-2">{quiz.title}</h2>
            <p className="mb-1">{quiz.description}</p>
            <p>
                Duration: <span className="font-semibold">{quiz.durationMinutes} min</span> | Cheating Control:{" "}
                <span className={quiz.cheatingControl ? "text-green-600 font-semibold" : "text-gray-500"}>
                    {quiz.cheatingControl ? "ON" : "OFF"}
                </span>
            </p>

            <div className="flex gap-2 mt-3 mb-5">
                <button
                    onClick={handleActivate}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                >
                    {quiz.active ? "Deactivate" : "Activate"}
                </button>
                <button
                    onClick={handleToggleCheating}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                >
                    Toggle Cheating
                </button>
                <button
                    onClick={() => navigate("/teacher/quizzes")}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
                >
                    ⬅ Back to My Quizzes
                </button>
                <button
                    onClick={handleViewResults}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded"
                >
                    📊 View Results
                </button>
            </div>

            <h3 className="font-semibold mb-2">Questions</h3>
            {questions.length === 0 ? (
                <p>No questions added yet.</p>
            ) : (
                <ul className="list-disc pl-5">
                    {questions.map((q, i) => (
                        <li key={q.id || i} className="mb-2">
                            <span className="font-medium">{i + 1}. {q.text}</span>
                            {q.options && (
                                <ul className="list-circle pl-6 text-gray-700">
                                    {q.options.map((opt, j) => (
                                        <li key={j}>{opt}</li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

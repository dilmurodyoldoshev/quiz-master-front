// src/pages/QuizDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function QuizDetailPage() {
    const { quizId } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const res = await axios.get(`/api/student/quizzes/${quizId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });
                setQuiz(res.data?.data ?? null);
            } catch (err) {
                console.error(err);
                alert("Error fetching quiz");
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [quizId]);

    const startQuiz = async () => {
        try {
            const res = await axios.post(`/api/student/quizzes/${quizId}/start`, null, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            const attempt = res.data?.data;
            navigate(`/student/quizzes/${quizId}/questions/${attempt.id}`);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message ?? "Error starting quiz");
        }
    };

    if (loading) return <p>Loading quiz...</p>;
    if (!quiz) return <p>Quiz not found.</p>;

    return (
        <div className="p-4 bg-white rounded shadow">
            <h2 className="text-2xl font-semibold mb-2">{quiz.title}</h2>
            <p className="mb-2">{quiz.description}</p>
            <p className="text-sm text-gray-600 mb-4">
                Duration: {quiz.durationMinutes ?? "—"} min
            </p>
            <button
                onClick={startQuiz}
                className="px-3 py-1 bg-blue-600 text-white rounded"
            >
                Start Quiz
            </button>
        </div>
    );
}

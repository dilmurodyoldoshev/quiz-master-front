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
                const resp = await axios.get(
                    `/api/student/quizzes/${quizId}`,
                    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
                );
                setQuiz(resp.data?.data ?? null);
            } catch (err) {
                console.error(err);
                alert(err.response?.data?.message ?? "Error fetching quiz");
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [quizId]);

    const startAttempt = async () => {
        const token = localStorage.getItem("token");
        try {
            const resp = await axios.post(
                `/api/student/quizzes/${quizId}/start`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const attemptId = resp.data?.data?.id;
            if (!attemptId) {
                // Active attempt mavjud yoki backend data bo‘lmasa
                alert(resp.data?.message ?? "Attempt already exists");
                return;
            }

            // To‘g‘ri attemptId bilan QuizQuestionsPage ga yo‘naltirish
            navigate(`/student/quizzes/${quizId}/attempt/${attemptId}`);

        } catch (err) {
            const msg = err.response?.data?.message;
            const attemptId = err.response?.data?.data?.id; // backend yuborsa
            if (msg === "You already have an active attempt for this quiz" && attemptId) {
                // Shu active attemptga yo‘naltirish
                navigate(`/student/quizzes/${quizId}/attempt/${attemptId}`);
            } else {
                alert(msg ?? "Error starting quiz");
            }
        }
    };

    if (loading) return <p>Loading quiz...</p>;
    if (!quiz) return <p>Quiz not found.</p>;

    return (
        <div className="p-4 bg-white rounded shadow">
            <h2 className="text-2xl font-semibold mb-4">{quiz.title}</h2>
            <p className="mb-4">{quiz.description}</p>

            <button
                onClick={startAttempt}
                className="px-4 py-2 bg-blue-600 text-white rounded"
            >
                Start Quiz
            </button>
        </div>
    );
}

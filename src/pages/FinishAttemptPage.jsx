import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function FinishAttemptPage() {
    const { attemptId } = useParams();
    const [attempt, setAttempt] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAttempt = async () => {
            try {
                const res = await axios.get(`/api/student/attempts/${attemptId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });
                setAttempt(res.data.data ?? null);
            } catch (err) {
                console.error(err);
                alert("Error fetching attempt result");
            } finally {
                setLoading(false);
            }
        };
        fetchAttempt();
    }, [attemptId]);

    if (loading) return <p>Loading result...</p>;
    if (!attempt) return <p>Result not found.</p>;

    return (
        <div className="p-4 bg-white rounded shadow">
            <h2 className="text-2xl font-semibold mb-2">Your Score: {attempt.score}</h2>
            <p>Total Questions: {attempt.totalQuestions}</p>
            <p>Correct Answers: {attempt.correctAnswers}</p>
            <button
                onClick={() => navigate("/student/quizzes")}
                className="mt-4 px-3 py-1 bg-blue-600 text-white rounded"
            >
                Back to Quizzes
            </button>
        </div>
    );
}

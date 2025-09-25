// src/pages/QuizListPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function QuizListPage() {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuizzes = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("Token topilmadi. Iltimos, tizimga kiring.");

                const resp = await axios.get("/api/student/quizzes", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                console.log("Backend response:", resp.data);

                const data = resp.data?.data ?? [];
                setQuizzes(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Xatolik:", err);
                setQuizzes([]);
            } finally {
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, []);

    if (loading) return <p>Loading quizzes...</p>;
    if (!quizzes.length) return <p>No quizzes available.</p>;

    return (
        <div className="p-4 bg-white rounded shadow">
            <h2 className="text-2xl font-semibold mb-3">Available Quizzes</h2>
            <ul className="space-y-2">
                {quizzes.map((quiz) => (
                    <li
                        key={quiz.id}
                        className="p-3 border rounded flex justify-between items-center"
                    >
                        <div>
                            <h3 className="font-medium">{quiz.title}</h3>
                            <p className="text-sm text-gray-600">{quiz.description}</p>
                        </div>
                        <button
                            onClick={() => navigate(`/student/quizzes/${quiz.id}`)}
                            className="px-3 py-1 bg-blue-600 text-white rounded"
                        >
                            View
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

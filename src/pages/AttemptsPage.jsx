// src/pages/AttemptsPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AttemptsPage() {
    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAttempts = async () => {
            try {
                const resp = await axios.get("/api/student/attempts", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });

                const data = Array.isArray(resp.data.data) ? resp.data.data : [];
                setAttempts(data);
            } catch (err) {
                console.error("Error fetching attempts:", err);
                setAttempts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAttempts();
    }, []);

    if (loading) return <p>Loading attempts...</p>;
    if (!attempts.length) return <p>No attempts yet.</p>;

    return (
        <div className="p-4 bg-white rounded shadow">
            <h2 className="text-2xl font-semibold mb-3">My Attempts</h2>
            <ul className="space-y-2">
                {attempts.map((a) => (
                    <li key={a.id} className="p-3 border rounded flex justify-between items-center">
                        <div>
                            <h3 className="font-semibold">{a.quizTitle}</h3>
                            <p className="text-gray-600 text-sm">Score: {a.score ?? 0}</p>
                            <p className="text-gray-500 text-xs">
                                Status: {a.finished ? "Finished" : "In Progress"}
                            </p>
                        </div>
                        <button
                            onClick={() => navigate(a.finished
                                ? `/student/finish/${a.id}`
                                : `/student/quizzes/${a.quizId}/questions/${a.id}`
                            )}
                            className="px-3 py-1 bg-blue-600 text-white rounded"
                        >
                            {a.finished ? "View Result" : "Continue"}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

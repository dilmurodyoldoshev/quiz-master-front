// src/pages/ViewResultsPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8080/api/teacher";

export default function ViewResultsPage() {
    const { quizId } = useParams(); // URLdan quizId oladi
    const navigate = useNavigate();
    const [results, setResults] = useState([]);
    const [quizTitle, setQuizTitle] = useState("");
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!quizId || !token) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                // 1. Leaderboardni olish
                const resLeaderboard = await fetch(`${API_URL}/quizzes/${quizId}/leaderboard`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!resLeaderboard.ok) throw new Error("Failed to fetch leaderboard");
                const leaderboardData = await resLeaderboard.json();
                if (leaderboardData.success) {
                    setResults(leaderboardData.data || []);
                } else {
                    console.error(leaderboardData.message);
                    setResults([]);
                }

                // 2. Quiz title olish
                const resQuiz = await fetch(`${API_URL}/quizzes/${quizId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!resQuiz.ok) throw new Error("Failed to fetch quiz");
                const quizData = await resQuiz.json();
                if (quizData.success) {
                    setQuizTitle(quizData.data.title || `Quiz ${quizId}`);
                } else {
                    setQuizTitle(`Quiz ${quizId}`);
                }
            } catch (err) {
                console.error("Error fetching data:", err);
                setResults([]);
                setQuizTitle(`Quiz ${quizId}`);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [quizId, token]);

    if (loading) return <p>Loading results...</p>;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">{quizTitle} - Results</h2>

            {/* Back button */}
            <button
                onClick={() => navigate("/teacher/quizzes")}
                className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                ⬅ Back to Quizzes
            </button>

            {results.length === 0 ? (
                <p>No results found</p>
            ) : (
                <table border="1" cellPadding="8" className="w-full text-left">
                    <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Username</th>
                        <th>Score</th>
                    </tr>
                    </thead>
                    <tbody>
                    {results.map((r, idx) => (
                        <tr key={idx}>
                            <td>{r.rank}</td>
                            <td>{r.username}</td>
                            <td>{r.score}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

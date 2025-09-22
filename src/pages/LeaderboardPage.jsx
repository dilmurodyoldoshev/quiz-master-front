import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function LeaderboardPage() {
    const { quizId } = useParams();
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`/api/student/quizzes/${quizId}/leaderboard`)
            .then(res => setLeaderboard(res.data.data ?? res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [quizId]);

    if (loading) return <p>Loading leaderboard...</p>;

    return (
        <div className="p-4 bg-white rounded shadow">
            <h3 className="text-xl font-semibold mb-3">Leaderboard</h3>
            {leaderboard.length === 0 ? (
                <p className="text-gray-600">Leaderboard mavjud emas.</p>
            ) : (
                <ol className="list-decimal pl-5">
                    {leaderboard.map((e, i) => (
                        <li key={i} className="flex justify-between">
                            <span>{e.username}</span>
                            <span>{e.score}</span>
                        </li>
                    ))}
                </ol>
            )}
        </div>
    );
}

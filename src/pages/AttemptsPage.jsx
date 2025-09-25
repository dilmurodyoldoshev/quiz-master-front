import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MyAttemptsPage() {
    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("/api/student/attempts", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
            .then(res => {
                const data = res.data.data ?? res.data;
                setAttempts(Array.isArray(data) ? data : []);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Loading attempts...</p>;
    if (!attempts.length) return <p>No attempts yet.</p>;

    return (
        <div className="p-4 bg-white rounded shadow">
            <h2 className="text-2xl font-semibold mb-3">My Attempts</h2>
            <ul>
                {attempts.map((a, i) => (
                    <li key={i} className="flex justify-between border-b py-1">
                        <span>{a.quizTitle}</span>
                        <span>Score: {a.score ?? 0}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

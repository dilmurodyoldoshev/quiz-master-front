import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ResultsPage() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("/api/student/results", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
            .then(res => {
                const data = res.data.data ?? res.data;
                setResults(Array.isArray(data) ? data : []);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Loading results...</p>;

    return (
        <div className="p-4 bg-white rounded shadow">
            <h3 className="text-xl font-semibold mb-3">Your Results</h3>
            {results.length === 0 ? (
                <p className="text-gray-600">Hozircha natija mavjud emas.</p>
            ) : (
                <ul>
                    {results.map((r, i) => (
                        <li key={i} className="flex justify-between border-b py-1">
                            <span>{r.quizTitle}</span>
                            <span>{r.score} ball</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

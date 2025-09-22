import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function FinishAttemptPage() {
    const { attemptId } = useParams();
    const [result, setResult] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.post(`/api/student/attempts/${attemptId}/finish`)
            .then(res => setResult(res.data.data ?? res.data))
            .catch(err => console.error(err));
    }, [attemptId]);

    if (!result) return <p>Finishing quiz...</p>;

    return (
        <div className="p-4 bg-white rounded shadow">
            <h2 className="text-2xl font-semibold mb-2">Quiz Finished</h2>
            <p>Score: {result.score ?? 0}</p>
            <button
                onClick={() => navigate("/student/results")}
                className="mt-2 px-3 py-1 bg-blue-600 text-white rounded"
            >
                View All Results
            </button>
        </div>
    );
}

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function QuizQuestionsPage() {
    const { quizId, attemptId } = useParams();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`/api/student/quizzes/${quizId}/questions`)
            .then(res => setQuestions(res.data.data ?? res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [quizId]);

    const goToQuestion = (questionId) => {
        navigate(`/student/quizzes/${quizId}/questions/${questionId}/${attemptId}`);
    };

    if (loading) return <p>Loading questions...</p>;
    if (!questions.length) return <p>Savollar topilmadi.</p>;

    return (
        <div className="p-4 bg-white rounded shadow">
            <h2 className="text-2xl font-semibold mb-3">Questions</h2>
            <ul className="space-y-2">
                {questions.map((q, idx) => (
                    <li key={q.id ?? idx} className="p-3 border rounded flex justify-between items-center">
                        <span>{idx + 1}. {q.text}</span>
                        <button
                            onClick={() => goToQuestion(q.id)}
                            className="px-3 py-1 bg-blue-600 text-white rounded"
                        >
                            Answer
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

// src/pages/QuestionDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function QuestionDetailPage() {
    const { quizId, questionId, attemptId } = useParams();
    const [question, setQuestion] = useState(null);
    const [selected, setSelected] = useState(null);
    const [answered, setAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState(null);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const resp = await axios.get(
                    `/api/student/quizzes/${quizId}/questions/${questionId}`,
                    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
                );
                const q = resp.data?.data ?? null;
                setQuestion(q);
                setSelected(q?.selectedOption ?? null);
                if (q?.isCorrect !== undefined) {
                    setAnswered(true);
                    setIsCorrect(q.isCorrect);
                    setScore(q.attemptScore ?? 0);
                }
            } catch (err) {
                console.error(err);
                alert(err.response?.data?.message ?? "Error fetching question");
            } finally {
                setLoading(false);
            }
        };
        fetchQuestion();
    }, [quizId, questionId]);

    const submitAnswer = async () => {
        if (!selected) return alert("Please select an answer!");
        setSubmitting(true);
        try {
            const resp = await axios.post(
                `/api/student/attempts/${attemptId}/questions/${questionId}/answer`,
                { selectedOption: selected },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            const ans = resp.data?.data ?? {};
            setAnswered(true);
            setIsCorrect(ans.isCorrect);
            setScore(ans.attemptScore ?? 0);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message ?? "Error submitting answer");
        } finally {
            setSubmitting(false);
        }
    };

    const goBackToQuestions = () => {
        navigate(`/student/quizzes/${quizId}/questions/${attemptId}`);
    };

    if (loading) return <p>Loading question...</p>;
    if (!question) return <p>Question not found.</p>;

    return (
        <div className="p-4 bg-white rounded shadow">
            <h2 className="text-2xl font-semibold mb-2">{question.text}</h2>

            <div className="space-y-2 mb-4">
                {Object.entries(question.options || {}).map(([key, value]) => {
                    const highlight = answered
                        ? key === question.correctAnswer
                            ? "bg-green-100"
                            : key === selected
                                ? "bg-red-100"
                                : ""
                        : "";

                    return (
                        <label
                            key={key}
                            className={`flex items-center space-x-2 p-2 border rounded ${highlight}`}
                        >
                            <input
                                type="radio"
                                name="option"
                                value={key}
                                checked={selected === key}
                                disabled={answered}
                                onChange={() => setSelected(key)}
                            />
                            <span>{value}</span>
                        </label>
                    );
                })}
            </div>

            {answered && (
                <p className={`font-semibold ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                    {isCorrect ? "Correct!" : "Incorrect!"} — Current Score: {score}
                </p>
            )}

            <div className="flex space-x-2 mt-2">
                {!answered && (
                    <button
                        onClick={submitAnswer}
                        disabled={submitting}
                        className="px-3 py-1 bg-blue-600 text-white rounded"
                    >
                        {submitting ? "Submitting..." : "Submit Answer"}
                    </button>
                )}
                <button
                    onClick={goBackToQuestions}
                    className="px-3 py-1 bg-gray-500 text-white rounded"
                >
                    Back to Questions
                </button>
            </div>
        </div>
    );
}

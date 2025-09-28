// src/pages/QuestionDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function QuestionDetailPage() {
    const { quizId, attemptId } = useParams();
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selected, setSelected] = useState(null);
    const [answered, setAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState(null);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const resp = await axios.get(
                    `/api/student/quizzes/${quizId}/questions`,
                    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
                );
                const qs = resp.data?.data ?? [];
                setQuestions(qs);
            } catch (err) {
                console.error(err);
                alert(err.response?.data?.message ?? "Error fetching questions");
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, [quizId]);

    if (loading) return <p>Loading questions...</p>;
    if (!questions.length) return <p>No questions found.</p>;

    const question = questions[currentIndex];

    // Backenddagi optionA/B/C/D dan options obyektini yaratamiz
    const options = {
        A: question.optionA,
        B: question.optionB,
        C: question.optionC,
        D: question.optionD
    };

    const submitAnswer = async () => {
        if (!selected) return alert("Please select an answer!");
        setSubmitting(true);
        try {
            const resp = await axios.post(
                `/api/student/attempts/${attemptId}/questions/${question.id}/answer`,
                { selectedOption: selected },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            const ans = resp.data?.data ?? {};
            setAnswered(true);
            setIsCorrect(ans.isCorrect);
            setScore(prev => prev + (ans.attemptScore ?? 0));
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message ?? "Error submitting answer");
        } finally {
            setSubmitting(false);
        }
    };

    const goPrev = () => {
        setAnswered(false);
        setSelected(null);
        setIsCorrect(null);
        setCurrentIndex(i => i - 1);
    };

    const goNext = () => {
        setAnswered(false);
        setSelected(null);
        setIsCorrect(null);
        setCurrentIndex(i => i + 1);
    };

    const finishAttempt = () => {
        navigate(`/student/quizzes/${quizId}/finish/${attemptId}`);
    };

    return (
        <div className="p-4 bg-white rounded shadow">
            <h2 className="text-2xl font-semibold mb-2">{question.text}</h2>

            <p>Progress: {currentIndex + 1} / {questions.length}</p>
            <p>Current Score: {score}</p>

            <div className="space-y-2 mb-4 mt-2">
                {Object.entries(options).map(([key, value]) => {
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
                    onClick={goPrev}
                    disabled={currentIndex === 0}
                    className="px-3 py-1 bg-gray-500 text-white rounded"
                >
                    Prev
                </button>

                <button
                    onClick={goNext}
                    disabled={currentIndex === questions.length - 1}
                    className="px-3 py-1 bg-gray-500 text-white rounded"
                >
                    Next
                </button>

                <button
                    onClick={finishAttempt}
                    className="px-3 py-1 bg-green-600 text-white rounded"
                >
                    Finish Attempt
                </button>
            </div>

            {answered && (
                <p className={`font-semibold mt-2 ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                    {isCorrect ? "Correct!" : "Incorrect!"}
                </p>
            )}
        </div>
    );
}

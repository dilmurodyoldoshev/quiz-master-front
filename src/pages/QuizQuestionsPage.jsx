// src/pages/QuizQuestionsPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function QuizQuestionsPage() {
    const { quizId, attemptId } = useParams();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [answers, setAnswers] = useState({});
    const [score, setScore] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await axios.get(`/api/student/quizzes/${quizId}/questions`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });
                const data = res.data?.data ?? [];
                setQuestions(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error(err);
                alert("Error fetching questions");
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, [quizId]);

    const submitAnswer = async (questionId, selected) => {
        if (!selected) return alert("Select an answer first!");
        try {
            const res = await axios.post(
                `/api/student/attempts/${attemptId}/questions/${questionId}/answer`,
                { selectedOption: selected },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            const ans = res.data?.data;
            setAnswers(prev => ({ ...prev, [questionId]: { selected: ans.selectedOption, isCorrect: ans.isCorrect } }));
            // update score
            setScore(Object.values({ ...answers, [questionId]: { isCorrect: ans.isCorrect } }).filter(a => a.isCorrect).length);
        } catch (err) {
            console.error(err);
            alert("Error submitting answer");
        }
    };

    const finishAttempt = async () => {
        try {
            await axios.post(`/api/student/attempts/${attemptId}/finish`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            navigate(`/student/finish/${attemptId}`);
        } catch (err) {
            console.error(err);
            alert("Error finishing attempt");
        }
    };

    if (loading) return <p>Loading questions...</p>;
    if (!questions.length) return <p>No questions found.</p>;

    const currentQuestion = questions[currentIndex];
    const ans = answers[currentQuestion.id] || {};

    return (
        <div className="p-4 bg-white rounded shadow">
            <h2 className="text-2xl font-semibold mb-2">{currentQuestion.text}</h2>
            <p className="mb-2">Progress: {Object.keys(answers).length} / {questions.length}</p>
            <p className="mb-4 font-medium">Current Score: {score}</p>

            <div className="space-y-2 mb-4">
                {Object.entries(currentQuestion.options || {}).map(([key, val]) => {
                    const highlight = ans.isCorrect !== undefined
                        ? key === currentQuestion.correctAnswer
                            ? "bg-green-100"
                            : key === ans.selected
                                ? "bg-red-100"
                                : ""
                        : "";
                    return (
                        <label key={key} className={`flex items-center space-x-2 p-2 border rounded ${highlight}`}>
                            <input
                                type="radio"
                                name={`question-${currentQuestion.id}`}
                                value={key}
                                disabled={ans.isCorrect !== undefined}
                                checked={ans.selected === key}
                                onChange={() => submitAnswer(currentQuestion.id, key)}
                            />
                            <span>{val}</span>
                        </label>
                    );
                })}
            </div>

            <div className="flex space-x-2 mt-2">
                <button onClick={() => setCurrentIndex(prev => Math.max(prev - 1, 0))}
                        disabled={currentIndex === 0}
                        className="px-3 py-1 bg-gray-500 text-white rounded">Prev</button>
                <button onClick={() => setCurrentIndex(prev => Math.min(prev + 1, questions.length - 1))}
                        disabled={currentIndex === questions.length - 1}
                        className="px-3 py-1 bg-gray-500 text-white rounded">Next</button>
                <button onClick={finishAttempt} className="px-3 py-1 bg-blue-600 text-white rounded">Finish Attempt</button>
            </div>
        </div>
    );
}

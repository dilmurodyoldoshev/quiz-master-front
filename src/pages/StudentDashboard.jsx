// src/pages/StudentDashboard.jsx
import React, { useEffect, useState } from "react";
import {
    startAttempt,
    submitAnswer,
    finishAttempt,
    getResult,
    getPublicQuizzes
} from "../index.js";
import { API_URL } from "../config";

function StudentDashboard() {
    const [quizzes, setQuizzes] = useState([]);
    const [currentAttempt, setCurrentAttempt] = useState(null);
    const [answers, setAnswers] = useState({});
    const [results, setResults] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const token = localStorage.getItem("token");

    // ==================== Fetch Quizzes ====================
    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                setError("");
                const data = await getPublicQuizzes(); // yoki student-specific API bo'lsa token bilan
                setQuizzes(data || []);
            } catch (err) {
                console.error("Fetch quizzes error:", err);
                setError("Quizlarni olishda xatolik yuz berdi");
            }
        };
        fetchQuizzes();
    }, []);

    // ==================== Quiz Actions ====================
    const handleStartQuiz = async (quizId) => {
        try {
            setError("");
            const attempt = await startAttempt(quizId, token);
            setCurrentAttempt(attempt);
            setAnswers({});
            setResults(null);
            setSuccess("Quiz boshlandi!");
        } catch (err) {
            console.error("Start quiz error:", err);
            setError("Quizni boshlashda xatolik");
        }
    };

    const handleAnswer = async (questionId, selectedOption) => {
        try {
            await submitAnswer(questionId, selectedOption, token);
            setAnswers(prev => ({ ...prev, [questionId]: selectedOption }));
        } catch (err) {
            console.error("Submit answer error:", err);
            setError("Javob yuborishda xatolik");
        }
    };

    const handleFinishQuiz = async () => {
        if (!currentAttempt) return;
        try {
            const result = await finishAttempt(currentAttempt.id, token);
            setResults(result);
            setCurrentAttempt(null);
            setAnswers({});
            setSuccess("Quiz yakunlandi!");
        } catch (err) {
            console.error("Finish quiz error:", err);
            setError("Quizni yakunlashda xatolik");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-4">
            <h1 className="text-4xl font-bold mb-4">Student Dashboard</h1>

            {/* Error / Success Messages */}
            {error && <div className="mb-2 p-2 bg-red-200 text-red-800 rounded">{error}</div>}
            {success && <div className="mb-2 p-2 bg-green-200 text-green-800 rounded">{success}</div>}

            {/* Available Quizzes */}
            {!currentAttempt && (
                <div className="w-full max-w-md mb-4">
                    <h2 className="text-2xl font-semibold mb-2">Available Quizzes</h2>
                    <ul>
                        {quizzes.map(quiz => (
                            <li key={quiz.id} className="mb-1 flex justify-between items-center">
                                <span>{quiz.title}</span>
                                <button
                                    onClick={() => handleStartQuiz(quiz.id)}
                                    className="bg-blue-500 text-white px-2 py-1 rounded"
                                >
                                    Start Quiz
                                </button>
                            </li>
                        ))}
                        {quizzes.length === 0 && <li>No quizzes available</li>}
                    </ul>
                </div>
            )}

            {/* Quiz in Progress */}
            {currentAttempt && (
                <div className="w-full max-w-xl p-4 bg-white rounded shadow mb-4">
                    <h2 className="text-2xl font-semibold mb-2">Quiz in Progress</h2>
                    <p>Attempt ID: {currentAttempt.id}</p>

                    {currentAttempt.questions?.map(q => (
                        <div key={q.id} className="mb-3 p-2 border rounded">
                            <p className="font-semibold">{q.text}</p>
                            {[q.optionA, q.optionB, q.optionC, q.optionD].map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => handleAnswer(q.id, opt)}
                                    className={`mr-2 mt-1 px-2 py-1 border rounded ${
                                        answers[q.id] === opt ? "bg-green-200" : ""
                                    }`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    ))}

                    <button
                        onClick={handleFinishQuiz}
                        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
                    >
                        Finish Quiz
                    </button>
                </div>
            )}

            {/* Quiz Results */}
            {results && (
                <div className="w-full max-w-md p-4 bg-white rounded shadow">
                    <h2 className="text-2xl font-semibold mb-2">Results</h2>
                    <p>Score: {results.score}</p>
                    <p>Rank: {results.rank}</p>
                </div>
            )}
        </div>
    );
}

export default StudentDashboard;

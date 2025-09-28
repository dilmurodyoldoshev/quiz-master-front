import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function QuizQuestionsPage() {
    const { quizId, attemptId } = useParams();
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({}); // { questionId: selectedOption }
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    // 1️⃣ Fetch all questions
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const resp = await axios.get(`/api/student/quizzes/${quizId}/questions`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });
                setQuestions(resp.data?.data ?? []);
            } catch (err) {
                console.error(err);
                alert("Error fetching questions");
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, [quizId]);

    if (loading) return <p>Loading questions...</p>;
    if (!questions.length) return <p>No questions found.</p>;

    const question = questions[currentIndex];
    const options = {
        A: question.optionA,
        B: question.optionB,
        C: question.optionC,
        D: question.optionD
    };

    // 2️⃣ Tanlangan variantni frontend state ga saqlash
    const selectOption = (optionKey) => {
        setAnswers(prev => ({ ...prev, [question.id]: optionKey }));
    };

    const goPrev = () => setCurrentIndex(i => i - 1);
    const goNext = () => setCurrentIndex(i => i + 1);

    // 3️⃣ Finish Attempt (barcha javoblarni bitta request bilan yuboradi)
    const finishAttempt = async () => {
        setSubmitting(true);
        const token = localStorage.getItem("token");

        try {
            const resp = await axios.post(
                `/api/student/attempts/${attemptId}/finish`,
                answers,  // bitta JSON map: { questionId: "A", ... }
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const result = resp.data?.data;
            navigate(`/student/quizzes/${quizId}/finish/${attemptId}`, { state: { result } });

        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message ?? err.message ?? "Error finishing attempt");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="p-4 bg-white rounded shadow">
            <h2 className="text-2xl font-semibold mb-2">{question.text}</h2>
            <p>Progress: {currentIndex + 1} / {questions.length}</p>

            <div className="space-y-2 mb-4 mt-2">
                {Object.entries(options).map(([key, value]) => (
                    <label key={key} className="flex items-center space-x-2 p-2 border rounded cursor-pointer hover:bg-gray-100">
                        <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={key}
                            checked={answers[question.id] === key}
                            onChange={() => selectOption(key)}
                        />
                        <span>{value}</span>
                    </label>
                ))}
            </div>

            <div className="flex space-x-2 mt-2">
                <button onClick={goPrev} disabled={currentIndex === 0} className="px-3 py-1 bg-gray-500 text-white rounded">Prev</button>
                <button onClick={goNext} disabled={currentIndex === questions.length - 1} className="px-3 py-1 bg-gray-500 text-white rounded">Next</button>
                <button onClick={finishAttempt} disabled={submitting} className="px-3 py-1 bg-green-600 text-white rounded">
                    {submitting ? "Finishing..." : "Finish Attempt"}
                </button>
            </div>
        </div>
    );
}

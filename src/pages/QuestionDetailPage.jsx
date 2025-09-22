import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function QuestionDetailPage() {
    const { quizId, questionId, attemptId } = useParams();
    const [question, setQuestion] = useState(null);
    const [questionsList, setQuestionsList] = useState([]);
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Hozirgi savol
        const fetchQuestion = axios.get(`/api/student/quizzes/${quizId}/questions/${questionId}`);
        // Barcha savollar
        const fetchAll = axios.get(`/api/student/quizzes/${quizId}/questions`);

        Promise.all([fetchQuestion, fetchAll])
            .then(([qRes, allRes]) => {
                setQuestion(qRes.data.data ?? qRes.data);
                setQuestionsList(allRes.data.data ?? allRes.data);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [quizId, questionId]);

    const handleSubmit = () => {
        if (!answer) return;
        axios.post(`/api/student/attempts/${attemptId}/questions/${questionId}/answer`, null, { params: { selectedOption: answer } })
            .then(() => {
                const currentIndex = questionsList.findIndex(q => q.id === question.id);
                const nextQuestion = questionsList[currentIndex + 1];
                if (nextQuestion) {
                    navigate(`/student/quizzes/${quizId}/questions/${nextQuestion.id}/${attemptId}`);
                } else {
                    navigate(`/student/finish/${attemptId}`);
                }
            })
            .catch(err => console.error(err));
    };

    if (loading) return <p>Loading question...</p>;
    if (!question) return <p>Question not found.</p>;

    return (
        <div className="p-4 bg-white rounded shadow">
            <h2 className="text-2xl font-semibold mb-3">{question.text}</h2>
            <div className="space-y-2">
                {["A", "B", "C", "D"].map(opt => (
                    question[`option${opt}`] ? (
                        <div key={opt}>
                            <label className="flex items-center gap-2">
                                <input type="radio" value={opt} checked={answer === opt} onChange={(e) => setAnswer(e.target.value)} />
                                {question[`option${opt}`]}
                            </label>
                        </div>
                    ) : null
                ))}
            </div>
            <button
                onClick={handleSubmit}
                disabled={!answer}
                className="mt-3 px-3 py-1 bg-blue-600 text-white rounded"
            >
                Submit Answer
            </button>
        </div>
    );
}

// src/pages/AddQuestionPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/addQuestion.css"; // CSS fayl

const API_URL = "http://localhost:8080/api/teacher";

export default function AddQuestionPage() {
    const { quizId } = useParams();
    const token = localStorage.getItem("token");

    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState({
        text: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctAnswer: "A",
    });

    const handleResponse = async (res) => {
        const contentType = res.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
            const json = await res.json();
            if (!res.ok) throw new Error(json?.message || `HTTP ${res.status}`);
            return json;
        }
        if (!res.ok) throw new Error(res.statusText || `HTTP ${res.status}`);
        return null;
    };

    useEffect(() => {
        const fetchQuiz = async () => {
            if (!token) return;
            try {
                const resQuiz = await fetch(`${API_URL}/quizzes/${quizId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const quizData = await handleResponse(resQuiz);
                setQuiz(quizData.data);

                const resQuestions = await fetch(`${API_URL}/quizzes/${quizId}/questions`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const questionsData = await handleResponse(resQuestions);
                setQuestions(questionsData.data || []);
            } catch (err) {
                console.error(err);
                alert("Failed to fetch quiz or questions: " + (err.message || err));
            }
        };
        fetchQuiz();
    }, [quizId, token]);

    const validateQuestion = () => {
        const { text, optionA, optionB, optionC, optionD, correctAnswer } = newQuestion;
        if (!text.trim()) return alert("Question text is required") || false;
        if (!optionA.trim() || !optionB.trim() || !optionC.trim() || !optionD.trim())
            return alert("All options are required") || false;
        if (!["A","B","C","D"].includes(correctAnswer)) return alert("Correct answer must be A/B/C/D") || false;
        return true;
    };

    const handleAddQuestion = async () => {
        if (!validateQuestion()) return;
        try {
            const payload = {
                text: newQuestion.text.trim(),
                optionA: newQuestion.optionA.trim(),
                optionB: newQuestion.optionB.trim(),
                optionC: newQuestion.optionC.trim(),
                optionD: newQuestion.optionD.trim(),
                correctAnswer: newQuestion.correctAnswer,
            };
            const res = await fetch(`${API_URL}/quizzes/${quizId}/questions`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(payload),
            });
            const data = await handleResponse(res);
            setQuestions((prev) => [...prev, data.data]);
            setNewQuestion({ text: "", optionA: "", optionB: "", optionC: "", optionD: "", correctAnswer: "A" });
        } catch (err) {
            console.error(err);
            alert("Failed to add question: " + (err.message || err));
        }
    };

    if (!quiz) return <p>Loading quiz...</p>;

    return (
        <div className="create-quiz-container">
            <h2 className="page-title">Quiz: {quiz.title}</h2>
            <p className="quiz-info">{quiz.description}</p>
            <p className="quiz-info">Duration: {quiz.durationMinutes} min | Cheating Control: {quiz.cheatingControl ? "ON" : "OFF"}</p>

            <h3 className="section-title">Questions</h3>
            <ul className="question-list">
                {questions.map((q, i) => <li key={i}>{i + 1}. {q.text}</li>)}
            </ul>

            <div className="new-question-card create-quiz-form">
                <h3 className="section-title">Add New Question</h3>
                <input type="text" placeholder="Question text" value={newQuestion.text} onChange={e => setNewQuestion({...newQuestion, text: e.target.value})} />

                <div className="option-row">
                    <input type="text" placeholder="Option A" value={newQuestion.optionA} onChange={e => setNewQuestion({...newQuestion, optionA: e.target.value})} />
                    <input type="text" placeholder="Option B" value={newQuestion.optionB} onChange={e => setNewQuestion({...newQuestion, optionB: e.target.value})} />
                </div>
                <div className="option-row">
                    <input type="text" placeholder="Option C" value={newQuestion.optionC} onChange={e => setNewQuestion({...newQuestion, optionC: e.target.value})} />
                    <input type="text" placeholder="Option D" value={newQuestion.optionD} onChange={e => setNewQuestion({...newQuestion, optionD: e.target.value})} />
                </div>

                <label>
                    Correct:
                    <select value={newQuestion.correctAnswer} onChange={e => setNewQuestion({...newQuestion, correctAnswer: e.target.value})}>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                    </select>
                </label>

                <button onClick={handleAddQuestion} className="btn-green">Add Question</button>
            </div>
        </div>
    );
}

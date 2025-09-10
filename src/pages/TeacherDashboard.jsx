// src/pages/TeacherDashboard.jsx
import React, { useState, useEffect } from "react";
import {
    createQuiz,
    activateQuiz,
    finishQuiz,
    toggleCheating,
    addQuestion,
    getQuestions
} from "../index.js";
import "../styles/teacher.css";

function TeacherDashboard() {
    const [messages, setMessages] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [newQuizTitle, setNewQuizTitle] = useState("");
    const [newQuizDescription, setNewQuizDescription] = useState("");
    const [newQuestion, setNewQuestion] = useState({
        text: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctAnswer: "",
        timeLimit: 30
    });

    const token = localStorage.getItem("token");

    // ================= Fetch Quizzes =================
    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const res = await fetch(`/api/teacher/quizzes`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error("Serverdan ma'lumot olishda xatolik");
                const data = await res.json();
                setQuizzes(data.data || []); // undefined bo'lsa bo'sh array
            } catch (err) {
                console.error(err);
            }
        };
        if (token) fetchQuizzes();
    }, [token]);

    const handleCreateQuiz = async () => {
        if (!newQuizTitle) return;
        try {
            const quiz = await createQuiz(
                { title: newQuizTitle, description: newQuizDescription },
                token
            );
            setQuizzes(prev => [...prev, quiz?.data || {}]);
            setNewQuizTitle("");
            setNewQuizDescription("");
        } catch (err) {
            console.error(err);
        }
    };

    const handleSelectQuiz = async (quiz) => {
        setSelectedQuiz(quiz);
        try {
            const qs = await getQuestions(quiz.id, token);
            setQuestions(qs?.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddQuestion = async () => {
        if (!selectedQuiz) return;
        try {
            const question = await addQuestion(selectedQuiz.id, newQuestion, token);
            setQuestions(prev => [...prev, question?.data || {}]);
            setNewQuestion({
                text: "",
                optionA: "",
                optionB: "",
                optionC: "",
                optionD: "",
                correctAnswer: "",
                timeLimit: 30
            });
        } catch (err) {
            console.error(err);
        }
    };

    const handleActivateQuiz = async () => {
        if (!selectedQuiz) return;
        try {
            const updated = await activateQuiz(selectedQuiz.id, token);
            setQuizzes(prev => prev.map(q => q.id === updated?.data?.id ? updated.data : q));
        } catch (err) {
            console.error(err);
        }
    };

    const handleFinishQuiz = async () => {
        if (!selectedQuiz) return;
        try {
            const updated = await finishQuiz(selectedQuiz.id, token);
            setQuizzes(prev => prev.map(q => q.id === updated?.data?.id ? updated.data : q));
        } catch (err) {
            console.error(err);
        }
    };

    const handleToggleCheating = async (enabled) => {
        if (!selectedQuiz) return;
        try {
            const updated = await toggleCheating(selectedQuiz.id, enabled, token);
            setQuizzes(prev => prev.map(q => q.id === updated?.data?.id ? updated.data : q));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen p-4 bg-blue-50">
            <h1 className="text-4xl font-bold mb-4">Teacher Dashboard</h1>

            {/* Create Quiz */}
            <div className="mb-4">
                <h2 className="text-2xl font-semibold">Create New Quiz</h2>
                <input
                    type="text"
                    placeholder="Quiz Title"
                    value={newQuizTitle}
                    onChange={e => setNewQuizTitle(e.target.value)}
                    className="border p-1 mr-2"
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={newQuizDescription}
                    onChange={e => setNewQuizDescription(e.target.value)}
                    className="border p-1 mr-2"
                />
                <button onClick={handleCreateQuiz} className="bg-green-500 text-white px-2 py-1">Create</button>
            </div>

            {/* Quiz List */}
            <div className="mb-4">
                <h2 className="text-2xl font-semibold">Quizzes</h2>
                <ul>
                    {quizzes.map(q => (
                        <li key={q.id}>
                            {q.title}
                            <button onClick={() => handleSelectQuiz(q)} className="ml-2 bg-blue-300 px-1">Select</button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Selected Quiz */}
            {selectedQuiz && (
                <div className="mb-4 p-2 border rounded bg-white">
                    <h2 className="text-xl font-semibold">Selected Quiz: {selectedQuiz.title}</h2>

                    {/* Quiz Controls */}
                    <div className="my-2">
                        <button onClick={handleActivateQuiz} className="mr-2 bg-green-400 px-2 py-1">Activate</button>
                        <button onClick={handleFinishQuiz} className="mr-2 bg-red-400 px-2 py-1">Finish</button>
                        <button onClick={() => handleToggleCheating(true)} className="mr-2 bg-yellow-300 px-2 py-1">Enable Cheating Control</button>
                        <button onClick={() => handleToggleCheating(false)} className="bg-gray-300 px-2 py-1">Disable Cheating Control</button>
                    </div>

                    {/* Questions */}
                    <div className="my-2">
                        <h3 className="font-semibold">Questions</h3>
                        {questions.map(q => (
                            <p key={q.id}>{q.text}</p>
                        ))}
                        <div className="mt-2 flex flex-wrap gap-1">
                            <input type="text" placeholder="Question text" value={newQuestion.text}
                                   onChange={e => setNewQuestion({ ...newQuestion, text: e.target.value })}
                                   className="border p-1" />
                            <input type="text" placeholder="Option A" value={newQuestion.optionA}
                                   onChange={e => setNewQuestion({ ...newQuestion, optionA: e.target.value })}
                                   className="border p-1" />
                            <input type="text" placeholder="Option B" value={newQuestion.optionB}
                                   onChange={e => setNewQuestion({ ...newQuestion, optionB: e.target.value })}
                                   className="border p-1" />
                            <input type="text" placeholder="Option C" value={newQuestion.optionC}
                                   onChange={e => setNewQuestion({ ...newQuestion, optionC: e.target.value })}
                                   className="border p-1" />
                            <input type="text" placeholder="Option D" value={newQuestion.optionD}
                                   onChange={e => setNewQuestion({ ...newQuestion, optionD: e.target.value })}
                                   className="border p-1" />
                            <input type="text" placeholder="Correct Answer" value={newQuestion.correctAnswer}
                                   onChange={e => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
                                   className="border p-1" />
                            <input type="number" placeholder="Time Limit" value={newQuestion.timeLimit}
                                   onChange={e => setNewQuestion({ ...newQuestion, timeLimit: parseInt(e.target.value) })}
                                   className="border p-1 w-20" />
                            <button onClick={handleAddQuestion} className="bg-green-500 px-2 py-1 text-white">Add Question</button>
                        </div>
                    </div>

                    {/* Messages (WebSocket) */}
                    <div className="my-2">
                        <h3 className="font-semibold">Messages (WebSocket)</h3>
                        <ul>
                            {messages.map((m, i) => <li key={i}>{m?.content || JSON.stringify(m)}</li>)}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TeacherDashboard;

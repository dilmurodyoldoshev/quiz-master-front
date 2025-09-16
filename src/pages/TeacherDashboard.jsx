// src/pages/TeacherDashboard.jsx
import React, { useState, useEffect } from "react";

const API_URL = "http://localhost:8080/api/teacher";

export default function TeacherDashboard() {
    const [activeTab, setActiveTab] = useState("dashboard"); // dashboard | create | viewQuiz
    const [quizzes, setQuizzes] = useState([]);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [newQuiz, setNewQuiz] = useState({
        title: "",
        description: "",
        durationMinutes: 10,
        cheatingControl: false,
    });

    const [newQuestion, setNewQuestion] = useState({
        text: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        // default to A so backend enum AnswerType deserializes cleanly
        correctAnswer: "A",
    });

    const token = localStorage.getItem("token");

    // helper to parse backend JSON and throw helpful errors
    const handleResponse = async (res) => {
        const contentType = res.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
            const json = await res.json();
            if (!res.ok) throw new Error(json?.message || `HTTP ${res.status}`);
            return json;
        }
        // fallback
        if (!res.ok) throw new Error(res.statusText || `HTTP ${res.status}`);
        return null;
    };

    // ================= Fetch Quizzes =================
    useEffect(() => {
        const fetchQuizzes = async () => {
            if (!token) return;
            try {
                const res = await fetch(`${API_URL}/quizzes`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await handleResponse(res);
                setQuizzes(data?.data || []);
            } catch (err) {
                console.error("Failed to fetch quizzes:", err.message || err);
                alert("Failed to fetch quizzes: " + (err.message || err));
            }
        };
        fetchQuizzes();
    }, [token]);

    // ================= Validation =================
    const validateNewQuestion = () => {
        const { text, optionA, optionB, optionC, optionD, correctAnswer } = newQuestion;
        if (!text || !text.trim()) return alert("Question text is required") || false;
        if (!optionA || !optionA.trim()) return alert("Option A is required") || false;
        if (!optionB || !optionB.trim()) return alert("Option B is required") || false;
        if (!optionC || !optionC.trim()) return alert("Option C is required") || false;
        if (!optionD || !optionD.trim()) return alert("Option D is required") || false;
        if (!["A", "B", "C", "D"].includes((correctAnswer || "").toUpperCase()))
            return alert("Correct answer must be one of: A, B, C, D") || false;
        return true;
    };

    // ================= Quiz Handlers =================
    const handleCreateQuiz = async () => {
        if (!newQuiz.title || !newQuiz.title.trim()) return alert("Title is required");
        try {
            const res = await fetch(`${API_URL}/quizzes`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(newQuiz),
            });
            const data = await handleResponse(res);
            setQuizzes((prev) => [...prev, data.data]);
            setNewQuiz({ title: "", description: "", durationMinutes: 10, cheatingControl: false });
            setActiveTab("dashboard");
        } catch (err) {
            console.error("Failed to create quiz:", err.message || err);
            alert("Failed to create quiz: " + (err.message || err));
        }
    };

    const handleSelectQuiz = async (quiz) => {
        setSelectedQuiz(quiz);
        setActiveTab("viewQuiz");
        try {
            const res = await fetch(`${API_URL}/quizzes/${quiz.id}/questions`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await handleResponse(res);
            setQuestions(data?.data || []);
        } catch (err) {
            console.error("Failed to fetch questions:", err.message || err);
            alert("Failed to fetch questions: " + (err.message || err));
        }
    };

    const handleAddQuestion = async () => {
        if (!selectedQuiz) return alert("Select a quiz first");
        if (!validateNewQuestion()) return;

        try {
            const payload = {
                text: newQuestion.text.trim(),
                optionA: newQuestion.optionA.trim(),
                optionB: newQuestion.optionB.trim(),
                optionC: newQuestion.optionC.trim(),
                optionD: newQuestion.optionD.trim(),
                // backend expects enum name (A/B/C/D)
                correctAnswer: newQuestion.correctAnswer.trim().toUpperCase(),
            };

            const res = await fetch(`${API_URL}/quizzes/${selectedQuiz.id}/questions`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(payload),
            });

            const data = await handleResponse(res);
            // append returned entity
            setQuestions((prev) => [...prev, data.data]);
            setNewQuestion({ text: "", optionA: "", optionB: "", optionC: "", optionD: "", correctAnswer: "A" });
        } catch (err) {
            console.error("Failed to add question:", err.message || err);
            alert("Failed to add question: " + (err.message || err));
        }
    };

    const handleActivateQuiz = async () => {
        if (!selectedQuiz) return;
        try {
            const res = await fetch(`${API_URL}/quizzes/${selectedQuiz.id}/activate`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
            });
            await handleResponse(res);
            alert("Quiz activated!");
        } catch (err) {
            console.error("Failed to activate quiz:", err.message || err);
            alert("Failed to activate quiz: " + (err.message || err));
        }
    };

    const handleFinishQuiz = async () => {
        if (!selectedQuiz) return;
        try {
            const res = await fetch(`${API_URL}/quizzes/${selectedQuiz.id}/finish`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
            });
            await handleResponse(res);
            alert("Quiz finished!");
        } catch (err) {
            console.error("Failed to finish quiz:", err.message || err);
            alert("Failed to finish quiz: " + (err.message || err));
        }
    };

    const handleToggleCheating = async () => {
        if (!selectedQuiz) return;
        try {
            const enabled = !selectedQuiz.cheatingControl;
            const res = await fetch(`${API_URL}/quizzes/${selectedQuiz.id}/cheating?enabled=${enabled}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
            });
            await handleResponse(res);
            setSelectedQuiz((prev) => ({ ...prev, cheatingControl: enabled }));
        } catch (err) {
            console.error("Failed to toggle cheating:", err.message || err);
            alert("Failed to toggle cheating: " + (err.message || err));
        }
    };

    // ================= Render =================
    return (
        <div className="min-h-screen p-4 bg-blue-50">
            {/* Top Menu */}
            <nav className="flex gap-4 mb-6">
                <button onClick={() => setActiveTab("dashboard")} className="px-3 py-1 bg-blue-500 text-white rounded">Dashboard</button>
                <button onClick={() => setActiveTab("create")} className="px-3 py-1 bg-green-500 text-white rounded">Create Quiz</button>
                <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="px-3 py-1 bg-red-500 text-white rounded ml-auto">Logout</button>
            </nav>

            {/* Dashboard Tab */}
            {activeTab === "dashboard" && (
                <div>
                    <h2 className="text-2xl font-bold mb-4">Your Quizzes</h2>
                    <ul className="space-y-2">
                        {quizzes.map((q) => (
                            <li key={q.id} className="p-3 bg-white rounded shadow flex justify-between items-center">
                                <div>
                                    <h3 className="font-semibold">{q.title}</h3>
                                    <p>{q.description}</p>
                                    <p>Duration: {q.durationMinutes} min | Cheating Control: {q.cheatingControl ? "ON" : "OFF"}</p>
                                </div>
                                <button onClick={() => handleSelectQuiz(q)} className="bg-blue-400 px-2 py-1 rounded text-white">View / Add Questions</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Create Quiz Tab */}
            {activeTab === "create" && (
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-2xl font-bold mb-2">Create New Quiz</h2>
                    <input type="text" placeholder="Title" value={newQuiz.title} onChange={e => setNewQuiz({ ...newQuiz, title: e.target.value })} className="border p-2 mb-2 w-full" />
                    <textarea placeholder="Description" value={newQuiz.description} onChange={e => setNewQuiz({ ...newQuiz, description: e.target.value })} className="border p-2 mb-2 w-full" />
                    <input type="number" placeholder="Duration (minutes)" value={newQuiz.durationMinutes} onChange={e => setNewQuiz({ ...newQuiz, durationMinutes: parseInt(e.target.value) })} className="border p-2 mb-2 w-32" />
                    <label className="flex items-center gap-2 mb-2">
                        <input type="checkbox" checked={newQuiz.cheatingControl} onChange={e => setNewQuiz({ ...newQuiz, cheatingControl: e.target.checked })} />
                        Enable Cheating Control
                    </label>
                    <button onClick={handleCreateQuiz} className="bg-green-500 text-white px-3 py-1 rounded">Create Quiz</button>
                </div>
            )}

            {/* View / Add Questions Tab */}
            {activeTab === "viewQuiz" && selectedQuiz && (
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-bold mb-2">{selectedQuiz.title}</h2>
                    <p>{selectedQuiz.description}</p>
                    <p>Duration: {selectedQuiz.durationMinutes} min | Cheating Control: {selectedQuiz.cheatingControl ? "ON" : "OFF"}</p>

                    <div className="mt-2 flex gap-2">
                        <button onClick={handleActivateQuiz} className="bg-blue-500 text-white px-3 py-1 rounded">Activate Quiz</button>
                        <button onClick={handleFinishQuiz} className="bg-red-500 text-white px-3 py-1 rounded">Finish Quiz</button>
                        <button onClick={handleToggleCheating} className="bg-yellow-500 text-white px-3 py-1 rounded">Toggle Cheating</button>
                    </div>

                    <h3 className="font-semibold mt-4">Questions</h3>
                    <ul className="mb-2">
                        {questions.map((q, i) => <li key={i}>{i + 1}. {q.text}</li>)}
                    </ul>

                    <div className="mt-2 space-y-2">
                        <input type="text" placeholder="Question text" value={newQuestion.text} onChange={e => setNewQuestion({ ...newQuestion, text: e.target.value })} className="border p-1 w-full" />
                        <div className="flex gap-2">
                            <input type="text" placeholder="Option A" value={newQuestion.optionA} onChange={e => setNewQuestion({ ...newQuestion, optionA: e.target.value })} className="border p-1 flex-1" />
                            <input type="text" placeholder="Option B" value={newQuestion.optionB} onChange={e => setNewQuestion({ ...newQuestion, optionB: e.target.value })} className="border p-1 flex-1" />
                        </div>
                        <div className="flex gap-2">
                            <input type="text" placeholder="Option C" value={newQuestion.optionC} onChange={e => setNewQuestion({ ...newQuestion, optionC: e.target.value })} className="border p-1 flex-1" />
                            <input type="text" placeholder="Option D" value={newQuestion.optionD} onChange={e => setNewQuestion({ ...newQuestion, optionD: e.target.value })} className="border p-1 flex-1" />
                        </div>

                        {/* Correct answer select (A/B/C/D) */}
                        <label className="flex items-center gap-2">
                            <span className="mr-2">Correct:</span>
                            <select value={newQuestion.correctAnswer} onChange={e => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })} className="border p-1">
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                                <option value="D">D</option>
                            </select>
                        </label>

                        <button onClick={handleAddQuestion} className="bg-green-500 px-3 py-1 text-white rounded">Add Question</button>
                    </div>
                </div>
            )}
        </div>
    );
}

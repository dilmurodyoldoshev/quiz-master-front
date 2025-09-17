// src/pages/StudentDashboard.jsx
import React, { useEffect, useState } from "react";
import { API_URL } from "../config";

export default function StudentDashboard() {
    const [tab, setTab] = useState("quizzes"); // quizzes | attempt | results | profile
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(false);

    const [currentAttempt, setCurrentAttempt] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [submitting, setSubmitting] = useState({});

    const [leaderboard, setLeaderboard] = useState([]);
    const [resultEntry, setResultEntry] = useState(null);
    const [allResults, setAllResults] = useState([]); // ✅ barcha natijalar
    const [lastQuizId, setLastQuizId] = useState(null);

    const [profile, setProfile] = useState(null);

    const [error, setError] = useState("");
    const [info, setInfo] = useState("");

    const token = localStorage.getItem("token");

    const api = async (path, opts = {}) => {
        const res = await fetch(`${API_URL}${path}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: token ? `Bearer ${token}` : undefined,
                ...(opts.headers || {}),
            },
            ...opts,
        });
        if (res.status === 401 || res.status === 403) {
            throw new Error("Unauthorized or forbidden. Check token/role.");
        }
        if (!res.ok) {
            const txt = await res.text();
            throw new Error(txt || `${res.status} ${res.statusText}`);
        }
        const text = await res.text();
        return text ? JSON.parse(text) : null;
    };

    const getQuizId = (q, idx) => q?.id ?? q?.quizId ?? q?.quiz_id ?? (typeof idx === "number" ? idx : null);
    const getQuestionId = (q, idx) => q?.id ?? q?.questionId ?? q?.question_id ?? (typeof idx === "number" ? idx : null);
    const optionLetters = ["A", "B", "C", "D"];
    const optionText = (q, l) => ({ A: q.optionA, B: q.optionB, C: q.optionC, D: q.optionD })[l];

    // JWT parsing
    function parseJwt(t) {
        if (!t) throw new Error("No token");
        const payload = t.split(".")[1];
        if (!payload) throw new Error("Invalid token");
        const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
        try {
            return JSON.parse(decodeURIComponent(escape(json)));
        } catch {
            return JSON.parse(json);
        }
    }

    // 1. Quizzes
    useEffect(() => {
        const load = async () => {
            setLoading(true); setError("");
            try {
                const json = await api("/quizzes", { method: "GET" });
                const data = json?.data ?? json ?? [];
                console.log("FETCHED QUIZZES:", data);
                setQuizzes(Array.isArray(data) ? data : []);
            } catch (e) {
                setError("Quizlarni olishda xatolik: " + e.message);
            } finally {
                setLoading(false);
            }
        };
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 2. Results + Leaderboard
    useEffect(() => {
        if (tab !== "results") return;
        const loadResults = async () => {
            try {
                const rjson = await api("/results", { method: "GET" });
                const rdata = rjson?.data ?? rjson ?? [];
                setAllResults(Array.isArray(rdata) ? rdata : []);
            } catch (e) {
                setError("Natijalarni olishda xatolik: " + e.message);
            }
        };
        loadResults();

        const loadLb = async () => {
            const fallbackId = quizzes[0] && (quizzes[0].id ?? quizzes[0].quizId);
            const qid = lastQuizId ?? fallbackId;
            if (!qid) { setLeaderboard([]); return; }
            try {
                const json = await api(`/quizzes/${qid}/leaderboard`, { method: "GET" });
                const data = json?.data ?? json ?? [];
                setLeaderboard(Array.isArray(data) ? data : []);
            } catch (e) {
                setError("Leaderboard olishda xato: " + e.message);
            }
        };
        loadLb();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tab, lastQuizId, quizzes]);

    // 3. Profile
    useEffect(() => {
        if (tab !== "profile") return;
        const fetchProfile = async () => {
            try {
                const json = await api("/users/me", { method: "GET" });
                const p = json?.data ?? json ?? null;
                setProfile(p);
            } catch (e) {
                try {
                    const payload = parseJwt(token);
                    setProfile({ email: payload?.sub ?? payload?.email, ...payload });
                } catch {
                    setProfile(null);
                }
            }
        };
        fetchProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tab]);

    // Start quiz
    const startQuiz = async (quiz) => {
        setError(""); setInfo("");
        const idx = quizzes.indexOf(quiz);
        const quizId = getQuizId(quiz, idx);
        if (quizId == null) { setError("Quiz ID topilmadi"); return; }
        try {
            const resp = await api(`/quizzes/${quizId}/start`, { method: "POST" });
            const attempt = resp?.data ?? resp ?? null;

            const qresp = await api(`/quizzes/${quizId}/questions`, { method: "GET" });
            const qlist = qresp?.data ?? qresp ?? [];
            setQuestions(Array.isArray(qlist) ? qlist : []);

            setCurrentAttempt({ ...(attempt || {}), quizId, quizTitle: quiz.title });
            setAnswers({}); setSubmitting({}); setLeaderboard([]); setResultEntry(null);
            setLastQuizId(quizId);
            setTab("attempt");
            setInfo("Quiz boshlandi");
        } catch (e) {
            setError("Quiz boshlashda xato: " + e.message);
        }
    };

    // Submit answer
    const submitAnswer = async (question, selected) => {
        if (!currentAttempt?.id) { setError("Avval quizni boshlang"); return; }
        const qIdx = questions.indexOf(question);
        const questionId = getQuestionId(question, qIdx);
        if (questionId == null) { setError("Question ID topilmadi"); return; }

        setSubmitting((s) => ({ ...s, [questionId]: true }));
        try {
            await api(`/attempts/${currentAttempt.id}/questions/${questionId}/answer?selectedOption=${encodeURIComponent(selected)}`, { method: "POST" });
            setAnswers((a) => ({ ...a, [questionId]: selected }));
            setInfo("Javob qabul qilindi");
        } catch (e) {
            setError("Javob yuborishda xato: " + e.message);
        } finally {
            setSubmitting((s) => ({ ...s, [questionId]: false }));
        }
    };

    // Finish attempt
    const finishAttempt = async () => {
        if (!currentAttempt?.id) return;
        try {
            const resp = await api(`/attempts/${currentAttempt.id}/finish`, { method: "POST" });
            const finished = resp?.data ?? resp ?? {};

            try {
                const qid = currentAttempt.quizId ?? lastQuizId;
                if (qid) {
                    const lbjson = await api(`/quizzes/${qid}/leaderboard`, { method: "GET" });
                    const lb = lbjson?.data ?? lbjson ?? [];
                    setLeaderboard(Array.isArray(lb) ? lb : []);
                    const username = finished?.user?.username ?? finished?.user?.email ?? null;
                    const myEntry = Array.isArray(lb) ? lb.find((x) => x.username === username) : null;
                    setResultEntry(myEntry ?? finished);
                } else {
                    setResultEntry(finished);
                }
            } catch {
                setResultEntry(finished);
            }

            setCurrentAttempt(null); setQuestions([]); setAnswers({});
            setTab("results");
            setInfo("Quiz yakunlandi");
        } catch (e) {
            setError("Quizni tugatishda xato: " + e.message);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    return (
        <div className="min-h-screen p-6 bg-gray-50">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <header className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Student Dashboard</h1>
                    <div className="flex items-center gap-3">
                        <nav className="flex gap-2">
                            <button onClick={() => setTab("quizzes")} className={`px-3 py-1 rounded ${tab === "quizzes" ? "bg-blue-600 text-white" : "bg-white"}`}>Quizzes</button>
                            <button onClick={() => setTab("results")} className={`px-3 py-1 rounded ${tab === "results" ? "bg-blue-600 text-white" : "bg-white"}`}>Results</button>
                            <button onClick={() => setTab("profile")} className={`px-3 py-1 rounded ${tab === "profile" ? "bg-blue-600 text-white" : "bg-white"}`}>Profile</button>
                        </nav>
                        <button onClick={logout} className="px-3 py-1 bg-red-500 text-white rounded">Logout</button>
                    </div>
                </header>

                {/* Error / Info */}
                {error && <div className="mb-3 p-2 bg-red-100 text-red-800 rounded">{error}</div>}
                {info && <div className="mb-3 p-2 bg-green-100 text-green-800 rounded">{info}</div>}

                {/* Quizzes */}
                {tab === "quizzes" && (
                    <section className="mb-6">
                        <h2 className="text-xl font-semibold mb-3">Available Quizzes</h2>
                        {loading ? (
                            <div>Loading...</div>
                        ) : quizzes.length === 0 ? (
                            <div className="p-3 bg-white rounded shadow">No quizzes available</div>
                        ) : (
                            <ul className="space-y-3">
                                {quizzes.map((q, idx) => {
                                    const qid = getQuizId(q, idx);
                                    return (
                                        <li key={qid ?? idx} className="p-3 bg-white rounded shadow flex justify-between items-center">
                                            <div>
                                                <div className="font-semibold">{q.title}</div>
                                                <div className="text-sm text-gray-600">{q.description}</div>
                                                <div className="text-xs text-gray-400">ID: {qid ?? "n/a"}</div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm px-2 py-1 bg-gray-100 rounded">{q.durationMinutes ?? "—"} min</span>
                                                <button onClick={() => startQuiz(q)} disabled={!qid} className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50">Start</button>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </section>
                )}

                {/* Attempt */}
                {tab === "attempt" && currentAttempt && (
                    <section className="mb-6 bg-white p-4 rounded shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-2xl font-semibold">{currentAttempt.quizTitle}</h2>
                                <p className="text-sm text-gray-600">Attempt ID: {currentAttempt.id ?? "—"}</p>
                            </div>
                            <button onClick={finishAttempt} className="px-3 py-1 bg-red-600 text-white rounded">Finish Quiz</button>
                        </div>

                        <div className="space-y-4">
                            {questions.length === 0 ? (
                                <div className="text-sm text-gray-600">Savollar yuklanmadi.</div>
                            ) : (
                                questions.map((q, idx) => {
                                    const qid = getQuestionId(q, idx);
                                    return (
                                        <div key={qid ?? idx} className="p-3 border rounded bg-gray-50">
                                            <div className="flex items-start gap-3">
                                                <div className="min-w-[36px] font-bold text-blue-700">{idx + 1}.</div>
                                                <div className="flex-1">
                                                    <div className="font-medium mb-2">{q.text}</div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {optionLetters.map((letter) => {
                                                            const txt = optionText(q, letter);
                                                            if (!txt) return null;
                                                            const selected = answers[qid] === letter;
                                                            return (
                                                                <button
                                                                    key={letter}
                                                                    onClick={() => submitAnswer(q, letter)}
                                                                    disabled={!!answers[qid] || submitting[qid]}
                                                                    className={`px-3 py-1 rounded border ${selected ? "bg-green-200 border-green-400" : "bg-white"}`}
                                                                >
                                                                    <strong className="mr-2">{letter}.</strong> {txt}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                    {qid != null && answers[qid] && <div className="mt-2 text-sm text-gray-700">Siz tanladingiz: <strong>{answers[qid]}</strong></div>}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </section>
                )}

                {/* Results */}
                {tab === "results" && (
                    <section className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded shadow">
                            <h3 className="font-medium mb-2">Your Results</h3>
                            {allResults.length === 0 ? (
                                <div className="text-sm text-gray-600">Hozircha natija mavjud emas.</div>
                            ) : (
                                <ul className="text-sm space-y-2">
                                    {allResults.map((r, i) => (
                                        <li key={i} className="flex justify-between border-b pb-1">
                                            <span>{r.quizTitle ?? "Quiz"}:</span>
                                            <span>{r.score ?? "—"} ball</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="bg-white p-4 rounded shadow">
                            <h3 className="font-medium mb-2">Leaderboard</h3>
                            {leaderboard.length === 0 ? (
                                <div className="text-sm text-gray-600">Leaderboard mavjud emas.</div>
                            ) : (
                                <ol className="space-y-1 text-sm">
                                    {leaderboard.map((e, i) => (
                                        <li key={`lb-${e.username ?? i}`} className="flex justify-between">
                                            <div>{e.rank}. {e.username}</div>
                                            <div>{e.score}</div>
                                        </li>
                                    ))}
                                </ol>
                            )}
                        </div>
                    </section>
                )}

                {/* Profile */}
                {tab === "profile" && (
                    <section className="bg-white p-4 rounded shadow">
                        <h2 className="text-xl font-semibold mb-3">Profile</h2>
                        {profile ? (
                            <div className="text-sm">
                                <p><strong>Email:</strong> {profile.email ?? profile.sub ?? "—"}</p>
                                <p><strong>Username:</strong> {profile.username ?? profile.name ?? "—"}</p>
                            </div>
                        ) : (
                            <div className="text-sm text-gray-600">Profile topilmadi.</div>
                        )}
                        <div className="mt-3">
                            <button onClick={logout} className="px-3 py-1 bg-red-500 text-white rounded">Logout</button>
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}

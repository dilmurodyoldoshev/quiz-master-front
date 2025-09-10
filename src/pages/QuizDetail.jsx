import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQuizById, getQuizQuestions } from "../index.js";
import "../styles/quizDetail.css";

function QuizDetail() {
    const { quizId } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const quizData = await getQuizById(quizId);
                setQuiz(quizData);

                const qs = await getQuizQuestions(quizId);
                setQuestions(qs);
            } catch (err) {
                alert("Failed to fetch quiz details");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [quizId]);

    if (loading) return <p>Loading...</p>;
    if (!quiz) return <p>Quiz not found</p>;

    return (
        <div>
            <h1>{quiz.title}</h1>
            <p>{quiz.description}</p>
            <h3>Questions:</h3>
            <ul>
                {questions.map((q) => (
                    <li key={q.id}>{q.questionText}</li>
                ))}
            </ul>
        </div>
    );
}

export default QuizDetail;

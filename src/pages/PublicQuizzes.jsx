import React, { useEffect, useState } from "react";
import { getPublicQuizzes } from "../index.js";
import "../styles/publicQuizzes.css";

function PublicQuizzes() {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getPublicQuizzes();
                setQuizzes(data);
            } catch (err) {
                alert("Failed to fetch public quizzes");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <h1>Available Quizzes</h1>
            <ul>
                {quizzes.map((quiz) => (
                    <li key={quiz.id}>
                        <strong>{quiz.title}</strong> - {quiz.description}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default PublicQuizzes;

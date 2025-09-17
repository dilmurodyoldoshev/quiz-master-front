import { Link } from "react-router-dom";
import "../styles/landing.css";

export default function LandingPage() {
    return (
        <div className="landing-container">
            {/* Header */}
            <header className="landing-header">
                <h1 className="logo">Quiz Master</h1>
                <Link to="/login" className="login-btn">
                    Login
                </Link>
            </header>

            {/* Main content */}
            <main className="landing-main">
                <h2>Welcome to Quiz Master</h2>
                <p>
                    Test your knowledge, compete with friends and improve your
                    skills.
                </p>
                <Link to="/login" className="start-btn">
                    Start Quiz
                </Link>
            </main>
        </div>
    );
}

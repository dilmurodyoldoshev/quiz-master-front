import React, { useState } from "react";
import { loginUser } from "../api/index.js";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const { token, role } = await loginUser(email, password);

            // Muvaffaqiyatli login bo‘lganda token va rolni saqlaymiz
            localStorage.setItem("token", token);
            localStorage.setItem("role", role);

            // Role ga qarab yo‘naltirish
            switch(role) {
                case "ADMIN":
                    navigate("/admin");
                    break;
                case "TEACHER":
                    navigate("/teacher");
                    break;
                default:
                    navigate("/student");
            }

        } catch (err) {
            setError(err.message || "Login failed");
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1 className="login-title">🔐 Login</h1>
                {error && <p className="error-text">{error}</p>}
                <form onSubmit={handleLogin} className="login-form">
                    <input
                        type="email"
                        placeholder="📧 Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="🔑 Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Kirish</button>
                </form>
            </div>
        </div>
    );
}

export default Login;

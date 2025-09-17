// src/pages/AddUserPage.jsx
import React, { useState } from "react";
import "../styles/admin.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddUserPage = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [newUser, setNewUser] = useState({
        firstName: "",
        lastName: "",
        username: "",
        phone: "",
        email: "",
        password: "",
        role: "STUDENT"
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value });
    };

    // Simple email validation only
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        // Admin qo‘shib bo‘lmaydi
        if (newUser.role.toUpperCase() === "ADMIN") {
            setError("❌ Admin foydalanuvchi qo‘shib bo‘lmaydi!");
            setLoading(false);
            return;
        }

        // Validation: firstName, lastName, username, email
        if (!newUser.firstName || !newUser.lastName || !newUser.username) {
            setError("❌ Iltimos, ism, familiya va username maydonlarini to‘ldiring!");
            setLoading(false);
            return;
        }

        if (!validateEmail(newUser.email)) {
            setError("❌ Iltimos, to‘g‘ri email kiriting!");
            setLoading(false);
            return;
        }

        try {
            const payload = {
                firstName: newUser.firstName.trim(),
                lastName: newUser.lastName.trim(),
                username: newUser.username.trim(),
                phone: newUser.phone.trim(),
                email: newUser.email.trim(),
                password: newUser.password,
                role: newUser.role.toUpperCase()
            };

            console.log("Sending payload:", payload);

            await axios.post("http://localhost:8080/api/users/create", payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            setSuccess(`✅ ${newUser.username} muvaffaqiyatli qo‘shildi!`);

            setNewUser({
                firstName: "",
                lastName: "",
                username: "",
                phone: "",
                email: "",
                password: "",
                role: "STUDENT"
            });

            navigate("/admin/userlist");

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || err.message || "Foydalanuvchi qo‘shishda xatolik");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-container">
            <h1 className="admin-title">➕ Yangi foydalanuvchi qo‘shish</h1>

            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleSubmit} className="form-grid">
                <label>
                    📝 First Name
                    <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={newUser.firstName}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    📝 Last Name
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={newUser.lastName}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    👤 Username
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={newUser.username}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    📞 Phone
                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone"
                        value={newUser.phone}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    📧 Email
                    <input
                        type="email"
                        name="email"
                        placeholder="example@mail.com"
                        value={newUser.email}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    🔑 Password
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={newUser.password}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Role
                    <select name="role" value={newUser.role} onChange={handleChange} required>
                        <option value="STUDENT">🎓 STUDENT</option>
                        <option value="TEACHER">👨‍🏫 TEACHER</option>
                    </select>
                </label>

                <button type="submit" className="btn-green" disabled={loading}>
                    {loading ? "Yuklanmoqda..." : "Qo‘shish"}
                </button>
            </form>
        </div>
    );
};

export default AddUserPage;

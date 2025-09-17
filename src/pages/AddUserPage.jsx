// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import UserList from "../components/UserList.jsx";
import axios from "axios";
import "../styles/admin.css";

function AdminDashboard() {
    const [users, setUsers] = useState([]);
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

    const token = localStorage.getItem("token");
    const API_URL = "http://localhost:8080/api/users/create";

    // ================= Fetch Users =================
    const fetchUsers = async () => {
        setError(""); setSuccess("");
        if (!token) return;

        try {
            const res = await axios.get("http://localhost:8080/api/users", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data.data || []);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Foydalanuvchilarni olishda xatolik");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [token]);

    // ================= Add User =================
    const handleAddUser = async (e) => {
        e.preventDefault();
        setError(""); setSuccess("");

        if (newUser.role === "ADMIN") {
            setError("❌ Admin foydalanuvchi qo‘shib bo‘lmaydi!");
            return;
        }

        try {
            const payload = { ...newUser };
            await axios.post(API_URL, payload, {
                headers: { Authorization: `Bearer ${token}` }
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
            fetchUsers();
        } catch (err) {
            console.error(err.response?.data || err);
            setError(err.response?.data?.message || "Foydalanuvchini qo‘shishda xatolik");
        }
    };

    return (
        <div className="admin-container">
            <h1 className="admin-title">👨‍💻 Admin Dashboard</h1>

            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            {/* ================= Add User Form ================= */}
            <div className="form-card">
                <h2>➕ Yangi foydalanuvchi qo‘shish</h2>
                <form onSubmit={handleAddUser} className="form-grid">
                    <label>
                        📝 First Name
                        <input
                            type="text"
                            value={newUser.firstName}
                            onChange={e => setNewUser({ ...newUser, firstName: e.target.value })}
                            placeholder="First Name"
                            required
                        />
                    </label>

                    <label>
                        📝 Last Name
                        <input
                            type="text"
                            value={newUser.lastName}
                            onChange={e => setNewUser({ ...newUser, lastName: e.target.value })}
                            placeholder="Last Name"
                            required
                        />
                    </label>

                    <label>
                        👤 Username
                        <input
                            type="text"
                            value={newUser.username}
                            onChange={e => setNewUser({ ...newUser, username: e.target.value })}
                            placeholder="Username"
                            required
                        />
                    </label>

                    <label>
                        📞 Phone
                        <input
                            type="text"
                            value={newUser.phone}
                            onChange={e => setNewUser({ ...newUser, phone: e.target.value })}
                            placeholder="Phone"
                            required
                        />
                    </label>

                    <label>
                        📧 Email
                        <input
                            type="email"
                            value={newUser.email}
                            onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                            placeholder="Email"
                            required
                        />
                    </label>

                    <label>
                        🔑 Password
                        <input
                            type="password"
                            value={newUser.password}
                            onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                            placeholder="Password"
                            required
                        />
                    </label>

                    <label>
                        Role
                        <select
                            value={newUser.role}
                            onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                        >
                            <option value="TEACHER">👨‍🏫 TEACHER</option>
                            <option value="STUDENT">🎓 STUDENT</option>
                        </select>
                    </label>

                    <button type="submit" className="btn-green">Qo‘shish</button>
                </form>
            </div>

            {/* ================= Users List ================= */}
            <div className="table-card">
                <h2>📋 Foydalanuvchilar ro‘yxati</h2>
                <UserList users={users} showDelete={false} />
            </div>
        </div>
    );
}

export default AdminDashboard;

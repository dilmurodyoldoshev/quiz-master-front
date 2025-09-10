// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { getUsers, addUser, deleteUser } from "../index.js";
import "../styles/admin.css";

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({
        username: "",
        email: "",
        password: "",
        role: "STUDENT",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const token = localStorage.getItem("token");

    // ================= Fetch Users =================
    const fetchUsers = async () => {
        try {
            if (!token) return;
            const data = await getUsers(token);
            setUsers(data?.data || []); // undefined bo‘lsa bo‘sh array
        } catch (err) {
            console.error(err);
            setError("Foydalanuvchilarni olishda xatolik");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [token]);

    // ================= Add User =================
    const handleAddUser = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (newUser.role === "ADMIN") {
            setError("❌ Admin foydalanuvchi qo‘shib bo‘lmaydi!");
            return;
        }

        try {
            await addUser(newUser, token);
            setSuccess(`✅ ${newUser.username} muvaffaqiyatli qo‘shildi!`);
            setNewUser({ username: "", email: "", password: "", role: "STUDENT" });

            // Foydalanuvchilar ro‘yxatini qayta olish
            fetchUsers();
        } catch (err) {
            console.error(err);
            setError(err.message || "Foydalanuvchini qo‘shishda xatolik");
        }
    };

    // ================= Delete User =================
    const handleDelete = async (id) => {
        setError("");
        setSuccess("");
        try {
            await deleteUser(id, token);
            setSuccess("🗑️ Foydalanuvchi o‘chirildi!");
            setUsers(prev => prev.filter(u => u?.id !== id));
        } catch (err) {
            console.error(err);
            setError(err.message || "Foydalanuvchini o‘chirishda xatolik");
        }
    };

    return (
        <div className="admin-container">
            <h1 className="admin-title">👨‍💻 Admin Dashboard</h1>

            {/* Alerts */}
            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            {/* Add User Form */}
            <div className="form-card">
                <h2>➕ Yangi foydalanuvchi qo‘shish</h2>
                <form onSubmit={handleAddUser} className="form-grid">
                    <input
                        type="text"
                        placeholder="👤 Username"
                        value={newUser.username}
                        onChange={e => setNewUser({ ...newUser, username: e.target.value })}
                        required
                    />
                    <input
                        type="email"
                        placeholder="📧 Email"
                        value={newUser.email}
                        onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                        required
                    />
                    <input
                        type="password"
                        placeholder="🔑 Password"
                        value={newUser.password}
                        onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                        required
                    />
                    <select
                        value={newUser.role}
                        onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                    >
                        <option value="TEACHER">👨‍🏫 TEACHER</option>
                        <option value="STUDENT">🎓 STUDENT</option>
                    </select>
                    <button type="submit" className="btn-green">Qo‘shish</button>
                </form>
            </div>

            {/* Users Table */}
            <div className="table-card">
                <h2>📋 Foydalanuvchilar ro‘yxati</h2>
                <div className="table-wrapper">
                    <table>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {(users || []).map(u => (
                            <tr key={u?.id}>
                                <td>{u?.id}</td>
                                <td>{u?.username}</td>
                                <td>{u?.email}</td>
                                <td>
                                        <span className={`role-tag ${u?.role === "TEACHER" ? "role-teacher" : "role-student"}`}>
                                            {u?.role}
                                        </span>
                                </td>
                                <td>
                                    <button onClick={() => handleDelete(u?.id)} className="btn-delete">
                                        O‘chirish
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {(!users || users.length === 0) && (
                            <tr>
                                <td colSpan={5} className="empty-text">
                                    🚫 Hozircha foydalanuvchi yo‘q
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;

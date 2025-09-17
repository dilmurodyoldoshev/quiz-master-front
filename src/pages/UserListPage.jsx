// src/pages/UserListPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import UserList from "../components/UserList.jsx";
import "../styles/admin.css";

function UserListPage() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("token");
    const API_URL = "http://localhost:8080/api/users"; // umumiy endpoint

    // ================= Fetch Users =================
    const fetchUsers = async () => {
        setError("");
        setLoading(true);

        if (!token) {
            setError("❌ Login qilishingiz kerak");
            setLoading(false);
            return;
        }

        try {
            const res = await axios.get(API_URL, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(res.data.data || []);
        } catch (err) {
            console.error(err);
            if (err.response?.status === 403) {
                setError("❌ Sizda foydalanuvchilarni ko‘rish huquqi yo‘q");
            } else {
                setError(err.response?.data?.message || "Foydalanuvchilarni olishda xato");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [token]);

    // ================= Search Filter =================
    const filteredUsers = users.filter(
        (u) =>
            u.firstName.toLowerCase().includes(search.toLowerCase()) ||
            u.lastName.toLowerCase().includes(search.toLowerCase()) ||
            u.username.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase()) ||
            u.phone.toLowerCase().includes(search.toLowerCase()) ||
            u.role.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="admin-container">
            <h1 className="admin-title">📋 Foydalanuvchilar Ro'yxati</h1>

            {error && <div className="alert alert-error">{error}</div>}
            {loading && <p>Loading...</p>}

            <UserList users={filteredUsers} showDelete={false} />
        </div>
    );
}

export default UserListPage;

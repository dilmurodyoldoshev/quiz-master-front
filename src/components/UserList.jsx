// src/components/UserList.jsx
import React, { useState } from "react";
import "../styles/admin.css";

const UserList = ({ users }) => {
    const [search, setSearch] = useState("");

    if (!users || users.length === 0) {
        return <p className="empty-text">🚫 Hozircha foydalanuvchi yo‘q</p>;
    }

    // qidiruv/filter
    const filteredUsers = users.filter((u) => {
        const q = search.toLowerCase();
        return (
            u.firstName?.toLowerCase().includes(q) ||
            u.lastName?.toLowerCase().includes(q) ||
            u.username?.toLowerCase().includes(q) ||
            u.email?.toLowerCase().includes(q) ||
            u.phone?.toLowerCase().includes(q) ||
            u.role?.toLowerCase().includes(q)
        );
    });

    return (
        <div className="userlist-container">
            <h2 className="page-title">👥 Foydalanuvchilar ro‘yxati</h2>

            {/* qidiruv input */}
            <div className="search-box">
                <input
                    type="text"
                    placeholder="🔍 Ism, username, email, telefon yoki role bo‘yicha qidiring..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="table-wrapper">
                <table>
                    <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Role</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((u) => (
                            <tr key={u.id}>
                                <td>{u.firstName}</td>
                                <td>{u.lastName}</td>
                                <td>{u.username}</td>
                                <td>{u.email}</td>
                                <td>{u.phone}</td>
                                <td>
                                        <span
                                            className={`role-tag ${
                                                u.role === "ADMIN"
                                                    ? "role-admin"
                                                    : u.role === "TEACHER"
                                                        ? "role-teacher"
                                                        : "role-student"
                                            }`}
                                        >
                                            {u.role}
                                        </span>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="empty-text">
                                ❌ Hech narsa topilmadi
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserList;

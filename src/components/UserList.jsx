// src/components/UserList.jsx
import React from "react";
import "../styles/admin.css";

const UserList = ({ users }) => {
    if (!users || users.length === 0) {
        return <p className="empty-text">🚫 Hozircha foydalanuvchi yo‘q</p>;
    }

    return (
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
                {users.map((u) => (
                    <tr key={u.id}>
                        <td>{u.firstName}</td>
                        <td>{u.lastName}</td>
                        <td>{u.username}</td>
                        <td>{u.email}</td>
                        <td>{u.phone}</td>
                        <td>
                                <span className={`role-tag ${u.role === "TEACHER" ? "role-teacher" : "role-student"}`}>
                                    {u.role}
                                </span>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserList;

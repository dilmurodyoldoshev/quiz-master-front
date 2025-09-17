// src/config.js
const raw =
    (typeof process !== "undefined" && process.env?.REACT_APP_API_URL) ||
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
    window.__API_URL__ ||
    "http://localhost:8080/api/student";

export const API_URL = String(raw).replace(/\/$/, "");

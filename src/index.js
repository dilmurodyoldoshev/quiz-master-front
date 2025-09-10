// src/api/index.js
import axios from "axios";

const API_URL = "http://localhost:8080/api"; // backend URL ni moslashtiring

// ======================== AUTH ========================
export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, {
            usernameOrEmail: email,
            password,
        });

        const { token, role } = response.data.data || {};
        if (!token) throw new Error("Token not returned from server");
        if (!role) throw new Error("Role not found in response");

        return { token, role };
    } catch (error) {
        console.error("Login error:", error);
        if (error.response?.data) throw new Error(error.response.data.message);
        throw new Error(error.message || "Login failed");
    }
};

// ======================== USERS ========================
export const getUsers = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/users`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.data; // data ichida users array qaytadi
    } catch (err) {
        console.error("Failed to fetch users", err);
        throw err;
    }
};

export const addUser = async (user, token) => {
    try {
        const response = await axios.post(`${API_URL}/users/create`, user, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.data;
    } catch (err) {
        console.error("Failed to add user", err);
        throw err;
    }
};

export const deleteUser = async (id, token) => {
    try {
        const response = await axios.delete(`${API_URL}/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (err) {
        console.error("Failed to delete user", err);
        throw err;
    }
};

export const getUserById = async (id, token) => {
    try {
        const response = await axios.get(`${API_URL}/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.data;
    } catch (err) {
        console.error("Failed to fetch user by id", err);
        throw err;
    }
};

// ======================== TEACHER ========================
export const getTeacherQuizzes = async (token) => {
    const response = await axios.get(`${API_URL}/teacher/quizzes`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
};

export const createQuiz = async (quiz, token) => {
    const response = await axios.post(`${API_URL}/teacher/quizzes/creat`, quiz, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
};

export const activateQuiz = async (quizId, token) => {
    const response = await axios.put(`${API_URL}/teacher/quizzes/${quizId}/activate`, {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const finishQuiz = async (quizId, token) => {
    const response = await axios.put(`${API_URL}/teacher/quizzes/${quizId}/finish`, {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const toggleCheating = async (quizId, enabled, token) => {
    const response = await axios.put(`${API_URL}/teacher/quizzes/${quizId}/cheating?enabled=${enabled}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const addQuestion = async (quizId, question, token) => {
    const response = await axios.post(`${API_URL}/teacher/quizzes/${quizId}/questions/create`, question, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
};

export const updateQuestion = async (quizId, questionId, question, token) => {
    const response = await axios.put(`${API_URL}/teacher/quizzes/${quizId}/questions/${questionId}/update`, question, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
};

export const getQuestions = async (quizId, token) => {
    const response = await axios.get(`${API_URL}/teacher/quizzes/${quizId}/questions`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
};

export const getResults = async (quizId, token) => {
    const response = await axios.get(`${API_URL}/teacher/quizzes/${quizId}/results`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
};

// ======================== STUDENT ========================
export const startAttempt = async (quizId, token) => {
    const response = await axios.post(`${API_URL}/student/quizzes/${quizId}/start`, {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
};

export const submitAnswer = async (questionId, selectedOption, token) => {
    const response = await axios.post(`${API_URL}/student/questions/${questionId}/answer`, { selectedOption }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
};

export const finishAttempt = async (attemptId, token) => {
    const response = await axios.put(`${API_URL}/student/attempts/${attemptId}/finish`, {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
};

export const getResult = async (attemptId, token) => {
    const response = await axios.get(`${API_URL}/student/attempts/${attemptId}/result`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
};

// ======================== PUBLIC QUIZZES ========================
export const getPublicQuizzes = async () => {
    const response = await axios.get(`${API_URL}/quizzes`);
    return response.data.data;
};

export const getQuizById = async (quizId) => {
    const response = await axios.get(`${API_URL}/quizzes/${quizId}`);
    return response.data.data;
};

export const getQuizQuestions = async (quizId) => {
    const response = await axios.get(`${API_URL}/quizzes/${quizId}/questions`);
    return response.data.data;
};

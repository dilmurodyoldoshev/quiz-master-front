import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";

// Admin
import AdminLayout from "./pages/AdminLayout";
import UserListPage from "./pages/UserListPage";
import AddUserPage from "./pages/AddUserPage";
import ProfilePage from "./pages/ProfilePage";

// Teacher
import TeacherLayout from "./pages/TeacherLayout.jsx";
import MyQuizzesPage from "./pages/MyQuizzesPage.jsx";
import CreateQuizPage from "./pages/CreateQuizPage.jsx";
import AddQuestionPage from "./pages/AddQuestionPage.jsx";
import ViewQuizPage from "./pages/ViewQuizPage.jsx";
import ViewResultsPage from "./pages/ViewResultsPage.jsx";

// Student
import StudentLayout from "./pages/StudentLayout";
import QuizListPage from "./pages/QuizListPage";
import QuizDetailPage from "./pages/QuizDetailPage";
import QuizQuestionsPage from "./pages/QuizQuestionsPage";
import QuestionDetailPage from "./pages/QuestionDetailPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import ResultsPage from "./pages/ResultsPage";
import FinishAttemptPage from "./pages/FinishAttemptPage";
import AttemptsPage from "./pages/AttemptsPage.jsx"; // yangi component

const PrivateRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || !role) return <Navigate to="/login" />;
    if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/login" />;

    return children;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Landing page */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />

                {/* Admin routes */}
                <Route path="/admin" element={
                    <PrivateRoute allowedRoles={["ADMIN"]}>
                        <AdminLayout />
                    </PrivateRoute>
                }>
                    <Route path="userlist" element={<UserListPage />} />
                    <Route path="adduser" element={<AddUserPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                </Route>

                {/* Teacher routes */}
                <Route path="/teacher" element={
                    <PrivateRoute allowedRoles={["TEACHER"]}>
                        <TeacherLayout />
                    </PrivateRoute>
                }>
                    <Route path="quizzes" element={<MyQuizzesPage />} />
                    <Route path="quizzes/:quizId/questions" element={<AddQuestionPage />} />
                    <Route path="quizzes/:quizId/view" element={<ViewQuizPage />} />
                    <Route path="quizzes/:quizId/results" element={<ViewResultsPage />} />
                    <Route path="create-quiz" element={<CreateQuizPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                </Route>

                {/* Student routes */}
                <Route path="/student" element={
                    <PrivateRoute allowedRoles={["STUDENT"]}>
                        <StudentLayout />
                    </PrivateRoute>
                }>
                    <Route path="quizzes" element={<QuizListPage />} />
                    <Route path="quizzes/:quizId" element={<QuizDetailPage />} />
                    <Route path="quizzes/:quizId/questions/:attemptId" element={<QuizQuestionsPage />} />
                    <Route path="quizzes/:quizId/questions/:questionId/:attemptId" element={<QuestionDetailPage />} />
                    <Route path="finish/:attemptId" element={<FinishAttemptPage />} />
                    <Route path="quizzes/:quizId/leaderboard" element={<LeaderboardPage />} />
                    <Route path="results" element={<ResultsPage />} />
                    <Route path="attempts" element={<AttemptsPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

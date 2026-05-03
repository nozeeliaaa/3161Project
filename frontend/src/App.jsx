import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import CalendarPage from "./pages/courses/CalendarPage";
import CourseDetailPage from "./pages/courses/CourseDetailPage";
import CoursesPage from "./pages/courses/CoursesPage";
import ForumThreadsPage from "./pages/forums/ForumThreadsPage";
import ThreadDetailPage from "./pages/forums/ThreadDetailPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import MembersPage from "./pages/courses/MembersPage";
import ProtectedRoute from "./components/navigation/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:courseId" element={<CourseDetailPage />} />
          <Route path="/forums" element={<CoursesPage compactForums />} />
          <Route path="/forums/:forumId/threads" element={<ForumThreadsPage />} />
          <Route path="/threads/:threadId" element={<ThreadDetailPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/members" element={<MembersPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

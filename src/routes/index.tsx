import DashboardPage from "@/pages/dashboard";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import type { JSX } from "react";
import type React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "@/pages/landing";
import WorkspacePage from "@/pages/workspace";
import { useAppSelector } from "@/states/hooks";

export const AppRoutes: React.FC = () => {
    const currentUser = useAppSelector((state) => state.app.currentUser);

    return (
        <Routes>
            {/* Protected Routes */}
            <Route path="/" element={currentUser ? <Navigate to="/dashboard" replace /> : <LandingPage />}></Route>
            <Route path="/dashboard/workspace/:workspaceId" element={<ProtectedRoute><><WorkspacePage /></></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><><DashboardPage /></></ProtectedRoute>} />
            <Route path="/login" element={currentUser ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
            <Route path="/register" element={currentUser ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />
        </Routes>
    )
}

interface PropsInterface {
    children: JSX.Element;
}

export const ProtectedRoute = ({ children }: PropsInterface) => {
    const currentUser = useAppSelector((state) => state.app.currentUser);
    // const { currentUser } = useAuthContext();
    return currentUser ? children : <Navigate to="/" replace />;
};

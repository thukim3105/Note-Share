import { Navigate, Route, Routes } from "react-router-dom";
import { AdminPage } from "./components/pages/AdminPage.jsx";
import { LandingPage } from "./components/pages/LandingPage.jsx";
import { LoginPage } from "./components/pages/LoginPage.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/auth" element={<LoginPage />} />
      <Route path="/*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

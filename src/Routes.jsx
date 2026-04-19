import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AdminPage } from "./components/pages/AdminPage.jsx";
import { LoginPage } from "./components/pages/LoginPage.jsx";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/auth" element={<LoginPage />} />
        <Route path="/*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

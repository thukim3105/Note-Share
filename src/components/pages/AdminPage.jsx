import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Admin } from "../admin/Admin.jsx";
import { AdminHeader } from "../admin/AdminHeader.jsx";

export function AdminPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRefresh = () => {
    setLoading(true);
    window.location.reload();
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin_token");
    }
    navigate("/auth");
  };

  return (
    <main className="min-h-screen bg-[#f5f4ed] text-[#141413] flex flex-col">
      <div className="sticky top-0 z-40">
        <AdminHeader
          onRefresh={handleRefresh}
          onLogout={handleLogout}
          loading={loading}
        />
      </div>

      <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-screen-2xl flex flex-col gap-6">
          <Admin />
        </div>
      </div>
    </main>
  );
}
import { Admin } from "../admin/Admin.jsx";

export function AdminPage() {
  return (
    <main className="min-h-screen bg-[#f5f4ed] text-[#141413]">
      <div className="grid min-h-screen place-items-center px-6 py-10">
        <div className="w-full max-w-screen-2xl">
          <Admin />
        </div>
      </div>
    </main>
  );
}

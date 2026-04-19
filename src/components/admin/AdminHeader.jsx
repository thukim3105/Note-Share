import { Button } from "../ui/Button.jsx";
import { Heading, Label, Text } from "../ui/Typography.jsx";

export function AdminHeader({
  onRefresh,
  onLogout,
  loading = false,
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#e8e6dc] bg-[#f5f4ed]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-screen-2xl flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
        
        {/* Left: Title */}
        <div className="space-y-1">
          <Heading className="text-[1.8rem]">
            User management dashboard
          </Heading>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            className="w-auto"
            onClick={onRefresh}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </Button>

          <Button
            type="button"
            className="w-auto bg-[#141413] hover:bg-[#30302e]"
            onClick={onLogout}
            disabled={loading}
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
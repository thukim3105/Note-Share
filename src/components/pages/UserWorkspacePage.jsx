import { Heading, Text } from "../ui/Typography.jsx";

export function UserWorkspacePage() {
  return (
    <main className="min-h-screen bg-[#f5f4ed] text-[#141413] flex items-center justify-center px-6">
      <div className="w-full max-w-3xl rounded-3xl border border-[#f0eee6] bg-[#faf9f5] px-8 py-14 text-center shadow-sm">
        <Heading className="mx-auto">Welcome to your workspace</Heading>
        <Text className="mt-4 text-base text-[#5e5d59]">
          Chào mừng bạn! Đây là trang làm việc của user, đang chờ được hoàn thiện.
        </Text>
      </div>
    </main>
  );
}

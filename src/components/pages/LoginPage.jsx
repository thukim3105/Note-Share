import { LoginForm } from "../auth/LoginForm.jsx";
import { Card } from "../ui/Card.jsx";
import { Divider } from "../ui/Divider.jsx";
import { Heading, Label } from "../ui/Typography.jsx";

export function LoginPage() {
  return (
    <main className="min-h-screen bg-[#f5f4ed] text-[#141413]">
      <div className="flex min-h-screen items-center justify-center px-6">
        <Card>
          <div className="space-y-8">
            <div className="space-y-3 text-center">
              <Label className="mx-auto">NOTE SHARE</Label>
              <Heading className="max-w-120 mx-auto">Notes and sharing</Heading>
              <Divider variant="short" />
            </div>

            <LoginForm />
          </div>
        </Card>
      </div>
    </main>
  );
}

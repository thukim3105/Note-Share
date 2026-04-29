import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleError } from "../../api/errorHandler.js";
import { loginAdmin } from "../../api/userService.js";
import { LoginForm } from "../auth/LoginForm.jsx";
import { Card } from "../ui/Card.jsx";
import { Divider } from "../ui/Divider.jsx";
import { Heading, Label, Text } from "../ui/Typography.jsx";

export function LoginPage() {
  const navigate = useNavigate();
  const [authForm, setAuthForm] = useState({ email: "", password: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setAuthForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setSubmitted(true);
    setError("");

    if (!authForm.email || !authForm.password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const result = await loginAdmin({
        username: authForm.email,
        password: authForm.password,
      });

      const accessToken = result.access_token || result.token;
      if (!accessToken) {
        throw new Error("Authentication failed. Please try again.");
      }

      localStorage.setItem("access_token", accessToken);
      navigate("/workspace");
    } catch (err) {
      handleError(err);
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f4ed] text-[#141413]">
      <div className="flex min-h-screen items-center justify-center px-6">
        <Card className="w-[30vw] max-w-md rounded-3xl border border-[#f0eee6] bg-[#faf9f5] px-8 py-10">
          <div className="space-y-8">
            <div className="space-y-3 text-center">
              <Label className="mx-auto">NOTE SHARE</Label>
              <Heading className="mx-auto">
                Notes and sharing
              </Heading>
              <Divider variant="short" />
            </div>

            {error ? (
              <Text className="text-center text-sm text-[#b53333]">{error}</Text>
            ) : null}

            <LoginForm
              form={authForm}
              onChange={handleChange}
              onSubmit={handleLogin}
              submitted={submitted}
              loading={loading}
            />
          </div>
        </Card>
      </div>
    </main>
  );
}
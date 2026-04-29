import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUser } from "../../api/userService.js";
import { handleError } from "../../api/errorHandler.js";
import { Button } from "../ui/Button.jsx";
import { Card } from "../ui/Card.jsx";
import { Divider } from "../ui/Divider.jsx";
import { InputField } from "../ui/InputField.jsx";
import { Heading, Label, Text } from "../ui/Typography.jsx";

export function RegisterPage() {
  const navigate = useNavigate();
  const [userForm, setUserForm] = useState({
    email: "",
    name: "",
    password: "",
    position: "",
    avatar_url: "",
    bio: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserForm((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccessMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitted(true);
    setError("");
    setSuccessMessage("");

    if (!userForm.email || !userForm.password) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);

    try {
      await createUser(userForm);
      setSuccessMessage("Registration successful. You can now log in.");
      setUserForm({
        email: "",
        name: "",
        password: "",
        position: "",
        avatar_url: "",
        bio: "",
      });
      setSubmitted(false);
      navigate("/auth");
    } catch (err) {
      handleError(err);
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const emailError = submitted && !userForm.email ? "Please enter your email." : "";
  const passwordError = submitted && !userForm.password ? "Please enter your password." : "";

  return (
    <main className="min-h-screen bg-[#f5f4ed] text-[#141413] flex items-center justify-center px-6">
      <Card className="w-full max-w-2xl rounded-3xl border border-[#f0eee6] bg-[#faf9f5] px-8 py-10 shadow-sm">
        <div className="space-y-8">
          <div className="space-y-3 text-center">
            <Label className="mx-auto">CREATE ACCOUNT</Label>
            <Heading className="mx-auto">Register a new user</Heading>
            <Divider variant="short" />
          </div>

          {error ? (
            <Text className="text-center text-sm text-[#b53333]">{error}</Text>
          ) : null}

          {successMessage ? (
            <Text className="text-center text-sm text-[#2f6f3a]">{successMessage}</Text>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              id="register-email"
              name="email"
              label="Email"
              type="email"
              value={userForm.email}
              onChange={handleChange}
              placeholder="user@example.com"
              error={emailError}
              required
            />
            <InputField
              id="register-name"
              name="name"
              label="Name"
              value={userForm.name}
              onChange={handleChange}
              placeholder="John Doe"
            />
            <InputField
              id="register-position"
              name="position"
              label="Position"
              value={userForm.position}
              onChange={handleChange}
              placeholder="Senior Developer"
            />
            <InputField
              id="register-avatar"
              name="avatar_url"
              label="Avatar URL"
              value={userForm.avatar_url}
              onChange={handleChange}
              placeholder="https://example.com/avatar.jpg"
            />
            <InputField
              id="register-bio"
              name="bio"
              label="Bio"
              value={userForm.bio}
              onChange={handleChange}
              placeholder="Short profile biography"
            />
            <InputField
              id="register-password"
              name="password"
              label="Password"
              type="password"
              value={userForm.password}
              onChange={handleChange}
              placeholder="Enter password"
              error={passwordError}
              required
            />

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
              <Button type="submit" disabled={loading}>
                Register
              </Button>
              <Text className="text-sm text-[#5e5d59]">
                Already registered? <Link to="/auth" className="font-medium text-[#c96442] hover:text-[#b24f31]">Sign in</Link>
              </Text>
            </div>
          </form>
        </div>
      </Card>
    </main>
  );
}

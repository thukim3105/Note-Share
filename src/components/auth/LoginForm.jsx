import { useState } from "react";
import { Button } from "../ui/Button.jsx";
import { Divider } from "../ui/Divider.jsx";
import { InputField } from "../ui/InputField.jsx";
import { Text } from "../ui/Typography.jsx";

export function LoginForm({
  form: externalForm,
  onChange,
  onSubmit,
  submitted = false,
  error = "",
  loading = false,
  submitLabel = "SIGN IN",
}) {
  const [localForm, setLocalForm] = useState({ email: "", password: "" });
  const [internalSubmitted, setInternalSubmitted] = useState(false);

  const form = externalForm || localForm;
  const isSubmitted = submitted || internalSubmitted;

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (onChange) {
      onChange(event);
      return;
    }

    setLocalForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setInternalSubmitted(true);
    if (onSubmit) {
      onSubmit(event);
    }
  };

  const emailError =
    isSubmitted && !form?.email ? "Please enter your email address." : "";
  const passwordError =
    isSubmitted && !form?.password ? "Please enter your password." : "";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <InputField
        id="email"
        label="EMAIL ADDRESS"
        type="email"
        value={form?.email || ""}
        onChange={handleChange}
        placeholder="scholar@manuscript.org"
        error={emailError}
      />

      <InputField
        id="password"
        label="PASSWORD"
        type="password"
        value={form?.password || ""}
        onChange={handleChange}
        placeholder="Enter your password"
        labelAction={
          <a
            href="#"
            className="text-sm font-medium text-[#141413] hover:text-[#c96442] transition"
          >
            Forgot password?
          </a>
        }
        error={passwordError}
      />

      {error ? <Text className="text-sm text-[#b53333]">{error}</Text> : null}

      <Button type="submit" disabled={loading}>
        {submitLabel}
      </Button>

      <div className="pt-6 space-y-3">
        <Divider />
        <Text className="text-center">
          New to the collection?{" "}
          <a
            href="#"
            className="font-medium text-[#c96442] hover:text-[#b24f31] transition"
          >
            Create an account
          </a>
        </Text>
      </div>
    </form>
  );
}

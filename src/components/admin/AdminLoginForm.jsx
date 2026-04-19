import { Button } from "../ui/Button.jsx";
import { Divider } from "../ui/Divider.jsx";
import { InputField } from "../ui/InputField.jsx";
import { Text } from "../ui/Typography.jsx";

export function AdminLoginForm({
  form = { username: "", password: "" },
  onChange,
  onSubmit,
  submitted = false,
  error = "",
  loading = false,
}) {
  const handleChange = (event) => {
    if (onChange) {
      onChange(event);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (onSubmit) {
      onSubmit(event);
    }
  };

  const usernameError =
    submitted && !form?.username ? "Please enter your username." : "";
  const passwordError =
    submitted && !form?.password ? "Please enter your password." : "";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <InputField
        id="username"
        label="USERNAME"
        value={form?.username || ""}
        onChange={handleChange}
        placeholder="admin"
        error={usernameError}
      />
      <InputField
        id="password"
        label="PASSWORD"
        type="password"
        value={form?.password || ""}
        onChange={handleChange}
        placeholder="Enter admin password"
        error={passwordError}
      />
      {error ? <Text className="text-sm text-[#b53333]">{error}</Text> : null}
      <Button type="submit" disabled={loading}>
        SIGN IN
      </Button>
      <div className="pt-6 space-y-3">
        <Divider />
        <Text className="text-center text-sm text-[#5e5d59]">
          Admin access only. Enter your username and password.
        </Text>
      </div>
    </form>
  );
}

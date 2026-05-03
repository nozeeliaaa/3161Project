import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import { Field, Input } from "../../components/ui/Input";
import { ErrorState } from "../../components/ui/Status";
import { useAuth } from "../../context/AuthContext";
import AuthShell from "./AuthShell";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (!form.username || !form.password) {
      setError("Username and password are required.");
      return;
    }

    setLoading(true);
    try {
      await login(form);
      navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Sign in with your university LMS credentials to continue.">
      <form className="space-y-4" onSubmit={submit}>
        {error ? <ErrorState message={error} /> : null}
        <Field label="Username">
          <Input value={form.username} onChange={update("username")} placeholder="teststudent1" autoComplete="username" />
        </Field>
        <Field label="Password">
          <Input value={form.password} onChange={update("password")} type="password" placeholder="password123" autoComplete="current-password" />
        </Field>
        <Button className="w-full" size="lg" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-ink-500">
        Need an account?{" "}
        <Link className="font-semibold text-brand-700" to="/register">
          Create one
        </Link>
      </p>
    </AuthShell>
  );
}

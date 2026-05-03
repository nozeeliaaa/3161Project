import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import { Field, Input, Select } from "../../components/ui/Input";
import { ErrorState } from "../../components/ui/Status";
import { useAuth } from "../../context/AuthContext";
import AuthShell from "./AuthShell";

const initialForm = {
  username: "",
  password: "",
  first_name: "",
  last_name: "",
  email: "",
  role: "student",
  major: "",
  year_level: "1",
  department: ""
};

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    const required = ["username", "password", "first_name", "last_name", "email", "role"];
    const missing = required.find((field) => !form[field]);
    if (missing) {
      setError("Please complete all required fields.");
      return;
    }

    const payload = { ...form, year_level: Number(form.year_level) };
    if (form.role !== "student") {
      delete payload.major;
      delete payload.year_level;
    }
    if (form.role !== "lecturer") {
      delete payload.department;
    }

    setLoading(true);
    try {
      await register(payload);
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Create your account" subtitle="Choose the role that matches your access in the course system.">
      <form className="space-y-4" onSubmit={submit}>
        {error ? <ErrorState message={error} /> : null}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="First name">
            <Input value={form.first_name} onChange={update("first_name")} />
          </Field>
          <Field label="Last name">
            <Input value={form.last_name} onChange={update("last_name")} />
          </Field>
        </div>
        <Field label="Username">
          <Input value={form.username} onChange={update("username")} />
        </Field>
        <Field label="Email">
          <Input value={form.email} onChange={update("email")} type="email" />
        </Field>
        <Field label="Password">
          <Input value={form.password} onChange={update("password")} type="password" />
        </Field>
        <Field label="Role">
          <Select value={form.role} onChange={update("role")}>
            <option value="student">Student</option>
            <option value="lecturer">Lecturer</option>
            <option value="admin">Admin</option>
          </Select>
        </Field>
        {form.role === "student" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Major">
              <Input value={form.major} onChange={update("major")} />
            </Field>
            <Field label="Year level">
              <Input value={form.year_level} onChange={update("year_level")} type="number" min="1" max="6" />
            </Field>
          </div>
        ) : null}
        {form.role === "lecturer" ? (
          <Field label="Department">
            <Input value={form.department} onChange={update("department")} />
          </Field>
        ) : null}
        <Button className="w-full" size="lg" type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-ink-500">
        Already registered?{" "}
        <Link className="font-semibold text-brand-700" to="/login">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}

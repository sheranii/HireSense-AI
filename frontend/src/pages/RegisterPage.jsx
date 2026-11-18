import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "../components/layout/Logo";
import { Button } from "../components/common/Button";
import { Notice } from "../components/common/Notice";
import { useAuth } from "../context/AuthContext";
import { homeForRole } from "../lib/roles";

export const RegisterPage = () => {
  const [role, setRole] = useState("CANDIDATE");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    const result = await register({
      email: email.trim(),
      password,
      fullName: fullName.trim(),
      role,
      title: title.trim() || (role === "RECRUITER" ? "Recruiter" : "Candidate"),
      department: department.trim() || (role === "RECRUITER" ? "Talent" : "General"),
    });
    setLoading(false);
    if (!result.success) {
      setError(result.error);
      return;
    }
    navigate(homeForRole(result.user?.role), { replace: true });
  };

  return (
    <div className="min-h-screen bg-paper">
      <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-4 py-12">
        <Logo />
        <h1 className="mt-8 font-serif text-4xl text-ink-950">Create an account</h1>
        <p className="mt-2 text-base text-ink-600">Choose the workspace you need. You can sign in with it immediately.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-lg border border-line bg-white p-6">
          {error ? <Notice tone="error">{error}</Notice> : null}
          <div className="grid grid-cols-2 gap-2">
            {[
              ["CANDIDATE", "I am looking for a role"],
              ["RECRUITER", "I am hiring"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setRole(value)}
                className={`rounded-md border px-3 py-3 text-left text-sm font-semibold ${role === value ? "border-navy-800 bg-navy-50 text-navy-900" : "border-line text-ink-800"}`}
              >
                {label}
              </button>
            ))}
          </div>
          <label className="block text-sm font-semibold text-ink-800">Full name
            <input className="field mt-1" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </label>
          <label className="block text-sm font-semibold text-ink-800">Email
            <input className="field mt-1" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label className="block text-sm font-semibold text-ink-800">Password
            <input className="field mt-1" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-ink-800">Title
              <input className="field mt-1" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={role === "RECRUITER" ? "Talent partner" : "Current role"} />
            </label>
            <label className="block text-sm font-semibold text-ink-800">Department
              <input className="field mt-1" value={department} onChange={(e) => setDepartment(e.target.value)} />
            </label>
          </div>
          <Button type="submit" variant="primary" className="w-full" loading={loading}>Create account</Button>
          <p className="text-sm text-ink-600">Already registered? <Link to="/login" className="font-semibold text-navy-800">Sign in</Link></p>
        </form>
      </div>
    </div>
  );
};

import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Logo } from "../components/layout/Logo";
import { Button } from "../components/common/Button";
import { Notice } from "../components/common/Notice";
import { useAuth } from "../context/AuthContext";
import { homeForRole } from "../lib/roles";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email.trim(), password);
    setLoading(false);
    if (!result.success) {
      setError(result.error);
      return;
    }
    const destination = location.state?.from || homeForRole(result.user?.role);
    navigate(destination, { replace: true });
  };

  return (
    <div className="min-h-screen bg-paper">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12">
        <Logo />
        <h1 className="mt-8 font-serif text-4xl text-ink-950">Sign in</h1>
        <p className="mt-2 text-base text-ink-600">Use the account for your recruiting team or your candidate profile.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-lg border border-line bg-white p-6">
          {error ? <Notice tone="error">{error}</Notice> : null}
          <label className="block text-sm font-semibold text-ink-800">
            Email
            <input className="field mt-1" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </label>
          <label className="block text-sm font-semibold text-ink-800">
            Password
            <input className="field mt-1" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          </label>
          <Button type="submit" variant="primary" className="w-full" loading={loading}>Sign in</Button>
          <p className="text-sm text-ink-600">
            New here? <Link to="/register" className="font-semibold text-navy-800">Create an account</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

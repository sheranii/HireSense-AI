import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { PageHeader } from "../components/common/PageHeader";
import { StatCard } from "../components/common/StatCard";
import { Button } from "../components/common/Button";
import { Badge } from "../components/common/Badge";
import { Notice } from "../components/common/Notice";

export const AdminDashboard = ({ view = "overview" }) => {
  const [users, setUsers] = useState([]);
  const [counts, setCounts] = useState({ users: 0, jobs: 0, applications: 0 });
  const [health, setHealth] = useState(null);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [usersRes, jobsRes, appsRes] = await Promise.all([
        api.get("/auth/users"),
        api.get("/jobs"),
        api.get("/applications"),
      ]);
      setUsers(usersRes.data || []);
      setCounts({
        users: (usersRes.data || []).length,
        jobs: (jobsRes.data || []).length,
        applications: (appsRes.data || []).length,
      });
      if (view === "system") {
        const [healthRes, statsRes] = await Promise.all([api.get("/health"), api.get("/system/stats")]);
        setHealth(healthRes.data);
        setStats(statsRes.data);
      }
    } catch {
      setError("Administration data could not be loaded. Sign in with an admin account and confirm the server is running.");
    }
  };

  useEffect(() => { load(); }, [view]);

  const titles = {
    overview: ["Administration", "Overview", "Accounts, jobs, and applications currently in the database."],
    users: ["Administration", "Users", "Accounts that can sign in. Passwords are not shown."],
    system: ["Administration", "System management", "A direct reading of the service and database connection. This page is limited to administrators."],
  };
  const [eyebrow, title, description] = titles[view];

  return (
    <div>
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        actions={view === "system" ? <Button onClick={load}>Refresh</Button> : null}
      />
      {error ? <Notice tone="error">{error}</Notice> : null}

      {view === "overview" ? (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Users" value={counts.users} detail="Sign-in accounts" />
            <StatCard label="Jobs" value={counts.jobs} detail="Requisitions on file" />
            <StatCard label="Applications" value={counts.applications} detail="Submissions on file" />
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/admin/users"><Button>Review users</Button></Link>
            <Link to="/jobs"><Button>Review jobs</Button></Link>
            <Link to="/applications"><Button>Review applications</Button></Link>
            <Link to="/admin/system"><Button variant="primary">System management</Button></Link>
          </div>
        </>
      ) : null}

      {view === "users" ? (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Title</th>
                <th>Department</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? <tr><td colSpan={5}>No users returned.</td></tr> : users.map((account) => (
                <tr key={account.id}>
                  <td className="font-semibold">{account.fullName}</td>
                  <td>{account.email}</td>
                  <td><Badge variant="navy">{account.role}</Badge></td>
                  <td>{account.title || "—"}</td>
                  <td>{account.department || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {view === "system" && health ? (
        <div className="grid gap-4 md:grid-cols-2">
          <section className="rounded-lg border border-line bg-white p-5">
            <h2 className="font-serif text-2xl">Service</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-4"><dt className="text-ink-600">Status</dt><dd className="font-semibold">{health.status}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-ink-600">Database</dt><dd className="font-semibold">{health.database}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-ink-600">Product</dt><dd>{health.databaseProduct || "—"}</dd></div>
            </dl>
          </section>
          <section className="rounded-lg border border-line bg-white p-5">
            <h2 className="font-serif text-2xl">Runtime</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-4"><dt className="text-ink-600">Reported status</dt><dd>{stats?.status || "—"}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-ink-600">Database detail</dt><dd className="max-w-[16rem] text-right">{stats?.database || "—"}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-ink-600">Version</dt><dd>{stats?.version || "—"}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-ink-600">Uptime</dt><dd>{stats?.uptimeSeconds != null ? `${Math.round(stats.uptimeSeconds)}s` : "—"}</dd></div>
            </dl>
          </section>
        </div>
      ) : null}
    </div>
  );
};

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PublicLayout } from "../components/layout/PublicLayout";
import { Button } from "../components/common/Button";
import api from "../api/client";

export const ForCandidatesPage = () => {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/jobs")
      .then((res) => setJobs((res.data || []).filter((job) => job.status === "OPEN")))
      .catch(() => setError("Open roles could not be loaded just now."));
  }, []);

  return (
    <PublicLayout>
      <section className="border-b border-line">
        <div className="mx-auto max-w-page px-4 py-16 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-navy-800">For candidates</p>
          <h1 className="mt-3 max-w-3xl font-serif text-5xl text-ink-950">Apply once, then follow the application you submitted.</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-600">
            Sign in to send an application, keep your profile, and see assessments linked to your account. The list below is the current set of open roles.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/register"><Button variant="primary">Create a candidate account</Button></Link>
            <Link to="/login"><Button>Sign in to apply</Button></Link>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-page px-4 py-12 sm:px-6">
        <h2 className="font-serif text-3xl text-ink-950">Open roles</h2>
        {error ? <p className="mt-4 text-sm text-rose-800">{error}</p> : null}
        <div className="mt-6 divide-y divide-line rounded-lg border border-line">
          {jobs.length === 0 && !error ? (
            <p className="px-4 py-8 text-sm text-ink-600">No open roles are published right now.</p>
          ) : jobs.map((job) => (
            <div key={job.id} className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-ink-950">{job.title}</p>
                <p className="text-sm text-ink-600">{job.department} · {job.location} · {job.type}</p>
              </div>
              <Link to="/login"><Button size="sm">Sign in to apply</Button></Link>
            </div>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
};

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { PageHeader } from "../components/common/PageHeader";
import { StatCard } from "../components/common/StatCard";
import { Button } from "../components/common/Button";
import { Badge, stageVariant } from "../components/common/Badge";
import { Notice } from "../components/common/Notice";
import { stageLabel } from "../lib/roles";

export const CandidateDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        const jobsRes = await api.get("/jobs");
        setJobs((jobsRes.data || []).filter((job) => job.status === "OPEN"));
        const appsRes = await api.get("/applications", { params: { email: user.email } });
        setApplications(appsRes.data || []);
        try {
          const profile = await api.get("/candidates/lookup", { params: { email: user.email } });
          const tests = await api.get(`/assessments/candidate/${profile.data.id}`);
          setAssessments(tests.data || []);
        } catch {
          setAssessments([]);
        }
      } catch {
        setError("Your dashboard could not be loaded.");
      }
    };
    run();
  }, [user.email]);

  const appliedIds = new Set(applications.map((item) => item.jobId));
  const suggestions = jobs.filter((job) => !appliedIds.has(job.id)).slice(0, 4);

  return (
    <div>
      <PageHeader
        eyebrow="Candidate"
        title={`Hello, ${user.fullName.split(" ")[0]}`}
        description="Open roles you have not applied for, and the status of applications already on file."
        actions={<Link to="/jobs"><Button variant="primary">Find jobs</Button></Link>}
      />
      {error ? <div className="mb-4"><Notice tone="error">{error}</Notice></div> : null}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Your applications" value={applications.length} detail="Stored under your email" />
        <StatCard label="Open roles" value={jobs.length} detail="Currently accepting applications" />
        <StatCard label="Assessments completed" value={assessments.length} detail={assessments[0] ? `Latest score ${assessments[0].score}` : "None yet"} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-line bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-serif text-2xl">Application progress</h2>
            <Link to="/applications" className="text-sm font-semibold text-navy-800">View all</Link>
          </div>
          {applications.length === 0 ? <p className="text-sm text-ink-600">You have not applied yet.</p> : (
            <ul className="divide-y divide-line">
              {applications.slice(0, 4).map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="font-semibold">{item.jobTitle}</p>
                    <p className="text-sm text-ink-600">{item.department}</p>
                  </div>
                  <Badge variant={stageVariant(item.stage)}>{stageLabel(item.stage)}</Badge>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="rounded-lg border border-line bg-white p-5">
          <h2 className="font-serif text-2xl">Roles you can still apply for</h2>
          {suggestions.length === 0 ? <p className="mt-3 text-sm text-ink-600">No additional open roles right now.</p> : (
            <ul className="mt-3 divide-y divide-line">
              {suggestions.map((job) => (
                <li key={job.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="font-semibold">{job.title}</p>
                    <p className="text-sm text-ink-600">{job.location}</p>
                  </div>
                  <Link to="/jobs"><Button size="sm">Apply</Button></Link>
                </li>
              ))}
            </ul>
          )}
          <Link to="/assessments" className="mt-4 inline-block text-sm font-semibold text-navy-800">Take the orientation assessment</Link>
        </section>
      </div>
    </div>
  );
};

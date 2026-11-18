
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { PageHeader } from "../components/common/PageHeader";
import { Button } from "../components/common/Button";
import { Badge, stageVariant } from "../components/common/Badge";
import { Notice } from "../components/common/Notice";
import { STAGES, stageLabel } from "../lib/roles";

const MetricCard = ({ label, value, detail, icon, accent = "indigo" }) => {
  const accents = {
    indigo: "bg-indigo-50 text-indigo-700",
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    slate: "bg-slate-100 text-slate-700",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            {value}
          </p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${accents[accent]}`}>
          {icon}
        </div>
      </div>
      <p className="mt-4 text-xs text-slate-500">{detail}</p>
    </div>
  );
};

const MetricIcon = ({ children }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const EmptyState = ({ title, description, action }) => (
  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-5 py-10 text-center">
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm">
      <MetricIcon>
        <path d="M8 3h8l4 4v14H4V3h4Z" />
        <path d="M8 12h8M8 16h5M16 3v5h4" />
      </MetricIcon>
    </div>
    <h3 className="mt-4 text-sm font-semibold text-slate-900">{title}</h3>
    <p className="mt-1 max-w-xs text-sm text-slate-500">{description}</p>
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const [jobsRes, candidatesRes, appsRes] = await Promise.all([
          api.get("/jobs"),
          api.get("/candidates"),
          api.get("/applications"),
        ]);

        if (!active) return;

        setJobs(Array.isArray(jobsRes.data) ? jobsRes.data : []);
        setCandidates(Array.isArray(candidatesRes.data) ? candidatesRes.data : []);
        setApplications(Array.isArray(appsRes.data) ? appsRes.data : []);
      } catch {
        if (active) {
          setError("We couldn't load your recruitment data. Please try again.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  const openJobs = jobs.filter((job) => job.status === "OPEN").length;

  const scoredCandidates = candidates.filter(
    (candidate) =>
      typeof candidate.aiMatchScore === "number" &&
      Number.isFinite(candidate.aiMatchScore)
  );

  const averageScore = scoredCandidates.length
    ? Math.round(
      scoredCandidates.reduce(
        (sum, candidate) => sum + candidate.aiMatchScore,
        0
      ) / scoredCandidates.length
    )
    : null;

  const pendingReviews = applications.filter(
    (item) => item.stage === "APPLIED" || item.stage === "UNDER_REVIEW"
  ).length;

  const stageCounts = useMemo(
    () =>
      STAGES.map((stage) => ({
        stage,
        label: stageLabel(stage),
        count: applications.filter((item) => item.stage === stage).length,
      })),
    [applications]
  );

  const maxStageCount = Math.max(
    1,
    ...stageCounts.map((item) => item.count)
  );

  const recentApplications = applications.slice(0, 6);

  return (
    <div className="min-h-screen space-y-7 bg-slate-50/70 pb-10">
      <div className="rounded-2xl border border-slate-200 bg-white px-5 py-6 shadow-sm sm:px-7">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
              Recruitment workspace
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
              Recruiter overview
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Your hiring activity, candidate pipeline and open roles in one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to="/ai-screening">
              <Button>Screen a resume</Button>
            </Link>
            <Link to="/jobs?create=1">
              <Button variant="primary">+ Create a job</Button>
            </Link>
          </div>
        </div>
      </div>

      {error && <Notice tone="error">{error}</Notice>}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-36 animate-pulse rounded-2xl border border-slate-200 bg-white"
            />
          ))}
        </div>
      ) : (
        <>
          <section>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Workspace performance
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Metrics based on records returned by your workspace APIs.
                </p>
              </div>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                Live workspace data
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                label="Open positions"
                value={openJobs}
                detail={`${jobs.length} total job records`}
                accent="indigo"
                icon={<MetricIcon><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M8 4V2h8v2M8 10h8M8 14h5" /></MetricIcon>}
              />
              <MetricCard
                label="Total candidates"
                value={candidates.length}
                detail="Profiles available in the workspace"
                accent="emerald"
                icon={<MetricIcon><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></MetricIcon>}
              />
              <MetricCard
                label="Applications"
                value={applications.length}
                detail={`${pendingReviews} awaiting review`}
                accent="amber"
                icon={<MetricIcon><path d="M8 3h8l4 4v14H4V3h4Z" /><path d="M16 3v5h4M8 13h8M8 17h5" /></MetricIcon>}
              />
              <MetricCard
                label="Average match score"
                value={averageScore === null ? "—" : `${averageScore}%`}
                detail={
                  scoredCandidates.length
                    ? `Based on ${scoredCandidates.length} scored profiles`
                    : "No screening scores recorded"
                }
                accent="slate"
                icon={<MetricIcon><path d="M3 17l6-6 4 4 8-9" /><path d="M15 6h6v6" /></MetricIcon>}
              />
            </div>
          </section>

          <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:px-6">
                <div>
                  <h2 className="text-base font-semibold text-slate-950">
                    Recruitment pipeline
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Application distribution across hiring stages.
                  </p>
                </div>
                <Link
                  to="/applications"
                  className="text-sm font-semibold text-indigo-700 hover:text-indigo-900"
                >
                  View applications →
                </Link>
              </div>

              <div className="space-y-5 p-5 sm:p-6">
                {applications.length === 0 ? (
                  <EmptyState
                    title="Your pipeline is empty"
                    description="Applications will appear here when candidates apply to your jobs."
                    action={
                      <Link to="/jobs">
                        <Button variant="primary">Explore jobs</Button>
                      </Link>
                    }
                  />
                ) : (
                  stageCounts.map((item) => (
                    <div key={item.stage}>
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <span className="text-sm font-medium text-slate-700">
                          {item.label}
                        </span>
                        <span className="text-sm font-semibold tabular-nums text-slate-950">
                          {item.count}
                        </span>
                      </div>
                      <div
                        className="h-2.5 overflow-hidden rounded-full bg-slate-100"
                        role="progressbar"
                        aria-label={`${item.label} applications`}
                        aria-valuemin={0}
                        aria-valuemax={applications.length}
                        aria-valuenow={item.count}
                      >
                        <div
                          className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                          style={{
                            width: `${(item.count / maxStageCount) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                  Screening intelligence
                </p>
                <h2 className="mt-2 text-base font-semibold text-slate-950">
                  Candidate matching
                </h2>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  An overview of candidate screening scores recorded by the system.
                </p>
              </div>

              <div className="p-5 sm:p-6">
                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      Average match score
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {scoredCandidates.length} scored profiles
                    </p>
                  </div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-indigo-100 bg-white">
                    <span className="text-lg font-bold text-indigo-700">
                      {averageScore === null ? "—" : averageScore}
                    </span>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Profiles screened</span>
                    <span className="font-semibold text-slate-900">
                      {scoredCandidates.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Profiles without a score</span>
                    <span className="font-semibold text-slate-900">
                      {candidates.length - scoredCandidates.length}
                    </span>
                  </div>
                </div>

                <Link to="/ai-screening" className="mt-6 block">
                  <Button variant="primary" block>
                    Open AI screening workspace →
                  </Button>
                </Link>

                <p className="mt-3 text-center text-xs text-slate-400">
                  Scores reflect the screening results stored by the existing system.
                </p>
              </div>
            </section>
          </div>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:px-6">
              <div>
                <h2 className="text-base font-semibold text-slate-950">
                  Recent applications
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  The latest records returned by your applications API.
                </p>
              </div>
              <Link
                to="/applications"
                className="text-sm font-semibold text-indigo-700 hover:text-indigo-900"
              >
                View all →
              </Link>
            </div>

            {recentApplications.length === 0 ? (
              <div className="p-5 sm:p-6">
                <EmptyState
                  title="No applications yet"
                  description="New candidate applications will appear in this section."
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[620px] text-left">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Candidate
                      </th>
                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Position
                      </th>
                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Application stage
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentApplications.map((item) => (
                      <tr key={item.id} className="transition hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <Link
                            to={`/candidates/${item.candidateId}`}
                            className="font-semibold text-slate-900 hover:text-indigo-700"
                          >
                            {item.candidateName || "Unnamed candidate"}
                          </Link>
                          <p className="mt-1 text-xs text-slate-400">
                            Application #{item.id}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {item.jobTitle || "Untitled position"}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={stageVariant(item.stage)}>
                            {stageLabel(item.stage)}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            to="/applications"
                            className="text-sm font-semibold text-indigo-700 hover:text-indigo-900"
                          >
                            Review →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};

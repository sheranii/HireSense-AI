import React, { useEffect, useMemo, useState } from "react";
import api from "../api/client";
import { PageHeader } from "../components/common/PageHeader";
import { StatCard } from "../components/common/StatCard";
import { Notice } from "../components/common/Notice";
import { STAGES, stageLabel } from "../lib/roles";

export const ReportsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.get("/jobs"), api.get("/applications"), api.get("/assessments")])
      .then(([jobsRes, appsRes, testsRes]) => {
        setJobs(jobsRes.data || []);
        setApplications(appsRes.data || []);
        setAssessments(testsRes.data || []);
      })
      .catch(() => setError("Reports could not be loaded."));
  }, []);

  const summary = useMemo(() => {
    const scores = applications.map((item) => item.matchScore).filter((score) => typeof score === "number");
    const testScores = assessments.map((item) => item.score).filter((score) => typeof score === "number");
    const avg = (values) => values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : null;
    return {
      openJobs: jobs.filter((job) => job.status === "OPEN").length,
      averageMatch: avg(scores),
      scoredApplications: scores.length,
      averageAssessment: avg(testScores),
    };
  }, [jobs, applications, assessments]);

  const byJob = jobs.map((job) => ({
    ...job,
    count: applications.filter((item) => item.jobId === job.id).length,
  }));

  return (
    <div>
      <PageHeader
        eyebrow="Reports"
        title="Recruitment activity"
        description="Every figure on this page is counted from jobs, applications, and assessments currently stored."
      />
      {error ? <Notice tone="error">{error}</Notice> : null}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Jobs" value={jobs.length} detail={`${summary.openJobs} open`} />
        <StatCard label="Applications" value={applications.length} detail="All stages" />
        <StatCard label="Average match score" value={summary.averageMatch ?? "—"} detail={summary.scoredApplications ? `${summary.scoredApplications} scored applications` : "No scores yet"} />
        <StatCard label="Average assessment score" value={summary.averageAssessment ?? "—"} detail={`${assessments.length} submissions`} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-line bg-white p-5">
          <h2 className="font-serif text-2xl">Stage totals</h2>
          <ul className="mt-4 space-y-3">
            {STAGES.map((stage) => {
              const count = applications.filter((item) => item.stage === stage).length;
              const width = applications.length ? `${Math.round((count / applications.length) * 100)}%` : "0%";
              return (
                <li key={stage}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{stageLabel(stage)}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-paper">
                    <div className="h-2 rounded-full bg-navy-800" style={{ width }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
        <section className="rounded-lg border border-line bg-white p-5">
          <h2 className="font-serif text-2xl">Applications per job</h2>
          {byJob.length === 0 ? <p className="mt-3 text-sm text-ink-600">No jobs to report.</p> : (
            <ul className="mt-3 divide-y divide-line">
              {byJob.map((job) => (
                <li key={job.id} className="flex items-center justify-between py-3 text-sm">
                  <span className="font-semibold">{job.title}</span>
                  <span>{job.count}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

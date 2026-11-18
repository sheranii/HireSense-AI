import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  FileSearch,
  FileText,
  LockKeyhole,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow,
} from "lucide-react";
import { PublicLayout } from "../components/layout/PublicLayout";
import { Button } from "../components/common/Button";
import { Badge } from "../components/common/Badge";
import api from "../api/client";

const capabilities = [
  {
    icon: Briefcase,
    number: "01",
    title: "Structured job management",
    description:
      "Create and manage requisitions, keep role requirements organized, and follow applicants from one workspace.",
  },
  {
    icon: Users,
    number: "02",
    title: "Candidate visibility",
    description:
      "Keep candidate profiles, skills, resumes, application history, and recruiter notes connected to the hiring process.",
  },
  {
    icon: FileSearch,
    number: "03",
    title: "Explainable resume screening",
    description:
      "Review extracted resume details alongside matched skills, missing requirements, and experience comparisons.",
  },
  {
    icon: Workflow,
    number: "04",
    title: "Application tracking",
    description:
      "Move applications through the supported hiring stages and retain a clear history of recruitment decisions.",
  },
  {
    icon: FileText,
    number: "05",
    title: "Assessments and reports",
    description:
      "Keep assessment activity and recruitment information accessible to the people who need it.",
  },
  {
    icon: LockKeyhole,
    number: "06",
    title: "Role-aware workspaces",
    description:
      "Separate recruiter, candidate, and administrator experiences with protected application access.",
  },
];

const workflowSteps = [
  { step: "01", title: "Create a role", detail: "Define the position and its requirements." },
  { step: "02", title: "Review applicants", detail: "Explore candidate profiles and submitted resumes." },
  { step: "03", title: "Screen with context", detail: "Compare available resume evidence with job requirements." },
  { step: "04", title: "Track decisions", detail: "Update application stages and keep the hiring history together." },
];

export const LandingPage = () => {
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    api
      .get("/jobs")
      .then((res) => {
        if (!mounted) return;
        const records = Array.isArray(res.data) ? res.data : [];
        setJobs(records.filter((job) => job.status === "OPEN").slice(0, 3));
      })
      .catch(() => {
        if (mounted) setJobs([]);
      })
      .finally(() => {
        if (mounted) setJobsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <PublicLayout>
      <main className="bg-white text-slate-950">
        {/* Hero */}
        <section className="relative isolate overflow-hidden border-b border-slate-200">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_rgba(79,70,229,0.09),_transparent_42%)]" />
          <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12 lg:px-10 lg:py-24">
            <div className="max-w-2xl">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/80 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-indigo-800">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                RECRUITMENT OPERATIONS, CONNECTED
              </div>

              <h1 className="font-serif text-5xl leading-[1.04] tracking-tight text-slate-950 sm:text-6xl lg:text-[4.35rem]">
                Hire with clarity.
                <span className="mt-1 block text-indigo-700">Move talent forward.</span>
              </h1>

              <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600 sm:text-xl">
                HireSense AI brings job management, candidate review, resume screening, and application tracking into one focused recruitment workspace.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link to="/register">
                  <Button variant="primary" size="lg" iconRight={ArrowRight}>
                    Get started
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="secondary">
                    Sign in to workspace
                  </Button>
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-slate-200 pt-6 text-sm text-slate-500">
                <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-600" /> Role-aware access</span>
                <span className="inline-flex items-center gap-2"><FileSearch className="h-4 w-4 text-indigo-600" /> Explainable screening</span>
                <span className="inline-flex items-center gap-2"><Workflow className="h-4 w-4 text-indigo-600" /> Connected workflows</span>
              </div>
            </div>

            {/* Product preview: illustrative interface, without fabricated candidate data */}
            <div className="relative mx-auto w-full max-w-2xl">
              <div className="absolute -inset-5 -z-10 rounded-[2rem] bg-indigo-100/60 blur-2xl" />
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_80px_-32px_rgba(15,23,42,0.28)]">
                <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-xs font-bold text-white">H</div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">HireSense workspace</p>
                      <p className="text-[11px] text-slate-500">Recruitment overview</p>
                    </div>
                  </div>
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">PRODUCT PREVIEW</span>
                </div>

                <div className="grid grid-cols-3 gap-3 p-5">
                  {[
                    { label: "Jobs", icon: Briefcase },
                    { label: "Candidates", icon: Users },
                    { label: "Screening", icon: FileSearch },
                  ].map(({ label, icon: Icon }) => (
                    <div key={label} className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
                      <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700"><Icon className="h-4 w-4" /></div>
                      <p className="text-xs font-semibold text-slate-800 sm:text-sm">{label}</p>
                      <p className="mt-1 text-[10px] text-slate-500 sm:text-xs">Workspace module</p>
                    </div>
                  ))}
                </div>

                <div className="px-5 pb-5">
                  <div className="rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Hiring workflow</p>
                        <p className="mt-0.5 text-xs text-slate-500">A clear path from role to decision</p>
                      </div>
                      <Workflow className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="space-y-3 p-4">
                      {workflowSteps.map((item, index) => (
                        <div key={item.step} className="flex items-start gap-3">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-[10px] font-bold text-indigo-700">{item.step}</div>
                          <div className="min-w-0 flex-1 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                            <p className="text-xs font-semibold text-slate-800">{item.title}</p>
                            <p className="mt-0.5 text-[11px] leading-5 text-slate-500">{item.detail}</p>
                          </div>
                          {index === 0 && <CheckCircle2 className="mt-1 h-4 w-4 text-emerald-500" />}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2.5 text-[11px] text-slate-500">
                    <Sparkles className="h-4 w-4 shrink-0 text-indigo-600" />
                    Screening results show the available evidence and matching factors.
                  </div>
                </div>
              </div>
              <p className="mt-3 text-center text-[11px] text-slate-400">Illustrative product preview · live workspace data appears after sign-in</p>
            </div>
          </div>
        </section>

        {/* Capabilities */}
        <section id="product" className="border-b border-slate-200 bg-slate-50/70 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-700">One connected platform</p>
              <h2 className="mt-3 font-serif text-3xl leading-tight tracking-tight text-slate-950 sm:text-4xl">The tools to manage each step of hiring.</h2>
              <p className="mt-4 text-base leading-7 text-slate-600">Keep requisitions, candidate information, screening evidence, and application decisions organized in one place.</p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {capabilities.map(({ icon: Icon, number, title, description }) => (
                <article key={number} className="group rounded-2xl border border-slate-200 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg hover:shadow-slate-200/60">
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700"><Icon className="h-5 w-5" /></div>
                    <span className="font-mono text-xs text-slate-400">{number}</span>
                  </div>
                  <h3 className="mt-6 text-lg font-semibold tracking-tight text-slate-900">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
                  <div className="mt-5 flex items-center gap-1 text-xs font-semibold text-indigo-700 opacity-0 transition group-hover:opacity-100">Explore platform <ChevronRight className="h-3.5 w-3.5" /></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Workflow */}
        <section id="workflow" className="border-b border-slate-200 py-20 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-700">How it works</p>
              <h2 className="mt-3 font-serif text-3xl leading-tight tracking-tight text-slate-950 sm:text-4xl">A hiring process your team can follow.</h2>
              <p className="mt-4 max-w-md text-base leading-7 text-slate-600">Bring the work into a consistent flow, from defining a role to reviewing evidence and recording the next decision.</p>
              <Link to="/register" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 hover:text-indigo-900">Start using HireSense <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white px-6">
              {workflowSteps.map((item) => (
                <div key={item.step} className="flex gap-5 py-6">
                  <span className="pt-0.5 font-mono text-sm font-semibold text-indigo-600">{item.step}</span>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Open roles from API */}
        <section id="jobs" className="border-b border-slate-200 bg-slate-50/70 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-700">Explore opportunities</p>
                <h2 className="mt-3 font-serif text-3xl tracking-tight text-slate-950 sm:text-4xl">Open roles</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">Current openings retrieved from the HireSense jobs service.</p>
              </div>
              <Link to="/jobs"><Button variant="secondary" iconRight={ArrowRight}>Browse all jobs</Button></Link>
            </div>

            <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
              {jobsLoading ? (
                <div className="p-8 text-center text-sm text-slate-500">Loading open positions…</div>
              ) : jobs.length === 0 ? (
                <div className="p-9 text-center">
                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-500"><Search className="h-5 w-5" /></div>
                  <p className="mt-3 text-sm font-semibold text-slate-800">No open positions right now</p>
                  <p className="mt-1 text-sm text-slate-500">Please check back later or browse the jobs page.</p>
                </div>
              ) : (
                jobs.map((job) => (
                  <div key={job.id} className="flex flex-col gap-4 border-b border-slate-100 p-5 last:border-0 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-slate-900">{job.title}</h3>
                        <Badge variant="green" size="xs">OPEN</Badge>
                      </div>
                      <p className="mt-1 text-sm text-slate-500">{[job.department, job.location, job.type].filter(Boolean).join(" · ")}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-4">
                      <span className="text-xs text-slate-500">{job.applicantCount ?? 0} applications</span>
                      <Link to="/login"><Button size="sm" variant="secondary">View role</Button></Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Trust and product integrity */}
        <section id="security" className="py-16 sm:py-20">
          <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 md:grid-cols-3 lg:px-10">
            <div className="md:col-span-1">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-700">Built around clarity</p>
              <h2 className="mt-3 font-serif text-3xl tracking-tight text-slate-950">Useful signals. Human decisions.</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 md:col-span-2">
              <div className="flex gap-3">
                <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-emerald-600" />
                <div><h3 className="font-semibold text-slate-900">Protected workspaces</h3><p className="mt-1 text-sm leading-6 text-slate-600">Role-aware access keeps recruiter, candidate, and administrator workflows separate.</p></div>
              </div>
              <div className="flex gap-3">
                <FileSearch className="mt-1 h-5 w-5 shrink-0 text-indigo-600" />
                <div><h3 className="font-semibold text-slate-900">Explainable screening</h3><p className="mt-1 text-sm leading-6 text-slate-600">Screening views present the matching factors and extracted information available from the current engine.</p></div>
              </div>
              <div className="flex gap-3">
                <Workflow className="mt-1 h-5 w-5 shrink-0 text-indigo-600" />
                <div><h3 className="font-semibold text-slate-900">Connected records</h3><p className="mt-1 text-sm leading-6 text-slate-600">Keep job, candidate, and application information connected throughout the hiring workflow.</p></div>
              </div>
              <div className="flex gap-3">
                <LockKeyhole className="mt-1 h-5 w-5 shrink-0 text-slate-600" />
                <div><h3 className="font-semibold text-slate-900">Designed for accountability</h3><p className="mt-1 text-sm leading-6 text-slate-600">Support consistent review and traceable application-stage updates.</p></div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-slate-950 py-16 text-white sm:py-20">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-300">HireSense AI</p>
              <h2 className="mt-3 font-serif text-3xl leading-tight tracking-tight sm:text-4xl">Bring your hiring workflow into focus.</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">Create an account or sign in to continue to your workspace.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/register"><Button variant="secondary" size="lg" className="bg-white text-slate-950 hover:bg-slate-100">Get started <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
              <Link to="/login"><Button size="lg" className="border border-slate-600 bg-transparent text-white hover:bg-slate-800">Sign in</Button></Link>
            </div>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
};

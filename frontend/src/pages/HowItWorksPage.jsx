import React from "react";
import { Link } from "react-router-dom";
import { PublicLayout } from "../components/layout/PublicLayout";
import { Button } from "../components/common/Button";

const flow = [
  { who: "Recruiter", title: "Open a requisition", text: "The job is saved with a status. Only open roles are offered to candidates." },
  { who: "Candidate", title: "Submit an application", text: "The candidate adds experience, skills, and a short summary. The application is stored against that job." },
  { who: "Workspace", title: "Screen the resume", text: "HireSense compares the text supplied with the job requirements and writes down the overlap." },
  { who: "Recruiter", title: "Advance or decline", text: "The stage changes on the application. Reports count whatever is currently in the database." },
  { who: "Candidate", title: "Follow progress", text: "The candidate dashboard lists their applications and any assessment they have completed." },
];

export const HowItWorksPage = () => (
  <PublicLayout>
    <section className="mx-auto max-w-page px-4 py-16 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-navy-800">How it works</p>
      <h1 className="mt-3 max-w-3xl font-serif text-5xl text-ink-950">A straight line from an open role to a recorded decision.</h1>
      <ol className="mt-12 space-y-0 border-l border-line">
        {flow.map((item, index) => (
          <li key={item.title} className="relative pb-10 pl-8">
            <span className="absolute -left-3 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-navy-800 text-xs font-semibold text-white">
              {index + 1}
            </span>
            <p className="text-xs font-semibold uppercase tracking-wide text-navy-800">{item.who}</p>
            <h2 className="mt-1 font-serif text-2xl text-ink-950">{item.title}</h2>
            <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-600">{item.text}</p>
          </li>
        ))}
      </ol>
      <Link to="/register"><Button variant="primary">Get Started</Button></Link>
    </section>
  </PublicLayout>
);

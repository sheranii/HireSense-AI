import React from "react";
import { Link } from "react-router-dom";
import { PublicLayout } from "../components/layout/PublicLayout";
import { Button } from "../components/common/Button";

export const ForRecruitersPage = () => (
  <PublicLayout>
    <section className="border-b border-line bg-paper">
      <div className="mx-auto max-w-page px-4 py-16 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-navy-800">For recruiters</p>
        <h1 className="mt-3 max-w-3xl font-serif text-5xl text-ink-950">Run the pipeline without a second spreadsheet.</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-600">
          The recruiter workspace opens on the roles and applications already stored for your team. Counts on the overview come from those records.
        </p>
        <div className="mt-8">
          <Link to="/register"><Button variant="primary" size="lg">Create a recruiter account</Button></Link>
        </div>
      </div>
    </section>
    <section className="mx-auto grid max-w-page gap-8 px-4 py-14 sm:px-6 lg:grid-cols-3">
      {[
        ["Overview", "Open roles, people in process, and the current stage counts."],
        ["Jobs and applications", "Search, filter, edit a requisition, and move an application to the next stage."],
        ["Screening and reports", "Score a resume against a chosen job, then read totals calculated from the same data."],
      ].map(([title, text]) => (
        <article key={title}>
          <h2 className="font-serif text-2xl text-ink-950">{title}</h2>
          <p className="mt-2 text-base leading-relaxed text-ink-600">{text}</p>
        </article>
      ))}
    </section>
  </PublicLayout>
);

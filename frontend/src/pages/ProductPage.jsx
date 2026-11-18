import React from "react";
import { Link } from "react-router-dom";
import { PublicLayout } from "../components/layout/PublicLayout";
import { Button } from "../components/common/Button";

const areas = [
  { title: "Jobs", text: "Create, edit, close, and search requisitions. Each role keeps its department, location, and applicant count." },
  { title: "Candidates", text: "A directory of people who have a profile or an application, with search and stage filters." },
  { title: "Applications", text: "A pipeline of submissions. Recruiters change the stage. The note on the application stays with the record." },
  { title: "Screening", text: "Upload or paste a resume, choose the job, and store the match explanation with the candidate." },
  { title: "Assessments", text: "Candidates complete a short written assessment. Scores are saved and visible to the recruiting team." },
  { title: "Reports", text: "Counts and stage totals calculated from the jobs, applications, and assessments already in the workspace." },
];

export const ProductPage = () => (
  <PublicLayout>
    <section className="border-b border-line bg-paper">
      <div className="mx-auto max-w-page px-4 py-16 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-navy-800">Product</p>
        <h1 className="mt-3 max-w-3xl font-serif text-5xl text-ink-950">One workspace for the work of hiring.</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-600">
          HireSense is organised around the records a recruiting team already keeps: roles, people, applications, and the notes that explain a decision.
        </p>
      </div>
    </section>
    <section className="mx-auto grid max-w-page gap-4 px-4 py-14 sm:px-6 md:grid-cols-2">
      {areas.map((area) => (
        <article key={area.title} className="rounded-lg border border-line p-6">
          <h2 className="font-serif text-2xl text-ink-950">{area.title}</h2>
          <p className="mt-2 text-base leading-relaxed text-ink-600">{area.text}</p>
        </article>
      ))}
    </section>
    <section className="border-t border-line">
      <div className="mx-auto flex max-w-page flex-col items-start gap-4 px-4 py-14 sm:px-6">
        <h2 className="font-serif text-3xl text-ink-950">See it from the side you work on.</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/for-recruiters"><Button variant="primary">For recruiters</Button></Link>
          <Link to="/for-candidates"><Button>For candidates</Button></Link>
        </div>
      </div>
    </section>
  </PublicLayout>
);

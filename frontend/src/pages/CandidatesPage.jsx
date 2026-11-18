import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { PageHeader } from "../components/common/PageHeader";
import { Button } from "../components/common/Button";
import { Badge, stageVariant } from "../components/common/Badge";
import { Notice } from "../components/common/Notice";
import { STAGES, stageLabel } from "../lib/roles";

export const CandidatesPage = () => {
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState("ALL");
  const [sortBy, setSortBy] = useState("score-desc");
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/candidates").then((res) => setCandidates(res.data || [])).catch(() => setError("Candidates could not be loaded."));
  }, []);

  const filtered = candidates
    .filter((candidate) => {
      const haystack = `${candidate.fullName} ${candidate.email} ${candidate.currentTitle} ${candidate.skills}`.toLowerCase();
      const matchesSearch = haystack.includes(search.toLowerCase());
      const matchesStage = stage === "ALL" || candidate.currentStage === stage;
      return matchesSearch && matchesStage;
    })
    .sort((a, b) => {
      if (sortBy === "score-desc") return (b.aiMatchScore || 0) - (a.aiMatchScore || 0);
      if (sortBy === "score-asc") return (a.aiMatchScore || 0) - (b.aiMatchScore || 0);
      if (sortBy === "name-asc") return (a.fullName || "").localeCompare(b.fullName || "");
      if (sortBy === "exp-desc") return (b.experienceYears || 0) - (a.experienceYears || 0);
      return 0;
    });

  return (
    <div>
      <PageHeader
        eyebrow="Directory"
        title="Candidates"
        description="People stored from applications and resume screening."
      />
      {error ? <div className="mb-4"><Notice tone="error">{error}</Notice></div> : null}
      <div className="mb-4 grid gap-3 md:grid-cols-[1fr_180px_200px]">
        <input className="field" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email, title, or skill" />
        <select className="field" value={stage} onChange={(e) => setStage(e.target.value)}>
          <option value="ALL">All stages</option>
          {STAGES.map((item) => <option key={item} value={item}>{stageLabel(item)}</option>)}
        </select>
        <select className="field" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="score-desc">Score: High to Low</option>
          <option value="score-asc">Score: Low to High</option>
          <option value="name-asc">Name: A to Z</option>
          <option value="exp-desc">Experience: High to Low</option>
        </select>
      </div>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Candidate</th>
              <th>Title</th>
              <th>Location</th>
              <th>Score</th>
              <th>Stage</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6}>No candidates match these filters.</td></tr>
            ) : filtered.map((candidate) => (
              <tr key={candidate.id}>
                <td>
                  <p className="font-semibold text-ink-950">{candidate.fullName}</p>
                  <p className="text-sm text-ink-600">{candidate.email}</p>
                </td>
                <td>{candidate.currentTitle || "—"}</td>
                <td>{candidate.location || "—"}</td>
                <td>{candidate.aiMatchScore ?? "—"}</td>
                <td><Badge variant={stageVariant(candidate.currentStage)}>{stageLabel(candidate.currentStage)}</Badge></td>
                <td className="text-right">
                  <Link to={`/candidates/${candidate.id}`}><Button size="sm">Open profile</Button></Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

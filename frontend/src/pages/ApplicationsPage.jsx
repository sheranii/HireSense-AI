import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { PageHeader } from "../components/common/PageHeader";
import { Badge, stageVariant } from "../components/common/Badge";
import { Button } from "../components/common/Button";
import { Modal } from "../components/common/Modal";
import { Notice } from "../components/common/Notice";
import { STAGES, apiError, formatDate, stageLabel } from "../lib/roles";

export const ApplicationsPage = () => {
  const { role, user } = useAuth();
  const isCandidate = role === "CANDIDATE";
  const [params] = useSearchParams();
  const [applications, setApplications] = useState([]);
  const [stage, setStage] = useState("ALL");
  const [search, setSearch] = useState(params.get("search") || "");
  const [activeNoteApp, setActiveNoteApp] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [notice, setNotice] = useState(null);
  const [error, setError] = useState("");

  const load = () => {
    const request = isCandidate ? api.get("/applications", { params: { email: user.email } }) : api.get("/applications");
    return request.then((res) => setApplications(res.data || [])).catch(() => setError("Applications could not be loaded."));
  };

  useEffect(() => { load(); }, [isCandidate, user.email]);

  const filtered = applications.filter((item) => {
    const haystack = `${item.candidateName} ${item.jobTitle} ${item.candidateEmail}`.toLowerCase();
    return (stage === "ALL" || item.stage === stage) && haystack.includes(search.toLowerCase());
  });

  const updateStage = async (item, nextStage) => {
    try {
      await api.patch(`/applications/${item.id}/stage`, { stage: nextStage, notes: item.notes || "" });
      setNotice({ tone: "success", text: `${item.candidateName} moved to ${stageLabel(nextStage)}.` });
      await load();
    } catch (err) {
      setNotice({ tone: "error", text: apiError(err, "The stage could not be updated.") });
    }
  };

  const saveApplicationNote = async (event) => {
    event.preventDefault();
    if (!activeNoteApp || !noteText.trim()) return;
    setSavingNote(true);
    try {
      await api.patch(`/applications/${activeNoteApp.id}/stage`, {
        stage: activeNoteApp.stage,
        notes: noteText.trim(),
      });
      setNotice({ tone: "success", text: `Note saved for ${activeNoteApp.candidateName}.` });
      setActiveNoteApp(null);
      setNoteText("");
      await load();
    } catch (err) {
      setNotice({ tone: "error", text: apiError(err, "The note could not be saved.") });
    } finally {
      setSavingNote(false);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow={isCandidate ? "Your record" : "Pipeline"}
        title={isCandidate ? "My applications" : "Applications"}
        description={isCandidate ? "Roles you have applied for, and the stage recorded for each one." : "Move an application when the recruiting decision changes."}
      />
      {error ? <div className="mb-4"><Notice tone="error">{error}</Notice></div> : null}
      {notice ? <div className="mb-4"><Notice tone={notice.tone}>{notice.text}</Notice></div> : null}
      <div className="mb-4 grid gap-3 md:grid-cols-[1fr_200px]">
        <input className="field" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search candidate or role" />
        <select className="field" value={stage} onChange={(e) => setStage(e.target.value)}>
          <option value="ALL">All stages</option>
          {STAGES.map((item) => <option key={item} value={item}>{stageLabel(item)}</option>)}
        </select>
      </div>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              {!isCandidate ? <th>Candidate</th> : null}
              <th>Role</th>
              <th>Score</th>
              <th>Stage</th>
              <th>Applied</th>
              {!isCandidate ? <th>Update</th> : null}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={isCandidate ? 4 : 6}>No applications match these filters.</td></tr>
            ) : filtered.map((item) => (
              <tr key={item.id}>
                {!isCandidate ? (
                  <td>
                    <Link to={`/candidates/${item.candidateId}`} className="font-semibold text-ink-950 hover:underline">{item.candidateName}</Link>
                    <p className="text-sm text-ink-600">{item.candidateEmail}</p>
                  </td>
                ) : null}
                <td>
                  <p className="font-semibold text-ink-950">{item.jobTitle}</p>
                  <p className="text-sm text-ink-600">{item.department}</p>
                </td>
                <td>{item.matchScore ?? "—"}</td>
                <td><Badge variant={stageVariant(item.stage)}>{stageLabel(item.stage)}</Badge></td>
                <td>{formatDate(item.appliedAt)}</td>
                {!isCandidate ? (
                  <td>
                    <div className="flex items-center gap-2">
                      <select className="field text-xs" value={item.stage} onChange={(e) => updateStage(item, e.target.value)}>
                        {STAGES.map((option) => <option key={option} value={option}>{stageLabel(option)}</option>)}
                      </select>
                      <Button size="sm" onClick={() => { setActiveNoteApp(item); setNoteText(""); }}>
                        Notes
                      </Button>
                    </div>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {activeNoteApp ? (
        <Modal
          title={`Notes: ${activeNoteApp.candidateName} — ${activeNoteApp.jobTitle}`}
          onClose={() => setActiveNoteApp(null)}
        >
          <div className="space-y-4">
            <div className="rounded-md border border-line bg-paper p-3 text-xs font-mono text-ink-700 max-h-48 overflow-y-auto whitespace-pre-line leading-relaxed">
              {activeNoteApp.notes || "No notes recorded yet."}
            </div>

            <form onSubmit={saveApplicationNote} className="space-y-3">
              <label className="block text-sm font-semibold text-ink-950">
                Append Interview / Review Note
                <textarea
                  className="field mt-1"
                  rows={3}
                  required
                  placeholder="Record interview observations, feedback, or justification for stage transition..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                />
              </label>

              <div className="flex justify-end gap-2 pt-2 border-t border-line">
                <Button onClick={() => setActiveNoteApp(null)}>Cancel</Button>
                <Button type="submit" variant="primary" loading={savingNote}>
                  Save Note
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      ) : null}

      {isCandidate ? (
        <div className="mt-4">
          <Link to="/jobs"><Button variant="primary">Find another role</Button></Link>
        </div>
      ) : null}
    </div>
  );
};

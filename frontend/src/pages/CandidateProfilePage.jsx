import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { PageHeader } from "../components/common/PageHeader";
import { Button } from "../components/common/Button";
import { Badge, stageVariant } from "../components/common/Badge";
import { Notice } from "../components/common/Notice";
import { STAGES, apiError, formatDate, stageLabel } from "../lib/roles";

const blank = {
  fullName: "",
  email: "",
  phone: "",
  currentTitle: "",
  location: "",
  experienceYears: "",
  education: "",
  skills: "",
  summary: "",
  resumeUrl: "",
};

export const CandidateProfilePage = () => {
  const { id } = useParams();
  const { user, role } = useAuth();
  const ownProfile = !id;
  const [profile, setProfile] = useState(blank);
  const [exists, setExists] = useState(false);
  const [applications, setApplications] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [notice, setNotice] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  const loadRelated = async (candidate) => {
    const [apps, tests] = await Promise.all([
      api.get("/applications", { params: { email: candidate.email } }).catch(() => ({ data: [] })),
      api.get(`/assessments/candidate/${candidate.id}`).catch(() => ({ data: [] })),
    ]);
    setApplications(apps.data || []);
    setAssessments(tests.data || []);
  };

  useEffect(() => {
    const run = async () => {
      try {
        if (ownProfile) {
          setProfile((current) => ({ ...current, fullName: user.fullName, email: user.email }));
          try {
            const res = await api.get("/candidates/lookup", { params: { email: user.email } });
            setProfile({ ...blank, ...res.data, experienceYears: res.data.experienceYears ?? "" });
            setExists(true);
            await loadRelated(res.data);
          } catch (err) {
            if (err.response?.status === 404) setExists(false);
            else setError("Your profile could not be loaded.");
          }
        } else {
          const res = await api.get(`/candidates/${id}`);
          setProfile({ ...blank, ...res.data, experienceYears: res.data.experienceYears ?? "" });
          setExists(true);
          await loadRelated(res.data);
        }
      } catch {
        setError("This profile could not be loaded.");
      }
    };
    run();
  }, [id, ownProfile, user.email, user.fullName]);

  const onFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text().catch(() => "");
    setProfile((current) => ({
      ...current,
      resumeUrl: file.name,
      summary: text && !current.summary ? text.slice(0, 4000) : current.summary,
    }));
    if (!text) setNotice({ tone: "info", text: `${file.name} was attached by name. Paste the resume text into the summary if the file is not plain text.` });
  };

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setNotice(null);
    const payload = {
      ...profile,
      fullName: profile.fullName || user.fullName,
      email: user.email,
      experienceYears: profile.experienceYears === "" ? null : Number(profile.experienceYears),
    };
    try {
      const res = exists
        ? await api.put(`/candidates/${profile.id}`, payload)
        : await api.post("/candidates", payload);
      setProfile({ ...blank, ...res.data, experienceYears: res.data.experienceYears ?? "" });
      setExists(true);
      setNotice({ tone: "success", text: "Profile saved." });
      await loadRelated(res.data);
    } catch (err) {
      setNotice({ tone: "error", text: apiError(err, "The profile could not be saved.") });
    } finally {
      setSaving(false);
    }
  };

  const changeStage = async (next) => {
    try {
      const res = await api.patch(`/candidates/${profile.id}/stage?stage=${next}`);
      setProfile((current) => ({ ...current, currentStage: res.data.currentStage }));
      setNotice({ tone: "success", text: `Stage set to ${stageLabel(next)}.` });
    } catch (err) {
      setNotice({ tone: "error", text: apiError(err, "The stage could not be updated.") });
    }
  };

  const handleAddNote = async (event, appId, currentStage) => {
    event.preventDefault();
    if (!newNote.trim()) return;
    setSavingNote(true);
    try {
      await api.patch(`/applications/${appId}/stage`, { stage: currentStage, notes: newNote.trim() });
      setNotice({ tone: "success", text: "Interview note recorded." });
      setNewNote("");
      if (profile.email) {
        const apps = await api.get("/applications", { params: { email: profile.email } });
        setApplications(apps.data || []);
      }
    } catch (err) {
      setNotice({ tone: "error", text: apiError(err, "The note could not be saved.") });
    } finally {
      setSavingNote(false);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow={ownProfile ? "Candidate" : "Candidate record"}
        title={profile.fullName || "Profile"}
        description={ownProfile ? "Keep the details recruiters see when you apply." : profile.email}
        actions={!ownProfile ? <Link to="/candidates"><Button>Back to directory</Button></Link> : null}
      />
      {error ? <div className="mb-4"><Notice tone="error">{error}</Notice></div> : null}
      {notice ? <div className="mb-4"><Notice tone={notice.tone}>{notice.text}</Notice></div> : null}

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <form onSubmit={save} className="space-y-4 rounded-lg border border-line bg-white p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold">Name
              <input className="field mt-1" value={profile.fullName} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} disabled={!ownProfile} />
            </label>
            <label className="text-sm font-semibold">Email
              <input className="field mt-1" value={ownProfile ? user.email : profile.email} disabled />
            </label>
            <label className="text-sm font-semibold">Phone
              <input className="field mt-1" value={profile.phone || ""} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} disabled={!ownProfile} />
            </label>
            <label className="text-sm font-semibold">Current title
              <input className="field mt-1" value={profile.currentTitle || ""} onChange={(e) => setProfile({ ...profile, currentTitle: e.target.value })} disabled={!ownProfile} />
            </label>
            <label className="text-sm font-semibold">Location
              <input className="field mt-1" value={profile.location || ""} onChange={(e) => setProfile({ ...profile, location: e.target.value })} disabled={!ownProfile} />
            </label>
            <label className="text-sm font-semibold">Years of experience
              <input className="field mt-1" type="number" min="0" value={profile.experienceYears} onChange={(e) => setProfile({ ...profile, experienceYears: e.target.value })} disabled={!ownProfile} />
            </label>
          </div>
          <label className="block text-sm font-semibold">Education
            <textarea className="field mt-1" rows={3} value={profile.education || ""} onChange={(e) => setProfile({ ...profile, education: e.target.value })} disabled={!ownProfile} />
          </label>
          <label className="block text-sm font-semibold">Skills
            <input className="field mt-1" value={profile.skills || ""} onChange={(e) => setProfile({ ...profile, skills: e.target.value })} disabled={!ownProfile} />
          </label>
          <label className="block text-sm font-semibold">Experience summary
            <textarea className="field mt-1" rows={5} value={profile.summary || ""} onChange={(e) => setProfile({ ...profile, summary: e.target.value })} disabled={!ownProfile} />
          </label>
          {ownProfile ? (
            <label className="block text-sm font-semibold">Resume file
              <input className="mt-1 block w-full text-sm" type="file" accept=".txt,.md,.csv,text/plain" onChange={onFile} />
              {profile.resumeUrl ? <span className="mt-1 block text-sm text-ink-600">Attached: {profile.resumeUrl}</span> : null}
            </label>
          ) : profile.resumeUrl ? <p className="text-sm text-ink-600">Resume file name: {profile.resumeUrl}</p> : null}
          {ownProfile ? <Button type="submit" variant="primary" loading={saving}>Save profile</Button> : null}
        </form>

        <div className="space-y-4">
          <section className="rounded-lg border border-line bg-white p-5">
            <h2 className="font-serif text-2xl">Screening</h2>
            <p className="mt-3 text-sm text-ink-600">Score</p>
            <p className="font-serif text-3xl">{profile.aiMatchScore ?? "—"}</p>
            <p className="mt-2 text-sm text-ink-600">{profile.aiRecommendation ? profile.aiRecommendation.replaceAll("_", " ") : "No screening result yet."}</p>
            {profile.matchStrengths ? <p className="mt-3 text-sm leading-relaxed text-ink-800">{profile.matchStrengths}</p> : null}
            {profile.matchConcerns ? <p className="mt-2 text-sm leading-relaxed text-ink-600">{profile.matchConcerns}</p> : null}
            {!ownProfile && exists ? (
              <label className="mt-4 block text-sm font-semibold">Stage
                <select className="field mt-1" value={profile.currentStage || "APPLIED"} onChange={(e) => changeStage(e.target.value)}>
                  {STAGES.map((item) => <option key={item} value={item}>{stageLabel(item)}</option>)}
                </select>
              </label>
            ) : null}
          </section>
          <section className="rounded-lg border border-line bg-white p-5">
            <h2 className="font-serif text-2xl">Applications</h2>
            {applications.length === 0 ? <p className="mt-3 text-sm text-ink-600">No applications yet.</p> : (
              <ul className="mt-3 divide-y divide-line">
                {applications.map((item) => (
                  <li key={item.id} className="flex items-center justify-between gap-3 py-3">
                    <div>
                      <p className="font-semibold">{item.jobTitle}</p>
                      <p className="text-sm text-ink-600">{formatDate(item.appliedAt)}</p>
                    </div>
                    <Badge variant={stageVariant(item.stage)}>{stageLabel(item.stage)}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </section>
          {!ownProfile && applications.length > 0 ? (
            <section className="rounded-lg border border-line bg-white p-5">
              <h2 className="font-serif text-2xl">Interview & Review Notes</h2>
              <div className="mt-3 space-y-2">
                {applications.map((app) => (
                  <div key={app.id} className="rounded-md border border-line bg-paper p-3 text-xs">
                    <p className="font-semibold text-ink-950">{app.jobTitle} ({stageLabel(app.stage)})</p>
                    <p className="mt-1 whitespace-pre-line text-ink-700 font-mono text-2xs leading-relaxed">
                      {app.notes || "No notes recorded yet."}
                    </p>
                    <form onSubmit={(e) => handleAddNote(e, app.id, app.stage)} className="mt-3 pt-2 border-t border-line/60">
                      <input
                        className="field text-xs"
                        placeholder="Add candidate evaluation or interview feedback..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        required
                      />
                      <div className="mt-2 flex justify-end">
                        <Button size="sm" type="submit" variant="primary" loading={savingNote}>
                          Append Note
                        </Button>
                      </div>
                    </form>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
          <section className="rounded-lg border border-line bg-white p-5">
            <h2 className="font-serif text-2xl">Assessments</h2>
            {assessments.length === 0 ? <p className="mt-3 text-sm text-ink-600">No completed assessments.</p> : (
              <ul className="mt-3 space-y-3">
                {assessments.map((item) => (
                  <li key={item.id} className="text-sm">
                    <p className="font-semibold">{item.assessmentType}</p>
                    <p className="text-ink-600">{item.score ?? "—"} / {item.maxScore || 100} · {item.jobTitle}</p>
                  </li>
                ))}
              </ul>
            )}
            {ownProfile ? <Link to="/assessments" className="mt-3 inline-block text-sm font-semibold text-navy-800">Go to assessments</Link> : null}
          </section>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { PageHeader } from "../components/common/PageHeader";
import { Button } from "../components/common/Button";
import { Notice } from "../components/common/Notice";
import { apiError } from "../lib/roles";

const empty = {
  fullName: "",
  email: "",
  phone: "",
  currentTitle: "",
  location: "",
  experienceYears: "",
  skills: "",
  summary: "",
  education: "",
};

export const AiScreeningPage = () => {
  const [jobs, setJobs] = useState([]);
  const [jobId, setJobId] = useState("");
  const [form, setForm] = useState(empty);
  const [result, setResult] = useState(null);
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const fileInput = useRef(null);

  useEffect(() => {
    api.get("/jobs").then((res) => {
      const open = (res.data || []).filter((job) => job.status === "OPEN");
      setJobs(open.length ? open : res.data || []);
      if ((res.data || [])[0]) setJobId(String((open[0] || res.data[0]).id));
    }).catch(() => setNotice({ tone: "error", text: "Jobs could not be loaded." }));
  }, []);

  const applyExtracted = (current, data, file) => ({
    ...current,
    summary: data.summary || "",
    fullName: current.fullName || data.fullName || "",
    email: current.email || data.email || "",
    phone: current.phone || data.phone || "",
    currentTitle: data.currentTitle || current.currentTitle || "",
    location: current.location || data.location || "",
    experienceYears: data.experienceYears ?? current.experienceYears ?? "",
    skills: data.skills || current.skills || "",
    education: data.education || current.education || "",
    resumeUrl: file.name,
  });

  const onFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (isPdf) {
      if (file.size > 5 * 1024 * 1024) {
        setNotice({ tone: "error", text: "That file is larger than 5 MB. Upload a smaller PDF." });
        event.target.value = "";
        return;
      }
      const body = new FormData();
      body.append("file", file);
      setLoading(true);
      setNotice(null);
      try {
        const res = await api.post("/candidates/extract-resume", body);
        setPdfFile(file);
        setForm((current) => applyExtracted(current, res.data || {}, file));
        setNotice({ tone: "success", text: `Read the text from ${file.name}. Nothing from the raw file is shown below.` });
      } catch (err) {
        setPdfFile(null);
        setNotice({ tone: "error", text: apiError(err, "The PDF could not be read.") });
        event.target.value = "";
      } finally {
        setLoading(false);
      }
      return;
    }
    if (!/\.(txt|md|csv)$/i.test(file.name)) {
      setPdfFile(null);
      setNotice({ tone: "error", text: "Upload a PDF, or a plain-text .txt, .md, or .csv resume." });
      event.target.value = "";
      return;
    }
    const text = await file.text().catch(() => "");
    if (!text || text.includes("\u0000")) {
      setNotice({ tone: "error", text: "That file is not readable text. Upload a PDF instead of pasting the file contents." });
      event.target.value = "";
      return;
    }
    setPdfFile(null);
    setForm((current) => ({ ...current, summary: text.slice(0, 4000), resumeUrl: file.name }));
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!jobId) {
      setNotice({ tone: "error", text: "Choose a job before screening." });
      return;
    }
    setLoading(true);
    setNotice(null);
    try {
      const experienceYears = form.experienceYears === "" ? null : Number(form.experienceYears);
      let res;
      if (pdfFile) {
        const body = new FormData();
        body.append("file", pdfFile);
        body.append("fullName", form.fullName || "");
        body.append("email", form.email || "");
        body.append("phone", form.phone || "");
        body.append("currentTitle", form.currentTitle || "");
        body.append("location", form.location || "");
        body.append("skills", form.skills || "");
        body.append("education", form.education || "");
        body.append("summary", form.summary || "");
        if (experienceYears != null && !Number.isNaN(experienceYears)) {
          body.append("experienceYears", String(experienceYears));
        }
        res = await api.post(`/candidates/screen-resume/file?jobId=${jobId}`, body);
      } else {
        res = await api.post(`/candidates/screen-resume?jobId=${jobId}`, {
          ...form,
          experienceYears,
        });
      }
      setResult(res.data);
      setForm((current) => ({ ...current, summary: res.data.summary || current.summary }));
      setNotice({ tone: "success", text: "Screening saved. An application was recorded if this person had not already applied." });
    } catch (err) {
      setNotice({ tone: "error", text: apiError(err, "Screening failed.") });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Screening"
        title="AI screening"
        description="The score compares words in the resume with the requirements on the selected job. It is a reading aid, not a hiring decision."
      />
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <form onSubmit={submit} className="space-y-3 rounded-lg border border-line bg-white p-5">
          {notice ? <Notice tone={notice.tone}>{notice.text}</Notice> : null}
          <label className="block text-sm font-semibold">Job
            <select className="field mt-1" required value={jobId} onChange={(e) => setJobId(e.target.value)}>
              {jobs.length === 0 ? <option value="">No jobs available</option> : null}
              {jobs.map((job) => <option key={job.id} value={job.id}>{job.title}</option>)}
            </select>
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm font-semibold">Name<input className="field mt-1" required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></label>
            <label className="text-sm font-semibold">Email<input className="field mt-1" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
            <label className="text-sm font-semibold">Title<input className="field mt-1" value={form.currentTitle} onChange={(e) => setForm({ ...form, currentTitle: e.target.value })} /></label>
            <label className="text-sm font-semibold">Years of experience<input className="field mt-1" type="number" min="0" value={form.experienceYears} onChange={(e) => setForm({ ...form, experienceYears: e.target.value })} /></label>
          </div>
          <label className="block text-sm font-semibold">Skills
            <input className="field mt-1" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="Java, recruiting operations, SQL" />
          </label>
          <label className="block text-sm font-semibold">Resume text
            <textarea className="field mt-1" rows={6} required value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
          </label>
          <label className="block text-sm font-semibold">Or upload a resume
            <input ref={fileInput} className="mt-1 block w-full text-sm" type="file" accept=".pdf,application/pdf,.txt,.md,.csv,text/plain" onChange={onFile} />
          </label>
          {pdfFile ? <p className="text-sm text-ink-600">PDF attached: {pdfFile.name}. The box above shows extracted text only.</p> : null}
          <div className="flex gap-2">
            <Button type="submit" variant="primary" loading={loading}>Screen resume</Button>
            <Button onClick={() => { setForm(empty); setResult(null); setPdfFile(null); if (fileInput.current) fileInput.current.value = ""; }}>Clear</Button>
          </div>
        </form>
        <aside className="rounded-lg border border-line bg-white p-5">
          <h2 className="font-serif text-2xl">Result</h2>
          {!result ? (
            <p className="mt-3 text-sm leading-relaxed text-ink-600">Submit a resume to store a score, the overlapping terms, and a candidate record.</p>
          ) : (
            <div className="mt-4 space-y-3 text-sm leading-relaxed">
              <p className="font-serif text-4xl text-ink-950">{result.aiMatchScore ?? "—"}</p>
              <p className="font-semibold">{(result.aiRecommendation || "").replaceAll("_", " ")}</p>
              <p className="whitespace-pre-line">{result.matchStrengths}</p>
              <p className="whitespace-pre-line text-ink-600">{result.matchConcerns}</p>
              <Link to={`/candidates/${result.id}`} className="inline-block font-semibold text-navy-800">Open candidate profile</Link>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

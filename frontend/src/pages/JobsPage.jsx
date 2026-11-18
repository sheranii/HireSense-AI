import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { PageHeader } from "../components/common/PageHeader";
import { Button } from "../components/common/Button";
import { Badge } from "../components/common/Badge";
import { Modal } from "../components/common/Modal";
import { Notice } from "../components/common/Notice";
import { apiError } from "../lib/roles";

const EMPTY_JOB = {
  title: "",
  department: "Engineering",
  location: "",
  type: "Full-time",
  status: "OPEN",
  salaryRange: "",
  description: "",
  requirements: "",
  experienceLevel: "",
};

export const JobsPage = () => {
  const { role, user } = useAuth();
  const canManage = role === "RECRUITER" || role === "ADMIN";
  const [params, setParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_JOB);
  const [applyJob, setApplyJob] = useState(null);
  const [profile, setProfile] = useState({ skills: "", summary: "", experienceYears: "", education: "", phone: "", currentTitle: "", location: "" });
  const [notice, setNotice] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () => api.get("/jobs").then((res) => setJobs(res.data || [])).catch(() => setError("Jobs could not be loaded."));

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (params.get("create") === "1" && canManage) {
      setEditing("new");
      setForm(EMPTY_JOB);
    }
  }, [params, canManage]);

  const departments = useMemo(() => ["ALL", ...new Set(jobs.map((job) => job.department).filter(Boolean))], [jobs]);

  const filtered = jobs.filter((job) => {
    const haystack = `${job.title} ${job.department} ${job.location}`.toLowerCase();
    const matchesSearch = haystack.includes(search.toLowerCase());
    const matchesDept = department === "ALL" || job.department === department;
    const matchesStatus = status === "ALL" || job.status === status;
    const visible = canManage || job.status === "OPEN";
    return visible && matchesSearch && matchesDept && matchesStatus;
  });

  const closeEditor = () => {
    setEditing(null);
    setParams({});
  };

  const saveJob = async (event) => {
    event.preventDefault();
    setSaving(true);
    setNotice(null);
    try {
      const payload = {
        title: form.title,
        department: form.department,
        location: form.location,
        type: form.type,
        status: form.status || "OPEN",
        salaryRange: form.salaryRange,
        description: form.description,
        requirements: form.requirements,
        experienceLevel: form.experienceLevel,
      };
      if (editing === "new") {
        await api.post("/jobs", payload);
        setNotice({ tone: "success", text: "The job was published." });
      } else {
        await api.put(`/jobs/${editing.id}`, payload);
        setNotice({ tone: "success", text: "The job was updated." });
      }
      closeEditor();
      await load();
    } catch (err) {
      setNotice({ tone: "error", text: apiError(err, "The job could not be saved.") });
    } finally {
      setSaving(false);
    }
  };

  const removeJob = async (job) => {
    if (!window.confirm(`Delete “${job.title}”? Applications linked to it may fail to load.`)) return;
    try {
      await api.delete(`/jobs/${job.id}`);
      setNotice({ tone: "success", text: "The job was deleted." });
      await load();
    } catch (err) {
      setNotice({ tone: "error", text: apiError(err, "The job could not be deleted.") });
    }
  };

  const setJobStatus = async (job, next) => {
    try {
      await api.patch(`/jobs/${job.id}/status?status=${next}`);
      setNotice({ tone: "success", text: `Status set to ${next}.` });
      await load();
    } catch (err) {
      setNotice({ tone: "error", text: apiError(err, "The status could not be changed.") });
    }
  };

  const submitApplication = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await api.post(`/applications?jobId=${applyJob.id}`, {
        fullName: user.fullName,
        email: user.email,
        phone: profile.phone,
        currentTitle: profile.currentTitle,
        location: profile.location,
        experienceYears: profile.experienceYears ? Number(profile.experienceYears) : null,
        skills: profile.skills,
        summary: profile.summary,
        education: profile.education,
      });
      setNotice({ tone: "success", text: `Application sent for ${applyJob.title}.` });
      setApplyJob(null);
      await load();
    } catch (err) {
      setNotice({ tone: "error", text: apiError(err, "The application could not be submitted.") });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow={canManage ? "Recruiting" : "Opportunities"}
        title={canManage ? "Jobs" : "Find jobs"}
        description={canManage ? "Search the requisitions on file, then create or update a role." : "Open roles you can apply for with the profile on your account."}
        actions={canManage ? <Button variant="primary" onClick={() => { setEditing("new"); setForm(EMPTY_JOB); }}>Post a job</Button> : null}
      />
      {error ? <div className="mb-4"><Notice tone="error">{error}</Notice></div> : null}
      {notice && !editing && !applyJob ? <div className="mb-4"><Notice tone={notice.tone}>{notice.text}</Notice></div> : null}

      <div className="mb-4 grid gap-3 md:grid-cols-[1fr_180px_160px]">
        <input className="field" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search title, department, or location" />
        <select className="field" value={department} onChange={(e) => setDepartment(e.target.value)}>
          {departments.map((item) => <option key={item} value={item}>{item === "ALL" ? "All departments" : item}</option>)}
        </select>
        <select className="field" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="ALL">All statuses</option>
          <option value="OPEN">Open</option>
          <option value="DRAFT">Draft</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Role</th>
              <th>Department</th>
              <th>Location</th>
              <th>Applications</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="text-ink-600">No jobs match these filters.</td></tr>
            ) : filtered.map((job) => (
              <tr key={job.id} className={params.get("focus") === String(job.id) ? "bg-navy-50" : ""}>
                <td>
                  <p className="font-semibold text-ink-950">{job.title}</p>
                  <p className="text-sm text-ink-600">{job.type}{job.salaryRange ? ` · ${job.salaryRange}` : ""}</p>
                </td>
                <td>{job.department}</td>
                <td>{job.location}</td>
                <td>
                  {canManage ? (
                    <Link to={`/applications?search=${encodeURIComponent(job.title)}`} className="font-semibold text-navy-800 hover:underline">
                      {job.applicantCount || 0}
                    </Link>
                  ) : (
                    job.applicantCount || 0
                  )}
                </td>
                <td><Badge variant={job.status === "OPEN" ? "green" : "default"}>{job.status}</Badge></td>
                <td>
                  <div className="flex flex-wrap gap-2">
                    {canManage ? (
                      <>
                        <Button size="sm" onClick={() => { setEditing(job); setForm({ ...EMPTY_JOB, ...job }); }}>Edit</Button>
                        {job.status === "OPEN"
                          ? <Button size="sm" onClick={() => setJobStatus(job, "CLOSED")}>Close</Button>
                          : <Button size="sm" onClick={() => setJobStatus(job, "OPEN")}>Reopen</Button>}
                        <Button size="sm" variant="danger" onClick={() => removeJob(job)}>Delete</Button>
                      </>
                    ) : (
                      <Button size="sm" variant="primary" onClick={() => setApplyJob(job)}>Apply</Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing ? (
        <Modal title={editing === "new" ? "Post a job" : "Edit job"} onClose={closeEditor}>
          <form onSubmit={saveJob} className="space-y-3">
            {notice ? <Notice tone={notice.tone}>{notice.text}</Notice> : null}
            <label className="block text-sm font-semibold">Title<input className="field mt-1" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-sm font-semibold">Department<input className="field mt-1" value={form.department || ""} onChange={(e) => setForm({ ...form, department: e.target.value })} /></label>
              <label className="block text-sm font-semibold">Location<input className="field mt-1" value={form.location || ""} onChange={(e) => setForm({ ...form, location: e.target.value })} /></label>
              <label className="block text-sm font-semibold">Type<input className="field mt-1" value={form.type || ""} onChange={(e) => setForm({ ...form, type: e.target.value })} /></label>
              <label className="block text-sm font-semibold">Salary range<input className="field mt-1" value={form.salaryRange || ""} onChange={(e) => setForm({ ...form, salaryRange: e.target.value })} /></label>
            </div>
            <label className="block text-sm font-semibold">Description<textarea className="field mt-1" rows={3} value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
            <label className="block text-sm font-semibold">Requirements<textarea className="field mt-1" rows={3} value={form.requirements || ""} onChange={(e) => setForm({ ...form, requirements: e.target.value })} /></label>
            <div className="flex justify-end gap-2">
              <Button onClick={closeEditor}>Cancel</Button>
              <Button type="submit" variant="primary" loading={saving}>Save</Button>
            </div>
          </form>
        </Modal>
      ) : null}

      {applyJob ? (
        <Modal title={`Apply for ${applyJob.title}`} onClose={() => setApplyJob(null)}>
          <form onSubmit={submitApplication} className="space-y-3">
            {notice ? <Notice tone={notice.tone}>{notice.text}</Notice> : null}
            <p className="text-sm text-ink-600">Applying as {user.fullName} ({user.email}).</p>
            <label className="block text-sm font-semibold">Current title<input className="field mt-1" value={profile.currentTitle} onChange={(e) => setProfile({ ...profile, currentTitle: e.target.value })} /></label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-sm font-semibold">Location<input className="field mt-1" value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} /></label>
              <label className="block text-sm font-semibold">Years of experience<input className="field mt-1" type="number" min="0" value={profile.experienceYears} onChange={(e) => setProfile({ ...profile, experienceYears: e.target.value })} /></label>
            </div>
            <label className="block text-sm font-semibold">Education<textarea className="field mt-1" rows={2} value={profile.education} onChange={(e) => setProfile({ ...profile, education: e.target.value })} /></label>
            <label className="block text-sm font-semibold">Skills<input className="field mt-1" value={profile.skills} onChange={(e) => setProfile({ ...profile, skills: e.target.value })} placeholder="Comma-separated skills" /></label>
            <label className="block text-sm font-semibold">Summary<textarea className="field mt-1" rows={4} required value={profile.summary} onChange={(e) => setProfile({ ...profile, summary: e.target.value })} /></label>
            <div className="flex justify-end gap-2">
              <Button onClick={() => setApplyJob(null)}>Cancel</Button>
              <Button type="submit" variant="primary" loading={saving}>Submit application</Button>
            </div>
          </form>
        </Modal>
      ) : null}
    </div>
  );
};

import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { PageHeader } from "../components/common/PageHeader";
import { Button } from "../components/common/Button";
import { Notice } from "../components/common/Notice";
import { apiError } from "../lib/roles";

export const SettingsPage = () => {
  const { user, updateProfile, role } = useAuth();
  const [form, setForm] = useState({ fullName: "", title: "", department: "" });
  const [compactTables, setCompactTables] = useState(false);
  const [notice, setNotice] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({
      fullName: user?.fullName || "",
      title: user?.title || "",
      department: user?.department || "",
    });
    setCompactTables(localStorage.getItem("hiresense_compact_tables") === "true");
  }, [user]);

  const saveAccount = async (event) => {
    event.preventDefault();
    setSaving(true);
    setNotice(null);
    try {
      await updateProfile(form);
      setNotice({ tone: "success", text: "Account details saved." });
    } catch (err) {
      setNotice({ tone: "error", text: apiError(err, "The account could not be updated.") });
    } finally {
      setSaving(false);
    }
  };

  const savePreference = (event) => {
    event.preventDefault();
    localStorage.setItem("hiresense_compact_tables", String(compactTables));
    document.documentElement.dataset.density = compactTables ? "compact" : "regular";
    setNotice({ tone: "success", text: "Display preference saved in this browser." });
  };

  return (
    <div>
      <PageHeader
        eyebrow="Account"
        title="Settings"
        description="Update the name and title stored on your sign-in account."
      />
      {notice ? <div className="mb-4"><Notice tone={notice.tone}>{notice.text}</Notice></div> : null}
      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={saveAccount} className="space-y-4 rounded-lg border border-line bg-white p-5">
          <h2 className="font-serif text-2xl">Profile</h2>
          <p className="text-sm text-ink-600">{user?.email} · {role}</p>
          <label className="block text-sm font-semibold">Full name
            <input className="field mt-1" required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          </label>
          <label className="block text-sm font-semibold">Title
            <input className="field mt-1" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </label>
          <label className="block text-sm font-semibold">Department
            <input className="field mt-1" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
          </label>
          <Button type="submit" variant="primary" loading={saving}>Save account</Button>
        </form>
        <form onSubmit={savePreference} className="space-y-4 rounded-lg border border-line bg-white p-5">
          <h2 className="font-serif text-2xl">Workspace preference</h2>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1" checked={compactTables} onChange={(e) => setCompactTables(e.target.checked)} />
            <span>
              <span className="font-semibold">Use tighter table spacing</span>
              <span className="mt-1 block text-ink-600">Stored only in this browser. It does not change other people’s accounts.</span>
            </span>
          </label>
          <Button type="submit" variant="primary">Save preference</Button>
        </form>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { PageHeader } from "../components/common/PageHeader";
import { Button } from "../components/common/Button";
import { Notice } from "../components/common/Notice";
import { formatDate, apiError } from "../lib/roles";

const QUESTIONS = [
  {
    prompt: "A requisition should be visible to candidates when its status is:",
    options: ["Closed", "Open", "Deleted", "Draft only"],
    answer: 1,
  },
  {
    prompt: "What should a recruiter record when they change their mind about a candidate?",
    options: ["Nothing", "The new application stage", "A public testimonial", "A database health check"],
    answer: 1,
  },
  {
    prompt: "A screening score in HireSense is based on:",
    options: ["A guaranteed interview outcome", "Overlap between resume text and job requirements", "The candidate’s photo", "How recently they signed in"],
    answer: 1,
  },
  {
    prompt: "Before submitting an application, a candidate should include:",
    options: ["Only a display name", "Skills and a summary of experience", "Another person’s resume", "A made-up score"],
    answer: 1,
  },
];

export const AssessmentsPage = () => {
  const { role, user } = useAuth();
  const isCandidate = role === "CANDIDATE";
  const [records, setRecords] = useState([]);
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [notice, setNotice] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      if (isCandidate) {
        const profile = await api.get("/candidates/lookup", { params: { email: user.email } });
        const res = await api.get(`/assessments/candidate/${profile.data.id}`);
        setRecords(res.data || []);
      } else {
        const res = await api.get("/assessments");
        setRecords(res.data || []);
      }
    } catch (err) {
      if (isCandidate && err.response?.status === 404) setRecords([]);
      else setError("Assessments could not be loaded.");
    }
  };

  useEffect(() => { load(); }, [isCandidate, user.email]);

  const submit = async () => {
    if (Object.keys(answers).length < QUESTIONS.length) {
      setNotice({ tone: "error", text: "Answer every question before submitting." });
      return;
    }
    setSaving(true);
    try {
      let candidateId;
      try {
        const existing = await api.get("/candidates/lookup", { params: { email: user.email } });
        candidateId = existing.data.id;
      } catch {
        const created = await api.post("/candidates", { fullName: user.fullName, email: user.email, currentStage: "APPLIED" });
        candidateId = created.data.id;
      }
      const correct = QUESTIONS.filter((question, index) => answers[index] === question.answer).length;
      const score = Math.round((correct / QUESTIONS.length) * 100);
      await api.post("/assessments/submit", {
        candidateId,
        jobTitle: "General hiring process",
        assessmentType: "Workplace orientation",
        score,
        feedback: `${correct} of ${QUESTIONS.length} answers matched the expected response.`,
      });
      setNotice({ tone: "success", text: `Assessment saved. Score: ${score}.` });
      setStarted(false);
      setAnswers({});
      await load();
    } catch (err) {
      setNotice({ tone: "error", text: apiError(err, "The assessment could not be saved.") });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Assessments"
        title={isCandidate ? "Your assessments" : "Assessment results"}
        description={isCandidate
          ? "A short orientation check. Your score is stored with your candidate record."
          : "Completed assessments stored for candidates in this workspace."}
      />
      {error ? <div className="mb-4"><Notice tone="error">{error}</Notice></div> : null}
      {notice ? <div className="mb-4"><Notice tone={notice.tone}>{notice.text}</Notice></div> : null}

      {isCandidate ? (
        <section className="mb-8 rounded-lg border border-line bg-white p-5">
          {!started ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-serif text-2xl">Workplace orientation</h2>
                <p className="mt-1 text-sm text-ink-600">{QUESTIONS.length} questions. You can retake it; each submission is saved.</p>
              </div>
              <Button variant="primary" onClick={() => { setStarted(true); setNotice(null); }}>Start assessment</Button>
            </div>
          ) : (
            <div className="space-y-5">
              {QUESTIONS.map((question, index) => (
                <fieldset key={question.prompt}>
                  <legend className="text-sm font-semibold text-ink-950">{index + 1}. {question.prompt}</legend>
                  <div className="mt-2 space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <label key={option} className="flex items-center gap-2 text-sm">
                        <input type="radio" name={`q-${index}`} checked={answers[index] === optionIndex} onChange={() => setAnswers({ ...answers, [index]: optionIndex })} />
                        {option}
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}
              <div className="flex gap-2">
                <Button onClick={() => setStarted(false)}>Cancel</Button>
                <Button variant="primary" loading={saving} onClick={submit}>Submit answers</Button>
              </div>
            </div>
          )}
        </section>
      ) : null}

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              {!isCandidate ? <th>Candidate</th> : null}
              <th>Assessment</th>
              <th>Role context</th>
              <th>Score</th>
              <th>Completed</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr><td colSpan={isCandidate ? 4 : 5}>No assessment results yet.</td></tr>
            ) : records.map((item) => (
              <tr key={item.id}>
                {!isCandidate ? <td>{item.candidateName || "—"}</td> : null}
                <td>{item.assessmentType}</td>
                <td>{item.jobTitle}</td>
                <td>{item.score ?? "—"} / {item.maxScore || 100}</td>
                <td>{formatDate(item.completedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isCandidate && records.length === 0 ? (
        <p className="mt-4 text-sm text-ink-600">Save your <Link to="/profile" className="font-semibold text-navy-800">profile</Link> if you want screening and applications to use the same details.</p>
      ) : null}
    </div>
  );
};

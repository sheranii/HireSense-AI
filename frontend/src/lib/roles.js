export function homeForRole(role) {
  if (role === "ADMIN") return "/admin";
  if (role === "CANDIDATE") return "/portal";
  return "/recruiter";
}

export function apiError(err, fallback) {
  const data = err?.response?.data;
  if (!data) return fallback;
  if (typeof data === "string") return data;
  if (data.message) return data.message;
  const first = Object.values(data)[0];
  return typeof first === "string" ? first : fallback;
}

export function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function stageLabel(stage) {
  if (!stage) return "Applied";
  return stage.charAt(0) + stage.slice(1).toLowerCase();
}

export const STAGES = ["APPLIED", "SCREENING", "TECHNICAL", "INTERVIEW", "OFFER", "REJECTED"];

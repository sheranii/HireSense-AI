import React, { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { 
  Bell, 
  Briefcase, 
  ChevronLeft, 
  ChevronRight, 
  Cpu, 
  FileText, 
  LayoutDashboard, 
  Layers, 
  LogOut, 
  Menu, 
  Search, 
  Settings, 
  ShieldCheck, 
  Sparkles, 
  User, 
  UserCheck, 
  Users, 
  X,
  BarChart3,
  CheckSquare,
  Server
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Logo } from "./Logo";
import api from "../../api/client";
import { formatDate, homeForRole, stageLabel } from "../../lib/roles";
import { Badge, stageVariant } from "../common/Badge";

const NAV_ICONS = {
  Overview: LayoutDashboard,
  Jobs: Briefcase,
  "Find Jobs": Briefcase,
  Candidates: Users,
  Applications: Layers,
  "My Applications": Layers,
  "AI Screening": Sparkles,
  "AI Resume Screening": Sparkles,
  Assessments: CheckSquare,
  Reports: BarChart3,
  "My Profile": UserCheck,
  Users: Users,
  "System Management": Server,
  Settings: Settings,
};

const NAV = {
  RECRUITER: [
    { name: "Overview", href: "/recruiter" },
    { name: "Jobs", href: "/jobs" },
    { name: "Candidates", href: "/candidates" },
    { name: "Applications", href: "/applications" },
    { name: "AI Resume Screening", href: "/ai-screening" },
    { name: "Assessments", href: "/assessments" },
    { name: "Reports", href: "/reports" },
    { name: "Settings", href: "/settings" },
  ],
  CANDIDATE: [
    { name: "Overview", href: "/portal" },
    { name: "Find Jobs", href: "/jobs" },
    { name: "My Applications", href: "/applications" },
    { name: "Assessments", href: "/assessments" },
    { name: "My Profile", href: "/profile" },
    { name: "Settings", href: "/settings" },
  ],
  ADMIN: [
    { name: "Overview", href: "/admin" },
    { name: "Users", href: "/admin/users" },
    { name: "Jobs", href: "/jobs" },
    { name: "Applications", href: "/applications" },
    { name: "System Management", href: "/admin/system" },
    { name: "Settings", href: "/settings" },
  ],
};

export const AppLayout = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [query, setQuery] = useState("");
  const [jobs, setJobs] = useState([]);
  const [notesOpen, setNotesOpen] = useState(false);
  const [activity, setActivity] = useState([]);

  const navigation = NAV[role] || NAV.RECRUITER;

  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
    setQuery("");
  }, [location.pathname]);

  useEffect(() => {
    if (role === "CANDIDATE") return;
    api.get("/jobs").then((res) => setJobs(res.data || [])).catch(() => setJobs([]));
    api.get("/applications").then((res) => setActivity((res.data || []).slice(0, 6))).catch(() => setActivity([]));
  }, [role]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const pages = navigation
      .filter((item) => item.name.toLowerCase().includes(q))
      .map((item) => ({ label: item.name, href: item.href, kind: "Page" }));
    const jobHits = jobs
      .filter((job) => `${job.title} ${job.department}`.toLowerCase().includes(q))
      .slice(0, 5)
      .map((job) => ({ label: job.title, href: role === "CANDIDATE" ? "/jobs" : `/jobs?focus=${job.id}`, kind: "Job" }));
    return [...pages, ...jobHits].slice(0, 8);
  }, [query, navigation, jobs, role]);

  const signOut = () => {
    logout();
    navigate("/");
  };

  const roleLabels = {
    RECRUITER: "Recruiter Workspace",
    CANDIDATE: "Candidate Portal",
    ADMIN: "System Admin",
  };

  const sidebarContent = (
    <div className="flex h-full flex-col bg-white select-none">
      {/* Sidebar Header / Logo */}
      <div className={`flex h-16 items-center border-b border-slate-100 ${collapsed ? "justify-center px-2" : "justify-between px-5"}`}>
        <Logo to={homeForRole(role)} collapsed={collapsed} />
        {!collapsed && (
          <button
            type="button"
            onClick={() => setCollapsed(true)}
            aria-label="Collapse sidebar"
            className="hidden lg:flex h-6 w-6 items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Role Workspace Indicator */}
      {!collapsed && (
        <div className="px-5 pt-4 pb-2">
          <div className="flex items-center justify-between text-2xs font-mono font-medium text-slate-400 uppercase tracking-wider">
            <span>{roleLabels[role] || "Workspace"}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </div>
        </div>
      )}

      {/* Nav Items */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-3">
        {navigation.map((item) => {
          const Icon = NAV_ICONS[item.name] || FileText;
          return (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === "/admin"}
              title={collapsed ? item.name : undefined}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                  isActive
                    ? "bg-slate-900 text-white font-semibold shadow-subtle"
                    : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                } ${collapsed ? "justify-center px-2" : ""}`
              }
            >
              <Icon className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-105`} />
              {!collapsed && <span className="truncate">{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Sidebar Footer / Collapse toggle for collapsed mode */}
      {collapsed && (
        <div className="hidden lg:flex justify-center p-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            aria-label="Expand sidebar"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* User Profile Footer */}
      <div className="border-t border-slate-100 p-3 bg-slate-50/50">
        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen((prev) => !prev)}
            className={`flex w-full items-center gap-2.5 rounded-lg p-1.5 text-left transition-colors hover:bg-slate-100 ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white shadow-subtle">
              {(user?.fullName || "?").slice(0, 1).toUpperCase()}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <span className="block truncate text-xs font-semibold text-slate-900">
                  {user?.fullName}
                </span>
                <span className="block truncate text-2xs text-slate-500 font-mono">
                  {user?.role ? `ROLE_${user.role}` : ""}
                </span>
              </div>
            )}
          </button>

          {/* Profile Dropdown Popover */}
          {profileOpen && (
            <div
              className={`absolute bottom-full mb-2 z-50 rounded-xl border border-slate-200 bg-white p-1.5 shadow-elevated transition-all ${
                collapsed ? "left-12 w-48" : "left-0 right-0"
              }`}
            >
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900 truncate">{user?.fullName}</p>
                <p className="text-2xs text-slate-500 truncate font-mono">{user?.email}</p>
              </div>
              <button
                type="button"
                onClick={() => navigate("/settings")}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <Settings className="h-3.5 w-3.5 text-slate-400" />
                <span>Account settings</span>
              </button>
              <button
                type="button"
                onClick={signOut}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-rose-700 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5 text-rose-500" />
                <span>Sign out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen bg-slate-50 transition-all ${collapsed ? "lg:pl-16" : "lg:pl-60"}`}>
      {/* Desktop Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden border-r border-slate-200/90 bg-white transition-all duration-200 lg:block ${
          collapsed ? "w-16" : "w-60"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] transition-opacity"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
          <aside className="relative h-full w-72 max-w-[85vw] bg-white shadow-panel animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Header and Main Content */}
      <div className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <button
              type="button"
              className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 lg:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label="Open mobile navigation"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Omni Search Bar */}
            <div className="relative w-full max-w-md">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search candidates, jobs, or pages..."
                className="field pl-8.5 pr-8 text-xs bg-slate-50/70 focus:bg-white"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}

              {/* Quick Search Popover */}
              {results.length > 0 && (
                <div className="absolute z-50 mt-1.5 w-full overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-elevated">
                  {results.map((result) => (
                    <button
                      key={`${result.kind}-${result.label}`}
                      type="button"
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs hover:bg-slate-50 transition-colors"
                      onClick={() => navigate(result.href)}
                    >
                      <span className="font-semibold text-slate-900">{result.label}</span>
                      <span className="text-2xs font-mono uppercase text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        {result.kind}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Header Badges and Notifications */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-2xs font-mono font-medium text-slate-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>{roleLabels[role] || role}</span>
            </span>

            {role !== "CANDIDATE" && (
              <div className="relative">
                <button
                  type="button"
                  className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100 transition-colors"
                  aria-label="Recent applications"
                  onClick={() => setNotesOpen((prev) => !prev)}
                >
                  <Bell className="h-4 w-4" />
                  {activity.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-600" />
                  )}
                </button>

                {notesOpen && (
                  <div className="absolute right-0 z-50 mt-2 w-80 max-w-[85vw] rounded-xl border border-slate-200 bg-white p-3 shadow-panel">
                    <div className="mb-2.5 flex items-center justify-between border-b border-slate-100 pb-2">
                      <p className="text-xs font-bold text-slate-900">Recent Applications</p>
                      <button
                        type="button"
                        onClick={() => setNotesOpen(false)}
                        className="rounded p-1 text-slate-400 hover:bg-slate-100"
                        aria-label="Close"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {activity.length === 0 ? (
                      <p className="py-4 text-center text-xs text-slate-500">No applications recorded yet.</p>
                    ) : (
                      <div className="space-y-1 max-h-64 overflow-y-auto">
                        {activity.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              navigate("/applications");
                              setNotesOpen(false);
                            }}
                            className="block w-full rounded-lg p-2 text-left hover:bg-slate-50 transition-colors"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-xs font-semibold text-slate-900 truncate">
                                {item.candidateName}
                              </p>
                              <Badge variant={stageVariant(item.stage)} size="xs">
                                {stageLabel(item.stage)}
                              </Badge>
                            </div>
                            <p className="text-2xs text-slate-500 mt-0.5 truncate font-sans">
                              {item.jobTitle} · {formatDate(item.appliedAt)}
                            </p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="mx-auto w-full max-w-page flex-1 px-4 py-7 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

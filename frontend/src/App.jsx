import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AppLayout } from "./components/layout/AppLayout";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { LandingPage } from "./pages/LandingPage";
import { ProductPage } from "./pages/ProductPage";
import { HowItWorksPage } from "./pages/HowItWorksPage";
import { ForRecruitersPage } from "./pages/ForRecruitersPage";
import { ForCandidatesPage } from "./pages/ForCandidatesPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { RecruiterDashboard } from "./pages/RecruiterDashboard";
import { CandidateDashboard } from "./pages/CandidateDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";
import { JobsPage } from "./pages/JobsPage";
import { CandidatesPage } from "./pages/CandidatesPage";
import { CandidateProfilePage } from "./pages/CandidateProfilePage";
import { ApplicationsPage } from "./pages/ApplicationsPage";
import { AiScreeningPage } from "./pages/AiScreeningPage";
import { AssessmentsPage } from "./pages/AssessmentsPage";
import { ReportsPage } from "./pages/ReportsPage";
import { SettingsPage } from "./pages/SettingsPage";

const guard = (allow, element) => <ProtectedRoute allow={allow}>{element}</ProtectedRoute>;

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/for-recruiters" element={<ForRecruitersPage />} />
          <Route path="/for-candidates" element={<ForCandidatesPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={guard(["RECRUITER", "CANDIDATE", "ADMIN"], <AppLayout />)}>
            <Route path="/recruiter" element={guard(["RECRUITER"], <RecruiterDashboard />)} />
            <Route path="/portal" element={guard(["CANDIDATE"], <CandidateDashboard />)} />
            <Route path="/admin" element={guard(["ADMIN"], <AdminDashboard view="overview" />)} />
            <Route path="/admin/users" element={guard(["ADMIN"], <AdminDashboard view="users" />)} />
            <Route path="/admin/system" element={guard(["ADMIN"], <AdminDashboard view="system" />)} />
            <Route path="/jobs" element={guard(["RECRUITER", "CANDIDATE", "ADMIN"], <JobsPage />)} />
            <Route path="/candidates" element={guard(["RECRUITER", "ADMIN"], <CandidatesPage />)} />
            <Route path="/candidates/:id" element={guard(["RECRUITER", "ADMIN"], <CandidateProfilePage />)} />
            <Route path="/profile" element={guard(["CANDIDATE"], <CandidateProfilePage />)} />
            <Route path="/applications" element={guard(["RECRUITER", "CANDIDATE", "ADMIN"], <ApplicationsPage />)} />
            <Route path="/ai-screening" element={guard(["RECRUITER", "ADMIN"], <AiScreeningPage />)} />
            <Route path="/assessments" element={guard(["RECRUITER", "CANDIDATE", "ADMIN"], <AssessmentsPage />)} />
            <Route path="/reports" element={guard(["RECRUITER", "ADMIN"], <ReportsPage />)} />
            <Route path="/settings" element={guard(["RECRUITER", "CANDIDATE", "ADMIN"], <SettingsPage />)} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

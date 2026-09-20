import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppShell } from './components/AppShell';
import { RequireAuth } from './components/RequireAuth';

/* Pages */
import { LoginPage }     from './pages/LoginPage';
import { WelcomePage }   from './pages/WelcomePage';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { ApiTestPage }   from './pages/ApiTestPage';
import { ComponentsPreviewPage } from './pages/ComponentsPreviewPage';

import {
  AccessibilityStatementPage,
  PrivacyPolicyPage,
  TermsConditionsPage,
  CopyrightPolicyPage,
  HyperlinkPolicyPage,
  SitemapPage,
} from './pages/policy/PolicyPages';

import { StewardDashboardPage } from './pages/steward/StewardDashboardPage';
import { DataOnboardingPage } from './pages/steward/DataOnboardingPage';
import { FieldMappingPage } from './pages/steward/FieldMappingPage';
import { QualityAlertsPage } from './pages/steward/QualityAlertsPage';
import { QualityAlertDetailPage } from './pages/steward/QualityAlertDetailPage';
import { ClarificationsInboxPage } from './pages/steward/ClarificationsInboxPage';
import { ClarificationDetailPage } from './pages/steward/ClarificationDetailPage';
import { CnmcSearchPage } from './pages/steward/CnmcSearchPage';
import { NationalMaterialPassportPage } from './pages/steward/NationalMaterialPassportPage';
import { NewCodeRequestPage } from './pages/steward/NewCodeRequestPage';

import { ReviewerDashboardPage } from './pages/reviewer/ReviewerDashboardPage';
import { PendingMatchQueuePage } from './pages/reviewer/PendingMatchQueuePage';
import { MatchDetailPage } from './pages/reviewer/MatchDetailPage';
import { ClarificationRequestFormPage } from './pages/reviewer/ClarificationRequestFormPage';
import { ClarificationTrackerPage } from './pages/reviewer/ClarificationTrackerPage';

import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { CpseManagementPage } from './pages/admin/CpseManagementPage';
import { CategoriesPage } from './pages/admin/CategoriesPage';
import { TrustScoreThresholdsPage } from './pages/admin/TrustScoreThresholdsPage';
import { CnmcRegistryManagementPage } from './pages/admin/CnmcRegistryManagementPage';
import { NationalAnalyticsPage } from './pages/admin/NationalAnalyticsPage';
import { AuditLogPage } from './pages/admin/AuditLogPage';
import { DisputeResolutionPage } from './pages/admin/DisputeResolutionPage';
import { DisputeDetailPage } from './pages/admin/DisputeDetailPage';

import './styles/global.css';

/* ================================================================
   Stub wrappers — each returns a PlaceholderPage with its title.
   These are replaced screen-by-screen in later phases.
   ================================================================ */
const Stub = ({ t }: { t: string }) => <PlaceholderPage title={t} />;

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* ── Public ──────────────────────────────── */}
          <Route path="/login" element={<LoginPage />} />

          {/* ── Dev / test (no auth required) ───────── */}
          <Route path="/dev/api-test" element={<AppShell><ApiTestPage /></AppShell>} />
          <Route path="/dev/components" element={<AppShell><ComponentsPreviewPage /></AppShell>} />

          {/* ── App shell wrapper ───────────────────── */}
          <Route path="/app/*" element={<AppShell><AppRoutes /></AppShell>} />

          {/* ── Policy pages (no auth required) ──────── */}
          <Route path="/policy/accessibility" element={<AppShell><AccessibilityStatementPage /></AppShell>} />
          <Route path="/policy/privacy"       element={<AppShell><PrivacyPolicyPage /></AppShell>} />
          <Route path="/policy/terms"         element={<AppShell><TermsConditionsPage /></AppShell>} />
          <Route path="/policy/copyright"     element={<AppShell><CopyrightPolicyPage /></AppShell>} />
          <Route path="/policy/hyperlink"     element={<AppShell><HyperlinkPolicyPage /></AppShell>} />
          <Route path="/sitemap"              element={<AppShell><SitemapPage /></AppShell>} />

          {/* Root → steward dashboard (will hit RequireAuth → /login if not logged in) */}
          <Route path="/" element={<Navigate to="/app/steward/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

/* ── All /app/* routes (rendered inside AppShell) ────────────── */
function AppRoutes() {
  return (
    <Routes>

      {/* ── CPSE Data Steward ──────────────────────── */}
      <Route path="steward/*" element={
        <RequireAuth section="steward">
          <Routes>
            <Route path="dashboard"                element={<StewardDashboardPage />} />
            <Route path="onboarding"               element={<DataOnboardingPage />} />
            <Route path="onboarding/mapping"        element={<FieldMappingPage />} />
            <Route path="alerts"                   element={<QualityAlertsPage />} />
            <Route path="alerts/:alertId"          element={<QualityAlertDetailPage />} />
            <Route path="clarifications"           element={<ClarificationsInboxPage />} />
            <Route path="clarifications/:requestId" element={<ClarificationDetailPage />} />
            <Route path="mappings"                 element={<CnmcSearchPage />} />
            <Route path="mappings/:cnmcCode"       element={<NationalMaterialPassportPage />} />
            <Route path="new-request"              element={<NewCodeRequestPage />} />
            <Route path="new-request/check"        element={<Stub t="Duplicate Check Result" />} />
            <Route path="*"                        element={<Navigate to="dashboard" replace />} />
          </Routes>
        </RequireAuth>
      } />

      {/* ── Technical Reviewer ─────────────────────── */}
      <Route path="reviewer/*" element={
        <RequireAuth section="reviewer">
          <Routes>
            <Route path="dashboard"                element={<ReviewerDashboardPage />} />
            <Route path="queue"                    element={<PendingMatchQueuePage />} />
            <Route path="queue/:groupId"           element={<MatchDetailPage />} />
            <Route path="queue/:groupId/clarify"   element={<ClarificationRequestFormPage />} />
            <Route path="clarifications"           element={<ClarificationTrackerPage />} />
            <Route path="*"                        element={<Navigate to="dashboard" replace />} />
          </Routes>
        </RequireAuth>
      } />

      {/* ── National Admin ─────────────────────────── */}
      <Route path="admin/*" element={
        <RequireAuth section="admin">
          <Routes>
            <Route path="dashboard"                element={<AdminDashboardPage />} />
            <Route path="cpses"                    element={<CpseManagementPage />} />
            <Route path="categories"               element={<CategoriesPage />} />
            <Route path="thresholds"               element={<TrustScoreThresholdsPage />} />
            <Route path="registry"                 element={<CnmcRegistryManagementPage />} />
            <Route path="registry/:cnmcCode"       element={<NationalMaterialPassportPage />} />
            <Route path="analytics"                element={<NationalAnalyticsPage />} />
            <Route path="audit"                    element={<AuditLogPage />} />
            <Route path="disputes"                 element={<DisputeResolutionPage />} />
            <Route path="disputes/:groupId"        element={<DisputeDetailPage />} />
            <Route path="*"                        element={<Navigate to="dashboard" replace />} />
          </Routes>
        </RequireAuth>
      } />

      {/* Default /app → welcome */}
      <Route path="*" element={<WelcomePage />} />

    </Routes>
  );
}

export default App;

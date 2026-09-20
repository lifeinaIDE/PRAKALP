import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Upload, AlertCircle, Inbox,
  Search, Plus, ListOrdered, BarChart3, FileText,
  AlertOctagon, Building2, FolderOpen,
  SlidersHorizontal, Database, LogOut, User, Menu, X,
} from 'lucide-react';
import { AshokaCrest } from './AshokaCrest';
import { useAuth } from '../context/AuthContext';

/* -------------------------------------------------------
   Nav item types
   ------------------------------------------------------- */
interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
}

/* -------------------------------------------------------
   Per-role nav configs
   ------------------------------------------------------- */
const STEWARD_NAV: NavItem[] = [
  { to: '/app/steward/dashboard',      label: 'Dashboard',          icon: <LayoutDashboard size={14} /> },
  { to: '/app/steward/onboarding',     label: 'Data Onboarding',    icon: <Upload size={14} /> },
  { to: '/app/steward/alerts',         label: 'Quality Alerts',     icon: <AlertCircle size={14} /> },
  { to: '/app/steward/clarifications', label: 'Clarification Inbox', icon: <Inbox size={14} /> },
  { to: '/app/steward/mappings',       label: 'Approved Mappings',  icon: <Search size={14} /> },
  { to: '/app/steward/new-request',    label: 'New Request',        icon: <Plus size={14} /> },
];

const REVIEWER_NAV: NavItem[] = [
  { to: '/app/reviewer/dashboard',      label: 'Dashboard',            icon: <LayoutDashboard size={14} /> },
  { to: '/app/reviewer/queue',          label: 'Pending Match Queue',  icon: <ListOrdered size={14} /> },
  { to: '/app/reviewer/clarifications', label: 'Clarification Tracker', icon: <Inbox size={14} /> },
];

const ADMIN_NAV: NavItem[] = [
  { to: '/app/admin/dashboard',   label: 'Dashboard',          icon: <LayoutDashboard size={14} /> },
  { to: '/app/admin/cpses',       label: 'Manage CPSEs',       icon: <Building2 size={14} /> },
  { to: '/app/admin/categories',  label: 'Categories',         icon: <FolderOpen size={14} /> },
  { to: '/app/admin/thresholds',  label: 'Thresholds',         icon: <SlidersHorizontal size={14} /> },
  { to: '/app/admin/registry',    label: 'CNMC Registry',      icon: <Database size={14} /> },
  { to: '/app/admin/analytics',   label: 'Analytics',          icon: <BarChart3 size={14} /> },
  { to: '/app/admin/audit',       label: 'Audit Trail',        icon: <FileText size={14} /> },
  { to: '/app/admin/disputes',    label: 'Disputes',           icon: <AlertOctagon size={14} /> },
];

/* -------------------------------------------------------
   App Shell — horizontal nav layout
   ------------------------------------------------------- */
export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const navItems =
    user?.role === 'CPSE Data Steward'  ? STEWARD_NAV  :
    user?.role === 'Technical Reviewer' ? REVIEWER_NAV :
    user?.role === 'National Admin'     ? ADMIN_NAV    : [];

  const roleLabel =
    user?.role === 'CPSE Data Steward'  ? 'CPSE Data Steward'  :
    user?.role === 'Technical Reviewer' ? 'Technical Reviewer' :
    user?.role === 'National Admin'     ? 'National Admin'     : '';

  return (
    <div className="app-layout">

      {/* ── Skip-to-content (WCAG 2.1 AA / GIGW 3.0) ─── */}
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      {/* ── Screen-reader live region for toasts ─────── */}
      <div
        id="sr-announce"
        className="sr-announce"
        aria-live="polite"
        aria-atomic="true"
        role="status"
      />

      {/* ── Row 1: Utility bar ─────────────────────────────── */}
      <div className="utility-bar" role="region" aria-label="Government identification and session info">
        <div className="utility-bar-inner">
          <span className="utility-bar-left">
            Ministry of Heavy Industries · Government of India
          </span>
          <div className="utility-bar-right">
            {user ? (
              <>
                <span className="utility-user">
                  <User size={11} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                  {user.name}
                  {user.plant_code ? ` · ${user.plant_code}` : ''}
                </span>
                <span className="utility-separator">|</span>
                <button className="utility-btn" onClick={handleLogout} id="logout-btn" aria-label="Logout">
                  <LogOut size={11} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                  Logout
                </button>
              </>
            ) : (
              <span className="utility-user">Not signed in</span>
            )}
          </div>
        </div>
      </div>

      {/* ── Row 2: Brand masthead ─────────────────────── */}
      <header className="app-masthead" role="banner">
        <div className="masthead-inner">
          <div className="masthead-left">
            <div className="masthead-crest">
              <AshokaCrest size={48} />
            </div>
            <div className="masthead-brand">
              <span className="masthead-brand-name">PRAKALP</span>
              <span className="masthead-brand-tagline">
                National Material Code Harmonization Platform
              </span>
              <span className="masthead-brand-sub">
                Ministry of Heavy Industries, Government of India
              </span>
            </div>
          </div>

          <div className="masthead-right">
            {roleLabel && (
              <div className="masthead-role-pill">
                <span className="masthead-role-label">Logged in as</span>
                <span className="masthead-role-value">{roleLabel}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── Row 3: Horizontal nav bar ─────────────────── */}
      <nav className="app-navbar" role="navigation" aria-label="Primary navigation">
        <div className="navbar-inner">

          {/* Desktop links */}
          <ul className="navbar-links" role="menubar">
            {navItems.map((item) => (
              <li key={item.to} role="none">
                <NavLink
                  to={item.to}
                  role="menuitem"
                  className={({ isActive }) =>
                    `navbar-link${isActive ? ' active' : ''}`
                  }
                  end={item.to.endsWith('dashboard')}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Mobile hamburger */}
          <button
            className="navbar-hamburger"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="navbar-mobile-menu" role="menu">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                role="menuitem"
                className={({ isActive }) =>
                  `navbar-mobile-link${isActive ? ' active' : ''}`
                }
                onClick={() => setMobileOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      {/* ── Main content ──────────────────────────────── */}
      <main className="app-main" id="main-content" tabIndex={-1}>
        {children}
      </main>

      {/* ── Footer (policy links / GIGW 3.0) ──────────────── */}
      <footer className="app-footer" role="contentinfo" aria-label="Site footer">
        <div className="app-footer-inner">
          <span className="app-footer-copy">
            &copy; 2026 Ministry of Heavy Industries, Government of India
          </span>
          <nav aria-label="Footer policy links" className="app-footer-links">
            <a href="/policy/accessibility">Accessibility Statement</a>
            <span aria-hidden="true">|</span>
            <a href="/policy/privacy">Privacy Policy</a>
            <span aria-hidden="true">|</span>
            <a href="/policy/terms">Terms &amp; Conditions</a>
            <span aria-hidden="true">|</span>
            <a href="/policy/copyright">Copyright Policy</a>
            <span aria-hidden="true">|</span>
            <a href="/policy/hyperlink">Hyperlink Policy</a>
            <span aria-hidden="true">|</span>
            <a href="/sitemap">Sitemap</a>
          </nav>
        </div>
      </footer>

    </div>
  );
}

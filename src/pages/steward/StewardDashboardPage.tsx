import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Upload, AlertCircle, Inbox, Search, Plus, ArrowRight } from 'lucide-react';
import { getDashboardStats, DashboardStatsSteward } from '../../api/mockApi';
import { SummaryStatCard } from '../../components/SharedUI';

export function StewardDashboardPage() {
  const [stats, setStats] = useState<DashboardStatsSteward | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats('steward')
      .then((res: unknown) => setStats(res as DashboardStatsSteward))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="placeholder-screen">
        <span className="spinner" aria-label="Loading" /> Loading dashboard data…
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="info-box error" role="alert">
        Failed to load dashboard data. Please refresh the page.
      </div>
    );
  }

  const QUICK_ACTIONS = [
    {
      to: '/app/steward/onboarding',
      label: 'Data Onboarding',
      sub: 'Upload and validate plant records',
      icon: <Upload size={18} />,
      accent: 'var(--gov-navy)',
      id: 'qa-onboarding',
    },
    {
      to: '/app/steward/alerts',
      label: 'Quality Alerts',
      sub: `${stats.summary_cards.records_pending_correction} records pending correction`,
      icon: <AlertCircle size={18} />,
      accent: 'var(--gov-maroon)',
      id: 'qa-alerts',
    },
    {
      to: '/app/steward/clarifications',
      label: 'Clarification Inbox',
      sub: `${stats.summary_cards.open_clarification_requests} requests awaiting response`,
      icon: <Inbox size={18} />,
      accent: 'var(--gov-amber)',
      id: 'qa-clarifications',
    },
    {
      to: '/app/steward/mappings',
      label: 'Approved Mappings',
      sub: `${stats.summary_cards.approved_cnmc_mappings} CNMC codes mapped`,
      icon: <Search size={18} />,
      accent: 'var(--gov-green)',
      id: 'qa-mappings',
    },
    {
      to: '/app/steward/new-request',
      label: 'New Material Request',
      sub: 'Submit a new code to the national registry',
      icon: <Plus size={18} />,
      accent: 'var(--gov-navy)',
      id: 'qa-new-request',
    },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>

      {/* Page header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">CPSE Data Steward Dashboard</h1>
          <p className="page-subtitle">
            Plant: <span className="mono">{stats.plant_code}</span>
            &nbsp;·&nbsp;
            Data as of: {new Date(stats.generated_on).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Summary stat cards — flat, 1px border, no shadow */}
      <div className="stat-grid mt-16" role="region" aria-label="Summary statistics">
        <SummaryStatCard
          label="Total Records Submitted"
          value={stats.summary_cards.total_records_submitted}
          linkTo="/app/steward/onboarding"
        />
        <SummaryStatCard
          label="Pending Correction"
          value={stats.summary_cards.records_pending_correction}
          linkTo="/app/steward/alerts"
        />
        <SummaryStatCard
          label="Flagged for Review"
          value={stats.summary_cards.records_flagged_for_review}
          linkTo="/app/steward/alerts"
        />
        <SummaryStatCard
          label="Approved Mappings"
          value={stats.summary_cards.approved_cnmc_mappings}
          linkTo="/app/steward/mappings"
        />
        <SummaryStatCard
          label="Open Clarifications"
          value={stats.summary_cards.open_clarification_requests}
          linkTo="/app/steward/clarifications"
        />
      </div>

      {/* Main content grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginTop: 32 }}>

        {/* Quick actions — table-row style, not card grid */}
        <div>
          <h2 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--gov-text-secondary)', marginBottom: 12, borderBottom: '2px solid var(--gov-navy)', paddingBottom: 6 }}>
            Quick Actions
          </h2>
          <div className="card" style={{ padding: 0 }}>
            <table style={{ marginBottom: 0 }}>
              <tbody>
                {QUICK_ACTIONS.map((action) => (
                  <tr key={action.id} className="clickable-row" style={{ cursor: 'pointer' }}>
                    <td style={{ width: 52, paddingRight: 0, borderRight: '3px solid ' + action.accent }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: action.accent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {action.icon}
                      </div>
                    </td>
                    <td>
                      <NavLink
                        to={action.to}
                        id={action.id}
                        style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                      >
                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{action.label}</div>
                        <div className="text-sm text-secondary">{action.sub}</div>
                      </NavLink>
                    </td>
                    <td style={{ width: 36, textAlign: 'right', color: 'var(--gov-text-secondary)' }}>
                      <ArrowRight size={16} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent activity */}
        <div>
          <h2 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--gov-text-secondary)', marginBottom: 12, borderBottom: '2px solid var(--gov-navy)', paddingBottom: 6 }}>
            Recent Activity
          </h2>
          <div className="card" style={{ padding: 0 }}>
            <table style={{ marginBottom: 0 }}>
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Date</th>
                  <th style={{ textAlign: 'right' }}>Records</th>
                </tr>
              </thead>
              <tbody>
                {(stats.recent_activity || []).map((act: { action: string; date: string; records: number }, i: number) => (
                  <tr key={i}>
                    <td style={{ fontSize: '0.8125rem' }}>{act.action}</td>
                    <td style={{ fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>
                      {new Date(act.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </td>
                    <td style={{ fontSize: '0.8125rem', textAlign: 'right', fontFamily: '"Roboto Mono", monospace' }}>
                      {act.records}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

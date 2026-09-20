import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ListOrdered, Inbox, ArrowRight } from 'lucide-react';
import { getDashboardStats, DashboardStatsReviewer } from '../../api/mockApi';
import { SummaryStatCard } from '../../components/SharedUI';

export function ReviewerDashboardPage() {
  const [stats, setStats] = useState<DashboardStatsReviewer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats('reviewer')
      .then((res: unknown) => setStats(res as DashboardStatsReviewer))
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
      to: '/app/reviewer/queue',
      label: 'Pending Match Queue',
      sub: `${stats.summary_cards.pending_matches_in_queue} records awaiting technical review`,
      icon: <ListOrdered size={18} />,
      accent: 'var(--gov-maroon)',
      id: 'qa-queue',
    },
    {
      to: '/app/reviewer/clarifications',
      label: 'Clarification Tracker',
      sub: `${stats.summary_cards.clarifications_awaiting_steward_response} awaiting steward response`,
      icon: <Inbox size={18} />,
      accent: 'var(--gov-navy)',
      id: 'qa-clarifications',
    },
  ];

  const queueByType = Object.entries(stats.match_queue_by_type || {});

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>

      {/* Page header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Technical Reviewer Dashboard</h1>
          <p className="page-subtitle">
            Reviewer: <span className="mono">{stats.reviewer_id}</span>
            &nbsp;·&nbsp;
            Data as of: {new Date(stats.generated_on).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Summary stat cards */}
      <div className="stat-grid mt-16" role="region" aria-label="Summary statistics">
        <SummaryStatCard
          label="Pending Matches"
          value={stats.summary_cards.pending_matches_in_queue}
          linkTo="/app/reviewer/queue"
        />
        <SummaryStatCard
          label="Approved This Quarter"
          value={stats.summary_cards.approved_this_quarter}
        />
        <SummaryStatCard
          label="Rejected This Quarter"
          value={stats.summary_cards.rejected_this_quarter}
        />
        <SummaryStatCard
          label="Awaiting Steward Response"
          value={stats.summary_cards.clarifications_awaiting_steward_response}
          linkTo="/app/reviewer/clarifications"
        />
        <SummaryStatCard
          label="Avg. Trust Score Reviewed"
          value={stats.summary_cards.average_trust_score_reviewed}
          subtext="Pre-computed result"
        />
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginTop: 32 }}>

        {/* Quick actions */}
        <div>
          <h2 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--gov-text-secondary)', marginBottom: 12, borderBottom: '2px solid var(--gov-navy)', paddingBottom: 6 }}>
            Quick Actions
          </h2>
          <div className="card" style={{ padding: 0 }}>
            <table style={{ marginBottom: 0 }}>
              <tbody>
                {QUICK_ACTIONS.map((action) => (
                  <tr key={action.id} className="clickable-row">
                    <td style={{ width: 52, paddingRight: 0, borderRight: '3px solid ' + action.accent }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: action.accent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {action.icon}
                      </div>
                    </td>
                    <td>
                      <NavLink to={action.to} id={action.id} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
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

        {/* Queue breakdown */}
        <div>
          <h2 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--gov-text-secondary)', marginBottom: 12, borderBottom: '2px solid var(--gov-navy)', paddingBottom: 6 }}>
            Queue Breakdown by Match Type
          </h2>
          <div className="card" style={{ padding: 0 }}>
            <table style={{ marginBottom: 0 }}>
              <thead>
                <tr>
                  <th>Match Type</th>
                  <th style={{ textAlign: 'right' }}>Count</th>
                </tr>
              </thead>
              <tbody>
                {queueByType.map(([type, count], i) => (
                  <tr key={type}>
                    <td style={{ fontSize: '0.8125rem' }}>{type}</td>
                    <td style={{ fontSize: '0.8125rem', textAlign: 'right', fontFamily: '"Roboto Mono", monospace', fontWeight: 700 }}>
                      {String(count)}
                    </td>
                  </tr>
                ))}
                {queueByType.length === 0 && (
                  <tr><td colSpan={2} style={{ textAlign: 'center', padding: '20px', color: 'var(--gov-text-secondary)' }}>Queue is empty.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

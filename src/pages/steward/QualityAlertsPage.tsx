import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAlertsForSteward, DataQualityAlert } from '../../api/mockApi';
import { QualityAlertBadge, StatusBadge } from '../../components/SharedUI';

export function QualityAlertsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<DataQualityAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'All' | 'Open' | 'Resolved'>('All');

  useEffect(() => {
    if (user) {
      getAlertsForSteward(user.user_id)
        .then(setAlerts)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user]);

  const filtered = filter === 'All' ? alerts : alerts.filter(a =>
    filter === 'Resolved' ? a.status === 'Resolved' : a.status !== 'Resolved'
  );

  const counts = {
    All: alerts.length,
    Open: alerts.filter(a => a.status !== 'Resolved').length,
    Resolved: alerts.filter(a => a.status === 'Resolved').length,
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>

      <div className="page-header">
        <div>
          <h1 className="page-title">Data Quality Alerts</h1>
          <p className="page-subtitle">
            Records flagged for manual correction before national mapping can proceed.
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 16, borderBottom: '1px solid var(--gov-border)' }}>
        {(['All', 'Open', 'Resolved'] as const).map(f => (
          <button
            key={f}
            id={`filter-${f.toLowerCase()}`}
            onClick={() => setFilter(f)}
            style={{
              background: filter === f ? 'var(--gov-navy)' : 'transparent',
              color: filter === f ? '#fff' : 'var(--gov-text-secondary)',
              border: 'none',
              borderBottom: filter === f ? '3px solid var(--gov-maroon)' : '3px solid transparent',
              padding: '7px 18px',
              fontFamily: 'inherit',
              fontSize: '0.8125rem',
              fontWeight: filter === f ? 700 : 400,
              cursor: 'pointer',
              transition: 'background 0.1s',
            }}
            aria-pressed={filter === f}
          >
            {f} ({counts[f]})
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center' }}><span className="spinner" aria-label="Loading" /> Loading alerts…</div>
      ) : (
        <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Alert Reference</th>
                <th>Local Material Code</th>
                <th>Alert Type</th>
                <th>Severity</th>
                <th>Status</th>
                <th><span className="sr-only">Action</span></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr
                  key={a.alert_id}
                  className="clickable-row"
                  onClick={() => navigate(`/app/steward/alerts/${a.alert_id}`)}
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate(`/app/steward/alerts/${a.alert_id}`); }}
                  role="row"
                  aria-label={`Alert ${a.alert_id}, ${a.alert_type}, ${a.severity}, ${a.status}`}
                >
                  <td className="mono">{a.alert_id}</td>
                  <td className="mono">{a.local_code}</td>
                  <td style={{ fontWeight: 600 }}>{a.alert_type}</td>
                  <td>
                    <QualityAlertBadge alert_type="" severity={a.severity as 'High' | 'Medium' | 'Low'} />
                  </td>
                  <td><StatusBadge status={a.status} /></td>
                  <td style={{ color: 'var(--gov-navy)', fontSize: '0.8125rem', fontWeight: 600 }}>
                    {a.status !== 'Resolved' ? 'Review →' : '—'}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '28px', color: 'var(--gov-text-secondary)' }}>
                    {filter === 'All' ? 'No quality alerts are assigned to your account.' : `No ${filter.toLowerCase()} alerts.`}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getClarificationsForReviewer, ClarificationRequest } from '../../api/mockApi';
import { StatusBadge } from '../../components/SharedUI';

export function ClarificationTrackerPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<ClarificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Resolved'>('All');

  useEffect(() => {
    if (user) {
      getClarificationsForReviewer(user.user_id)
        .then(setRequests)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user]);

  const filtered = filter === 'All' ? requests : requests.filter(r => 
    filter === 'Resolved' ? r.status === 'Resolved' : r.status !== 'Resolved'
  );

  const counts = {
    All: requests.length,
    Pending: requests.filter(r => r.status !== 'Resolved').length,
    Resolved: requests.filter(r => r.status === 'Resolved').length,
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Clarification Tracker</h1>
          <p className="page-subtitle">
            Track the status of queries sent to CPSE Data Stewards.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 0, marginBottom: 16, borderBottom: '1px solid var(--gov-border)' }}>
        {(['All', 'Pending', 'Resolved'] as const).map(f => (
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
        <div style={{ padding: 40, textAlign: 'center' }}><span className="spinner" aria-label="Loading" /> Loading tracker…</div>
      ) : (
        <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Group ID</th>
                <th>Steward</th>
                <th>Requested Date</th>
                <th>Responded Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.request_id}>
                  <td className="mono" style={{ fontSize: '0.8125rem' }}>{r.request_id}</td>
                  <td className="mono" style={{ fontSize: '0.8125rem' }}>{r.material_group_id}</td>
                  <td>{r.steward_id}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{r.requested_date}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{r.responded_date || '—'}</td>
                  <td><StatusBadge status={r.status} /></td>
                  <td>
                    {r.status === 'Resolved' ? (
                      <NavLink to={`/app/reviewer/queue/${r.material_group_id}`} style={{ fontWeight: 600, color: 'var(--gov-navy)', textDecoration: 'underline' }}>
                        Return to Match Detail →
                      </NavLink>
                    ) : (
                      <span className="text-secondary" style={{ fontSize: '0.8125rem' }}>Awaiting Response</span>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '28px', color: 'var(--gov-text-secondary)' }}>
                    No clarification requests tracked.
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

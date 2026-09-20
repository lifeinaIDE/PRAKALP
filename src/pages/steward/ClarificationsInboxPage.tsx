import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getClarificationsForSteward, ClarificationRequest } from '../../api/mockApi';
import { StatusBadge } from '../../components/SharedUI';

export function ClarificationsInboxPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<ClarificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Resolved'>('All');

  useEffect(() => {
    if (user) {
      getClarificationsForSteward(user.user_id)
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
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Clarification Inbox</h1>
          <p className="page-subtitle">
            Respond to queries raised by Technical Reviewers regarding your submitted records.
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
        <div style={{ padding: 40, textAlign: 'center' }}><span className="spinner" aria-label="Loading" /> Loading inbox…</div>
      ) : (
        <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Material Group ID</th>
                <th>Message Preview</th>
                <th>Requested Date</th>
                <th>Status</th>
                <th><span className="sr-only">Action</span></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr 
                  key={r.request_id} 
                  className="clickable-row"
                  onClick={() => navigate(`/app/steward/clarifications/${r.request_id}`)}
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate(`/app/steward/clarifications/${r.request_id}`); }}
                  role="row"
                  aria-label={`Clarification ${r.request_id}, Group ${r.material_group_id}, Status ${r.status}`}
                >
                  <td className="mono" style={{ fontSize: '0.8125rem' }}>{r.request_id}</td>
                  <td className="mono" style={{ fontSize: '0.8125rem' }}>{r.material_group_id}</td>
                  <td style={{ maxWidth: 260, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {r.message}
                  </td>
                  <td>{r.requested_date}</td>
                  <td><StatusBadge status={r.status} /></td>
                  <td style={{ color: 'var(--gov-navy)', fontSize: '0.8125rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {r.status !== 'Resolved' ? 'Respond →' : 'View'}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '28px', color: 'var(--gov-text-secondary)' }}>
                    No clarification requests found.
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

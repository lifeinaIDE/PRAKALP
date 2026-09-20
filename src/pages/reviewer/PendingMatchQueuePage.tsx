import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMatchQueue, MatchResult } from '../../api/mockApi';
import { TrustScoreGauge, StatusBadge } from '../../components/SharedUI';

export function PendingMatchQueuePage() {
  const navigate = useNavigate();
  const [queue, setQueue] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('All');

  useEffect(() => {
    getMatchQueue()
      .then(setQueue)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const matchTypes = ['All', ...Array.from(new Set(queue.map(m => m.match_type)))];
  const filtered = filterType === 'All' ? queue : queue.filter(m => m.match_type === filterType);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>

      <div className="page-header">
        <div>
          <h1 className="page-title">Pending Match Queue</h1>
          <p className="page-subtitle">
            Pre-computed material match results requiring technical review and decision.&nbsp;
            <span style={{ fontSize: '0.72rem', background: '#fef9c3', padding: '1px 6px', borderRadius: 2, border: '1px solid #fde047', color: 'var(--gov-amber)' }}>
              Pre-computed results
            </span>
          </p>
        </div>
        <div className="text-secondary text-sm">
          {filtered.length} record{filtered.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 16, borderBottom: '1px solid var(--gov-border)' }}>
        {matchTypes.map(t => (
          <button
            key={t}
            id={`filter-type-${t.replace(/\s/g, '-').toLowerCase()}`}
            onClick={() => setFilterType(t)}
            style={{
              background: filterType === t ? 'var(--gov-navy)' : 'transparent',
              color: filterType === t ? '#fff' : 'var(--gov-text-secondary)',
              border: 'none',
              borderBottom: filterType === t ? '3px solid var(--gov-maroon)' : '3px solid transparent',
              padding: '7px 16px',
              fontFamily: 'inherit',
              fontSize: '0.8125rem',
              fontWeight: filterType === t ? 700 : 400,
              cursor: 'pointer',
            }}
            aria-pressed={filterType === t}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center' }}><span className="spinner" aria-label="Loading" /> Loading queue…</div>
      ) : (
        <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Group ID</th>
                <th>CPSE 1 Plant</th>
                <th>CPSE 2 Plant</th>
                <th>Match Type</th>
                <th style={{ minWidth: 220 }}>Match Trust Score</th>
                <th>Status</th>
                <th><span className="sr-only">Action</span></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr
                  key={m.material_group_id}
                  className="clickable-row"
                  onClick={() => navigate(`/app/reviewer/queue/${m.material_group_id}`)}
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate(`/app/reviewer/queue/${m.material_group_id}`); }}
                  aria-label={`Match group ${m.material_group_id}, ${m.match_type}, trust score ${m.trust_score}%, ${m.status}`}
                >
                  <td className="mono">{m.material_group_id}</td>
                  <td>{m.cpse_1_plant}</td>
                  <td>{m.cpse_2_plant}</td>
                  <td>
                    <span style={{ fontWeight: 600, fontSize: '0.8125rem' }}>{m.match_type}</span>
                  </td>
                  <td>
                    <TrustScoreGauge trust_score={parseInt(m.trust_score, 10)} />
                  </td>
                  <td><StatusBadge status={m.status} /></td>
                  <td style={{ color: 'var(--gov-navy)', fontSize: '0.8125rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    Review →
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '28px', color: 'var(--gov-text-secondary)' }}>
                    {filterType === 'All' ? 'No pending matches in the queue.' : `No matches of type "${filterType}".`}
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

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDisputes, MatchResult } from '../../api/mockApi';
import { StatusBadge, TrustScoreGauge } from '../../components/SharedUI';

export function DisputeResolutionPage() {
  const navigate = useNavigate();
  const [disputes, setDisputes] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDisputes()
      .then(setDisputes)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div className="page-header" style={{ marginBottom: 24, paddingBottom: 12, borderBottom: '2px solid var(--gov-navy)' }}>
        <h1 className="page-title" style={{ marginBottom: 4 }}>Dispute Resolution</h1>
        <p className="page-subtitle" style={{ color: 'var(--gov-text-secondary)', fontSize: '0.875rem' }}>
          Review and override rejected matches or disputes raised by Technical Reviewers.
        </p>
      </div>

      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        <table aria-busy={loading}>
          <thead>
            <tr>
              <th>Group ID</th>
              <th>CPSE 1 Plant</th>
              <th>CPSE 2 Plant</th>
              <th>Match Type</th>
              <th style={{ width: 140 }}>Trust Score</th>
              <th>Status</th>
              <th><span className="sr-only">Action</span></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px' }}><span className="spinner" aria-hidden="true" /> Loading disputes…</td></tr>
            ) : disputes.length > 0 ? (
              disputes.map((m) => (
                <tr 
                  key={m.material_group_id} 
                  className="clickable-row"
                  onClick={() => navigate(`/app/admin/disputes/${m.material_group_id}`)}
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate(`/app/admin/disputes/${m.material_group_id}`); }}
                  aria-label={`View dispute detail for group ${m.material_group_id}`}
                >
                  <td className="mono" style={{ fontSize: '0.8125rem' }}>{m.material_group_id}</td>
                  <td>{m.cpse_1_plant}</td>
                  <td>{m.cpse_2_plant}</td>
                  <td>{m.match_type}</td>
                  <td>
                    <TrustScoreGauge trust_score={parseInt(m.trust_score, 10)} />
                  </td>
                  <td><StatusBadge status={m.status} /></td>
                  <td style={{ color: 'var(--gov-navy)', fontSize: '0.8125rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    View →
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--gov-text-secondary)' }}>No disputes found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

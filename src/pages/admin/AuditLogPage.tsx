import { useEffect, useState } from 'react';
import { getAuditLogs, AuditLog } from '../../api/mockApi';
import { AuditTrailTable } from '../../components/SharedUI';

export function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [user, setUser] = useState('');
  const [role, setRole] = useState('');
  const [action, setAction] = useState('');

  useEffect(() => {
    fetchLogs();
  }, [user, role, action]);

  const fetchLogs = () => {
    setLoading(true);
    getAuditLogs({ user, role, action })
      .then(setLogs)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div className="page-header" style={{ marginBottom: 24, paddingBottom: 12, borderBottom: '2px solid var(--gov-navy)' }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: 4 }}>Audit Log</h1>
          <p className="page-subtitle" style={{ color: 'var(--gov-text-secondary)', fontSize: '0.875rem' }}>
            Immutable traceability logs of all actions across the platform.
          </p>
        </div>
      </div>

      <div className="card mb-24" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        <div className="form-group mb-0">
          <label htmlFor="filter-user" className="text-sm">Filter by User ID</label>
          <input id="filter-user" type="text" value={user} onChange={(e) => setUser(e.target.value)} placeholder="e.g. USR-001" style={{ width: '100%' }} aria-label="Filter by User ID" />
        </div>
        <div className="form-group mb-0">
          <label htmlFor="filter-role" className="text-sm">Filter by Role</label>
          <select id="filter-role" value={role} onChange={(e) => setRole(e.target.value)} style={{ width: '100%' }} aria-label="Filter by Role">
            <option value="">All Roles</option>
            <option value="CPSE Data Steward">CPSE Data Steward</option>
            <option value="Technical Reviewer">Technical Reviewer</option>
            <option value="National Admin">National Admin</option>
          </select>
        </div>
        <div className="form-group mb-0">
          <label htmlFor="filter-action" className="text-sm">Filter by Action</label>
          <input id="filter-action" type="text" value={action} onChange={(e) => setAction(e.target.value)} placeholder="e.g. Validation" style={{ width: '100%' }} aria-label="Filter by Action" />
        </div>
      </div>

      <div className="card" style={{ padding: 0, minHeight: 400, position: 'relative' }} aria-busy={loading}>
        {loading && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
            <span className="spinner" aria-hidden="true" />
          </div>
        )}
        <AuditTrailTable rows={logs} />
      </div>
    </div>
  );
}

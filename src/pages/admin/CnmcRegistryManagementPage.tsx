import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchCnmcRegistry, CnmcRegistry } from '../../api/mockApi';
import { StatusBadge } from '../../components/SharedUI';
import { Search } from 'lucide-react';

export function CnmcRegistryManagementPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CnmcRegistry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    handleSearch('');
  }, []);

  const handleSearch = async (searchQuery: string) => {
    setLoading(true);
    try {
      const res = await searchCnmcRegistry(searchQuery);
      setResults(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div className="page-header" style={{ marginBottom: 24, paddingBottom: 12, borderBottom: '2px solid var(--gov-navy)' }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: 4 }}>CNMC Registry Management</h1>
          <p className="page-subtitle" style={{ color: 'var(--gov-text-secondary)', fontSize: '0.875rem' }}>
            View and manage all approved National Material Codes across CPSEs.
          </p>
        </div>
      </div>

      <div className="card mb-24" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--gov-text-secondary)' }} aria-hidden="true" />
          <input 
            type="text" 
            placeholder="Search by CNMC Code or Description…" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
            style={{ paddingLeft: 40 }}
            aria-label="Search registry"
          />
        </div>
        <button className="btn btn-primary" onClick={() => handleSearch(query)} disabled={loading} aria-busy={loading}>
          {loading ? 'Searching…' : 'Search'}
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        <table aria-busy={loading}>
          <thead>
            <tr>
              <th>CNMC Code</th>
              <th>Canonical Description</th>
              <th>UOM</th>
              <th>Created Date</th>
              <th>Version</th>
              <th>Status</th>
              <th><span className="sr-only">Action</span></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px' }}>
                  <span className="spinner" aria-hidden="true" /> Loading registry…
                </td>
              </tr>
            ) : results.length > 0 ? (
              results.map((r) => (
                <tr 
                  key={r.cnmc_code} 
                  className="clickable-row"
                  onClick={() => navigate(`/app/admin/registry/${r.cnmc_code}`)}
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate(`/app/admin/registry/${r.cnmc_code}`); }}
                  aria-label={`View mapping for ${r.cnmc_code}`}
                >
                  <td className="mono" style={{ fontSize: '0.8125rem' }}>{r.cnmc_code}</td>
                  <td style={{ fontWeight: 500 }}>{r.canonical_description}</td>
                  <td>{r.standardized_uom}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{r.created_date}</td>
                  <td style={{ textAlign: 'center' }}>{r.version}</td>
                  <td><StatusBadge status={r.approval_status} /></td>
                  <td style={{ color: 'var(--gov-navy)', fontSize: '0.8125rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    View →
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--gov-text-secondary)' }}>
                  No matching CNMC codes found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

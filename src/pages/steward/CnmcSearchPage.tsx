import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchCnmcRegistry, CnmcRegistry } from '../../api/mockApi';
import { StatusBadge } from '../../components/SharedUI';
import { Search, X } from 'lucide-react';

export function CnmcSearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CnmcRegistry[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<string[]>([]);

  // Load all by default when page opens
  useEffect(() => {
    handleSearch('', true);
  }, []);

  const handleSearch = async (searchQuery: string, initial = false) => {
    setLoading(true);
    try {
      const res = await searchCnmcRegistry(searchQuery);
      setResults(res);
      if (!initial) {
        setHasSearched(true);
        if (searchQuery.trim()) {
          setAppliedFilters([`Search: ${searchQuery}`]);
        } else {
          setAppliedFilters([]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setQuery('');
    setAppliedFilters([]);
    handleSearch('', true);
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">CNMC Registry Search</h1>
          <p className="page-subtitle">
            Search the National Material Code registry for approved mappings.
          </p>
        </div>
      </div>

      <div className="card mb-16" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--gov-text-secondary)' }} aria-hidden="true" />
          <input 
            type="text" 
            placeholder="Search by CNMC Code or canonical description…" 
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

      {appliedFilters.length > 0 && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16 }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--gov-text-secondary)' }}>Filters:</span>
          {appliedFilters.map((f, i) => (
            <div key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--gov-bg)', border: '1px solid var(--gov-border)', padding: '2px 8px', borderRadius: 12, fontSize: '0.8125rem' }}>
              {f}
              <button 
                onClick={clearFilters}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--gov-text-secondary)', display: 'flex', alignItems: 'center' }}
                aria-label="Clear filter"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          <button 
            onClick={clearFilters}
            style={{ background: 'none', border: 'none', fontSize: '0.8125rem', color: 'var(--gov-navy)', textDecoration: 'underline', cursor: 'pointer' }}
          >
            Clear all
          </button>
        </div>
      )}

      {(hasSearched || results.length > 0 || loading) && (
        <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
          <table aria-busy={loading}>
            <thead>
              <tr>
                <th>CNMC Code</th>
                <th>Canonical Description</th>
                <th>UOM</th>
                <th>Category</th>
                <th>Status</th>
                <th><span className="sr-only">Action</span></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>
                    <span className="spinner" aria-hidden="true" /> Loading results…
                  </td>
                </tr>
              ) : results.length > 0 ? (
                results.map((r) => (
                  <tr 
                    key={r.cnmc_code} 
                    className="clickable-row"
                    onClick={() => navigate(`/app/steward/mappings/${r.cnmc_code}`)}
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate(`/app/steward/mappings/${r.cnmc_code}`); }}
                    aria-label={`View mapping for ${r.cnmc_code}`}
                  >
                    <td className="mono" style={{ fontSize: '0.8125rem' }}>{r.cnmc_code}</td>
                    <td style={{ fontWeight: 500 }}>{r.canonical_description}</td>
                    <td>{r.standardized_uom}</td>
                    <td>{r.category}</td>
                    <td><StatusBadge status={r.approval_status} /></td>
                    <td style={{ color: 'var(--gov-navy)', fontSize: '0.8125rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                      View →
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--gov-text-secondary)' }}>
                    No matching CNMC codes found.
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

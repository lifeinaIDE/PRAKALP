import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Settings, BarChart2, FileText, LayoutTemplate, ShieldAlert, List, Search } from 'lucide-react';
import { getDashboardStats, DashboardStatsAdmin } from '../../api/mockApi';
import { SummaryStatCard } from '../../components/SharedUI';

export function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStatsAdmin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats('admin')
      .then((res: unknown) => setStats(res as DashboardStatsAdmin))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="placeholder-screen"><span className="spinner" /> Loading dashboard...</div>;
  }

  if (!stats) {
    return <div className="placeholder-screen text-red">Failed to load dashboard data.</div>;
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">National Admin Dashboard</h1>
          <p className="page-subtitle">Generated: {new Date(stats.generated_on).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="stat-grid mt-16" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
        <SummaryStatCard label="CPSE Plants" value={stats.summary_cards.total_cpse_plants_onboarded} />
        <SummaryStatCard label="Total Records" value={stats.summary_cards.total_records_in_system} />
        <SummaryStatCard label="Approved CNMCs" value={stats.summary_cards.total_cnmc_entries_approved} />
        <SummaryStatCard label="Pending Tech Reviews" value={stats.summary_cards.pending_technical_reviews} />
        <SummaryStatCard label="Open Alerts" value={stats.summary_cards.open_data_quality_alerts} />
        <SummaryStatCard label="Open Disputes" value={stats.summary_cards.open_disputes} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24, marginTop: 32 }}>
        {/* Navigation Cards */}
        <div>
          <h3 style={{ marginBottom: 16 }}>Administration</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
            <NavLink to="/app/admin/cpses" className="card" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gov-navy)', color: '#fff', borderRadius: '50%', flexShrink: 0 }}><Settings size={20} /></div>
              <div><div className="text-bold">CPSE Management</div><div className="text-sm text-secondary">Manage onboarded plants</div></div>
            </NavLink>
            <NavLink to="/app/admin/categories" className="card" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gov-navy)', color: '#fff', borderRadius: '50%', flexShrink: 0 }}><LayoutTemplate size={20} /></div>
              <div><div className="text-bold">Categories & Templates</div><div className="text-sm text-secondary">Schema definitions</div></div>
            </NavLink>
            <NavLink to="/app/admin/thresholds" className="card" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gov-navy)', color: '#fff', borderRadius: '50%', flexShrink: 0 }}><Settings size={20} /></div>
              <div><div className="text-bold">Trust Score Thresholds</div><div className="text-sm text-secondary">Configure auto-approve limits</div></div>
            </NavLink>
            <NavLink to="/app/admin/registry" className="card" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gov-navy)', color: '#fff', borderRadius: '50%', flexShrink: 0 }}><Search size={20} /></div>
              <div><div className="text-bold">CNMC Registry</div><div className="text-sm text-secondary">View all national mappings</div></div>
            </NavLink>
            <NavLink to="/app/admin/analytics" className="card" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gov-navy)', color: '#fff', borderRadius: '50%', flexShrink: 0 }}><BarChart2 size={20} /></div>
              <div><div className="text-bold">National Analytics</div><div className="text-sm text-secondary">System-wide reports</div></div>
            </NavLink>
            <NavLink to="/app/admin/audit" className="card" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gov-navy)', color: '#fff', borderRadius: '50%', flexShrink: 0 }}><List size={20} /></div>
              <div><div className="text-bold">Audit Log</div><div className="text-sm text-secondary">Traceability logs</div></div>
            </NavLink>
            <NavLink to="/app/admin/disputes" className="card" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gov-maroon)', color: '#fff', borderRadius: '50%', flexShrink: 0 }}><ShieldAlert size={20} /></div>
              <div><div className="text-bold">Dispute Resolution</div><div className="text-sm text-secondary">Handle rejected matches</div></div>
            </NavLink>
          </div>
        </div>

        {/* Charts / Progress */}
        <div>
          <h3 style={{ marginBottom: 16 }}>System Overview</h3>
          <div className="card mb-24">
            <h4 style={{ marginBottom: 16 }}>Migration Progress</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span>{stats.migration_progress.records_mapped_to_cnmc} / {stats.migration_progress.total_source_records} records mapped</span>
              <span className="text-bold">{stats.migration_progress.migration_percentage}%</span>
            </div>
            <div style={{ width: '100%', height: 16, background: 'var(--gov-border)', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ width: `${stats.migration_progress.migration_percentage}%`, height: '100%', background: 'var(--gov-green)' }} />
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div className="card">
              <h4 style={{ marginBottom: 16 }}>Records by Plant</h4>
              {Object.entries(stats.records_by_plant || {}).map(([plant, count], i, arr) => (
                <div key={plant} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: i === arr.length - 1 ? 'none' : '1px solid var(--gov-border)', paddingBottom: 8, paddingTop: 8 }}>
                  <div className="text-sm">{plant}</div>
                  <div className="text-bold">{count}</div>
                </div>
              ))}
            </div>
            <div className="card">
              <h4 style={{ marginBottom: 16 }}>Data Quality Alerts</h4>
              {Object.entries(stats.data_quality_by_plant || {}).map(([plant, count], i, arr) => (
                <div key={plant} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: i === arr.length - 1 ? 'none' : '1px solid var(--gov-border)', paddingBottom: 8, paddingTop: 8 }}>
                  <div className="text-sm">{plant}</div>
                  <div className="text-bold text-red">{count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { getDashboardStats, DashboardStatsAdmin } from '../../api/mockApi';
import { SummaryStatCard } from '../../components/SharedUI';
import { BarChart2 } from 'lucide-react';

export function NationalAnalyticsPage() {
  const [stats, setStats] = useState<DashboardStatsAdmin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats('admin')
      .then((res: unknown) => setStats(res as DashboardStatsAdmin))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="placeholder-screen"><span className="spinner" aria-label="Loading" /> Loading analytics…</div>;
  }

  if (!stats) {
    return <div className="info-box error" role="alert">Failed to load analytics data.</div>;
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div className="page-header" style={{ marginBottom: 24, paddingBottom: 12, borderBottom: '2px solid var(--gov-navy)' }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: 4 }}>National Analytics</h1>
          <p className="page-subtitle" style={{ color: 'var(--gov-text-secondary)', fontSize: '0.875rem' }}>
            Expanded system-wide reporting and metrics across all CPSEs.
          </p>
        </div>
      </div>

      <div className="stat-grid mb-24" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <SummaryStatCard label="Total Records" value={stats.summary_cards.total_records_in_system} />
        <SummaryStatCard label="Approved CNMCs" value={stats.summary_cards.total_cnmc_entries_approved} />
        <SummaryStatCard label="Pending Tech Reviews" value={stats.summary_cards.pending_technical_reviews} />
        <SummaryStatCard label="CPSE Plants" value={stats.summary_cards.total_cpse_plants_onboarded} />
      </div>

      <div className="card mb-24" style={{ padding: '24px 32px' }}>
        <h2 style={{ fontSize: '1rem', marginBottom: 24, paddingBottom: 8, borderBottom: '1px solid var(--gov-border)' }}>
          Migration Progress
        </h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--gov-text-secondary)' }}>
            {stats.migration_progress.records_mapped_to_cnmc} / {stats.migration_progress.total_source_records} records mapped
          </span>
          <span style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--gov-navy)' }}>
            {stats.migration_progress.migration_percentage}%
          </span>
        </div>
        <div style={{ width: '100%', height: 24, background: 'var(--gov-bg)', borderRadius: 2, border: '1px solid var(--gov-border)', overflow: 'hidden' }} role="progressbar" aria-valuenow={stats.migration_progress.migration_percentage} aria-valuemin={0} aria-valuemax={100}>
          <div style={{ width: `${stats.migration_progress.migration_percentage}%`, height: '100%', background: 'var(--gov-green)' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div className="card">
          <h2 style={{ fontSize: '1rem', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 8, borderBottom: '1px solid var(--gov-border)' }}>
            <BarChart2 size={18} aria-hidden="true" /> Records by Plant
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {Object.entries(stats.records_by_plant || {}).map(([plant, count]) => {
              const max = Math.max(...Object.values(stats.records_by_plant || {}));
              const width = `${(count / max) * 100}%`;
              return (
                <div key={plant}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: 6 }}>
                    <span style={{ fontWeight: 500 }}>{plant}</span>
                    <span style={{ fontWeight: 600, color: 'var(--gov-navy)' }}>{count}</span>
                  </div>
                  <div style={{ width: '100%', height: 12, background: 'var(--gov-bg)', border: '1px solid var(--gov-border)', borderRadius: 2 }}>
                    <div style={{ width, height: '100%', background: 'var(--gov-navy)' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <h2 style={{ fontSize: '1rem', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 8, borderBottom: '1px solid var(--gov-border)' }}>
            <BarChart2 size={18} aria-hidden="true" /> Data Quality Alerts by Plant
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {Object.entries(stats.data_quality_by_plant || {}).map(([plant, count]) => {
              const max = Math.max(...Object.values(stats.data_quality_by_plant || {}));
              const width = max > 0 ? `${(count / max) * 100}%` : '0%';
              return (
                <div key={plant}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: 6 }}>
                    <span style={{ fontWeight: 500 }}>{plant}</span>
                    <span style={{ fontWeight: 600, color: 'var(--gov-maroon)' }}>{count}</span>
                  </div>
                  <div style={{ width: '100%', height: 12, background: 'var(--gov-bg)', border: '1px solid var(--gov-border)', borderRadius: 2 }}>
                    <div style={{ width, height: '100%', background: 'var(--gov-maroon)' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

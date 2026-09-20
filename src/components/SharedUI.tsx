import React, { useState } from 'react';
import { Lock, CheckCircle2, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { NationalPassport, CnmcRegistry, AuditLog, CpseMaster, MatchResult } from '../api/mockApi';

/* ── Utility: announce to screen reader live region ──────── */
function srAnnounce(msg: string) {
  const el = document.getElementById('sr-announce');
  if (el) { el.textContent = ''; setTimeout(() => { el.textContent = msg; }, 50); }
}
export { srAnnounce };

/* ================================================================
   1. TrustScoreGauge
   Phase 2 rule: always print numeric value; label is "Match Trust Score";
   color band does NOT rely on color alone — label text changes too.
   ================================================================ */
export function TrustScoreGauge({ trust_score }: { trust_score: number }) {
  let color = 'var(--gov-maroon)';
  let label = 'Partial / No Match';
  if (trust_score >= 85) { color = 'var(--gov-green)'; label = 'Exact Match'; }
  else if (trust_score >= 70) { color = 'var(--gov-amber)'; label = 'Near-Duplicate'; }

  return (
    <div style={{ maxWidth: 500 }} aria-label={`Match Trust Score: ${trust_score}%, ${label}`}>
      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--gov-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>
        Match Trust Score
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* Bar track */}
        <div style={{ flex: 1, height: 10, background: 'var(--gov-border)', borderRadius: 2, overflow: 'hidden', border: '1px solid var(--gov-border)' }}>
          <div
            role="meter"
            aria-valuenow={trust_score}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${trust_score}%`}
            style={{ width: `${Math.min(100, Math.max(0, trust_score))}%`, height: '100%', background: color, transition: 'width 0.3s' }}
          />
        </div>
        {/* Numeric value — always visible, never rely on color alone */}
        <div style={{ fontFamily: '"Roboto Mono", monospace', fontWeight: 700, color, minWidth: 48, textAlign: 'right', fontSize: '1.1rem' }}>
          {trust_score}%
        </div>
        {/* Text label */}
        <span className={`status-badge ${trust_score >= 85 ? 'green' : trust_score >= 70 ? 'amber' : 'maroon'}`}>
          {label}
        </span>
      </div>
    </div>
  );
}

/* ================================================================
   2. WhyWhyNotPanel
   Phase 2 rule: plain text in bordered boxes. "Why Not" box always rendered.
   ================================================================ */
export function WhyWhyNotPanel({ why_match, why_not }: { why_match: string; why_not: string }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 20 }}>
      <div style={{ border: '1px solid var(--gov-border)', borderLeft: '3px solid var(--gov-green)', padding: 16, borderRadius: 'var(--gov-radius)' }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--gov-green)', marginBottom: 8 }}>
          Why Matched
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--gov-text-primary)', margin: 0, lineHeight: 1.65 }}>
          {why_match || 'No match reasons provided.'}
        </p>
      </div>
      <div style={{ border: '1px solid var(--gov-border)', borderLeft: '3px solid var(--gov-text-secondary)', padding: 16, borderRadius: 'var(--gov-radius)' }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--gov-text-secondary)', marginBottom: 8 }}>
          Why Not Matched
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--gov-text-primary)', margin: 0, lineHeight: 1.65 }}>
          {why_not || 'No conflicting attributes identified.'}
        </p>
      </div>
    </div>
  );
}

/* ================================================================
   6. StatusBadge — rectangular, token-colored, never pill-shaped
   ================================================================ */
export function StatusBadge({ status }: { status: string }) {
  const s = (status || '').toLowerCase();
  let colorClass = 'grey';

  if (s.includes('pass') || s.includes('approve') || s.includes('active') || s.includes('resolve') || s.includes('success')) {
    colorClass = 'green';
  } else if (s.includes('fail') || s.includes('reject') || s.includes('high')) {
    colorClass = 'maroon';
  } else if (s.includes('pend') || s.includes('await') || s.includes('review')) {
    colorClass = 'amber';
  } else if (s.includes('flag') || s.includes('medium')) {
    colorClass = 'saffron';
  }

  return <span className={`status-badge ${colorClass}`}>{status}</span>;
}

/* ================================================================
   3. PassportCard — document/certificate style
   ================================================================ */
export function PassportCard({ passport, registry }: { passport: NationalPassport; registry: CnmcRegistry }) {
  const [downloadToast, setDownloadToast] = useState('');

  function handleDownload() {
    const csvContent = [
      ['Field', 'Value'],
      ['CNMC Code', registry.cnmc_code],
      ['Canonical Description', registry.canonical_description],
      ['Standardized UOM', registry.standardized_uom],
      ['Material Category', registry.category || ''],
      ['Legacy Codes', registry.legacy_codes],
      ['Passport ID', passport.passport_id],
      ['Technical Specifications', passport.technical_specifications],
      ['Manufacturer Info', passport.manufacturer_info],
      ['Lifecycle Status', passport.lifecycle_status],
      ['Functional Equivalents', passport.functional_equivalents],
      ['Created Date', registry.created_date],
      ['Version', registry.version]
    ].map(e => e.map(item => `"${(item || '').toString().replace(/"/g, '""')}"`).join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Material_Passport_${registry.cnmc_code}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    const ref = `EXP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 90000 + 10000))}`;
    setDownloadToast(`Download complete. Reference: ${ref}`);
    srAnnounce(`Download complete. Reference: ${ref}`);
    setTimeout(() => setDownloadToast(''), 4000);
  }

  function handleSendToErp() {
    const ref = `ERP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 90000 + 10000))}`;
    setDownloadToast(`ERP transfer queued (simulation). Reference: ${ref}`);
    srAnnounce(`ERP transfer queued. Reference: ${ref}`);
    setTimeout(() => setDownloadToast(''), 4000);
  }

  return (
    <div>
      {downloadToast && (
        <div className="toast success" style={{ position: 'relative', marginBottom: 16 }}>
          <CheckCircle2 size={14} style={{ display: 'inline', marginRight: 6 }} />
          {downloadToast}
          <span className="toast-ref" style={{ display: 'block', marginTop: 2 }}>
            {downloadToast.split('Reference: ')[1]}
          </span>
        </div>
      )}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }} role="region" aria-label={`National Material Passport: ${registry.cnmc_code}`}>
        {/* Header strip */}
        <div style={{ background: 'var(--gov-navy)', color: '#fff', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px solid var(--gov-maroon)' }}>
          <div>
            <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>
              National Material Passport · CNMC Code
            </div>
            <span className="cnmc-code" style={{ fontSize: '1.3rem', fontWeight: 700, letterSpacing: '0.06em' }}>
              {registry.cnmc_code}
            </span>
          </div>
          <StatusBadge status={passport.lifecycle_status} />
        </div>

        {/* Body */}
        <div style={{ padding: 20 }}>
          <h3 style={{ fontSize: '1rem', marginBottom: 20, borderBottom: '1px solid var(--gov-border)', paddingBottom: 12 }}>
            {registry.canonical_description}
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 32px', marginBottom: 20, fontSize: '0.875rem' }}>
            <div>
              <div className="text-secondary text-sm" style={{ marginBottom: 3 }}>Standardized UOM</div>
              <div style={{ fontWeight: 600 }}>{registry.standardized_uom}</div>
            </div>
            <div>
              <div className="text-secondary text-sm" style={{ marginBottom: 3 }}>Material Category</div>
              <div style={{ fontWeight: 600 }}>{registry.category}</div>
            </div>
            <div>
              <div className="text-secondary text-sm" style={{ marginBottom: 3 }}>Technical Specifications</div>
              <div>{passport.technical_specifications}</div>
            </div>
            <div>
              <div className="text-secondary text-sm" style={{ marginBottom: 3 }}>Manufacturer Info</div>
              <div>{passport.manufacturer_info}</div>
            </div>
            <div>
              <div className="text-secondary text-sm" style={{ marginBottom: 3 }}>Legacy Codes</div>
              <div className="mono" style={{ fontSize: '0.8125rem' }}>{registry.legacy_codes}</div>
            </div>
            <div>
              <div className="text-secondary text-sm" style={{ marginBottom: 3 }}>Functional Equivalents</div>
              <div>
                {passport.functional_equivalents ? (
                  <a href={typeof window !== 'undefined' && window.location.pathname.startsWith('/app/admin') ? `/app/admin/registry/${passport.functional_equivalents}` : `/app/steward/mappings/${passport.functional_equivalents}`} className="mono" style={{ fontSize: '0.8125rem' }}>
                    {passport.functional_equivalents}
                  </a>
                ) : 'None identified'}
              </div>
            </div>
          </div>

          <hr />
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 16 }}>
            <button className="btn btn-secondary" onClick={handleDownload} id={`passport-download-${registry.cnmc_code}`}>
              Download Mapping (CSV/Excel)
            </button>
            <button className="btn btn-primary" onClick={handleSendToErp} id={`passport-erp-${registry.cnmc_code}`}>
              Send to ERP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   4. QualityAlertBadge
   ================================================================ */
export function QualityAlertBadge({ alert_type, severity }: { alert_type: string; severity: 'High' | 'Medium' | 'Low' }) {
  let colorClass = 'grey';
  if (severity === 'High') colorClass = 'maroon';
  else if (severity === 'Medium') colorClass = 'saffron';

  return (
    <span className={`status-badge ${colorClass}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, textTransform: 'none', padding: '4px 8px', fontSize: '0.75rem' }}>
      <span style={{ fontWeight: 600 }}>{alert_type}</span>
      <span style={{ borderLeft: '1px solid currentColor', paddingLeft: 6, opacity: 0.8, fontWeight: 500 }}>{severity}</span>
    </span>
  );
}

/* ================================================================
   5. AuditTrailTable — dense table, monospace IDs
   ================================================================ */
export function AuditTrailTable({ rows }: { rows: AuditLog[] }) {
  const [sortDesc, setSortDesc] = useState(true);

  const sorted = [...rows].sort((a, b) =>
    sortDesc ? b.timestamp.localeCompare(a.timestamp) : a.timestamp.localeCompare(b.timestamp)
  );

  return (
    <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
      <table>
        <thead>
          <tr>
            <th>
              <button
                onClick={() => setSortDesc(!sortDesc)}
                style={{ background: 'none', border: 'none', font: 'inherit', fontWeight: 700, fontSize: '0.8125rem', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.03em', padding: 0, display: 'flex', alignItems: 'center', gap: 4 }}
                aria-label={`Sort by timestamp ${sortDesc ? 'ascending' : 'descending'}`}
              >
                Timestamp {sortDesc ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
              </button>
            </th>
            <th>User</th>
            <th>Role</th>
            <th>Action</th>
            <th>Material / CNMC</th>
            <th>Reference ID</th>
            <th>IP Address</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(row => (
            <tr key={row.log_id}>
              <td style={{ whiteSpace: 'nowrap', fontSize: '0.8125rem' }}>{row.timestamp}</td>
              <td style={{ fontSize: '0.8125rem' }}>{row.user_id}</td>
              <td style={{ fontSize: '0.8125rem' }}>{row.user_role}</td>
              <td style={{ fontSize: '0.8125rem' }}>{row.action}</td>
              <td className="mono">{row.material_code || row.cnmc_code || '—'}</td>
              <td className="mono">{row.log_id}</td>
              <td className="mono" style={{ fontSize: '0.75rem' }}>{row.ip_address || '—'}</td>
            </tr>
          ))}
          {sorted.length === 0 && (
            <tr><td colSpan={7} style={{ textAlign: 'center', padding: '24px' }}>No audit logs found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

/* ================================================================
   7. SummaryStatCard — flat card, no shadow, no gradient, optional link
   ================================================================ */
export function SummaryStatCard({
  label,
  value,
  subtext,
  linkTo,
}: {
  label: string;
  value: string | number;
  subtext?: string;
  linkTo?: string;
}) {
  const inner = (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 4, cursor: linkTo ? 'pointer' : 'default', transition: 'border-color 0.12s' }}>
      <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--gov-navy)', lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--gov-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.03em', marginTop: 2 }}>{label}</div>
      {subtext && <div style={{ fontSize: '0.72rem', color: 'var(--gov-text-secondary)', marginTop: 2 }}>{subtext}</div>}
    </div>
  );

  if (linkTo) {
    return (
      <a href={linkTo} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
        {inner}
      </a>
    );
  }
  return inner;
}

/* ================================================================
   8. PlantSelector
   ================================================================ */
export function PlantSelector({ value, onChange, plants }: { value: string; onChange: (val: string) => void; plants: CpseMaster[] }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">-- Select Plant --</option>
      {plants.map(p => (
        <option key={p.plant_code} value={p.plant_code}>{p.plant_code} — {p.plant_name}</option>
      ))}
    </select>
  );
}

/* ================================================================
   9. RecordComparisonTable
   Phase 2 rule: differing values shown bold + underlined (NOT colored).
   ================================================================ */
export function RecordComparisonTable({ match }: { match: MatchResult }) {
  const isDiff = (val1: string, val2: string) =>
    (val1 || '').trim().toLowerCase() !== (val2 || '').trim().toLowerCase();

  const fields = [
    { label: 'Local Code',   key1: 'cpse_1_code',  key2: 'cpse_2_code'  },
    { label: 'Description',  key1: 'cpse_1_desc',  key2: 'cpse_2_desc'  },
    { label: 'Plant',        key1: 'cpse_1_plant', key2: 'cpse_2_plant' },
  ] as const;

  const diffStyle: React.CSSProperties = { fontWeight: 700, textDecoration: 'underline', textDecorationStyle: 'solid', textUnderlineOffset: '2px' };

  return (
    <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
      <table>
        <thead>
          <tr>
            <th style={{ width: '22%' }}>Attribute</th>
            <th>Record 1 — {match.cpse_1_plant}</th>
            <th>Record 2 — {match.cpse_2_plant}</th>
          </tr>
        </thead>
        <tbody>
          {fields.map(f => {
            const v1 = String(match[f.key1 as keyof MatchResult] ?? '');
            const v2 = String(match[f.key2 as keyof MatchResult] ?? '');
            const diff = isDiff(v1, v2);
            return (
              <tr key={f.label}>
                <td style={{ fontWeight: 600, color: 'var(--gov-text-secondary)', fontSize: '0.8125rem' }}>{f.label}</td>
                <td style={diff ? diffStyle : {}}>{v1 || '—'}</td>
                <td style={diff ? diffStyle : {}}>{v2 || '—'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ================================================================
   10. SecurityBadgeStrip (Deprecated / Empty)
   ================================================================ */
export function SecurityBadgeStrip() {
  return null;
}

/* ================================================================
   11. FieldErrorList
   ================================================================ */
export interface FieldError {
  row_no: string | number;
  local_code: string;
  field: string;
  error_type: string;
  message: string;
}

export function FieldErrorList({ errors }: { errors: FieldError[] }) {
  return (
    <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
      <table>
        <thead>
          <tr>
            <th>Row No.</th>
            <th>Local Code</th>
            <th>Field</th>
            <th>Error Type</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          {errors.map((e, i) => (
            <tr key={i}>
              <td>{e.row_no}</td>
              <td className="mono">{e.local_code}</td>
              <td>{e.field}</td>
              <td><span className="status-badge maroon">{e.error_type}</span></td>
              <td>{e.message}</td>
            </tr>
          ))}
          {errors.length === 0 && (
            <tr><td colSpan={5} style={{ textAlign: 'center', padding: '24px' }}>No errors found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

/* ================================================================
   12. Toast helper component
   ================================================================ */
export function InlineToast({ message, type = 'success', refId }: { message: string; type?: 'success' | 'error' | 'warning'; refId?: string }) {
  if (!message) return null;
  return (
    <div className={`toast ${type}`} style={{ position: 'relative', marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {type === 'success' && <CheckCircle2 size={15} aria-hidden="true" />}
        <span>{message}</span>
      </div>
      {refId && <div className="toast-ref">{refId}</div>}
    </div>
  );
}

/* ================================================================
   13. ErrorSummary — form-level error block (WCAG 3.3.1)
   ================================================================ */
export function ErrorSummary({ errors }: { errors: string[] }) {
  if (!errors.length) return null;
  return (
    <div className="info-box error" role="alert" aria-live="assertive" style={{ marginBottom: 20 }}>
      <div style={{ fontWeight: 700, marginBottom: 6, fontSize: '0.875rem' }}>Please correct the following before submitting:</div>
      <ul style={{ paddingLeft: 18, margin: 0 }}>
        {errors.map((e, i) => <li key={i} style={{ fontSize: '0.875rem', marginBottom: 3 }}>{e}</li>)}
      </ul>
    </div>
  );
}

/**
 * ApiTest.tsx — Phase 1 exit check scratch component.
 * Calls each mock API function and displays results.
 * Remove or hide this component after Phase 1 is verified.
 */

import { useEffect, useState } from 'react';
import {
  getUsers,
  getRawMaterialsByPlant,
  getMatchQueue,
  getDashboardStats,
  checkDuplicate,
  getCpseMaster,
  getAuditLogs,
} from '../api/mockApi';

interface TestResult {
  label: string;
  status: 'loading' | 'ok' | 'error';
  count?: number;
  preview?: string;
  error?: string;
}

export function ApiTestPage() {
  const [results, setResults] = useState<TestResult[]>([
    { label: 'getUsers()',                                status: 'loading' },
    { label: 'getRawMaterialsByPlant("BHEL-HEEP")',       status: 'loading' },
    { label: 'getMatchQueue()',                           status: 'loading' },
    { label: 'getDashboardStats("admin")',                status: 'loading' },
    { label: 'checkDuplicate("Ball Bearing 6205")',       status: 'loading' },
    { label: 'checkDuplicate("Unknown Item XYZ")',        status: 'loading' },
    { label: 'getCpseMaster()',                           status: 'loading' },
    { label: 'getAuditLogs({})',                          status: 'loading' },
  ]);

  function update(index: number, patch: Partial<TestResult>) {
    setResults((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  }

  useEffect(() => {
    // getUsers
    getUsers()
      .then((d) => update(0, { status: 'ok', count: d.length, preview: d.map((u) => u.role).filter((v, i, a) => a.indexOf(v) === i).join(', ') }))
      .catch((e) => update(0, { status: 'error', error: String(e) }));

    // getRawMaterialsByPlant
    getRawMaterialsByPlant('BHEL-HEEP')
      .then((d) => update(1, { status: 'ok', count: d.length, preview: d[0]?.description ?? '—' }))
      .catch((e) => update(1, { status: 'error', error: String(e) }));

    // getMatchQueue
    getMatchQueue()
      .then((d) => update(2, { status: 'ok', count: d.length, preview: `First: ${d[0]?.material_group_id ?? '—'}, trust: ${d[0]?.trust_score ?? '—'}` }))
      .catch((e) => update(2, { status: 'error', error: String(e) }));

    // getDashboardStats admin
    getDashboardStats('admin')
      .then((d) => update(3, { status: 'ok', preview: JSON.stringify((d as { summary_cards: unknown }).summary_cards).slice(0, 80) + '…' }))
      .catch((e) => update(3, { status: 'error', error: String(e) }));

    // checkDuplicate — match
    checkDuplicate('Ball Bearing 6205')
      .then((d) => {
        const r = d as { result: string; trust_score: number };
        update(4, { status: 'ok', preview: `result: ${r.result}, trust_score: ${r.trust_score}` });
      })
      .catch((e) => update(4, { status: 'error', error: String(e) }));

    // checkDuplicate — no match
    checkDuplicate('Unknown Item XYZ')
      .then((d) => {
        const r = d as { result: string };
        update(5, { status: 'ok', preview: `result: ${r.result}` });
      })
      .catch((e) => update(5, { status: 'error', error: String(e) }));

    // getCpseMaster
    getCpseMaster()
      .then((d) => update(6, { status: 'ok', count: d.length, preview: d.map((c) => c.plant_code).join(', ') }))
      .catch((e) => update(6, { status: 'error', error: String(e) }));

    // getAuditLogs
    getAuditLogs({})
      .then((d) => update(7, { status: 'ok', count: d.length, preview: d[0]?.action ?? '—' }))
      .catch((e) => update(7, { status: 'error', error: String(e) }));
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Phase 1 — API Layer Test</h1>
          <p className="page-subtitle">Verifying all mockApi.ts functions read correctly from /CSV/ and /JSON/</p>
        </div>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Function</th>
              <th>Status</th>
              <th>Count</th>
              <th>Preview</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.label}>
                <td><code>{r.label}</code></td>
                <td>
                  {r.status === 'loading' && <span className="status-badge grey">Loading…</span>}
                  {r.status === 'ok'      && <span className="status-badge green">OK</span>}
                  {r.status === 'error'   && <span className="status-badge maroon">Error</span>}
                </td>
                <td>{r.count ?? '—'}</td>
                <td style={{ fontSize: '0.8rem', color: r.status === 'error' ? 'var(--gov-maroon)' : 'var(--gov-text-secondary)', maxWidth: 420, wordBreak: 'break-word' }}>
                  {r.error ?? r.preview ?? '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="security-badge-strip">
        <span className="badge-item">Phase 1 Exit Check — all rows should show green OK</span>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMatchDetail, approveMatch, MatchResult } from '../../api/mockApi';
import { RecordComparisonTable, TrustScoreGauge, WhyWhyNotPanel, StatusBadge, InlineToast, ErrorSummary, srAnnounce } from '../../components/SharedUI';

function genRef() {
  return `OVR-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 90000 + 10000))}`;
}

export function DisputeDetailPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  
  const [match, setMatch] = useState<MatchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [toast, setToast] = useState('');
  const [toastRef, setToastRef] = useState('');
  
  const [showOverrideConfirm, setShowOverrideConfirm] = useState(false);
  const [overrideComment, setOverrideComment] = useState('');
  const [formErrors, setFormErrors] = useState<string[]>([]);

  useEffect(() => {
    if (!groupId) return;
    getMatchDetail(groupId)
      .then(setMatch)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [groupId]);

  const handlePreOverride = () => {
    setOverrideComment('');
    setFormErrors([]);
    setShowOverrideConfirm(true);
  };

  const handleOverride = async () => {
    const errors = [];
    if (!overrideComment.trim()) errors.push('Override Justification is required.');
    setFormErrors(errors);
    if (errors.length) return;

    if (!groupId) return;
    setSubmitting(true);
    try {
      await approveMatch(groupId);
      const ref = genRef();
      setToast('Decision overridden. Match force-approved.');
      setToastRef(ref);
      srAnnounce(`Decision overridden. Reference: ${ref}`);
      setShowOverrideConfirm(false);
      setTimeout(() => navigate('/app/admin/disputes'), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}><span className="spinner" aria-label="Loading" /> Loading match…</div>;
  if (!match) return <div className="info-box error" role="alert">Match record not found.</div>;

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      {toast && <InlineToast message={toast} refId={toastRef} />}

      <button className="btn btn-secondary mb-16" onClick={() => navigate('/app/admin/disputes')} aria-label="Go back to disputes">
        ← Back to Disputes
      </button>

      <div className="page-header" style={{ marginBottom: 24, paddingBottom: 12, borderBottom: '2px solid var(--gov-navy)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-title" style={{ marginBottom: 4 }}>Dispute Detail</h1>
            <div className="text-secondary text-sm">
              Match Group ID: <span className="mono">{match.material_group_id}</span> · Match Type: {match.match_type}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <StatusBadge status={match.status} />
            <div className="text-secondary text-sm mt-4">Rejected by: {match.assigned_reviewer}</div>
          </div>
        </div>
      </div>

      <div className="card mb-24">
        <h2 style={{ fontSize: '1rem', marginBottom: 16, borderBottom: '1px solid var(--gov-border)', paddingBottom: 8 }}>Trust Score &amp; Rationale</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
          <TrustScoreGauge trust_score={parseInt(match.trust_score, 10)} />
          <WhyWhyNotPanel why_match={match.why_match} why_not={match.why_not} />
        </div>
      </div>

      <h2 style={{ fontSize: '1rem', marginBottom: 16, borderBottom: '1px solid var(--gov-border)', paddingBottom: 8 }}>Record Comparison</h2>
      <RecordComparisonTable match={match} />

      {match.status === 'Rejected' && (
        <div className="card mt-24" style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', background: 'var(--gov-bg)' }}>
          <button className="btn btn-primary" onClick={handlePreOverride} disabled={!!toast}>
            Override Decision
          </button>
        </div>
      )}

      {/* OVERRIDE MODAL */}
      {showOverrideConfirm && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-override-title">
          <div className="modal-box" style={{ maxWidth: 500 }}>
            <h2 id="modal-override-title" className="modal-title">Confirm Override</h2>
            
            {formErrors.length > 0 && <ErrorSummary errors={formErrors} />}

            <div className="modal-body">
              <p>
                Are you sure you want to override the Technical Reviewer's rejection for <strong className="mono">{match.material_group_id}</strong>? 
                This will forcefully approve the match and generate a CNMC.
              </p>
              
              <div className="form-group mt-16">
                <label htmlFor="override-comment" className="required">Override Justification</label>
                <textarea 
                  id="override-comment"
                  rows={3}
                  value={overrideComment}
                  onChange={(e) => { setOverrideComment(e.target.value); setFormErrors([]); }}
                  placeholder="Provide justification for overriding the reviewer decision…"
                  aria-required="true"
                  style={{ borderColor: formErrors.length ? 'var(--gov-maroon)' : undefined }}
                />
              </div>

              <div className="info-box warning" style={{ marginTop: 16 }}>
                <strong>Warning:</strong> This is a destructive administrative action that bypasses standard governance workflows.
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowOverrideConfirm(false)} disabled={submitting}>Cancel</button>
              <button className="btn btn-primary" onClick={handleOverride} disabled={submitting} aria-busy={submitting}>
                {submitting ? 'Processing…' : 'Confirm Override'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

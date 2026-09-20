import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMatchDetail, approveMatch, rejectMatch, MatchResult } from '../../api/mockApi';
import { RecordComparisonTable, TrustScoreGauge, WhyWhyNotPanel, InlineToast, srAnnounce } from '../../components/SharedUI';
import { CheckCircle2, XCircle } from 'lucide-react';

function genRef() {
  return `DEC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 90000 + 10000))}`;
}

export function MatchDetailPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();

  const [match, setMatch] = useState<MatchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState('');
  const [toastRef, setToastRef] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  // Modals
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  // Reject form
  const [rejectReason, setRejectReason] = useState('Specifications do not match');
  const [rejectNotes, setRejectNotes] = useState('');

  // Post-approval info
  const [generatedInfo, setGeneratedInfo] = useState<{ cnmc: string; passport: string } | null>(null);

  useEffect(() => {
    if (!groupId) return;
    getMatchDetail(groupId)
      .then(setMatch)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [groupId]);

  const handleApprove = async () => {
    if (!groupId) return;
    setSubmitting(true);
    try {
      const res = await approveMatch(groupId);
      const ref = genRef();
      if (res.approved && res.cnmc && res.passport) {
        setGeneratedInfo({ cnmc: res.cnmc.cnmc_code, passport: res.passport.passport_id });
        setToast(`Match approved. CNMC ${res.cnmc.cnmc_code} assigned and National Material Passport created.`);
        setToastRef(ref);
        setToastType('success');
        srAnnounce(`Match approved. CNMC generated. Reference: ${ref}`);
      } else {
        setToast('Approval recorded. CNMC resolution pending manual verification.');
        setToastRef(ref);
        setToastType('success');
        srAnnounce(`Approval recorded. Reference: ${ref}`);
        setTimeout(() => navigate('/app/reviewer/queue'), 2500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
      setShowApproveConfirm(false);
    }
  };

  const handleReject = async () => {
    if (!groupId) return;
    setSubmitting(true);
    try {
      await rejectMatch(groupId, `${rejectReason} - ${rejectNotes}`);
      const ref = genRef();
      setToast(`Match rejected: "${rejectReason}". Record returned to queue.`);
      setToastRef(ref);
      setToastType('error');
      srAnnounce(`Match rejected. Reference: ${ref}`);
      setTimeout(() => navigate('/app/reviewer/queue'), 2500);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
      setShowRejectModal(false);
    }
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}><span className="spinner" aria-label="Loading" /> Loading match record…</div>;
  if (!match)  return <div className="info-box error" role="alert">Match record not found.</div>;

  const isDecided = match.status === 'Approved' || match.status === 'Rejected';

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>

      {toast && <InlineToast message={toast} type={toastType} refId={toastRef} />}

      <button className="btn btn-secondary mb-16" onClick={() => navigate('/app/reviewer/queue')} id="back-to-queue">
        ← Back to Queue
      </button>

      {/* Page header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, paddingBottom: 12, borderBottom: '2px solid var(--gov-navy)' }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: 4 }}>Match Detail Review</h1>
          <div className="text-secondary text-sm">
            Group ID: <span className="mono">{match.material_group_id}</span>
            &nbsp;·&nbsp;Match Type: <strong>{match.match_type}</strong>
            &nbsp;·&nbsp;Assigned: {match.assigned_reviewer}
          </div>
        </div>
        <span className={`status-badge ${isDecided ? (match.status === 'Approved' ? 'green' : 'maroon') : 'amber'}`}>
          {match.status}
        </span>
      </div>

      {/* Post-approval success panel */}
      {generatedInfo && (
        <div className="validation-panel mb-24">
          <div className="validation-panel-header success">
            <CheckCircle2 size={16} aria-hidden="true" />
            MATCH APPROVED — CNMC ASSIGNED
          </div>
          <div className="validation-panel-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 16 }}>
              <div>
                <div className="text-secondary text-sm" style={{ marginBottom: 3 }}>National Material Code (CNMC)</div>
                <div className="mono" style={{ fontSize: '1.2rem', fontWeight: 700 }}>{generatedInfo.cnmc}</div>
              </div>
              <div>
                <div className="text-secondary text-sm" style={{ marginBottom: 3 }}>Passport ID</div>
                <div className="mono" style={{ fontWeight: 700 }}>{generatedInfo.passport}</div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button className="btn btn-secondary" onClick={() => navigate(`/app/reviewer/queue`)}>
                Return to Queue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trust Score */}
      <div className="card mb-16">
        <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--gov-text-secondary)', marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid var(--gov-border)' }}>
          Trust Score &amp; Match Rationale
        </div>
        <TrustScoreGauge trust_score={parseInt(match.trust_score, 10)} />
        <WhyWhyNotPanel why_match={match.why_match} why_not={match.why_not} />
      </div>

      {/* Record comparison */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--gov-text-secondary)', marginBottom: 10, paddingBottom: 6, borderBottom: '1px solid var(--gov-border)' }}>
          Side-by-Side Record Comparison
        </div>
        <p className="text-sm text-secondary" style={{ marginBottom: 10 }}>
          Differing fields are shown in <strong style={{ textDecoration: 'underline' }}>bold underline</strong>.
        </p>
        <RecordComparisonTable match={match} />
      </div>

      {/* Decision action bar — only shown when not yet decided */}
      {!generatedInfo && !isDecided && (
        <div className="card mt-16" style={{ background: 'var(--gov-bg)', display: 'flex', gap: 12, justifyContent: 'flex-end', alignItems: 'center' }}>
          <button
            className="btn btn-secondary"
            id="btn-clarify"
            onClick={() => navigate(`/app/reviewer/queue/${match.material_group_id}/clarify`)}
          >
            Request Clarification
          </button>
          <button
            className="btn btn-danger"
            id="btn-reject"
            onClick={() => setShowRejectModal(true)}
          >
            <XCircle size={14} aria-hidden="true" /> Reject
          </button>
          <button
            className="btn btn-success"
            id="btn-approve"
            onClick={() => setShowApproveConfirm(true)}
          >
            <CheckCircle2 size={14} aria-hidden="true" /> Approve Match
          </button>
        </div>
      )}

      {/* APPROVE MODAL */}
      {showApproveConfirm && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-approve-title">
          <div className="modal-box">
            <h2 id="modal-approve-title" className="modal-title">Confirm Approval</h2>
            <div className="modal-body">
              <p>Approve match group <strong className="mono">{match.material_group_id}</strong>?</p>
              <p className="text-sm text-secondary mt-8">
                This action will generate a new National Material Code (CNMC) and create a National Material Passport. This decision is recorded in the audit trail and cannot be undone via this interface.
              </p>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" id="modal-approve-cancel" onClick={() => setShowApproveConfirm(false)} disabled={submitting}>Cancel</button>
              <button className="btn btn-success" id="modal-approve-confirm" onClick={handleApprove} disabled={submitting} aria-busy={submitting}>
                {submitting ? 'Approving…' : 'Confirm Approval'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECT MODAL */}
      {showRejectModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-reject-title">
          <div className="modal-box">
            <h2 id="modal-reject-title" className="modal-title">Reject Match</h2>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="reject-reason" className="required">Rejection Reason</label>
                <select id="reject-reason" value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}>
                  <option value="Specifications do not match">Specifications do not match</option>
                  <option value="Insufficient data">Insufficient data</option>
                  <option value="Vendor-specific code">Vendor-specific code</option>
                  <option value="Near-duplicate">Near-duplicate — not identical</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group mt-16">
                <label htmlFor="reject-notes">Additional Notes (Optional)</label>
                <textarea
                  id="reject-notes"
                  rows={3}
                  value={rejectNotes}
                  onChange={(e) => setRejectNotes(e.target.value)}
                  placeholder="Provide additional context for rejection…"
                />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" id="modal-reject-cancel" onClick={() => setShowRejectModal(false)} disabled={submitting}>Cancel</button>
              <button className="btn btn-danger" id="modal-reject-confirm" onClick={handleReject} disabled={submitting} aria-busy={submitting}>
                {submitting ? 'Rejecting…' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

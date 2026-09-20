import { useState } from 'react';
import { InlineToast, srAnnounce } from '../../components/SharedUI';

function genRef() {
  return `CFG-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 90000 + 10000))}`;
}

export function TrustScoreThresholdsPage() {
  const [autoApprove, setAutoApprove] = useState(85);
  const [manualReview, setManualReview] = useState(70);
  const [autoReject, setAutoReject] = useState(50);
  
  const [showConfirm, setShowConfirm] = useState(false);
  const [toast, setToast] = useState('');
  const [toastRef, setToastRef] = useState('');

  const handlePreSave = () => {
    setShowConfirm(true);
  };

  const handleConfirmSave = () => {
    const ref = genRef();
    setToast('Thresholds updated locally.');
    setToastRef(ref);
    srAnnounce(`Thresholds updated. Reference: ${ref}`);
    setShowConfirm(false);
    setTimeout(() => setToast(''), 3500);
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      {toast && <InlineToast message={toast} refId={toastRef} />}

      <div className="page-header" style={{ marginBottom: 24, paddingBottom: 12, borderBottom: '2px solid var(--gov-navy)' }}>
        <h1 className="page-title" style={{ marginBottom: 4 }}>Trust Score Thresholds</h1>
        <p className="page-subtitle" style={{ color: 'var(--gov-text-secondary)', fontSize: '0.875rem' }}>
          Configure the system-wide thresholds for the deduplication engine.
        </p>
      </div>

      <div className="card">
        <div className="form-group mb-24">
          <label htmlFor="thresh-auto-approve" style={{ fontWeight: 600 }}>Auto-Approve Threshold ({autoApprove}%)</label>
          <div className="text-sm text-secondary mb-8">Matches above this score will bypass manual review and automatically generate a CNMC.</div>
          <input 
            id="thresh-auto-approve"
            type="range" 
            min="0" 
            max="100" 
            value={autoApprove} 
            onChange={(e) => setAutoApprove(Number(e.target.value))} 
            style={{ width: '100%' }}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={autoApprove}
          />
        </div>

        <div className="form-group mb-24">
          <label htmlFor="thresh-manual-review" style={{ fontWeight: 600 }}>Manual Review Threshold ({manualReview}%)</label>
          <div className="text-sm text-secondary mb-8">Matches above this score (but below Auto-Approve) will be routed to the Technical Reviewer Queue.</div>
          <input 
            id="thresh-manual-review"
            type="range" 
            min="0" 
            max="100" 
            value={manualReview} 
            onChange={(e) => setManualReview(Number(e.target.value))} 
            style={{ width: '100%' }} 
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={manualReview}
          />
        </div>

        <div className="form-group mb-24">
          <label htmlFor="thresh-auto-reject" style={{ fontWeight: 600 }}>Auto-Reject Below ({autoReject}%)</label>
          <div className="text-sm text-secondary mb-8">Matches below this score will be immediately rejected and require CPSE Data Steward intervention.</div>
          <input 
            id="thresh-auto-reject"
            type="range" 
            min="0" 
            max="100" 
            value={autoReject} 
            onChange={(e) => setAutoReject(Number(e.target.value))} 
            style={{ width: '100%' }} 
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={autoReject}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 32, paddingTop: 16, borderTop: '1px solid var(--gov-border)' }}>
          <button className="btn btn-primary" onClick={handlePreSave}>
            Review &amp; Save Thresholds
          </button>
        </div>
      </div>

      {/* CONFIRMATION MODAL */}
      {showConfirm && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-confirm-title">
          <div className="modal-box">
            <h2 id="modal-confirm-title" className="modal-title">Confirm Configuration Change</h2>
            <div className="modal-body">
              <p>Are you sure you want to update the system-wide Trust Score thresholds?</p>
              <ul style={{ margin: '12px 0', paddingLeft: 20 }}>
                <li><strong>Auto-Approve:</strong> {autoApprove}%</li>
                <li><strong>Manual Review:</strong> {manualReview}%</li>
                <li><strong>Auto-Reject:</strong> {autoReject}%</li>
              </ul>
              <div className="info-box" style={{ marginTop: 16 }}>
                <strong>Note:</strong> Updated threshold criteria will apply immediately to incoming CPSE plant harmonization runs.
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowConfirm(false)}>Cancel</button>
              <button className="btn btn-success" onClick={handleConfirmSave}>Confirm Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

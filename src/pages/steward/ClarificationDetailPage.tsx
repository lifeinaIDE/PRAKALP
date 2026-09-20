import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getClarificationsForSteward, respondToClarification, ClarificationRequest } from '../../api/mockApi';
import { StatusBadge, InlineToast, ErrorSummary, srAnnounce } from '../../components/SharedUI';

export function ClarificationDetailPage() {
  const { requestId } = useParams<{ requestId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [request, setRequest] = useState<ClarificationRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [response, setResponse] = useState('');
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [toast, setToast] = useState('');
  const [toastRef, setToastRef] = useState('');

  useEffect(() => {
    if (!user || !requestId) return;

    getClarificationsForSteward(user.user_id)
      .then(reqs => {
        const r = reqs.find(x => x.request_id === requestId);
        setRequest(r || null);
        setResponse(r?.response || '');
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, requestId]);

  const handleSubmit = async () => {
    const errors: string[] = [];
    if (!response.trim()) errors.push('Your Response is required.');
    setFormErrors(errors);
    if (errors.length) return;

    if (!requestId) return;
    setSubmitting(true);
    try {
      await respondToClarification(requestId, response);
      const ref = `LOG-${String(Math.floor(Math.random() * 90000 + 10000))}`;
      setToast('Response submitted successfully. Clarification marked as Resolved.');
      setToastRef(ref);
      srAnnounce(`Response submitted. Reference: ${ref}`);
      setTimeout(() => {
        navigate('/app/steward/clarifications');
      }, 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}><span className="spinner" aria-label="Loading" /> Loading…</div>;
  if (!request) return <div className="info-box error" role="alert">Request not found or access denied.</div>;

  const isResolved = request.status === 'Resolved';

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      {toast && <InlineToast message={toast} refId={toastRef} />}
      <ErrorSummary errors={formErrors} />

      <button className="btn btn-secondary mb-16" onClick={() => navigate('/app/steward/clarifications')} id="back-to-inbox">
        ← Back to Inbox
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, paddingBottom: 12, borderBottom: '2px solid var(--gov-navy)' }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: 4 }}>Clarification Request</h1>
          <div className="text-secondary text-sm">
            Request ID: <span className="mono">{request.request_id}</span> · Match Group: <span className="mono">{request.material_group_id}</span>
          </div>
        </div>
        <StatusBadge status={request.status} />
      </div>

      <div className="card mb-24" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ background: '#f0f0f0', padding: '8px 16px', borderBottom: '1px solid var(--gov-border)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--gov-text-secondary)' }}>
          Reviewer Query
        </div>
        <div style={{ padding: 16 }}>
          <div className="text-sm text-secondary mb-8">
            From Reviewer: <span style={{ fontWeight: 600 }}>{request.reviewer_id}</span> on {request.requested_date}
          </div>
          <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.5 }}>{request.message}</p>
        </div>
      </div>

      <div className="card">
        <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--gov-text-secondary)', marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid var(--gov-border)' }}>
          Response Form
        </div>
        
        <div className="form-group">
          <label htmlFor="response-text" className="required">Your Response</label>
          <textarea 
            id="response-text"
            rows={6} 
            value={response}
            onChange={(e) => { setResponse(e.target.value); setFormErrors([]); }}
            placeholder="Provide clear technical clarification regarding this record…"
            disabled={isResolved}
            aria-required="true"
            style={{ borderColor: formErrors.length ? 'var(--gov-maroon)' : undefined }}
          />
        </div>

        {isResolved && (
          <div className="info-box success" style={{ marginTop: 16 }}>
            This clarification request has been resolved. No further action is required.
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--gov-border)' }}>
          <button 
            className="btn btn-primary" 
            id="submit-response"
            onClick={handleSubmit}
            disabled={submitting || !!toast || isResolved}
            aria-busy={submitting}
          >
            {submitting ? <><span className="spinner" style={{ width: 14, height: 14 }} /> Submitting…</> : 'Submit Response'}
          </button>
        </div>
      </div>
    </div>
  );
}

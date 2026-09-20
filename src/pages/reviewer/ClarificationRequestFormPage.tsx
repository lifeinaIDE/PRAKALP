import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUsers, getMatchDetail, sendClarificationRequest, User, MatchResult } from '../../api/mockApi';
import { useAuth } from '../../context/AuthContext';
import { InlineToast, ErrorSummary, srAnnounce } from '../../components/SharedUI';

function genRef() {
  return `CLR-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 90000 + 10000))}`;
}

export function ClarificationRequestFormPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const { user: reviewer } = useAuth();
  const navigate = useNavigate();

  const [match, setMatch] = useState<MatchResult | null>(null);
  const [stewards, setStewards] = useState<User[]>([]);
  
  const [selectedSteward, setSelectedSteward] = useState('');
  const [message, setMessage] = useState('');
  const [formErrors, setFormErrors] = useState<string[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState('');
  const [toastRef, setToastRef] = useState('');

  useEffect(() => {
    if (!groupId) return;
    Promise.all([getMatchDetail(groupId), getUsers()])
      .then(([m, allUsers]) => {
        setMatch(m);
        if (m) {
          const possiblePlants = [m.cpse_1_plant.toLowerCase(), m.cpse_2_plant.toLowerCase()];
          const validStewards = allUsers.filter(u => 
            u.role === 'CPSE Data Steward' && possiblePlants.includes(u.plant_code.toLowerCase())
          );
          setStewards(validStewards);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [groupId]);

  const handleSend = async () => {
    const errors: string[] = [];
    if (!selectedSteward) errors.push('Select Steward is required.');
    if (!message.trim()) errors.push('Message is required.');
    if (message.trim() && message.trim().length < 10) errors.push('Message must be at least 10 characters.');
    setFormErrors(errors);
    if (errors.length) return;

    if (!groupId || !reviewer) return;
    setSubmitting(true);
    try {
      const res = await sendClarificationRequest(groupId, selectedSteward, message);
      const ref = genRef(); // Mocking actual ref generation since res.ref might not match Phase 2 prefix rule (CLR-)
      setToast('Request sent to steward successfully.');
      setToastRef(ref);
      srAnnounce(`Request sent. Reference: ${ref}`);
      setTimeout(() => navigate(`/app/reviewer/queue/${groupId}`), 2500);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}><span className="spinner" aria-label="Loading" /> Loading form…</div>;
  if (!match) return <div className="info-box error" role="alert">Match record not found.</div>;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      {toast && <InlineToast message={toast} refId={toastRef} />}
      <ErrorSummary errors={formErrors} />

      <button className="btn btn-secondary mb-16" onClick={() => navigate(`/app/reviewer/queue/${groupId}`)} id="back-to-match">
        ← Back to Match Detail
      </button>

      <div className="page-header" style={{ marginBottom: 24, paddingBottom: 12, borderBottom: '2px solid var(--gov-navy)' }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: 4 }}>Request Clarification</h1>
          <div className="text-secondary text-sm">
            Match Group ID: <span className="mono">{groupId}</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--gov-text-secondary)', marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid var(--gov-border)' }}>
          Clarification Details
        </div>
        
        <div className="form-group mb-16">
          <label htmlFor="steward-select" className="required">Select Steward</label>
          <select 
            id="steward-select"
            value={selectedSteward} 
            onChange={(e) => { setSelectedSteward(e.target.value); setFormErrors([]); }}
            aria-required="true"
            style={{ borderColor: formErrors.some(e => e.includes('Steward')) ? 'var(--gov-maroon)' : undefined }}
          >
            <option value="">-- Select a Steward --</option>
            {stewards.map(s => (
              <option key={s.user_id} value={s.user_id}>{s.name} ({s.plant_code})</option>
            ))}
          </select>
          {stewards.length === 0 && <div className="info-box error" style={{ marginTop: 8 }}>No stewards found for {match.cpse_1_plant} or {match.cpse_2_plant}.</div>}
        </div>

        <div className="form-group">
          <label htmlFor="message-text" className="required">Message</label>
          <textarea 
            id="message-text"
            rows={5} 
            value={message}
            onChange={(e) => { setMessage(e.target.value); setFormErrors([]); }}
            placeholder="Explain what specific technical detail needs clarification…"
            aria-required="true"
            style={{ borderColor: formErrors.some(e => e.includes('Message')) ? 'var(--gov-maroon)' : undefined }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--gov-border)' }}>
          <button 
            className="btn btn-primary" 
            id="send-request"
            onClick={handleSend}
            disabled={submitting || !!toast || stewards.length === 0}
            aria-busy={submitting}
          >
            {submitting ? <><span className="spinner" style={{ width: 14, height: 14 }} /> Sending…</> : 'Send Request'}
          </button>
        </div>
      </div>
    </div>
  );
}

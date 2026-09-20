import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkDuplicate, getCpseMaster } from '../../api/mockApi';
import { TrustScoreGauge, InlineToast, ErrorSummary, srAnnounce } from '../../components/SharedUI';
import { CheckCircle2, AlertCircle } from 'lucide-react';

function genRef() {
  return `REQ-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 90000 + 10000))}`;
}

export function NewCodeRequestPage() {
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [uom, setUom] = useState('');
  const [specs, setSpecs] = useState('');
  
  const [categories, setCategories] = useState<string[]>([]);
  
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  const [justification, setJustification] = useState('');
  const [justificationError, setJustificationError] = useState('');
  
  const [toast, setToast] = useState('');
  const [toastRef, setToastRef] = useState('');

  // Modals
  const [showReuseConfirm, setShowReuseConfirm] = useState(false);
  const [showNewRequestConfirm, setShowNewRequestConfirm] = useState(false);

  useEffect(() => {
    getCpseMaster().then(plants => {
      const cats = Array.from(new Set(plants.map(p => p.sector))).filter(Boolean);
      setCategories([...cats, 'Mechanical', 'Electrical', 'Consumables']);
    });
  }, []);

  const handleCheck = async () => {
    const errors: string[] = [];
    if (!description.trim()) errors.push('Description is required.');
    if (!category) errors.push('Category is required.');
    if (!uom.trim()) errors.push('Unit of Measure is required.');
    setFormErrors(errors);
    if (errors.length) return;

    setLoading(true);
    setResult(null);
    setToast('');
    try {
      const res: any = await checkDuplicate(description);
      setResult(res);
      srAnnounce(`Check complete. ${res.result === 'POTENTIAL_MATCH_FOUND' ? 'Potential match found.' : 'No match found.'}`);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const confirmReuse = () => {
    const ref = genRef();
    setToast('CNMC reused successfully. National mapping updated.');
    setToastRef(ref);
    srAnnounce(`CNMC reused. Reference: ${ref}`);
    setShowReuseConfirm(false);
    setTimeout(() => navigate('/app/steward/dashboard'), 2500);
  };

  const confirmNewRequest = () => {
    if (result && result.result === 'POTENTIAL_MATCH_FOUND' && !justification.trim()) {
      setJustificationError('Justification is required when bypassing a potential match.');
      setShowNewRequestConfirm(false);
      return;
    }
    const ref = genRef();
    setToast('New CNMC request submitted for Technical Review.');
    setToastRef(ref);
    srAnnounce(`Request submitted. Reference: ${ref}`);
    setShowNewRequestConfirm(false);
    setTimeout(() => navigate('/app/steward/dashboard'), 2500);
  };

  const handleSendForReviewClick = () => {
    if (result && result.result === 'POTENTIAL_MATCH_FOUND' && !justification.trim()) {
      setJustificationError('Justification is required when bypassing a potential match.');
      return;
    }
    setShowNewRequestConfirm(true);
  };

  return (
    <div style={{ maxWidth: 840, margin: '0 auto' }}>
      {toast && <InlineToast message={toast} refId={toastRef} />}

      <div className="page-header">
        <div>
          <h1 className="page-title">New Material Request</h1>
          <p className="page-subtitle">
            Request a new National Material Code (CNMC) if no existing match exists.
          </p>
        </div>
      </div>

      <ErrorSummary errors={formErrors} />

      <div className="card mb-24">
        <h2 style={{ fontSize: '1rem', marginBottom: 16, borderBottom: '1px solid var(--gov-border)', paddingBottom: 8 }}>
          Material Details
        </h2>
        
        <div className="form-group mb-16">
          <label htmlFor="req-desc" className="required">Description</label>
          <input 
            id="req-desc"
            type="text" 
            value={description}
            onChange={(e) => { setDescription(e.target.value); setFormErrors([]); }}
            placeholder="e.g. Ball Bearing 6205…"
            disabled={!!result}
            aria-required="true"
            style={{ borderColor: formErrors.some(e => e.includes('Description')) ? 'var(--gov-maroon)' : undefined }}
          />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div className="form-group">
            <label htmlFor="req-cat" className="required">Category</label>
            <select 
              id="req-cat"
              value={category} 
              onChange={(e) => { setCategory(e.target.value); setFormErrors([]); }}
              disabled={!!result}
              aria-required="true"
              style={{ borderColor: formErrors.some(e => e.includes('Category')) ? 'var(--gov-maroon)' : undefined }}
            >
              <option value="">-- Select Category --</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="req-uom" className="required">Unit of Measure (UOM)</label>
            <input 
              id="req-uom"
              type="text" 
              value={uom} 
              onChange={(e) => { setUom(e.target.value); setFormErrors([]); }}
              disabled={!!result}
              aria-required="true"
              style={{ borderColor: formErrors.some(e => e.includes('Unit')) ? 'var(--gov-maroon)' : undefined }}
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="req-specs">Technical Specifications</label>
          <textarea 
            id="req-specs"
            rows={3} 
            value={specs}
            onChange={(e) => setSpecs(e.target.value)}
            disabled={!!result}
          />
        </div>

        {!result && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--gov-border)' }}>
            <button 
              className="btn btn-primary" 
              onClick={handleCheck}
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? <><span className="spinner" style={{ width: 14, height: 14 }} /> Checking…</> : 'Check for Duplicates'}
            </button>
          </div>
        )}
      </div>

      {result && result.result === 'POTENTIAL_MATCH_FOUND' && (
        <div className="validation-panel" role="region" aria-label="Duplicate check results">
          <div className="validation-panel-header error" style={{ background: 'var(--gov-red-light)', color: 'var(--gov-saffron)', borderBottomColor: 'var(--gov-saffron)' }}>
            <AlertCircle size={16} aria-hidden="true" />
            POTENTIAL MATCH FOUND
          </div>
          <div className="validation-panel-body">
            <p className="text-sm mb-16">{result.recommendation}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 16 }}>
              <div>
                <div className="text-sm text-secondary mb-4">Matched CNMC</div>
                <div className="mono" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--gov-navy)' }}>{result.matched_cnmc.cnmc_code}</div>
                <div style={{ marginTop: 4, fontWeight: 500 }}>{result.matched_cnmc.canonical_description}</div>
              </div>
              <div>
                <TrustScoreGauge trust_score={result.trust_score} />
              </div>
            </div>

            <hr style={{ margin: '24px 0' }} />
            
            <div className="form-group mt-16">
              <label htmlFor="justification-text" className="required">
                If proceeding with new request, please provide justification:
              </label>
              <textarea 
                id="justification-text"
                rows={3} 
                value={justification}
                onChange={(e) => { setJustification(e.target.value); setJustificationError(''); }}
                placeholder="Explain why the existing CNMC cannot be used (e.g. incompatible technical specification)…"
                style={{ borderColor: justificationError ? 'var(--gov-maroon)' : undefined }}
              />
              {justificationError && <div className="text-sm text-red mt-4">{justificationError}</div>}
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
              <button className="btn btn-secondary" onClick={() => { setResult(null); setJustification(''); }} disabled={!!toast}>
                Edit Details
              </button>
              <button className="btn btn-primary" onClick={handleSendForReviewClick} disabled={!!toast}>
                Proceed with New Request
              </button>
              <button className="btn btn-success" onClick={() => setShowReuseConfirm(true)} disabled={!!toast}>
                Reuse Existing CNMC
              </button>
            </div>
          </div>
        </div>
      )}

      {result && result.result !== 'POTENTIAL_MATCH_FOUND' && (
        <div className="validation-panel" role="region" aria-label="Duplicate check results">
          <div className="validation-panel-header success">
            <CheckCircle2 size={16} aria-hidden="true" />
            NO MATCH FOUND
          </div>
          <div className="validation-panel-body">
            <p className="text-sm mb-16">
              No existing National Material Code matched your description. You may proceed with the new request.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setResult(null)} disabled={!!toast}>
                Edit Details
              </button>
              <button className="btn btn-primary" onClick={() => setShowNewRequestConfirm(true)} disabled={!!toast}>
                Send for Technical Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REUSE CONFIRM MODAL */}
      {showReuseConfirm && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-reuse-title">
          <div className="modal-box">
            <h2 id="modal-reuse-title" className="modal-title">Confirm Reuse</h2>
            <div className="modal-body">
              <p>Are you sure you want to map your local record to CNMC <strong className="mono">{result?.matched_cnmc?.cnmc_code}</strong>?</p>
              <p className="text-sm text-secondary mt-8">This will immediately create a mapping in the National Registry.</p>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowReuseConfirm(false)}>Cancel</button>
              <button className="btn btn-success" onClick={confirmReuse}>Confirm Reuse</button>
            </div>
          </div>
        </div>
      )}

      {/* NEW REQUEST CONFIRM MODAL */}
      {showNewRequestConfirm && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-new-title">
          <div className="modal-box">
            <h2 id="modal-new-title" className="modal-title">Confirm New Request</h2>
            <div className="modal-body">
              <p>Submit this material for a new National Material Code (CNMC)?</p>
              <p className="text-sm text-secondary mt-8">This request will be sent to the Technical Reviewer queue for validation.</p>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowNewRequestConfirm(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={confirmNewRequest}>Confirm Request</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

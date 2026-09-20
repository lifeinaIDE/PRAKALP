import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRawMaterialsByPlant, RawMaterial } from '../../api/mockApi';
import { CheckCircle2 } from 'lucide-react';
import { InlineToast, srAnnounce } from '../../components/SharedUI';

export function FieldMappingPage() {
  const navigate = useNavigate();
  const [records, setRecords] = useState<RawMaterial[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState('');
  const [toastRef, setToastRef] = useState('');

  useEffect(() => {
    // For demo purposes, we load a fixed plant's sample data to simulate the "in-memory" preview
    getRawMaterialsByPlant('BHEL-HEEP')
      .then(res => setRecords(res.slice(0, 10)))
      .catch(console.error);
  }, []);

  const handleConfirm = () => {
    setSubmitting(true);
    setTimeout(() => {
      const ref = `VAL-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 90000 + 10000))}`;
      setToast('Submitted for national schema mapping.');
      setToastRef(ref);
      srAnnounce(`Submission confirmed. Reference: ${ref}`);
      setTimeout(() => {
        navigate('/app/steward/dashboard');
      }, 2500);
    }, 500);
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      {toast && <InlineToast message={toast} refId={toastRef} />}

      <h1 className="page-title">Field Mapping / Preview</h1>
      
      {/* Stepper UI */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, gap: 12, fontSize: '0.875rem' }}>
        <div style={{ color: 'var(--gov-green)' }}>
          <CheckCircle2 size={16} style={{ verticalAlign: 'text-bottom', marginRight: 4 }} />
          1. Select &amp; Validate
        </div>
        <div style={{ flex: 1, height: 2, background: 'var(--gov-green)' }} />
        <div style={{ fontWeight: 700, color: 'var(--gov-navy)' }}>2. Field Mapping</div>
        <div style={{ flex: 1, height: 2, background: 'var(--gov-border)' }} />
        <div style={{ color: 'var(--gov-text-secondary)' }}>3. Confirm</div>
      </div>

      <p className="page-subtitle" style={{ marginBottom: 24 }}>
        Preview the validated records before final submission for national mapping.
      </p>

      <div className="card" style={{ padding: 0, overflowX: 'auto', marginBottom: 24 }}>
        <table>
          <thead>
            <tr>
              <th>Local Code</th>
              <th>Description</th>
              <th>UOM</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r, i) => (
              <tr key={i}>
                <td className="mono" style={{ fontSize: '0.8125rem' }}>{r.local_code}</td>
                <td>{r.description}</td>
                <td>{r.uom}</td>
                <td>{r.category}</td>
              </tr>
            ))}
            {records.length === 0 && (
              <tr><td colSpan={4} style={{ textAlign: 'center', padding: '24px' }}>No records found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
        <button 
          className="btn btn-secondary" 
          onClick={() => navigate('/app/steward/onboarding')}
          disabled={submitting || !!toast}
        >
          Cancel
        </button>
        <button 
          className="btn btn-success" 
          onClick={handleConfirm}
          disabled={submitting || !!toast}
          aria-busy={submitting}
        >
          {submitting ? <><span className="spinner" style={{ width: 14, height: 14 }} /> Submitting…</> : 'Confirm Submission'}
        </button>
      </div>
    </div>
  );
}

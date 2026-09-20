import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCpseMaster, CpseMaster, validateUpload } from '../../api/mockApi';
import { PlantSelector, FieldErrorList, InlineToast, ErrorSummary, srAnnounce } from '../../components/SharedUI';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export function DataOnboardingPage() {
  const navigate = useNavigate();
  const [plants, setPlants] = useState<CpseMaster[]>([]);
  const [selectedPlant, setSelectedPlant] = useState('');
  const [sampleId, setSampleId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  
  // Correction form state
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [correctionData, setCorrectionData] = useState<Record<string, string>>({});
  const [resubmitting, setResubmitting] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    getCpseMaster().then(setPlants).catch(console.error);
  }, []);

  const handleValidate = async () => {
    const errors: string[] = [];
    if (!selectedPlant) errors.push('CPSE Plant is required.');
    if (!sampleId) errors.push('Dataset batch is required.');
    setFormErrors(errors);
    if (errors.length) return;

    setLoading(true);
    setResult(null);
    setEditingRow(null);
    setToast('');
    try {
      const res: any = await validateUpload(sampleId);
      setResult(res);
      srAnnounce(`Validation complete. ${res.status === 'VALIDATION_PASSED' ? 'Passed' : 'Failed'}.`);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleResubmit = () => {
    setResubmitting(true);
    setTimeout(() => {
      // Simulate success after correction
      setResult({
        validation_id: 'VAL-2026-04711',
        status: 'VALIDATION_PASSED',
        summary: { total_records: 12, records_passed: 12, records_failed: 0 },
        remarks: 'Corrections accepted. All records conform to mandatory field requirements.'
      });
      setToast('Row corrected successfully.');
      srAnnounce('Row corrected successfully.');
      setResubmitting(false);
      setEditingRow(null);
      setTimeout(() => setToast(''), 3000);
    }, 500);
  };

  const startCorrection = (rowNo: number) => {
    setEditingRow(rowNo);
    setCorrectionData({});
  };

  const handleCorrectionChange = (field: string, val: string) => {
    setCorrectionData(prev => ({ ...prev, [field]: val }));
  };

  return (
    <div style={{ maxWidth: 840, margin: '0 auto' }}>
      {toast && <InlineToast message={toast} />}

      <h1 className="page-title">Data Onboarding</h1>
      
      {/* Stepper UI */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, gap: 12, fontSize: '0.875rem' }}>
        <div style={{ fontWeight: 700, color: 'var(--gov-navy)' }}>1. Select &amp; Validate</div>
        <div style={{ flex: 1, height: 2, background: 'var(--gov-border)' }} />
        <div style={{ color: 'var(--gov-text-secondary)' }}>2. Field Mapping</div>
        <div style={{ flex: 1, height: 2, background: 'var(--gov-border)' }} />
        <div style={{ color: 'var(--gov-text-secondary)' }}>3. Confirm</div>
      </div>

      <ErrorSummary errors={formErrors} />

      <div className="card">
        <h2 style={{ fontSize: '1rem', marginBottom: 16, borderBottom: '1px solid var(--gov-border)', paddingBottom: 8 }}>
          Upload Configuration
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div className="form-group">
            <label htmlFor="plant-select" className="required">CPSE Plant</label>
            <div id="plant-select">
              <PlantSelector value={selectedPlant} onChange={(val) => { setSelectedPlant(val); setFormErrors([]); }} plants={plants} />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="ingestion-method">Ingestion Method</label>
            <select id="ingestion-method" disabled title="Scheduled API Sync" style={{ opacity: 0.6, marginBottom: 8 }}>
              <option>Automated ERP Connector (SAP / Oracle)</option>
            </select>
            <select value="upload" onChange={() => {}}>
              <option value="upload">Manual Batch Upload (CSV / Excel)</option>
            </select>
          </div>
        </div>

        <hr style={{ margin: '24px 0' }} />
        
        <div className="form-group">
          <label htmlFor="sample-select" className="required">Select Batch Dataset</label>
          <select id="sample-select" value={sampleId} onChange={(e) => { setSampleId(e.target.value); setFormErrors([]); }}>
            <option value="">-- Select a batch --</option>
            <option value="bhel-heep clean">BHEL-HEEP Batch (Standard Master Records)</option>
            <option value="sail-rsp error">SAIL-RSP Batch (Discrepancy Master Records)</option>
          </select>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
          <button 
            className="btn btn-primary" 
            onClick={handleValidate} 
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? <><span className="spinner" style={{ width: 14, height: 14 }} /> Validating…</> : 'Validate'}
          </button>
        </div>
      </div>

      {result && (
        <div className="validation-panel mt-24">
          <div className={`validation-panel-header ${result.status === 'VALIDATION_PASSED' ? 'success' : 'error'}`}>
            {result.status === 'VALIDATION_PASSED' ? <CheckCircle2 size={16} aria-hidden="true" /> : <AlertCircle size={16} aria-hidden="true" />}
            {result.status}
          </div>
          <div className="validation-panel-body">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div className="text-sm text-secondary">Validation ID</div>
                <div className="mono" style={{ fontWeight: 600 }}>{result.validation_id}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="text-sm text-secondary">Summary</div>
                <div style={{ fontWeight: 600 }}>{result.summary?.records_passed} passed, {result.summary?.records_failed} failed</div>
              </div>
            </div>

            <p style={{ fontSize: '0.875rem', marginBottom: 16 }}>{result.remarks}</p>

            {result.status === 'VALIDATION_FAILED' && result.field_errors && (
              <>
                <div className="info-box error" style={{ marginBottom: 16 }}>
                  Please correct the inline errors below before proceeding.
                </div>
                <FieldErrorList errors={result.field_errors.map((e: any) => ({ ...e, row_no: e.row_number }))} />
                
                <h3 style={{ marginTop: 24, marginBottom: 12, fontSize: '1rem' }}>Inline Correction</h3>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {Array.from(new Set(result.field_errors.map((e: any) => e.row_number))).map((rowNo: any) => (
                    <button 
                      key={rowNo} 
                      className="btn btn-secondary" 
                      onClick={() => startCorrection(rowNo)}
                      style={{ background: editingRow === rowNo ? 'var(--gov-navy)' : '', color: editingRow === rowNo ? '#fff' : '' }}
                      aria-pressed={editingRow === rowNo}
                    >
                      Correct Row {rowNo}
                    </button>
                  ))}
                </div>

                {editingRow !== null && (
                  <div className="card mt-16" style={{ background: 'var(--gov-bg)', border: '1px solid var(--gov-border)' }}>
                    <h4 style={{ marginBottom: 8, fontSize: '0.9rem' }}>Editing Row {editingRow}</h4>
                    <p className="text-sm text-secondary mb-16">Provide missing or corrected information.</p>
                    
                    <div className="form-group mb-12">
                      <label htmlFor="corr-desc" className="required">Description</label>
                      <input id="corr-desc" type="text" onChange={(e) => handleCorrectionChange('description', e.target.value)} />
                    </div>
                    <div className="form-group mb-12">
                      <label htmlFor="corr-uom" className="required">Unit of Measure (UOM)</label>
                      <input id="corr-uom" type="text" onChange={(e) => handleCorrectionChange('uom', e.target.value)} />
                    </div>
                    <div className="form-group mb-12">
                      <label htmlFor="corr-spec">Technical Specification</label>
                      <input id="corr-spec" type="text" onChange={(e) => handleCorrectionChange('specification', e.target.value)} />
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
                      <button className="btn btn-primary" onClick={handleResubmit} disabled={resubmitting}>
                        {resubmitting ? <><span className="spinner" style={{ width: 14, height: 14 }} /> Resubmitting…</> : 'Resubmit'}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {result.status === 'VALIDATION_PASSED' && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
                <button 
                  className="btn btn-success" 
                  onClick={() => navigate('/app/steward/onboarding/mapping')}
                >
                  Proceed to Mapping →
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

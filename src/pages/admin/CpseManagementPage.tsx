import { useEffect, useState } from 'react';
import { getCpseMaster, CpseMaster } from '../../api/mockApi';
import { StatusBadge, InlineToast, srAnnounce } from '../../components/SharedUI';
import { Plus } from 'lucide-react';

function genRef() {
  return `CFG-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 90000 + 10000))}`;
}

export function CpseManagementPage() {
  const [cpses, setCpses] = useState<CpseMaster[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [toast, setToast] = useState('');
  const [toastRef, setToastRef] = useState('');
  
  // Form state
  const [plantCode, setPlantCode] = useState('');
  const [plantName, setPlantName] = useState('');
  const [sector, setSector] = useState('');
  const [formErrors, setFormErrors] = useState<string[]>([]);

  useEffect(() => {
    getCpseMaster()
      .then(setCpses)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const openEdit = (c?: CpseMaster) => {
    if (c) {
      setPlantCode(c.plant_code);
      setPlantName(c.plant_name);
      setSector(c.sector);
    } else {
      setPlantCode('');
      setPlantName('');
      setSector('');
    }
    setFormErrors([]);
    setShowModal(true);
  };

  const handlePreSave = () => {
    const errors: string[] = [];
    if (!plantCode.trim()) errors.push('Plant Code is required.');
    if (!plantName.trim()) errors.push('Plant Name is required.');
    if (!sector) errors.push('Sector is required.');
    setFormErrors(errors);
    if (errors.length) return;
    
    setShowModal(false);
    setShowConfirm(true);
  };

  const handleConfirmSave = () => {
    const ref = genRef();
    setToast(`Plant ${plantCode} configuration updated locally.`);
    setToastRef(ref);
    srAnnounce(`Configuration updated. Reference: ${ref}`);
    setShowConfirm(false);
    setTimeout(() => setToast(''), 3500);
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {toast && <InlineToast message={toast} refId={toastRef} />}

      <div className="page-header" style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '2px solid var(--gov-navy)', paddingBottom: 12 }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: 4 }}>CPSE Management</h1>
          <p className="page-subtitle" style={{ color: 'var(--gov-text-secondary)', fontSize: '0.875rem' }}>Manage onboarded CPSE plants and their configurations.</p>
        </div>
        <button className="btn btn-primary" onClick={() => openEdit()}>
          <Plus size={16} style={{ display: 'inline', marginRight: 8, verticalAlign: 'text-bottom' }} aria-hidden="true" />
          Add Plant
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        <table aria-busy={loading}>
          <thead>
            <tr>
              <th>Plant Code</th>
              <th>CPSE Short Code</th>
              <th>Plant Name</th>
              <th>Sector</th>
              <th>Location</th>
              <th>Onboarded Date</th>
              <th>Status</th>
              <th><span className="sr-only">Action</span></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: '40px' }}><span className="spinner" aria-hidden="true" /> Loading CPSEs…</td></tr>
            ) : cpses.map((c) => (
              <tr key={c.plant_code}>
                <td className="mono" style={{ fontSize: '0.8125rem' }}>{c.plant_code}</td>
                <td>{c.cpse_short_code}</td>
                <td style={{ fontWeight: 500 }}>{c.plant_name}</td>
                <td>{c.sector}</td>
                <td>{c.location}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{c.onboarded_date}</td>
                <td><StatusBadge status={c.status} /></td>
                <td>
                  <button className="btn btn-secondary" style={{ padding: '4px 12px', fontSize: '0.8125rem' }} onClick={() => openEdit(c)} aria-label={`Edit ${c.plant_name}`}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EDIT MODAL */}
      {showModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-cpse-title">
          <div className="modal-box" style={{ maxWidth: 500 }}>
            <h2 id="modal-cpse-title" className="modal-title" style={{ marginBottom: 16 }}>{plantCode ? 'Edit CPSE Plant' : 'Add CPSE Plant'}</h2>
            
            {formErrors.length > 0 && (
              <div className="info-box error" style={{ marginBottom: 16 }} role="alert">
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  {formErrors.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
              </div>
            )}

            <div className="modal-body">
              <div className="form-group mb-16">
                <label htmlFor="plant-code" className="required">Plant Code</label>
                <input 
                  id="plant-code" 
                  type="text" 
                  value={plantCode} 
                  onChange={(e) => { setPlantCode(e.target.value); setFormErrors([]); }} 
                  aria-required="true" 
                  style={{ borderColor: formErrors.some(e => e.includes('Code')) ? 'var(--gov-maroon)' : undefined }}
                />
              </div>
              <div className="form-group mb-16">
                <label htmlFor="plant-name" className="required">Plant Name</label>
                <input 
                  id="plant-name" 
                  type="text" 
                  value={plantName} 
                  onChange={(e) => { setPlantName(e.target.value); setFormErrors([]); }} 
                  aria-required="true" 
                  style={{ borderColor: formErrors.some(e => e.includes('Name')) ? 'var(--gov-maroon)' : undefined }}
                />
              </div>
              <div className="form-group">
                <label htmlFor="plant-sector" className="required">Sector</label>
                <select 
                  id="plant-sector" 
                  value={sector} 
                  onChange={(e) => { setSector(e.target.value); setFormErrors([]); }} 
                  aria-required="true"
                  style={{ borderColor: formErrors.some(e => e.includes('Sector')) ? 'var(--gov-maroon)' : undefined }}
                >
                  <option value="">-- Select Sector --</option>
                  <option value="Power">Power</option>
                  <option value="Oil & Gas">Oil & Gas</option>
                  <option value="Steel">Steel</option>
                  <option value="Manufacturing">Manufacturing</option>
                </select>
              </div>
            </div>
            <div className="modal-actions" style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--gov-border)' }}>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handlePreSave}>Review &amp; Save</button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL */}
      {showConfirm && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-confirm-title">
          <div className="modal-box">
            <h2 id="modal-confirm-title" className="modal-title">Confirm Configuration Change</h2>
            <div className="modal-body">
              <p>Are you sure you want to save changes to <strong className="mono">{plantCode || 'NEW'}</strong>?</p>
              <div className="info-box" style={{ marginTop: 16 }}>
                <strong>Note:</strong> Plant configurations and SFTP endpoints will be updated in the national directory.
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

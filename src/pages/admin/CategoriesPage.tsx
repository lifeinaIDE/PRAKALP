import { useState } from 'react';
import { Plus } from 'lucide-react';
import { InlineToast, srAnnounce } from '../../components/SharedUI';

function genRef() {
  return `CFG-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 90000 + 10000))}`;
}

export function CategoriesPage() {
  const [categories, setCategories] = useState([
    'Bearings & Bushings',
    'Fasteners',
    'Valves',
    'Electrical & Cables',
    'Motors & Pumps',
    'General',
  ]);
  
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [toast, setToast] = useState('');
  const [toastRef, setToastRef] = useState('');
  
  const [newCat, setNewCat] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const openEdit = (idx: number | null) => {
    if (idx !== null) {
      setNewCat(categories[idx]);
      setEditingIndex(idx);
    } else {
      setNewCat('');
      setEditingIndex(null);
    }
    setFormErrors([]);
    setShowModal(true);
  };

  const handlePreSave = () => {
    const errors = [];
    if (!newCat.trim()) errors.push('Category Name is required.');
    setFormErrors(errors);
    if (errors.length) return;
    
    setShowModal(false);
    setShowConfirm(true);
  };

  const handleConfirmSave = () => {
    if (editingIndex !== null) {
      const updated = [...categories];
      updated[editingIndex] = newCat.trim();
      setCategories(updated);
    } else {
      setCategories([...categories, newCat.trim()]);
    }
    
    const ref = genRef();
    setToast(`Category '${newCat}' saved locally.`);
    setToastRef(ref);
    srAnnounce(`Category saved. Reference: ${ref}`);
    setShowConfirm(false);
    setNewCat('');
    setEditingIndex(null);
    setTimeout(() => setToast(''), 3500);
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      {toast && <InlineToast message={toast} refId={toastRef} />}

      <div className="page-header" style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '2px solid var(--gov-navy)', paddingBottom: 12 }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: 4 }}>Categories &amp; Templates</h1>
          <p className="page-subtitle" style={{ color: 'var(--gov-text-secondary)', fontSize: '0.875rem' }}>Manage top-level material categories for the National Schema.</p>
        </div>
        <button className="btn btn-primary" onClick={() => openEdit(null)}>
          <Plus size={16} style={{ display: 'inline', marginRight: 8, verticalAlign: 'text-bottom' }} aria-hidden="true" />
          Add Category
        </button>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--gov-border)', textAlign: 'left' }}>Category Name</th>
              <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--gov-border)', textAlign: 'right' }}><span className="sr-only">Action</span></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c, i) => (
              <tr key={i}>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--gov-border)', fontWeight: 500 }}>{c}</td>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--gov-border)', textAlign: 'right' }}>
                  <button className="btn btn-secondary" style={{ padding: '4px 12px', fontSize: '0.8125rem' }} onClick={() => openEdit(i)} aria-label={`Edit category ${c}`}>
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
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-cat-title">
          <div className="modal-box" style={{ maxWidth: 400 }}>
            <h2 id="modal-cat-title" className="modal-title" style={{ marginBottom: 16 }}>{editingIndex !== null ? 'Edit Category' : 'Add Category'}</h2>
            
            {formErrors.length > 0 && (
              <div className="info-box error" style={{ marginBottom: 16 }} role="alert">
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  {formErrors.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
              </div>
            )}

            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="cat-name" className="required">Category Name</label>
                <input 
                  id="cat-name" 
                  type="text" 
                  value={newCat} 
                  onChange={(e) => { setNewCat(e.target.value); setFormErrors([]); }} 
                  aria-required="true"
                  style={{ borderColor: formErrors.length ? 'var(--gov-maroon)' : undefined }}
                />
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
              <p>Are you sure you want to save the category <strong className="mono">{newCat}</strong>?</p>
              <div className="info-box" style={{ marginTop: 16 }}>
                <strong>Note:</strong> Newly added categories will be available in the CPSE material master taxonomy.
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

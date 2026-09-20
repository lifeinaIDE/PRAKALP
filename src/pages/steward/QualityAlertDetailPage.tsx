import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAlertsForSteward, getRawMaterialsByPlant, resolveAlert, DataQualityAlert, RawMaterial } from '../../api/mockApi';
import { QualityAlertBadge, StatusBadge, InlineToast, ErrorSummary, srAnnounce } from '../../components/SharedUI';

function genRef() {
  return `LOG-${String(Math.floor(Math.random() * 9000 + 1000))}`;
}

export function QualityAlertDetailPage() {
  const { alertId } = useParams<{ alertId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [alert, setAlert] = useState<DataQualityAlert | null>(null);
  const [material, setMaterial] = useState<RawMaterial | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState('');
  const [toastRef, setToastRef] = useState('');
  const [correctedValue, setCorrectedValue] = useState('');
  const [formErrors, setFormErrors] = useState<string[]>([]);

  useEffect(() => {
    if (!user || !alertId) return;
    async function load() {
      try {
        const alerts = await getAlertsForSteward(user!.user_id);
        const currentAlert = alerts.find(a => a.alert_id === alertId);
        if (currentAlert && user?.plant_code) {
          setAlert(currentAlert);
          const materials = await getRawMaterialsByPlant(user.plant_code);
          const mat = materials.find(m => m.local_code === currentAlert.local_code);
          setMaterial(mat || null);
          setCorrectedValue(mat?.description || '');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user, alertId]);

  const handleSave = async () => {
    const errors: string[] = [];
    if (!correctedValue.trim()) errors.push('Corrected / Enriched Value is required.');
    if (correctedValue.trim().length < 10) errors.push('Description must be at least 10 characters.');
    setFormErrors(errors);
    if (errors.length) return;

    if (!alertId) return;
    setSubmitting(true);
    try {
      await resolveAlert(alertId);
      const ref = genRef();
      setToastRef(ref);
      setToast(`Record resubmitted. Alert ${alertId} marked Resolved.`);
      srAnnounce(`Alert resolved. Reference: ${ref}`);
      setTimeout(() => navigate('/app/steward/alerts'), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}><span className="spinner" aria-label="Loading" /> Loading alert…</div>;
  if (!alert)  return <div className="info-box error" role="alert">Alert not found or access denied.</div>;

  const isResolved = alert.status === 'Resolved';

  return (
    <div style={{ maxWidth: 820, margin: '0 auto' }}>

      {toast && <InlineToast message={toast} type="success" refId={toastRef} />}
      <ErrorSummary errors={formErrors} />

      <button
        className="btn btn-secondary mb-16"
        onClick={() => navigate('/app/steward/alerts')}
        id="back-to-alerts"
      >
        ← Back to Quality Alerts
      </button>

      {/* Page title row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, paddingBottom: 12, borderBottom: '2px solid var(--gov-navy)' }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: 4 }}>Correct / Enrich Record</h1>
          <div className="text-secondary text-sm">
            Alert Reference: <span className="mono">{alert.alert_id}</span>
          </div>
        </div>
        <StatusBadge status={alert.status} />
      </div>

      {/* Alert detail — read-only */}
      <div className="card mb-16" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ background: '#f0f0f0', padding: '8px 16px', borderBottom: '1px solid var(--gov-border)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--gov-text-secondary)' }}>
          Alert Details
        </div>
        <div style={{ padding: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, fontSize: '0.875rem' }}>
            <div>
              <div className="text-secondary text-sm" style={{ marginBottom: 3 }}>Local Material Code</div>
              <div className="mono" style={{ fontWeight: 700 }}>{alert.local_code}</div>
            </div>
            <div>
              <div className="text-secondary text-sm" style={{ marginBottom: 3 }}>Alert Type</div>
              <QualityAlertBadge alert_type={alert.alert_type} severity={alert.severity as 'High' | 'Medium' | 'Low'} />
            </div>
            <div>
              <div className="text-secondary text-sm" style={{ marginBottom: 3 }}>Assigned To</div>
              <div style={{ fontWeight: 600 }}>{alert.assigned_to}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Correction form */}
      {material && (
        <div className="card">
          <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--gov-text-secondary)', marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid var(--gov-border)' }}>
            Material Record — Correction Form
          </div>

          {/* Current value (read-only) */}
          <div className="form-group">
            <label htmlFor="current-description">Current Description (read-only)</label>
            <div
              id="current-description"
              style={{ padding: '8px 12px', background: 'var(--gov-bg)', border: '1px solid var(--gov-border)', borderRadius: 3, fontSize: '0.875rem', color: 'var(--gov-text-secondary)' }}
              aria-readonly="true"
            >
              {material.description}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <div className="text-secondary text-sm" style={{ marginBottom: 3 }}>UOM</div>
              <div style={{ fontWeight: 600 }}>{material.uom || '—'}</div>
            </div>
            <div>
              <div className="text-secondary text-sm" style={{ marginBottom: 3 }}>Category</div>
              <div style={{ fontWeight: 600 }}>{material.category || '—'}</div>
            </div>
          </div>

          <div className="form-group mt-16">
            <label htmlFor="corrected-value" className="required">
              Corrected / Enriched Description
            </label>
            <textarea
              id="corrected-value"
              rows={5}
              value={correctedValue}
              onChange={(e) => { setCorrectedValue(e.target.value); if (formErrors.length) setFormErrors([]); }}
              placeholder="Enter corrected value with full specifications…"
              disabled={isResolved}
              aria-required="true"
              aria-describedby="corrected-help"
              style={{ borderColor: formErrors.length ? 'var(--gov-maroon)' : undefined }}
            />
            <div id="corrected-help" className="text-sm text-secondary mt-4">
              Provide the complete, standardised description per the National Material Schema. Minimum 10 characters.
            </div>
          </div>

          {isResolved && (
            <div className="info-box success" style={{ marginTop: 12 }}>
              This alert has already been resolved. No further action is required.
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--gov-border)' }}>
            <button
              className="btn btn-secondary"
              onClick={() => navigate('/app/steward/alerts')}
              id="cancel-correction"
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              id="submit-correction"
              onClick={handleSave}
              disabled={submitting || isResolved}
              aria-busy={submitting}
            >
              {submitting ? <><span className="spinner" style={{ width: 14, height: 14 }} /> Submitting…</> : 'Save & Resubmit'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

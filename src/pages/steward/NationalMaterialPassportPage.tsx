import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPassport, CnmcRegistry, NationalPassport } from '../../api/mockApi';
import { PassportCard } from '../../components/SharedUI';

export function NationalMaterialPassportPage() {
  const { cnmcCode } = useParams<{ cnmcCode: string }>();
  const navigate = useNavigate();
  
  const [data, setData] = useState<{ cnmc: CnmcRegistry; passport: NationalPassport } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cnmcCode) return;
    getPassport(cnmcCode)
      .then((res) => setData(res as any)) // getPassport returns { cnmc, passport }
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [cnmcCode]);

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}><span className="spinner" aria-label="Loading" /> Loading passport…</div>;
  if (!data || !data.cnmc || !data.passport) return <div className="info-box error" role="alert">Passport not found.</div>;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <button className="btn btn-secondary mb-16" onClick={() => navigate(-1)} aria-label="Go back to previous screen">
        ← Back
      </button>

      <div className="page-header" style={{ marginBottom: 24, paddingBottom: 12, borderBottom: '2px solid var(--gov-navy)' }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: 4 }}>National Material Passport</h1>
          <p className="page-subtitle" style={{ color: 'var(--gov-text-secondary)', fontSize: '0.875rem' }}>
            Authoritative national record and mapping for this material code.
            <br/>
            <span style={{ fontSize: '0.72rem', background: '#fef9c3', padding: '1px 6px', borderRadius: 2, border: '1px solid #fde047', color: 'var(--gov-amber)', display: 'inline-block', marginTop: 8 }}>
              Authoritative Record
            </span>
          </p>
        </div>
      </div>

      <PassportCard passport={data.passport} registry={data.cnmc} />
    </div>
  );
}

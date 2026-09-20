import {
  TrustScoreGauge,
  WhyWhyNotPanel,
  PassportCard,
  QualityAlertBadge,
  AuditTrailTable,
  StatusBadge,
  SummaryStatCard,
  PlantSelector,
  RecordComparisonTable,
  SecurityBadgeStrip,
  FieldErrorList
} from '../components/SharedUI';

export function ComponentsPreviewPage() {
  const dummyPassport = {
    passport_id: 'P-101',
    cnmc_code: 'CNMC-8821-99A',
    canonical_description: 'Ball Bearing 6205 C3',
    technical_specifications: 'OD: 52mm, ID: 25mm, Width: 15mm',
    manufacturer_info: 'SKF / FAG',
    lifecycle_status: 'Active',
    functional_equivalents: 'CNMC-8821-99B',
    audit_trail_reference: 'LOG-123'
  };

  const dummyRegistry = {
    cnmc_code: 'CNMC-8821-99A',
    canonical_description: 'Ball Bearing 6205 C3 (Deep Groove)',
    standardized_uom: 'NOS',
    standardized_specs: 'Clearance C3',
    material_fingerprint: 'bf882...',
    legacy_codes: 'BHEL: 123, SAIL: 456',
    created_date: '2025-01-01',
    version: '1.0',
    approval_status: 'Approved'
  };

  const dummyMatch = {
    material_group_id: 'MG-101',
    cpse_1_code: 'BHEL-6205',
    cpse_1_desc: 'Bearing 6205',
    cpse_1_plant: 'BHEL-HEEP',
    cpse_2_code: 'SAIL-6205',
    cpse_2_desc: 'Ball Bearing 6205',
    cpse_2_plant: 'SAIL-RSP',
    trust_score: '88',
    match_type: 'Exact',
    review_type: 'Auto',
    why_match: 'High text similarity',
    why_not: '',
    status: 'Pending',
    assigned_reviewer: 'Rev1'
  };

  const dummyAudit = [
    { log_id: 'L-1', timestamp: '2026-09-01T10:00:00Z', user_id: 'U1', user_role: 'Steward', action: 'Upload', material_code: 'BHEL-6205', cnmc_code: '', ip_address: '1.1.1.1', hash_chain: 'abcdef123' },
    { log_id: 'L-2', timestamp: '2026-09-01T11:00:00Z', user_id: 'U2', user_role: 'Reviewer', action: 'Approve', material_code: '', cnmc_code: 'CNMC-8821-99A', ip_address: '1.1.1.2', hash_chain: '123456789' }
  ];

  const dummyErrors = [
    { row_no: 1, local_code: 'ITEM-1', field: 'Description', error_type: 'Missing Data', message: 'Description cannot be empty' },
    { row_no: 2, local_code: 'ITEM-2', field: 'UOM', error_type: 'Invalid Format', message: 'UOM must be 3 letters' }
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 className="page-title" style={{ marginBottom: '32px' }}>Phase 3 — Shared UI Components Preview</h1>

      <section style={{ marginBottom: '40px' }}>
        <h2>1. TrustScoreGauge</h2>
        <div className="card mt-16" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <TrustScoreGauge trust_score={92} />
          <TrustScoreGauge trust_score={75} />
          <TrustScoreGauge trust_score={45} />
        </div>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>2. WhyWhyNotPanel</h2>
        <WhyWhyNotPanel why_match="High text similarity in Description and UOM." why_not="" />
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>3. PassportCard</h2>
        <div className="mt-16">
          <PassportCard passport={dummyPassport} registry={dummyRegistry} />
        </div>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>4. QualityAlertBadge</h2>
        <div className="card mt-16" style={{ display: 'flex', gap: '16px' }}>
          <QualityAlertBadge alert_type="Missing UOM" severity="High" />
          <QualityAlertBadge alert_type="Suspect Description" severity="Medium" />
          <QualityAlertBadge alert_type="Formatting Issue" severity="Low" />
        </div>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>5. AuditTrailTable</h2>
        <div className="mt-16">
          <AuditTrailTable rows={dummyAudit} />
        </div>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>6. StatusBadge</h2>
        <div className="card mt-16" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <StatusBadge status="Approved" />
          <StatusBadge status="Pending" />
          <StatusBadge status="Rejected" />
          <StatusBadge status="Flagged" />
          <StatusBadge status="Neutral" />
        </div>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>7. SummaryStatCard</h2>
        <div className="mt-16 stat-grid">
          <SummaryStatCard label="Total Records" value="1,245" subtext="Across 6 CPSEs" />
          <SummaryStatCard label="Pending Review" value="34" />
        </div>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>8. PlantSelector</h2>
        <div className="card mt-16">
          <PlantSelector value="" onChange={() => {}} plants={[{ plant_code: 'BHEL-HEEP', plant_name: 'BHEL Haridwar', cpse_short_code: 'BHEL', sector: 'Heavy Eng', location: 'Haridwar', onboarded_date: '2026', status: 'Active' }]} />
        </div>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>9. RecordComparisonTable</h2>
        <div className="mt-16">
          <RecordComparisonTable match={dummyMatch as any} />
        </div>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>10. FieldErrorList</h2>
        <div className="mt-16">
          <FieldErrorList errors={dummyErrors} />
        </div>
      </section>
    </div>
  );
}

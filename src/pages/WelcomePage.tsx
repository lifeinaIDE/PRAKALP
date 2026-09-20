/* Welcome / Home screen shown in the App Shell (Phase 0 / 1) */
export function WelcomePage() {
  return (
    <div className="welcome-screen">
      <div className="page-header">
        <div>
          <h1 className="page-title">Welcome to PRAKALP</h1>
          <p className="page-subtitle">
            National Material Code Harmonization Platform — Ministry of Heavy Industries
          </p>
        </div>
      </div>

      <div className="welcome-banner">
        <h3 style={{ marginBottom: 6 }}>Platform under setup</h3>
        <p>
          The PRAKALP platform is being initialized. Log in with your Government SSO
          credentials to access your role-specific dashboard.
        </p>
      </div>

      <div className="card mt-16">
        <h3 style={{ marginBottom: 10 }}>About PRAKALP</h3>
        <p>
          PRAKALP assigns every CPSE material a single National Material Code (CNMC),
          mapped back to all local plant codes, with a governed review process before
          any code is finalized.
        </p>
        <hr />
        <p style={{ fontSize: '0.8125rem', color: 'var(--gov-text-secondary)' }}>
          Participating CPSEs: BHEL-HEEP · NTPC-TPS · SAIL-RSP · IOCL-BR · ONGC-HZR · BPCL-MR
        </p>
      </div>
    </div>
  );
}

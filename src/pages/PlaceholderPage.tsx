/* Placeholder screen — used for routes not yet implemented */
export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">{title}</h1>
          <p className="page-subtitle">This screen will be wired in a subsequent build phase.</p>
        </div>
      </div>
      <div className="card" style={{ padding: '32px', textAlign: 'center', color: 'var(--gov-text-secondary)' }}>
        <p>Screen under construction — content coming soon.</p>
      </div>
    </div>
  );
}

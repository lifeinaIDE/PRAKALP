/**
 * PolicyPages.tsx
 * All 6 GIGW 3.0-required policy pages + Sitemap.
 * These are demonstration content, clearly marked as such.
 * Each page renders inside AppShell (via /policy/* routes in App.tsx).
 */

import { Calendar, Info, FileText, Link } from 'lucide-react';

/* ── Shared header used by all policy pages ──────────────── */
function PolicyHeader({
  title,
  subtitle,
  lastUpdated,
}: {
  title: string;
  subtitle?: string;
  lastUpdated: string;
}) {
  return (
    <div className="policy-page-header">
      <h1>{title}</h1>
      {subtitle && (
        <p style={{ fontSize: '0.85rem', color: 'var(--gov-text-secondary)', marginTop: 4 }}>
          {subtitle}
        </p>
      )}
      <div className="policy-meta">
        <span>
          <Calendar size={13} />
          Last Updated: <strong>{lastUpdated}</strong>
        </span>
        <span>
          <FileText size={13} />
          Ministry of Heavy Industries, Government of India
        </span>
      </div>
    </div>
  );
}

/* ================================================================
   1. Accessibility Statement
   ================================================================ */
export function AccessibilityStatementPage() {
  return (
    <div className="policy-page">
      <PolicyHeader
        title="Accessibility Statement"
        subtitle="PRAKALP — National Material Code Harmonization Platform"
        lastUpdated="September 2026"
      />

      <div className="policy-section">
        <h2>Commitment to Accessibility</h2>
        <p>
          The Ministry of Heavy Industries is committed to making the PRAKALP platform accessible
          to all users, including persons with disabilities, in accordance with the Guidelines for
          Indian Government Websites (GIGW 3.0) and the Web Content Accessibility Guidelines
          (WCAG) 2.1, Level AA.
        </p>
      </div>

      <div className="policy-section">
        <h2>Measures Taken</h2>
        <ul>
          <li>Skip-to-content link is provided on all pages to bypass repetitive navigation.</li>
          <li>All interactive elements are keyboard-operable with a visible focus indicator.</li>
          <li>Status information is communicated through both colour and text labels.</li>
          <li>All form fields carry visible labels and required-field asterisks.</li>
          <li>ARIA landmark roles (header, nav, main, footer) are used throughout the application.</li>
          <li>Toast notifications are announced to screen readers via ARIA live regions.</li>
          <li>Colour contrast ratios meet WCAG 2.1 AA minimums (4.5:1 for normal text).</li>
        </ul>
      </div>

      <div className="policy-section">
        <h2>Feedback</h2>
        <p>
          If you encounter accessibility barriers, please contact:{' '}
          <strong>prakalp-support@mhi.gov.in</strong>.
        </p>
      </div>
    </div>
  );
}

/* ================================================================
   2. Privacy Policy
   ================================================================ */
export function PrivacyPolicyPage() {
  return (
    <div className="policy-page">
      <PolicyHeader
        title="Privacy Policy"
        subtitle="PRAKALP — National Material Code Harmonization Platform"
        lastUpdated="September 2026"
      />

      <div className="policy-section">
        <h2>Information We Collect</h2>
        <p>
          PRAKALP collects the minimum information necessary to authenticate authorised CPSE
          personnel and facilitate the material code harmonization workflow. This includes:
        </p>
        <ul>
          <li>Name, designation, official email, and plant/unit affiliation (from CPSE HR systems)</li>
          <li>Material master records submitted for validation and mapping</li>
          <li>Actions performed within the platform (for audit trail purposes)</li>
        </ul>
      </div>

      <div className="policy-section">
        <h2>How We Use Your Information</h2>
        <ul>
          <li>To authenticate and authorise platform access.</li>
          <li>To route material records, alerts, and clarification requests to the correct personnel.</li>
          <li>To maintain a tamper-evident audit trail of all governance decisions.</li>
        </ul>
      </div>

      <div className="policy-section">
        <h2>Data Retention</h2>
        <p>
          All platform data is retained for a minimum of 7 years in line with GoI financial
          record-keeping guidelines. Audit logs are retained indefinitely.
        </p>
      </div>

      <div className="policy-section">
        <h2>Data Security</h2>
        <p>
          All data in transit is encrypted using TLS 1.3. Data at rest is encrypted using AES-256.
          Access is restricted to authorised personnel via role-based access control.
        </p>
      </div>

      <div className="policy-section">
        <h2>Contact</h2>
        <p>
          Data Protection Officer: <strong>dpo-prakalp@mhi.gov.in</strong>.
        </p>
      </div>
    </div>
  );
}

/* ================================================================
   3. Terms & Conditions
   ================================================================ */
export function TermsConditionsPage() {
  return (
    <div className="policy-page">
      <PolicyHeader
        title="Terms &amp; Conditions of Use"
        subtitle="PRAKALP — National Material Code Harmonization Platform"
        lastUpdated="September 2026"
      />

      <div className="policy-section">
        <h2>Authorised Use</h2>
        <p>
          PRAKALP is a Government of India platform restricted to authorised personnel of Central
          Public Sector Enterprises (CPSEs) under the Ministry of Heavy Industries. Unauthorised
          access is prohibited and may attract legal action under the Information Technology Act, 2000.
        </p>
      </div>

      <div className="policy-section">
        <h2>User Responsibilities</h2>
        <ul>
          <li>Users must only access PRAKALP using their official government-issued credentials.</li>
          <li>Users must not share login credentials with any other person.</li>
          <li>Users are responsible for the accuracy of material data they submit.</li>
          <li>Users must report suspected security incidents immediately to their system administrator.</li>
        </ul>
      </div>

      <div className="policy-section">
        <h2>Disclaimer</h2>
        <p>
          The Ministry of Heavy Industries makes no warranty, express or implied, regarding the
          accuracy or completeness of information on this platform. CNMC assignments are subject
          to technical review and may be revised.
        </p>
      </div>

      <div className="policy-section">
        <h2>Governing Law</h2>
        <p>
          These terms are governed by the laws of India. Disputes shall be subject to the exclusive
          jurisdiction of courts in New Delhi.
        </p>
      </div>
    </div>
  );
}

/* ================================================================
   4. Copyright Policy
   ================================================================ */
export function CopyrightPolicyPage() {
  return (
    <div className="policy-page">
      <PolicyHeader
        title="Copyright Policy"
        subtitle="PRAKALP — National Material Code Harmonization Platform"
        lastUpdated="September 2026"
      />

      <div className="policy-section">
        <h2>Ownership</h2>
        <p>
          All content on the PRAKALP platform — including text, data, graphics, interface design,
          and compiled material master records — is the property of the Ministry of Heavy Industries,
          Government of India, unless otherwise stated.
        </p>
      </div>

      <div className="policy-section">
        <h2>Permitted Use</h2>
        <p>
          Content may be used for official CPSE operations, internal reporting, and material
          procurement purposes. Republication, commercial use, or modification of platform content
          without prior written permission from the Ministry is prohibited.
        </p>
      </div>

      <div className="policy-section">
        <h2>National Material Codes (CNMCs)</h2>
        <p>
          CNMCs and associated canonical descriptions assigned through this platform are official
          government reference data. They may be referenced in procurement documents but may not
          be altered or misrepresented.
        </p>
      </div>

      <div className="policy-section">
        <h2>Third-Party Content</h2>
        <p>
          Where third-party standards or specifications are referenced (e.g. BIS, ISO), copyright
          rests with the originating standards body. PRAKALP provides references only, not
          reproduction of third-party text.
        </p>
      </div>
    </div>
  );
}

/* ================================================================
   5. Hyperlink Policy
   ================================================================ */
export function HyperlinkPolicyPage() {
  return (
    <div className="policy-page">
      <PolicyHeader
        title="Hyperlink Policy"
        subtitle="PRAKALP — National Material Code Harmonization Platform"
        lastUpdated="September 2026"
      />

      <div className="policy-section">
        <h2>Links to External Websites</h2>
        <p>
          PRAKALP may contain links to external websites operated by other government entities or
          third parties. These links are provided for reference only. The Ministry of Heavy
          Industries does not endorse, control, or accept responsibility for the content of
          external sites.
        </p>
      </div>

      <div className="policy-section">
        <h2>Links from External Websites to PRAKALP</h2>
        <p>
          Other government portals and official CPSE intranets may link to the PRAKALP platform
          login page without prior permission, provided:
        </p>
        <ul>
          <li>The link does not misrepresent or mislead regarding PRAKALP's scope or ownership.</li>
          <li>The link does not frame PRAKALP content within another site's UI.</li>
          <li>The linking site is an official government or CPSE domain.</li>
        </ul>
        <p>
          Commercial or private websites must seek written permission before linking to PRAKALP.
        </p>
      </div>

      <div className="policy-section">
        <h2>Reporting Broken Links</h2>
        <p>
          Report broken or misdirected links to:{' '}
          <strong>prakalp-webmaster@mhi.gov.in</strong>.
        </p>
      </div>
    </div>
  );
}

/* ================================================================
   6. Sitemap
   ================================================================ */
export function SitemapPage() {
  return (
    <div className="policy-page" style={{ maxWidth: 900 }}>
      <PolicyHeader
        title="Sitemap"
        subtitle="PRAKALP — All available screens and policy pages"
        lastUpdated="September 2026"
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>

        <div className="sitemap-section">
          <h2>CPSE Data Steward</h2>
          <ul>
            <li><a href="/app/steward/dashboard">Dashboard</a></li>
            <li><a href="/app/steward/onboarding">Data Onboarding</a></li>
            <li><a href="/app/steward/onboarding/mapping">Field Mapping / Preview</a></li>
            <li><a href="/app/steward/alerts">Quality Alerts</a></li>
            <li><a href="/app/steward/clarifications">Clarification Inbox</a></li>
            <li><a href="/app/steward/mappings">CNMC Search (Approved Mappings)</a></li>
            <li><a href="/app/steward/new-request">New Code Request</a></li>
          </ul>
        </div>

        <div className="sitemap-section">
          <h2>Technical Reviewer</h2>
          <ul>
            <li><a href="/app/reviewer/dashboard">Reviewer Dashboard</a></li>
            <li><a href="/app/reviewer/queue">Pending Match Queue</a></li>
            <li><a href="/app/reviewer/clarifications">Clarification Tracker</a></li>
          </ul>
        </div>

        <div className="sitemap-section">
          <h2>National Admin</h2>
          <ul>
            <li><a href="/app/admin/dashboard">Admin Dashboard</a></li>
            <li><a href="/app/admin/cpses">Manage CPSEs</a></li>
            <li><a href="/app/admin/categories">Categories &amp; Templates</a></li>
            <li><a href="/app/admin/thresholds">Trust Score Thresholds</a></li>
            <li><a href="/app/admin/registry">CNMC Registry</a></li>
            <li><a href="/app/admin/analytics">National Analytics</a></li>
            <li><a href="/app/admin/audit">Audit Trail</a></li>
            <li><a href="/app/admin/disputes">Dispute Resolution</a></li>
          </ul>
        </div>

        <div className="sitemap-section">
          <h2>Policy &amp; Information</h2>
          <ul>
            <li><a href="/policy/accessibility">Accessibility Statement</a></li>
            <li><a href="/policy/privacy">Privacy Policy</a></li>
            <li><a href="/policy/terms">Terms &amp; Conditions</a></li>
            <li><a href="/policy/copyright">Copyright Policy</a></li>
            <li><a href="/policy/hyperlink">Hyperlink Policy</a></li>
            <li><a href="/sitemap">Sitemap</a></li>
          </ul>
        </div>

        <div className="sitemap-section">
          <h2>Account</h2>
          <ul>
            <li><a href="/login">Sign In</a></li>
          </ul>
        </div>

      </div>
    </div>
  );
}

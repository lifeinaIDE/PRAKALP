/**
 * LoginPage.tsx
 * Email + password login form for PRAKALP.
 * Password is NOT validated — any value is accepted (prototype).
 * Email is matched against users.csv to identify the user & role.
 * Wires into AuthContext and redirects to the correct dashboard.
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Shield, CheckCircle2, Eye, EyeOff, User, Building2, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUsers, type User as DemoUser } from '../api/mockApi';

const ROLE_DASHBOARD: Record<string, string> = {
  'CPSE Data Steward':  '/app/steward/dashboard',
  'Technical Reviewer': '/app/reviewer/dashboard',
  'National Admin':     '/app/admin/dashboard',
};

/* ── Demo credentials data (static, mirrors users.csv) ── */
const DEMO_GROUPS = [
  {
    role: 'CPSE Data Steward', badgeClass: 'green',
    color: '#166534', bg: '#f0fdf4', border: '#bbf7d0',
    users: [
      { name: 'Ravi Kumar Sharma',  email: 'ravi.kumar.sharma@bhel.gov.in',  plant: 'BHEL-HEEP', id: 'USR-001' },
      { name: 'Anjali Deshmukh',    email: 'anjali.deshmukh@ntpc.gov.in',    plant: 'NTPC-TPS',  id: 'USR-002' },
      { name: 'Suresh Patnaik',     email: 'suresh.patnaik@sail.gov.in',     plant: 'SAIL-RSP',  id: 'USR-003' },
      { name: 'Farhan Ahmed',       email: 'farhan.ahmed@iocl.gov.in',       plant: 'IOCL-BR',   id: 'USR-004' },
      { name: 'Meera Iyer',         email: 'meera.iyer@ongc.gov.in',         plant: 'ONGC-HZR',  id: 'USR-005' },
      { name: 'Vikram Nair',        email: 'vikram.nair@bpcl.gov.in',        plant: 'BPCL-MR',   id: 'USR-006' },
    ],
  },
  {
    role: 'Technical Reviewer', badgeClass: 'amber',
    color: '#92400E', bg: '#fef9c3', border: '#fde047',
    users: [
      { name: 'Dr. Priya Venkataraman', email: 'priya.venkataraman@samaan.gov.in', plant: '', id: 'USR-007' },
      { name: 'Sanjeev Rathi',          email: 'sanjeev.rathi@samaan.gov.in',       plant: '', id: 'USR-008' },
      { name: 'Kavita Reddy',           email: 'kavita.reddy@samaan.gov.in',        plant: '', id: 'USR-009' },
    ],
  },
  {
    role: 'National Admin', badgeClass: 'black',
    color: '#111111', bg: '#f5f5f5', border: '#d4d4d4',
    users: [
      { name: 'Ashok Bhalla', email: 'ashok.bhalla@samaan.gov.in', plant: '', id: 'USR-010' },
      { name: 'Neha Kapoor',  email: 'neha.kapoor@samaan.gov.in',  plant: '', id: 'USR-011' },
    ],
  },
];

export function LoginPage() {
  const { login }   = useAuth();
  const navigate     = useNavigate();

  const [users,      setUsers]      = useState<DemoUser[]>([]);
  const [email,      setEmail]      = useState('');
  const [password,   setPassword]   = useState('');
  const [showPw,     setShowPw]     = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState<string | null>(null);
  const [showHelper, setShowHelper] = useState(false);

  /* Load users once on mount */
  useEffect(() => {
    getUsers().then(setUsers).catch(() => {/* silently fail; error surfaced on submit */});
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.trim()) { setError('Please enter your official email address.'); return; }
    if (!password)     { setError('Please enter your password.'); return; }

    setSubmitting(true);
    setTimeout(() => {
      const found = users.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
      );
      if (!found) {
        setError(
          'Email address not found in the system. ' +
          'Please select an authorized account from the panel below or contact your system administrator.',
        );
        setSubmitting(false);
        return;
      }
      if (found.status !== 'Active') {
        setError('Your account is currently inactive. Please contact the PRAKALP administrator.');
        setSubmitting(false);
        return;
      }
      login(found);
      navigate(ROLE_DASHBOARD[found.role] ?? '/');
    }, 500);
  }

  function fillCredential(emailVal: string) {
    setEmail(emailVal);
    setPassword('GovPass@2026');
    setError(null);
  }

  /* shared input style helper */
  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    width: '100%',
    padding: '9px 10px 9px 32px',
    border: `1px solid ${hasError ? '#C0001A' : '#CCCCCC'}`,
    borderRadius: 3,
    fontSize: '0.875rem',
    fontFamily: 'inherit',
    outline: 'none',
    color: '#111111',
    background: '#FFFFFF',
  });

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F5F5F5',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: 36,
      paddingBottom: 48,
    }}>

      {/* ── Top Gov strip ── */}
      <div style={{
        width: '100%', background: '#111111',
        padding: '6px 0', textAlign: 'center',
        position: 'fixed', top: 0, left: 0, zIndex: 100,
        fontSize: '0.7rem', color: '#ffffff', letterSpacing: '0.04em',
      }}>
        <span style={{ opacity: 0.65 }}>भारत सरकार — Government of India</span>
        &nbsp;|&nbsp;Ministry of Heavy Industries&nbsp;|&nbsp;
        <span style={{ color: '#D97706' }}>Authorised Access Only</span>
      </div>

      <div style={{ width: '100%', maxWidth: 460, padding: '36px 16px 0' }}>

        {/* ── Masthead ── */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #CCCCCC',
          borderBottom: 'none',
          borderRadius: '3px 3px 0 0',
          padding: '22px 24px 18px',
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <div style={{
            width: 54, height: 54, background: '#111111', borderRadius: 3,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="18" r="15" stroke="#C0001A" strokeWidth="1.5" fill="none"/>
              <circle cx="18" cy="18" r="9"  stroke="#C0001A" strokeWidth="1" fill="none"/>
              <circle cx="18" cy="18" r="2.5" fill="#C0001A"/>
              {Array.from({ length: 24 }).map((_, i) => {
                const a = (i * 360) / 24;
                const rad = (a * Math.PI) / 180;
                return (
                  <line key={i}
                    x1={18 + 2.5 * Math.cos(rad)} y1={18 + 2.5 * Math.sin(rad)}
                    x2={18 + 8.5 * Math.cos(rad)} y2={18 + 8.5 * Math.sin(rad)}
                    stroke="#C0001A" strokeWidth="0.8"
                  />
                );
              })}
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#111111', letterSpacing: '0.07em' }}>
              PRAKALP
            </div>
            <div style={{ fontSize: '0.77rem', color: '#555555', lineHeight: 1.45, marginTop: 2 }}>
              National Material Code Harmonization Platform
            </div>
            <div style={{ fontSize: '0.68rem', color: '#555555', marginTop: 3 }}>
              Ministry of Heavy Industries &nbsp;·&nbsp; Government of India
            </div>
          </div>
        </div>

        {/* ── Login form card ── */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #CCCCCC',
          borderTop: '3px solid #C0001A',
          padding: '24px',
        }}>
          <h2 style={{
            fontSize: '0.88rem', fontWeight: 700, color: '#111111',
            marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em',
          }}>
            Sign In to Your Account
          </h2>
          <p style={{ fontSize: '0.78rem', color: '#555555', marginBottom: 20 }}>
            This system is for authorised CPSE personnel only. Unauthorised
            access is prohibited under the IT Act, 2000.
          </p>

          <form onSubmit={handleSubmit} noValidate>

            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label htmlFor="login-email" style={{
                display: 'block', fontSize: '0.8rem', fontWeight: 600,
                color: '#111111', marginBottom: 5,
              }}>
                Official Email Address <span style={{ color: '#C0001A' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <User size={14} style={{
                  position: 'absolute', left: 10, top: '50%',
                  transform: 'translateY(-50%)', color: '#AAAAAA', pointerEvents: 'none',
                }} />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="username"
                  placeholder="e.g. ravi.kumar@bhel.gov.in"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(null); }}
                  style={inputStyle(!!error && !email)}
                  onFocus={(e) => { e.target.style.borderColor = '#111111'; e.target.style.boxShadow = '0 0 0 2px rgba(0,0,0,0.07)'; }}
                  onBlur={(e)  => { e.target.style.borderColor = '#CCCCCC'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 20 }}>
              <label htmlFor="login-password" style={{
                display: 'block', fontSize: '0.8rem', fontWeight: 600,
                color: '#111111', marginBottom: 5,
              }}>
                Password <span style={{ color: '#C0001A' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={14} style={{
                  position: 'absolute', left: 10, top: '50%',
                  transform: 'translateY(-50%)', color: '#AAAAAA', pointerEvents: 'none',
                }} />
                <input
                  id="login-password"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(null); }}
                  style={{ ...inputStyle(!!error && !password), paddingRight: 38 }}
                  onFocus={(e) => { e.target.style.borderColor = '#111111'; e.target.style.boxShadow = '0 0 0 2px rgba(0,0,0,0.07)'; }}
                  onBlur={(e)  => { e.target.style.borderColor = '#CCCCCC'; e.target.style.boxShadow = 'none'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute', right: 9, top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none',
                    cursor: 'pointer', color: '#555555', padding: 0,
                    display: 'flex', alignItems: 'center',
                  }}
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <div style={{ marginTop: 5, fontSize: '0.7rem', color: '#555555' }}>
                Enter your authorized account password or select an account below.
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: 8,
                background: '#fff5f5',
                border: '1px solid #fca5a5',
                borderLeft: '3px solid #C0001A',
                borderRadius: 3, padding: '9px 12px',
                marginBottom: 16,
                fontSize: '0.8rem', color: '#C0001A',
              }}>
                <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={submitting}
              style={{
                width: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '11px 16px',
                background: submitting ? '#333333' : '#111111',
                color: '#FFFFFF',
                border: 'none', borderRadius: 3,
                fontSize: '0.9rem', fontWeight: 700, fontFamily: 'inherit',
                letterSpacing: '0.04em',
                cursor: submitting ? 'not-allowed' : 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.background = '#000000'; }}
              onMouseLeave={(e) => { if (!submitting) e.currentTarget.style.background = submitting ? '#333333' : '#111111'; }}
            >
              {submitting ? (
                <><span className="spinner" style={{ width: 14, height: 14 }} /> Authenticating…</>
              ) : (
                <><Shield size={16} /> Sign In</>
              )}
            </button>
          </form>
        </div>

        {/* ── Credentials accordion ── */}
        <div style={{
          marginTop: 18,
          background: '#FFFFFF',
          border: '1px solid #CCCCCC',
          borderRadius: 3,
        }}>
          <button
            id="demo-credentials-toggle"
            type="button"
            onClick={() => setShowHelper((v) => !v)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center',
              justifyContent: 'space-between',
              padding: '11px 16px',
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'inherit', fontSize: '0.82rem', fontWeight: 700,
              color: '#111111', borderRadius: 3,
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <User size={14} />
              Select Authorized Account
            </span>
            {showHelper ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>

          {showHelper && (
            <div style={{ borderTop: '1px solid #EEEEEE', padding: '12px 16px 16px' }}>
              <p style={{ fontSize: '0.74rem', color: '#888888', marginBottom: 14 }}>
                Click any user profile below to populate login credentials.
              </p>

              {DEMO_GROUPS.map((group) => (
                <div key={group.role} style={{ marginBottom: 14 }}>
                  {/* Role header */}
                  <div style={{
                    fontSize: '0.68rem', fontWeight: 700,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: group.color, background: group.bg,
                    border: `1px solid ${group.border}`,
                    borderRadius: '3px 3px 0 0', padding: '5px 10px',
                  }}>
                    {group.role}
                  </div>

                  {/* User rows */}
                  <div style={{
                    border: `1px solid ${group.border}`, borderTop: 'none',
                    borderRadius: '0 0 3px 3px', overflow: 'hidden',
                  }}>
                    {group.users.map((u, idx) => (
                      <button
                        key={u.email}
                        id={`demo-${u.id}`}
                        type="button"
                        onClick={() => fillCredential(u.email)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          width: '100%', padding: '8px 10px',
                          background: 'none', border: 'none',
                          borderBottom: idx < group.users.length - 1 ? `1px solid ${group.border}` : 'none',
                          cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                          transition: 'background 0.1s',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = group.bg; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
                      >
                        <div style={{
                          width: 28, height: 28,
                          background: group.bg, border: `1px solid ${group.border}`,
                          borderRadius: '50%',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                          <User size={13} color={group.color} />
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.8rem', color: '#111111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {u.name}
                          </div>
                          <div style={{ fontSize: '0.68rem', color: '#777777', fontFamily: '"Roboto Mono", monospace', display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                            {u.email}
                            {u.plant && <><span style={{ color: '#DDD' }}>·</span><Building2 size={10} /> {u.plant}</>}
                          </div>
                        </div>

                        <span style={{
                          fontSize: '0.63rem', color: group.color,
                          background: group.bg, border: `1px solid ${group.border}`,
                          borderRadius: 2, padding: '2px 6px', whiteSpace: 'nowrap', flexShrink: 0,
                        }}>
                          Use ↗
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.68rem', color: '#BBBBBB', lineHeight: 1.7 }}>
          © 2026 Ministry of Heavy Industries, Government of India. All rights reserved.<br />
          <span style={{ fontFamily: '"Roboto Mono", monospace', fontSize: '0.63rem' }}>
            PRAKALP v1.0 — National Material Code Harmonization System
          </span>
        </p>
      </div>
    </div>
  );
}

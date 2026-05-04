import React, { useState } from 'react';
import EventSelection from './EventSelection';
import VerifierDashboard from './dashboard';

function EyeIcon({ open }) {
  return open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

function VerifierApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  /* ── same logic as before ── */
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    setLoading(false);
    if (username === 'admin' && password === 'admin') {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Invalid credentials. (Hint: admin / admin)');
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Inter,system-ui,sans-serif', padding: '2rem',
        background: 'linear-gradient(135deg,#0f172a 0%,#1e1b4b 50%,#0f172a 100%)'
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div style={{
            background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24,
            padding: '2.5rem', boxShadow: '0 32px 80px rgba(0,0,0,0.4)'
          }}>
            {/* Brand mark */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '2rem' }}>
              <div style={{
                width: 44, height: 44, borderRadius: 14,
                background: 'linear-gradient(135deg,#10b981,#059669)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 800, fontSize: 20,
                boxShadow: '0 8px 24px rgba(16,185,129,0.4)'
              }}>✓</div>
              <div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>EMS Verifier</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>Event Management System</div>
              </div>
            </div>

            <h2 style={{ color: '#fff', fontWeight: 800, fontSize: 24, margin: '0 0 4px', letterSpacing: '-0.03em' }}>
              Verifier Sign In
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, margin: '0 0 1.75rem' }}>
              Sign in to access the QR scanner
            </p>

            {loginError && (
              <div style={{
                background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.25)',
                color: '#fca5a5', borderRadius: 10, padding: '10px 14px',
                fontSize: 13, marginBottom: '1.25rem'
              }}>{loginError}</div>
            )}

            <form onSubmit={handleLogin} noValidate>
              {/* Username */}
              <div style={{ marginBottom: '1.1rem' }}>
                <label style={{
                  display: 'block', fontSize: 12, fontWeight: 700,
                  color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase',
                  letterSpacing: '0.1em', marginBottom: 8
                }}>Username</label>
                <input
                  id="verifier-username" type="text"
                  value={username} onChange={e => { setUsername(e.target.value); setLoginError(''); }}
                  placeholder="Enter username" autoComplete="username" required
                  style={{
                    width: '100%', padding: '12px 14px', boxSizing: 'border-box',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 12, color: '#fff', fontSize: 14, outline: 'none'
                  }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(16,185,129,0.7)'; e.target.style.background = 'rgba(255,255,255,0.08)'; }}
                  onBlur={e =>  { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; e.target.style.background = 'rgba(255,255,255,0.06)'; }}
                />
              </div>

              {/* Password */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block', fontSize: 12, fontWeight: 700,
                  color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase',
                  letterSpacing: '0.1em', marginBottom: 8
                }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="verifier-password" type={showPw ? 'text' : 'password'}
                    value={password} onChange={e => { setPassword(e.target.value); setLoginError(''); }}
                    placeholder="••••••••" autoComplete="current-password" required
                    style={{
                      width: '100%', padding: '12px 42px 12px 14px', boxSizing: 'border-box',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: 12, color: '#fff', fontSize: 14, outline: 'none'
                    }}
                    onFocus={e => { e.target.style.borderColor = 'rgba(16,185,129,0.7)'; e.target.style.background = 'rgba(255,255,255,0.08)'; }}
                    onBlur={e =>  { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; e.target.style.background = 'rgba(255,255,255,0.06)'; }}
                  />
                  <button type="button" onClick={() => setShowPw(p => !p)} style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0
                  }}>
                    <EyeIcon open={showPw}/>
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} style={{
                width: '100%', padding: '13px', borderRadius: 12, border: 'none',
                background: loading ? 'rgba(16,185,129,0.4)' : 'linear-gradient(135deg,#10b981,#059669)',
                color: '#fff', fontWeight: 700, fontSize: 15,
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 8px 24px rgba(16,185,129,0.3)',
                transition: 'all 0.2s', letterSpacing: '-0.01em'
              }}>
                {loading ? 'Signing in…' : 'Sign in to Verifier'}
              </button>
            </form>

            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <a href="/login" style={{
                color: 'rgba(255,255,255,0.35)', fontSize: 12, textDecoration: 'none'
              }}
                onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,0.7)'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.35)'}
              >
                Are you an admin? Sign in here →
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedEvent) {
    return <EventSelection onEventSelect={setSelectedEvent} onLogout={() => setIsLoggedIn(false)} />;
  }

  return <VerifierDashboard selectedEvent={selectedEvent} onBackToSelection={() => setSelectedEvent(null)} />;
}

export default VerifierApp;

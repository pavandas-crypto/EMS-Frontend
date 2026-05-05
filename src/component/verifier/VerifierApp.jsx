import React, { useState } from 'react';
import './Verifier.css';
import EventSelection from './EventSelection';
import VerifierDashboard from './dashboard';

function EyeIcon({ open }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

function VerifierApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
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
      setLoginError('Invalid credentials. Hint: admin / admin');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="v-center">
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div className="v-card">
            {/* Brand */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '2.5rem' }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, backgroundColor: '#000',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 900, fontSize: 22, flexShrink: 0,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}>✓</div>
              <div>
                <div style={{ color: '#000', fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em' }}>EMS Verifier</div>
                <div style={{ color: '#666', fontSize: 13, fontWeight: 500 }}>Management System</div>
              </div>
            </div>

            <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#000', margin: '0 0 8px', letterSpacing: '-0.03em' }}>
              Welcome back
            </h2>
            <p style={{ color: '#555', fontSize: 15, margin: '0 0 2.5rem', fontWeight: 500 }}>
              Sign in to your verification portal
            </p>

            {loginError && <div className="v-error">{loginError}</div>}

            <form onSubmit={handleLogin} noValidate>
              <div style={{ marginBottom: '1.25rem' }}>
                <label className="v-label">Username</label>
                <input
                  id="verifier-username" type="text"
                  value={username} onChange={e => { setUsername(e.target.value); setLoginError(''); }}
                  placeholder="admin" autoComplete="username" required
                  className="v-input"
                />
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label className="v-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="verifier-password" type={showPw ? 'text' : 'password'}
                    value={password} onChange={e => { setPassword(e.target.value); setLoginError(''); }}
                    placeholder="••••••••" autoComplete="current-password" required
                    className="v-input"
                    style={{ paddingRight: 52 }}
                  />
                  <button type="button" onClick={() => setShowPw(p => !p)} style={{
                    position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: '#aaa', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', padding: 0
                  }}>
                    <EyeIcon open={showPw} />
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="v-btn">
                {loading ? 'Authenticating…' : 'Sign In Now'}
              </button>
            </form>

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <a href="/login" className="v-btn--text">
                Admin Portal Access &rarr;
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

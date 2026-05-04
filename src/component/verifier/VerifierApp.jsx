import React, { useState } from 'react';
import EventSelection from './EventSelection';
import VerifierDashboard from './dashboard';
import './Verifier.css';

function VerifierApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Invalid credentials. (Hint: admin/admin)');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="bento-container d-flex align-items-center justify-content-center">
        <div className="bento-box black" style={{ maxWidth: '400px', width: '100%', padding: '2.5rem' }}>
          <div className="text-center mb-4">
            <h2 className="bento-title text-white mb-2" style={{ fontSize: '2rem' }}>Verifier Login</h2>
            <p className="bento-subtitle text-muted">Sign in to access scanner</p>
          </div>
          
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label text-white-50 small fw-bold">USERNAME</label>
              <input 
                type="text" 
                className="bento-input" 
                placeholder="Enter username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="form-label text-white-50 small fw-bold">PASSWORD</label>
              <input 
                type="password" 
                className="bento-input" 
                placeholder="Enter password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            {loginError && <div className="text-danger small mb-3">{loginError}</div>}
            
            <button type="submit" className="bento-btn w-100" style={{ backgroundColor: '#fff', color: '#000' }}>
              Sign In
            </button>
          </form>
          
          <div className="mt-4 text-center">
            <a href="/" className="text-white-50 text-decoration-none small">
              &larr; Back to main site
            </a>
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

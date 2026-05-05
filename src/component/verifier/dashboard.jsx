import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import './Verifier.css';

const mockUsers = {
  'V12345': { status: 'valid', details: { name: 'John Doe', email: 'john.doe@example.com', designation: 'Software Engineer', organisation: 'Tech Corp', mobile: '9876543210', passNo: 'V12345' } },
  'V67890': { status: 'valid', details: { name: 'Alice Smith', email: 'alice.smith@example.com', designation: 'Product Manager', organisation: 'Innovate Ltd', mobile: '8765432109', passNo: 'V67890' } },
  'D11111': { status: 'duplicate', details: { name: 'Bob Johnson', email: 'bob.j@example.com', designation: 'Designer', organisation: 'Creative Agency', mobile: '7654321098', passNo: 'D11111' } },
};

const playBeep = (freq = 800, ms = 200) => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.frequency.value = freq; osc.type = 'square';
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + ms / 1000);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + ms / 1000);
  } catch (_) {}
};

const VerifierDashboard = ({ selectedEvent, onBackToSelection }) => {
  const [scanResult, setScanResult] = useState('');
  const [userStatus, setUserStatus] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  const [activity, setActivity] = useState([]);

  const processCode = (code) => {
    const found = mockUsers[code] || { status: 'invalid', details: null };
    setUserStatus(found.status);
    setUserDetails(found.details);
    setActivity(prev => [{
      id: Date.now(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      code,
      status: found.status,
      name: found.details?.name ?? 'Unknown',
    }, ...prev].slice(0, 20));
    if (found.status === 'valid') playBeep(800, 200);
    else if (found.status === 'duplicate') playBeep(600, 300);
    else playBeep(400, 500);
  };

  const handleScan = (code) => {
    if (!scanResult && code) { setScanResult(code); processCode(code); }
  };

  const clearResult = () => setScanResult('');

  useEffect(() => {
    let scanner = null;
    const timer = setTimeout(() => {
      const el = document.getElementById('reader');
      if (el && el.innerHTML === '') {
        scanner = new Html5QrcodeScanner('reader', { fps: 10, qrbox: { width: 220, height: 220 } }, false);
        scanner.render(handleScan, () => {});
      }
    }, 150);
    return () => {
      clearTimeout(timer);
      scanner?.clear().catch(() => {});
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const statusClass = userStatus === 'valid' ? 'v-result--valid' : userStatus === 'duplicate' ? 'v-result--dup' : 'v-result--invalid';
  const statusIcon  = userStatus === 'valid' ? 'fa-check-circle' : userStatus === 'duplicate' ? 'fa-exclamation-triangle' : 'fa-times-circle';
  const statusLabel = userStatus === 'valid' ? 'Valid Entry' : userStatus === 'duplicate' ? 'Duplicate Entry' : 'Invalid Code';

  return (
    <div className="v-page">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <div>
            <button onClick={onBackToSelection} className="v-btn--text" style={{ marginBottom: '0.75rem' }}>
              ← Back to events
            </button>
            <h1 className="v-heading" style={{ fontSize: '1.75rem' }}>Scanner</h1>
            <p className="v-subheading">{selectedEvent.name}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#10b981', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '0.5rem' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block', animation: 'pulse 1.5s infinite' }}></span>
            Live
          </div>
        </div>

        <div className="v-dashboard-grid">
          {/* Left: Scanner card */}
          <div className="v-card" style={{ position: 'relative', overflow: 'hidden', minHeight: 480 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span style={{ fontWeight: 700, fontSize: '1rem', color: '#020202ff' }}>Camera</span>
              <i className="fas fa-camera" style={{ color: '#636366' }}></i>
            </div>

            {/* QR scanner */}
            <div className="v-scanner-wrap">
              <div id="reader"></div>
            </div>

            <p style={{ textAlign: 'center', color: '#636366', fontSize: '0.8rem', margin: '1rem 0' }}>
              Point camera at QR code to scan
            </p>

            <hr className="v-divider" />

            {/* Manual entry */}
            <label className="v-label">Manual Code Entry</label>
            <form onSubmit={e => {
              e.preventDefault();
              const code = e.target.manualCode.value.trim();
              if (code) { handleScan(code); e.target.reset(); }
            }} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                name="manualCode"
                className="v-input"
                placeholder="e.g. 12345"
                style={{ flex: 1 }}
              />
              <button type="submit" className="v-btn" style={{ width: 'auto', margin: 0, padding: '0 1.25rem' }}>
                Scan
              </button>
            </form>

            {/* Inline result overlay */}
            {scanResult && (
              <div className={`v-result ${statusClass}`}>
                <i className={`fas ${statusIcon} v-result__icon`}></i>
                <div className="v-result__title">{statusLabel}</div>

                {userDetails ? (
                  <div className="v-result-grid">
                    <div className="v-result-cell v-result-cell--full">
                      <span className="v-result-cell__label">Name</span>
                      <span className="v-result-cell__value">{userDetails.name}</span>
                    </div>
                    <div className="v-result-cell v-result-cell--full">
                      <span className="v-result-cell__label">Organisation</span>
                      <span className="v-result-cell__value">{userDetails.organisation}</span>
                    </div>
                    <div className="v-result-cell">
                      <span className="v-result-cell__label">Designation</span>
                      <span className="v-result-cell__value">{userDetails.designation}</span>
                    </div>
                    <div className="v-result-cell">
                      <span className="v-result-cell__label">Pass No</span>
                      <span className="v-result-cell__value">{userDetails.passNo}</span>
                    </div>
                    <div className="v-result-cell v-result-cell--full">
                      <span className="v-result-cell__label">Mobile</span>
                      <span className="v-result-cell__value">{userDetails.mobile}</span>
                    </div>
                    <div className="v-result-cell v-result-cell--full">
                      <span className="v-result-cell__label">Email</span>
                      <span className="v-result-cell__value">{userDetails.email}</span>
                    </div>
                  </div>
                ) : (
                  <div className="v-result-cell v-result-cell--full" style={{ marginBottom: '1rem', textAlign: 'center' }}>
                    <span className="v-result-cell__label">Code scanned</span>
                    <span className="v-result-cell__value" style={{ fontSize: '1.3rem' }}>{scanResult}</span>
                  </div>
                )}

                <button className="v-btn" onClick={clearResult} style={{ marginTop: 'auto' }}>
                  Scan Next →
                </button>
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="v-col-stack">
            {/* Event info card */}
            <div className="v-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #2c2c2e' }}>
                <span style={{ fontWeight: 700, color: '#000000ff' }}>Event Info</span>
                <span className="v-badge v-badge--active">Active</span>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <div className="v-label">Total Participants</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#060606ff', letterSpacing: '-0.03em', lineHeight: 1 }}>
                  {selectedEvent.attendees}
                </div>
              </div>

              <div>
                <div className="v-card__meta">
                  <i className="fas fa-calendar-alt"></i>
                  {selectedEvent.date}
                </div>
                <div className="v-card__meta">
                  <i className="fas fa-map-marker-alt"></i>
                  {selectedEvent.location}
                </div>
                <div className="v-card__meta">
                  <i className="fas fa-user-check"></i>
                  {activity.length} verified today
                </div>
              </div>
            </div>

            {/* Activity card */}
            <div className="v-card" style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #2c2c2e' }}>
                <span style={{ fontWeight: 700, color: '#000000ff' }}>Recent Activity</span>
                <span style={{ background: '#2c2c2e', color: '#8e8e93', borderRadius: '100px', padding: '2px 10px', fontSize: '0.75rem', fontWeight: 600 }}>
                  {activity.length}
                </span>
              </div>

              <div style={{ overflowY: 'auto', maxHeight: 300 }}>
                {activity.length === 0 ? (
                  <p style={{ color: '#636366', fontSize: '0.85rem', textAlign: 'center', padding: '2rem 0' }}>
                    No scans yet. Scan a QR code to get started.
                  </p>
                ) : (
                  activity.map(item => (
                    <div key={item.id} className="v-activity-item">
                      <div>
                        <div className="v-activity-name">{item.name}</div>
                        <div className="v-activity-meta">{item.time} · {item.code}</div>
                      </div>
                      <span className={`v-activity-badge v-activity-badge--${item.status === 'valid' ? 'valid' : item.status === 'duplicate' ? 'dup' : 'invalid'}`}>
                        {item.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifierDashboard;
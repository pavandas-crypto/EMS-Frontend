import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import api from '../../api/api';
import './Verifier.css';

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
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const processCode = async (code) => {
    try {
      const response = await api.scanQRCode({ qr_code: code, event_id: selectedEvent.id });
      
      if (response.success) {
        const data = response.data;
        const status = data.status || 'valid';
        
        setUserStatus(status);
        setUserDetails({
          name: data.participant_name,
          email: data.email,
          designation: data.designation,
          organisation: data.organization,
          mobile: data.phone,
          passNo: data.pass_number
        });
        
        setActivity(prev => [{
          id: Date.now(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          code,
          status: status,
          name: data.participant_name,
        }, ...prev].slice(0, 20));

        if (status === 'valid') playBeep(800, 200);
        else if (status === 'duplicate') playBeep(600, 300);
      }
    } catch (error) {
      console.error("Scan error:", error);
      setUserStatus('invalid');
      const errorMsg = error.message || 'Invalid Code';
      setUserDetails(null);
      setScanResult(code); // Ensure code is shown even if invalid
      setActivity(prev => [{
        id: Date.now(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        code,
        status: 'invalid',
        name: errorMsg,
      }, ...prev].slice(0, 20));
      playBeep(400, 500);
    }
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
          <div className="v-card" style={{ position: 'relative', overflow: 'hidden', minHeight: 480 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span style={{ fontWeight: 700, fontSize: '1rem', color: '#020202ff' }}>Camera</span>
              <i className="fas fa-camera" style={{ color: '#636366' }}></i>
            </div>

            <div className="v-scanner-wrap">
              <div id="reader"></div>
            </div>

            <p style={{ textAlign: 'center', color: '#636366', fontSize: '0.8rem', margin: '1rem 0' }}>
              Point camera at QR code to scan
            </p>

            <hr className="v-divider" />

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

            {scanResult && (
              <div className="v-result-overlay" onClick={clearResult}>
                <div className={`v-result ${statusClass}`} onClick={e => e.stopPropagation()}>
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
                    <div className="v-result-cell v-result-cell--full" style={{ marginBottom: '2rem', textAlign: 'center', background: 'rgba(255,255,255,0.1)' }}>
                      <span className="v-result-cell__label" style={{ color: 'rgba(255,255,255,0.7)' }}>Message</span>
                      <span className="v-result-cell__value" style={{ fontSize: '1.2rem' }}>{scanResult}</span>
                    </div>
                  )}

                  <button className="v-btn" onClick={clearResult} style={{ 
                    marginTop: 'auto', background: '#fff', color: userStatus === 'valid' ? '#10b981' : userStatus === 'duplicate' ? '#f59e0b' : '#ef4444',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}>
                    Scan Next →
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="v-col-stack">
            <div className="v-card v-desktop-only">
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

      {/* Floating Info Button for Mobile */}
      <div className="v-fab" onClick={() => setIsInfoOpen(true)}>
        <i className="fas fa-info-circle"></i>
      </div>

      {/* Mobile Info Sheet */}
      {isInfoOpen && (
        <div className="v-info-overlay" onClick={() => setIsInfoOpen(false)}>
          <div className="v-info-sheet" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setIsInfoOpen(false)}
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', fontSize: '1.5rem', color: '#adb5bd', cursor: 'pointer' }}
            >
              <i className="fas fa-times"></i>
            </button>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>Event Info</h2>
              <span className="v-badge v-badge--active">Active</span>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <div className="v-label">Total Participants</div>
              <div style={{ fontSize: '3rem', fontWeight: 800, color: '#000', letterSpacing: '-0.03em', lineHeight: 1 }}>
                {selectedEvent.attendees}
              </div>
            </div>

            <div style={{ display: 'grid', gap: '1rem' }}>
              <div className="v-card__meta" style={{ fontSize: '1.1rem' }}>
                <i className="fas fa-calendar-alt"></i>
                {selectedEvent.date}
              </div>
              <div className="v-card__meta" style={{ fontSize: '1.1rem' }}>
                <i className="fas fa-map-marker-alt"></i>
                {selectedEvent.location}
              </div>
              <div className="v-card__meta" style={{ fontSize: '1.1rem' }}>
                <i className="fas fa-user-check"></i>
                {activity.length} verified today
              </div>
            </div>

            <button className="v-btn" onClick={() => setIsInfoOpen(false)} style={{ marginTop: '2.5rem' }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifierDashboard;
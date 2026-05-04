import React, { useState, useEffect, useRef } from 'react';
import { Container } from 'react-bootstrap';
import { Html5QrcodeScanner } from 'html5-qrcode';

const VerifierDashboard = ({ selectedEvent, onBackToSelection }) => {
  const [scanResult, setScanResult] = useState('');
  const [userStatus, setUserStatus] = useState(''); // 'valid', 'duplicate', 'invalid'
  const [userDetails, setUserDetails] = useState(null);
  const [scanningReports, setScanningReports] = useState([]);

  // Mock user verification function
  const verifyUser = (code) => {
    const mockUsers = {
      'V12345': {
        status: 'valid',
        details: {
          name: 'John Doe',
          designation: 'Software Engineer',
          organisation: 'Tech Corp',
          mobile: '9876543210',
          passNo: 'V12345'
        }
      },
      'V67890': {
        status: 'valid',
        details: {
          name: 'Alice Smith',
          designation: 'Product Manager',
          organisation: 'Innovate Ltd',
          mobile: '8765432109',
          passNo: 'V67890'
        }
      },
      'D11111': {
        status: 'duplicate',
        details: {
          name: 'Bob Johnson',
          designation: 'Designer',
          organisation: 'Creative Agency',
          mobile: '7654321098',
          passNo: 'D11111'
        }
      }
    };

    if (mockUsers[code]) {
      return mockUsers[code];
    } else {
      return { status: 'invalid', details: null };
    }
  };

  const playBeep = (frequency = 800, duration = 200) => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = 'square';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch(e) {
      console.log("Audio not supported or blocked");
    }
  };

  const onScanSuccess = (decodedText) => {
    // Prevent repeated scans of the same code rapidly
    if (decodedText !== scanResult) {
      setScanResult(decodedText);
      processCode(decodedText);
      // reset scan result after 3 seconds to allow scanning same code again if needed
      setTimeout(() => setScanResult(''), 3000);
    }
  };

  const onScanFailure = (error) => {
    // console.warn(`Code scan error = ${error}`);
  };

  const processCode = (code) => {
    const result = verifyUser(code);
    setUserStatus(result.status);
    setUserDetails(result.details);

    setScanningReports(prev => [...prev, {
      id: Date.now(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      code,
      status: result.status,
      details: result.details
    }]);

    if (result.status === 'valid') {
      playBeep(800, 200);
    } else if (result.status === 'duplicate') {
      playBeep(600, 300);
    } else {
      playBeep(400, 500);
    }
  };

  useEffect(() => {
    let scanner = null;

    // Use a small delay to bypass React Strict Mode double-mounts.
    // We intentionally DO NOT wipe the DOM manually because it breaks
    // the library's internal cleanup routines.
    const timer = setTimeout(() => {
      const reader = document.getElementById('reader');
      // Only initialize if the container is empty (avoids duplicate rendering)
      if (reader && reader.innerHTML === '') {
        scanner = new Html5QrcodeScanner(
          "reader",
          { fps: 10, qrbox: { width: 250, height: 250 } },
          false
        );
        scanner.render(onScanSuccess, onScanFailure);
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      if (scanner) {
        scanner.clear().catch(error => {
          console.error("Failed to clear html5QrcodeScanner. ", error);
        });
      }
    };
  }, []);

  return (
    <div className="bento-container">
      <Container>
        {/* Header Section */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center bento-header gap-3">
          <div>
            <button onClick={onBackToSelection} className="btn btn-link text-dark text-decoration-none p-0 mb-2 fw-bold">
              &larr; Back to Events
            </button>
            <h1 className="bento-title mb-1" style={{ fontSize: '2rem' }}>Scanner Dashboard</h1>
            <p className="bento-subtitle mb-0 d-flex align-items-center">
              <span className="fw-bold text-dark me-2">{selectedEvent.name}</span>
              <span className="text-muted text-sm">&bull; {selectedEvent.date}</span>
            </p>
          </div>
          <div className="text-md-end bg-white px-4 py-2 rounded-pill shadow-sm border">
            <div className="text-success fw-bold d-flex align-items-center">
              <span className="spinner-grow spinner-grow-sm text-success me-2" role="status" aria-hidden="true" style={{width: '0.5rem', height: '0.5rem'}}></span>
              Scanner Active
            </div>
          </div>
        </div>

        <div className="bento-grid-dashboard">
          {/* Scanner Box */}
          <div className="bento-box black">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="fw-bold m-0" style={{ fontSize: '1.25rem' }}>Camera Stream</h3>
              <i className="fas fa-camera text-white-50"></i>
            </div>
            
            <div className="flex-grow-1 d-flex flex-column justify-content-center">
              <div id="reader" className="bg-white text-dark rounded-4 w-100" style={{ minHeight: '300px' }}></div>
            </div>
            
            <div className="mt-4 text-center text-white-50 small mb-3">
              Position QR code within the frame to scan automatically
            </div>
            
            <div className="mt-auto border-top border-secondary pt-3">
              <label className="text-white-50 small fw-bold mb-2">MANUAL ENTRY (TESTING)</label>
              <form onSubmit={(e) => {
                e.preventDefault();
                const code = e.target.manualCode.value.trim();
                if (code) {
                  // Simulate scan success
                  setScanResult(code);
                  processCode(code);
                  setTimeout(() => setScanResult(''), 3000);
                  e.target.reset();
                }
              }} className="d-flex gap-2">
                <input 
                  type="text" 
                  name="manualCode" 
                  className="form-control form-control-sm bg-dark text-white border-secondary" 
                  placeholder="e.g. V12345, V67890, D11111" 
                />
                <button type="submit" className="btn btn-sm btn-light fw-bold px-3">Scan</button>
              </form>
            </div>
          </div>

          <div className="d-flex flex-column gap-4">
            {/* Verification Status Box */}
            <div className="bento-box">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold m-0" style={{ fontSize: '1.25rem' }}>Verification Status</h3>
                <i className="fas fa-check-circle text-muted"></i>
              </div>

              {userStatus ? (
                <div className="flex-grow-1 d-flex flex-column">
                  <div className={`p-3 rounded-4 mb-3 d-flex align-items-center ${
                    userStatus === 'valid' ? 'bg-success bg-opacity-10 text-success' :
                    userStatus === 'duplicate' ? 'bg-warning bg-opacity-10 text-warning' : 'bg-danger bg-opacity-10 text-danger'
                  }`} style={{ border: `1px solid ${
                    userStatus === 'valid' ? '#198754' :
                    userStatus === 'duplicate' ? '#ffc107' : '#dc3545'
                  }`}}>
                    <i className={`fas fa-${
                      userStatus === 'valid' ? 'check-circle' :
                      userStatus === 'duplicate' ? 'exclamation-triangle' : 'times-circle'
                    } fa-2x me-3`}></i>
                    <div>
                      <h4 className="fw-bold mb-0">
                        {userStatus === 'valid' ? 'Valid Entry' :
                         userStatus === 'duplicate' ? 'Duplicate Entry' : 'Invalid Entry'}
                      </h4>
                      <small className="opacity-75">Code: {scanResult}</small>
                    </div>
                  </div>

                  {userDetails ? (
                    <div className="bg-light p-4 rounded-4 flex-grow-1">
                      <div className="row g-3">
                        <div className="col-6">
                          <small className="text-muted d-block fw-bold mb-1">NAME</small>
                          <span className="fw-bold">{userDetails.name}</span>
                        </div>
                        <div className="col-6">
                          <small className="text-muted d-block fw-bold mb-1">PASS NO</small>
                          <span className="badge bg-dark px-2 py-1">{userDetails.passNo}</span>
                        </div>
                        <div className="col-6">
                          <small className="text-muted d-block fw-bold mb-1">ORGANISATION</small>
                          <span>{userDetails.organisation}</span>
                        </div>
                        <div className="col-6">
                          <small className="text-muted d-block fw-bold mb-1">MOBILE</small>
                          <span>{userDetails.mobile}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-light p-4 rounded-4 flex-grow-1 d-flex align-items-center justify-content-center text-muted">
                      No user details found for this code.
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center text-muted bg-light rounded-4">
                  <div className="bg-white rounded-circle d-flex align-items-center justify-content-center mb-3 shadow-sm" style={{ width: '80px', height: '80px' }}>
                    <i className="fas fa-qrcode fa-2x text-dark"></i>
                  </div>
                  <h5 className="fw-bold text-dark">Awaiting Scan</h5>
                  <p className="small mb-0">Scan a ticket to view details</p>
                </div>
              )}
            </div>

            {/* Recent Scans Box */}
            <div className="bento-box">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="fw-bold m-0" style={{ fontSize: '1.25rem' }}>Recent Activity</h3>
                <span className="badge bg-light text-dark border">{scanningReports.length} total</span>
              </div>
              
              <div className="overflow-auto pe-2" style={{ maxHeight: '200px' }}>
                {scanningReports.length > 0 ? (
                  <div className="d-flex flex-column gap-2">
                    {scanningReports.slice(-5).reverse().map((report) => (
                      <div key={report.id} className="d-flex justify-content-between align-items-center p-3 border rounded-3 bg-light">
                        <div>
                          <div className="fw-bold small">{report.details ? report.details.name : 'Unknown User'}</div>
                          <div className="text-muted" style={{ fontSize: '0.75rem' }}>{report.time} • Code: {report.code}</div>
                        </div>
                        <div className={`badge ${
                          report.status === 'valid' ? 'bg-success' :
                          report.status === 'duplicate' ? 'bg-warning text-dark' : 'bg-danger'
                        }`}>
                          {report.status}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted py-4 small">
                    No activity recorded yet today.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default VerifierDashboard;
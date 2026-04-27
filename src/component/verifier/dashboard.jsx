import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Table } from 'react-bootstrap';
import { Html5QrcodeScanner } from 'html5-qrcode';

const VerifierDashboard = ({ selectedEvent, onBackToSelection }) => {
  const [scanResult, setScanResult] = useState('');
  const [userStatus, setUserStatus] = useState(''); // 'valid', 'duplicate', 'invalid'
  const [userDetails, setUserDetails] = useState(null);
  const [scanningReports, setScanningReports] = useState([]);
  const scannerRef = useRef(null);

  // Mock user verification function
  const verifyUser = (code) => {
    // Mock logic: codes starting with 'V' valid, 'D' duplicate, else invalid
    // Simulate fetching user data from register form
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

  // Function to play beep sound
  const playBeep = (frequency = 800, duration = 200) => {
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
  };

  // Handle scan success
  const onScanSuccess = (decodedText) => {
    setScanResult(decodedText);
    processCode(decodedText);
  };

  // Handle scan failure
  const onScanFailure = (error) => {
    console.warn(`Code scan error = ${error}`);
  };

  // Process the code (from scan)
  const processCode = (code) => {
    const result = verifyUser(code);
    setUserStatus(result.status);
    setUserDetails(result.details);

    // Add to reports
    setScanningReports(prev => [...prev, {
      time: new Date().toLocaleTimeString(),
      code,
      status: result.status,
      details: result.details
    }]);

    // Play beep based on status
    if (result.status === 'valid') {
      playBeep(800, 200); // High beep for valid
    } else if (result.status === 'duplicate') {
      playBeep(600, 300); // Medium beep for duplicate
    } else {
      playBeep(400, 500); // Low beep for invalid
    }
  };

  // Initialize scanner when component mounts
  useEffect(() => {
    if (!scannerRef.current) {
      scannerRef.current = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );
      scannerRef.current.render(onScanSuccess, onScanFailure);
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => {
          console.error("Failed to clear html5QrcodeScanner. ", error);
        });
        scannerRef.current = null;
      }
    };
  }, []);

  return (
    <Container fluid className="mt-4">
      {/* Header Section */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <Button variant="outline-secondary" onClick={onBackToSelection} className="mb-2">
                ← Back to Events
              </Button>
              <h2 className="mb-1">Event Verification</h2>
              <p className="text-muted mb-0">
                <i className="fas fa-calendar-alt me-2"></i>
                {selectedEvent.name} • {selectedEvent.date} • {selectedEvent.location}
              </p>
            </div>
            <div className="text-end">
              <div className="text-success fw-bold">
                <i className="fas fa-circle me-2"></i>
                Scanner Active
              </div>
              <small className="text-muted">Ready to scan QR codes</small>
            </div>
          </div>
        </Col>
      </Row>

      <Row>
        {/* Scanner Section */}
        <Col lg={6} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">
                <i className="fas fa-qrcode me-2"></i>
                QR Code Scanner
              </h5>
            </Card.Header>
            <Card.Body className="d-flex flex-column">
              <div id="reader" className="flex-grow-1 d-flex align-items-center justify-content-center bg-light rounded"
                   style={{ minHeight: '300px' }}>
              </div>
              <div className="mt-3 text-center">
                <small className="text-muted">
                  Position QR code within the camera view to scan automatically
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* User Status Section */}
        <Col lg={6} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Header className="bg-success text-white">
              <h5 className="mb-0">
                <i className="fas fa-user-check me-2"></i>
                Verification Status
              </h5>
            </Card.Header>
            <Card.Body>
              {userStatus ? (
                <div>
                  <Alert variant={
                    userStatus === 'valid' ? 'success' :
                    userStatus === 'duplicate' ? 'warning' : 'danger'
                  } className="mb-3">
                    <div className="d-flex align-items-center">
                      <i className={`fas fa-${
                        userStatus === 'valid' ? 'check-circle' :
                        userStatus === 'duplicate' ? 'exclamation-triangle' : 'times-circle'
                      } fa-lg me-2`}></i>
                      <div>
                        <h6 className="mb-0">
                          {userStatus === 'valid' ? '✓ Valid Entry' :
                           userStatus === 'duplicate' ? '⚠ Duplicate Entry' : '✗ Invalid Entry'}
                        </h6>
                        <small>Last scanned: {scanResult}</small>
                      </div>
                    </div>
                  </Alert>

                  {userDetails && (
                    <div className="user-details-card bg-light p-3 rounded">
                      <h6 className="text-primary mb-3">
                        <i className="fas fa-id-card me-2"></i>
                        Attendee Information
                      </h6>
                      <Row>
                        <Col sm={6}>
                          <div className="mb-2">
                            <strong className="text-muted">Name:</strong><br/>
                            <span className="fw-semibold">{userDetails.name}</span>
                          </div>
                          <div className="mb-2">
                            <strong className="text-muted">Designation:</strong><br/>
                            <span>{userDetails.designation}</span>
                          </div>
                        </Col>
                        <Col sm={6}>
                          <div className="mb-2">
                            <strong className="text-muted">Organisation:</strong><br/>
                            <span>{userDetails.organisation}</span>
                          </div>
                          <div className="mb-2">
                            <strong className="text-muted">Mobile:</strong><br/>
                            <span>{userDetails.mobile}</span>
                          </div>
                        </Col>
                      </Row>
                      <div className="mt-3 pt-3 border-top">
                        <div className="d-flex justify-content-between align-items-center">
                          <span><strong className="text-muted">Pass No:</strong></span>
                          <span className="badge bg-primary fs-6">{userDetails.passNo}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-muted py-5">
                  <i className="fas fa-qrcode fa-3x mb-3"></i>
                  <h6>No Scan Yet</h6>
                  <p className="mb-0">Scan a QR code to verify attendee</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Reports Section */}
      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-info text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <i className="fas fa-history me-2"></i>
                Scanning Reports
              </h5>
              <div className="badge bg-light text-dark">
                {scanningReports.length} scans
              </div>
            </Card.Header>
            <Card.Body>
              {scanningReports.length > 0 ? (
                <div className="table-responsive">
                  <Table striped hover className="mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="text-center">#</th>
                        <th>Time</th>
                        <th>Code</th>
                        <th>Status</th>
                        <th>Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scanningReports.slice(-10).reverse().map((report, index) => (
                        <tr key={index}>
                          <td className="text-center fw-bold">{scanningReports.length - index}</td>
                          <td className="text-nowrap">{report.time}</td>
                          <td>
                            <code className="bg-light px-2 py-1 rounded small">{report.code}</code>
                          </td>
                          <td>
                            <span className={`badge ${
                              report.status === 'valid' ? 'bg-success' :
                              report.status === 'duplicate' ? 'bg-warning text-dark' : 'bg-danger'
                            }`}>
                              {report.status}
                            </span>
                          </td>
                          <td>{report.details ? report.details.name : '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <div className="text-center text-muted py-4">
                  <i className="fas fa-list fa-2x mb-2"></i>
                  <p className="mb-0">No scans recorded yet</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default VerifierDashboard;
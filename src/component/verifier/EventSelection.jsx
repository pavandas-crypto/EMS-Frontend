import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';

const EventSelection = ({ onEventSelect }) => {
  // Mock events data with more details
  const events = [
    {
      id: 1,
      name: 'Tech Conference 2024',
      date: '2024-05-15',
      location: 'Convention Center, Mumbai',
      attendees: 250,
      status: 'active',
      description: 'Annual technology conference featuring industry leaders and innovative solutions.'
    },
    {
      id: 2,
      name: 'Music Festival',
      date: '2024-06-20',
      location: 'City Park, Delhi',
      attendees: 500,
      status: 'upcoming',
      description: 'Three-day music extravaganza with international and local artists.'
    },
    {
      id: 3,
      name: 'Workshop on AI',
      date: '2024-07-10',
      location: 'Tech Hub, Bangalore',
      attendees: 100,
      status: 'active',
      description: 'Hands-on workshop covering latest AI technologies and practical applications.'
    }
  ];

  return (
    <Container fluid className="mt-4">
      {/* Header */}
      <Row className="mb-5">
        <Col className="text-center">
          <h1 className="display-4 text-primary mb-3">
            <i className="fas fa-calendar-check me-3"></i>
            Event Verification Portal
          </h1>
          <p className="lead text-muted">
            Select an event to begin ticket verification and attendee check-in
          </p>
          <hr className="my-4" />
        </Col>
      </Row>

      {/* Events Grid */}
      <Row className="g-4">
        {events.map(event => (
          <Col lg={4} md={6} key={event.id} className="mb-4">
            <Card className="h-100 shadow-lg border-0 event-card">
              <Card.Header className="bg-gradient-primary text-white position-relative overflow-hidden"
                           style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
                <div className="position-absolute top-0 end-0">
                  <Badge bg={event.status === 'active' ? 'success' : 'warning'} className="me-2">
                    {event.status === 'active' ? 'Active' : 'Upcoming'}
                  </Badge>
                </div>
                <h5 className="card-title mb-2">
                  <i className="fas fa-calendar-alt me-2"></i>
                  {event.name}
                </h5>
                <div className="event-meta">
                  <small className="d-block mb-1">
                    <i className="fas fa-clock me-1"></i>
                    {new Date(event.date).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </small>
                  <small className="d-block">
                    <i className="fas fa-map-marker-alt me-1"></i>
                    {event.location}
                  </small>
                </div>
              </Card.Header>

              <Card.Body className="d-flex flex-column">
                <p className="card-text text-muted mb-3 flex-grow-1">
                  {event.description}
                </p>

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="text-muted">
                    <i className="fas fa-users me-1"></i>
                    <small>Expected: {event.attendees} attendees</small>
                  </div>
                  <div className="text-muted">
                    <i className="fas fa-qrcode me-1"></i>
                    <small>QR Verification</small>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  className="w-100 mt-auto"
                  onClick={() => onEventSelect(event)}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
                  }}
                >
                  <i className="fas fa-play-circle me-2"></i>
                  Start Verification
                </Button>
              </Card.Body>

              <Card.Footer className="bg-light text-center">
                <small className="text-muted">
                  <i className="fas fa-shield-alt me-1"></i>
                  Secure QR Code Verification System
                </small>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Footer Info */}
      <Row className="mt-5">
        <Col className="text-center">
          <div className="bg-light rounded p-4">
            <h5 className="text-primary mb-3">
              <i className="fas fa-info-circle me-2"></i>
              How It Works
            </h5>
            <Row className="g-3">
              <Col md={4}>
                <div className="text-center">
                  <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
                       style={{width: '50px', height: '50px'}}>
                    <i className="fas fa-qrcode fa-lg"></i>
                  </div>
                  <h6>Scan QR Code</h6>
                  <small className="text-muted">Use camera to scan attendee QR codes</small>
                </div>
              </Col>
              <Col md={4}>
                <div className="text-center">
                  <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
                       style={{width: '50px', height: '50px'}}>
                    <i className="fas fa-check-circle fa-lg"></i>
                  </div>
                  <h6>Verify Details</h6>
                  <small className="text-muted">Instant verification with attendee info</small>
                </div>
              </Col>
              <Col md={4}>
                <div className="text-center">
                  <div className="bg-info text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
                       style={{width: '50px', height: '50px'}}>
                    <i className="fas fa-chart-line fa-lg"></i>
                  </div>
                  <h6>Track Reports</h6>
                  <small className="text-muted">Monitor check-in statistics</small>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default EventSelection;
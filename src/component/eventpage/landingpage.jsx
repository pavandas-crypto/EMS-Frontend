n
import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Navbar, Nav, Badge, Tabs, Tab, Accordion } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Event details
  const eventDetails = {
    title: "Tech Conference 2024",
    subtitle: "Shaping the Future of Technology",
    date: "2024-05-15T09:00:00",
    location: "Convention Center, Mumbai",
    description: "Join industry leaders, innovators, and tech enthusiasts for an immersive experience featuring cutting-edge technologies, networking opportunities, and transformative insights.",
    highlights: [
      "Keynote speeches by industry leaders",
      "Hands-on workshops and technical sessions",
      "Networking opportunities with peers",
      "Latest technology demonstrations",
      "Career development workshops"
    ],
    speakers: [
      { name: "Dr. Sarah Johnson", title: "AI Research Director, TechCorp" },
      { name: "Michael Chen", title: "CTO, InnovateLabs" },
      { name: "Priya Sharma", title: "VP Engineering, DataFlow" }
    ]
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const handleBecomeMember = () => {
    window.open('https://tssia.org/become-a-member', '_blank');
  };

  return (
    <div className="landing-page bg-light">
      {/* Compact Header */}
      <Navbar bg="white" variant="light" expand="lg" className="shadow-sm border-bottom">
        <Container>
          <Navbar.Brand className="fw-bold text-primary">
            <i className="fas fa-calendar-alt me-2"></i>
            EMS
          </Navbar.Brand>
        </Container>
      </Navbar>

      {/* Hero Section */}
      <section className="hero-section bg-dark text-white">
        <div className="mountain-header-overlay">
          <div className="parallax-layer mountain-header-layer"></div>
          <div className="parallax-layer foreground-mountain-header"></div>
        </div>

        <div className="hero-overlay"></div>
        <Container fluid className="h-100">
          <Row className="justify-content-center text-center h-100 align-items-center">
            <Col lg={10}>
              <div className="hero-content">
                <Badge bg="primary" className="mb-3 badge-morph">
                  <i className="fas fa-calendar me-1"></i>
                  {new Date(eventDetails.date).toLocaleDateString('en-IN', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </Badge>
                <h1 className="display-4 fw-bold mb-3 title-morph">{eventDetails.title}</h1>
                <h2 className="h4 text-primary mb-4 subtitle-morph">{eventDetails.subtitle}</h2>
                <p className="lead mb-4 description-morph">{eventDetails.description}</p>

                <div className="location-info mb-4 location-morph">
                  <i className="fas fa-map-marker-alt me-2 text-primary"></i>
                  <span className="h5">{eventDetails.location}</span>
                </div>

                <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center button-container">
                  <Button
                    size="lg"
                    className="px-4 py-3 fw-bold button-primary"
                    onClick={handleRegister}
                  >
                    <i className="fas fa-user-plus me-2"></i>
                    Register Now
                  </Button>
                  <Button
                    variant="outline-light"
                    size="lg"
                    className="px-4 py-3 fw-bold button-secondary"
                    onClick={handleBecomeMember}
                  >
                    <i className="fas fa-crown me-2"></i>
                    Become a Member
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Content Section */}
      <section className="py-5 bg-white">
        <Container>
          <Row className="align-items-center">
            <Col lg={8}>
              <Card className="shadow-sm border-0">
                <Card.Header className="bg-light border-0">
                  <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-0">
                    <Tab eventKey="overview" title="Overview">
                      <Card.Body className="bg-white">
                        <h4 className="text-dark mb-4">Why Attend?</h4>
                        <Row>
                          {eventDetails.highlights.slice(0, 3).map((highlight, index) => (
                            <Col md={4} key={index} className="mb-4">
                              <div className="text-center">
                                <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                     style={{width: '60px', height: '60px'}}>
                                  <i className="fas fa-check text-primary fa-lg"></i>
                                </div>
                                <p className="text-muted mb-0">{highlight}</p>
                              </div>
                            </Col>
                          ))}
                        </Row>
                        <Accordion className="mt-4">
                          <Accordion.Item eventKey="0">
                            <Accordion.Header className="bg-light">View All Highlights</Accordion.Header>
                            <Accordion.Body className="bg-white">
                              <ul className="list-unstyled">
                                {eventDetails.highlights.map((highlight, index) => (
                                  <li key={index} className="mb-2">
                                    <i className="fas fa-check text-success me-2"></i>
                                    {highlight}
                                  </li>
                                ))}
                              </ul>
                            </Accordion.Body>
                          </Accordion.Item>
                        </Accordion>
                      </Card.Body>
                    </Tab>

                    <Tab eventKey="speakers" title="Speakers">
                      <Card.Body className="bg-white">
                        <h4 className="text-dark mb-4">Featured Speakers</h4>
                        <Row>
                          {eventDetails.speakers.map((speaker, index) => (
                            <Col md={4} key={index} className="mb-4">
                              <Card className="border-0 shadow-sm bg-light">
                                <Card.Body className="text-center p-4">
                                  <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                       style={{width: '50px', height: '50px'}}>
                                    <i className="fas fa-user"></i>
                                  </div>
                                  <h6 className="text-dark mb-2">{speaker.name}</h6>
                                  <small className="text-muted">{speaker.title}</small>
                                </Card.Body>
                              </Card>
                            </Col>
                          ))}
                        </Row>
                      </Card.Body>
                    </Tab>

                    <Tab eventKey="venue" title="Venue">
                      <Card.Body className="bg-white">
                        <h4 className="text-dark mb-4">Event Venue</h4>
                        <div className="d-flex align-items-center mb-4">
                          <i className="fas fa-map-marker-alt text-primary me-3 fs-3"></i>
                          <div>
                            <h5 className="text-dark mb-1">{eventDetails.location}</h5>
                            <p className="text-muted mb-0">Modern convention center with state-of-the-art facilities</p>
                          </div>
                        </div>
                        <Row className="g-3">
                          <Col md={6}>
                            <div className="bg-light p-4 rounded text-center">
                              <i className="fas fa-parking text-primary mb-3 fs-2"></i>
                              <div className="text-dark fw-bold">Free Parking</div>
                            </div>
                          </Col>
                          <Col md={6}>
                            <div className="bg-light p-4 rounded text-center">
                              <i className="fas fa-wifi text-primary mb-3 fs-2"></i>
                              <div className="text-dark fw-bold">High-Speed WiFi</div>
                            </div>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Tab>
                  </Tabs>
                </Card.Header>
              </Card>
            </Col>

            <Col lg={4}>
              {/* Quick Actions Card */}
              <Card className="shadow-sm border-0 bg-dark text-white">
                <Card.Header className="bg-primary text-white border-0">
                  <h5 className="mb-0">Quick Actions</h5>
                </Card.Header>
                <Card.Body className="bg-dark">
                  <Button variant="light" className="w-100 mb-3 py-3 fw-bold" onClick={handleRegister}>
                    <i className="fas fa-user-plus me-2"></i>
                    Register Now
                  </Button>
                  <Button variant="outline-light" className="w-100 py-3 fw-bold" onClick={handleBecomeMember}>
                    <i className="fas fa-crown me-2"></i>
                    Become a Member
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer */}
      <footer className="footer-section bg-dark text-white">
        <div className="footer-overlay"></div>
        <Container fluid className="h-100">
          <Row className="text-center h-100 align-items-center justify-content-center">
            <Col lg={8}>
              <div className="footer-content">
                <div className="mb-4">
                  <h3 className="text-primary mb-4 footer-title">
                    <i className="fas fa-calendar-alt me-2"></i>
                    EMS
                  </h3>
                  <p className="text-light mb-4 footer-description">
                    Event Management System - Making event organization seamless and efficient.
                  </p>
                </div>
                <div className="social-links mb-4">
                  <a href="#" className="social-link">
                    <i className="fab fa-facebook"></i>
                  </a>
                  <a href="#" className="social-link">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" className="social-link">
                    <i className="fab fa-linkedin"></i>
                  </a>
                  <a href="#" className="social-link">
                    <i className="fab fa-instagram"></i>
                  </a>
                </div>
                <hr className="footer-divider" />
                <p className="mb-0 text-light footer-copyright">
                  &copy; 2024 EMS - Event Management System. All rights reserved.
                  <span className="ms-2">
                    Powered by <a href="https://tssia.org" className="text-primary text-decoration-none powered-by">TSSIA</a>
                  </span>
                </p>
              </div>
            </Col>
          </Row>
        </Container>

        <div className="sea-footer-overlay">
          <div className="parallax-layer sea-footer-layer"></div>
        </div>
      </footer>

      <style jsx>{`
        .landing-page {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          overflow-x: hidden;
          color: #212529;
        }

        .hero-section {
          position: relative;
          background: linear-gradient(180deg, #111111 0%, #191c20 55%, #0f1013 100%);
          min-height: 90vh;
          display: flex;
          align-items: center;
          overflow: hidden;
        }

        .mountain-header-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 48%;
          overflow: hidden;
          z-index: 1;
        }

        .parallax-layer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }

        .mountain-header-layer {
          background-image: url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80');
          opacity: 0.34;
        }

        .foreground-mountain-header {
          background-image: url('https://images.unsplash.com/photo-1464822759844-d150f39b8b26?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80');
          opacity: 0.28;
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: rgba(15, 15, 15, 0.84);
          z-index: 2;
        }

        .hero-content {
          position: relative;
          z-index: 3;
        }

        .badge-morph {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background-color: #0d6efd;
          color: #ffffff;
          border-radius: 999px;
          padding: 0.65rem 1rem;
          font-weight: 600;
          border: none;
        }

        .title-morph {
          color: #ffffff;
          letter-spacing: -0.03em;
        }

        .subtitle-morph {
          color: #c1c7d0;
        }

        .description-morph {
          color: #e9ecef;
          max-width: 720px;
          margin: 0 auto 1.5rem;
        }

        .location-morph {
          color: #adb5bd;
        }

        .button-primary {
          background-color: #0d6efd;
          border: none;
          color: #ffffff;
        }

        .button-primary:hover {
          background-color: #0b5ed7;
        }

        .button-secondary {
          color: #ffffff;
          border-color: rgba(255, 255, 255, 0.38);
          background-color: transparent;
        }

        .button-secondary:hover {
          background-color: rgba(255, 255, 255, 0.08);
          color: #ffffff;
        }

        .footer-section {
          position: relative;
          background: #090a0d;
          padding: 4rem 0;
          overflow: hidden;
        }

        .footer-overlay {
          position: absolute;
          inset: 0;
          background: rgba(9, 10, 13, 0.9);
          z-index: 1;
        }

        .sea-footer-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 45%;
          overflow: hidden;
          z-index: 1;
        }

        .sea-footer-layer {
          position: absolute;
          inset: 0;
          background-image: url('https://images.unsplash.com/photo-1505142468610-359e7d316be0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80');
          background-size: cover;
          background-position: center bottom;
          opacity: 0.28;
        }

        .footer-content {
          position: relative;
          z-index: 2;
        }

        .footer-title {
          color: #ffffff;
        }

        .footer-description {
          color: #c9d1d9;
        }

        .social-links {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
        }

        .social-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 50px;
          height: 50px;
          color: #adb5bd;
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 50%;
          transition: border-color 0.25s ease, color 0.25s ease;
        }

        .social-link:hover {
          color: #ffffff;
          border-color: rgba(255, 255, 255, 0.35);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
          transform: none;
        }

        .footer-divider {
          border-color: rgba(255, 255, 255, 0.12);
          width: 100px;
          margin: 2rem auto;
        }

        .footer-copyright {
          color: #a1a8b3;
        }

        .powered-by {
          color: #0d6efd;
        }

        .powered-by:hover {
          color: #0b5ed7 !important;
        }

        .card {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
          transition: box-shadow 0.25s ease;
        }

        .card:hover {
          box-shadow: 0 14px 36px rgba(0, 0, 0, 0.08);
        }

        @media (max-width: 768px) {
          .hero-section,
          .footer-section {
            min-height: auto;
            padding: 3rem 0;
          }

          .hero-section .display-4 {
            font-size: 2rem;
          }

          .hero-section .lead {
            font-size: 1rem;
          }

          .button-container {
            flex-direction: column;
          }

          .button-primary,
          .button-secondary {
            width: 100%;
          }

          .social-links {
            gap: 1rem;
          }

          .social-link {
            width: 44px;
            height: 44px;
          }

          .mountain-header-overlay,
          .sea-footer-overlay {
            display: none;
          }
        }

        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
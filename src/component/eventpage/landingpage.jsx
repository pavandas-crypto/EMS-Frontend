import React from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  // Event details
  const eventDetails = {
    title: "Tech Conference 2024",
    subtitle: "Shaping the Future of Technology",
    date: "2024-05-15T09:00:00",
    location: "Thane Small Scale Industries Association, Mumbai",
    description: "Join industry leaders, innovators, and tech enthusiasts for an immersive experience featuring cutting-edge technologies, networking opportunities, and transformative insights.",
    highlights: [
      { icon: "fas fa-microphone", title: "Keynote Speeches", desc: "Industry leaders sharing insights" },
      { icon: "fas fa-laptop", title: "Technical Workshops", desc: "Hands-on learning sessions" },
      { icon: "fas fa-handshake", title: "Networking", desc: "Connect with professionals" },
      { icon: "fas fa-lightbulb", title: "Innovations", desc: "Latest tech demonstrations" },
      { icon: "fas fa-graduation-cap", title: "Career Dev", desc: "Development workshops" },
      { icon: "fas fa-star", title: "Exclusive Access", desc: "Premium event features" }
    ]
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const handleBecomeMember = () => {
    window.open('https://tssia.org/become-a-member', '_blank');
  };

  return (
    <div className="landing-page" style={{ backgroundColor: '#0a0e27', color: '#ffffff' }}>
      {/* Navbar */}
      <nav className="navbar navbar-dark" style={{ backgroundColor: '#0f1835', boxShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
        <Container>
          <div className="navbar-brand d-flex align-items-center gap-2">
            <img src="/tssia-logo.svg" alt="TSSIA" height="40" />
            <div>
              <div style={{ fontSize: '18px', fontWeight: 'bold' }}>EMS</div>
              <div style={{ fontSize: '11px', color: '#888' }}>Event Management</div>
            </div>
          </div>
        </Container>
      </nav>

      {/* Hero Section - Compact */}
      <section style={{ 
        background: 'linear-gradient(135deg, #0f1835 0%, #1a1f3a 50%, #0a0e27 100%)',
        padding: '3rem 0',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(59, 130, 246, 0.2)'
      }}>
        {/* Animated background elements */}
        <div style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          top: '-100px',
          right: '-100px',
          animation: 'float 6s ease-in-out infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          width: '250px',
          height: '250px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          bottom: '-80px',
          left: '-80px',
          animation: 'float 8s ease-in-out infinite reverse'
        }}></div>

        <Container style={{ position: 'relative', zIndex: 2 }}>
          <Row className="align-items-center">
            <Col lg={7}>
              <div className="mb-4">
                <Badge 
                  bg="primary" 
                  className="mb-3" 
                  style={{ 
                    padding: '0.6rem 1.2rem',
                    fontSize: '12px',
                    borderRadius: '50px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <i className="fas fa-calendar"></i>
                  {new Date(eventDetails.date).toLocaleDateString('en-IN', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </Badge>
              </div>
              <h1 style={{ 
                fontSize: '2.8rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                lineHeight: 1.2
              }}>
                {eventDetails.title}
              </h1>
              <h2 style={{ 
                fontSize: '1.5rem',
                color: '#3b82f6',
                marginBottom: '1.5rem',
                fontWeight: '500'
              }}>
                {eventDetails.subtitle}
              </h2>
              <p style={{ fontSize: '1.05rem', color: '#d1d5db', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                {eventDetails.description}
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Button 
                  size="lg" 
                  className="px-4 py-2 fw-bold"
                  style={{ 
                    background: '#3b82f6',
                    border: 'none',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={handleRegister}
                >
                  <i className="fas fa-user-plus me-2"></i>
                  Register Now
                </Button>
                <Button 
                  size="lg"
                  className="px-4 py-2 fw-bold"
                  style={{ 
                    background: 'transparent',
                    border: '2px solid #3b82f6',
                    color: '#3b82f6',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={handleBecomeMember}
                >
                  <i className="fas fa-crown me-2"></i>
                  Become Member
                </Button>
              </div>
            </Col>
            <Col lg={5}>
              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: '12px',
                padding: '2rem',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📍</div>
                <h4 style={{ marginBottom: '0.5rem' }}>Event Location</h4>
                <p style={{ color: '#9ca3af', marginBottom: 0 }}>{eventDetails.location}</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* About Section - Cards */}
      <section style={{ padding: '4rem 0', background: '#0a0e27', borderBottom: '1px solid rgba(59, 130, 246, 0.1)' }}>
        <Container>
          <div className="text-center mb-5">
            <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Why Attend?</h2>
            <p style={{ color: '#9ca3af', fontSize: '1.05rem' }}>Discover what makes this event extraordinary</p>
          </div>
          
          <Row className="g-4">
            {eventDetails.highlights.map((highlight, index) => (
              <Col md={6} lg={4} key={index}>
                <Card 
                  className="h-100" 
                  style={{
                    background: 'linear-gradient(135deg, #1a1f3a 0%, #0f1835 100%)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.6)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(59, 130, 246, 0.15)';
                    e.currentTarget.style.transform = 'translateY(-5px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.2)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <Card.Body className="text-center">
                    <div style={{
                      width: '60px',
                      height: '60px',
                      background: 'rgba(59, 130, 246, 0.1)',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.5rem',
                      fontSize: '1.8rem',
                      color: '#3b82f6'
                    }}>
                      <i className={highlight.icon}></i>
                    </div>
                    <h5 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>{highlight.title}</h5>
                    <p style={{ color: '#9ca3af', marginBottom: 0, fontSize: '0.95rem' }}>{highlight.desc}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Venue Section with Dark Map */}
      <section style={{ padding: '4rem 0', background: 'linear-gradient(135deg, #1a1f3a 0%, #0f1835 100%)', borderBottom: '1px solid rgba(59, 130, 246, 0.1)' }}>
        <Container>
          <div className="text-center mb-5">
            <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Event Venue</h2>
            <p style={{ color: '#9ca3af', fontSize: '1.05rem' }}>Find us at the TSSIA Headquarters</p>
          </div>

          <Row className="g-4 align-items-center">
            <Col lg={6}>
              <Card style={{
                background: 'rgba(59, 130, 246, 0.05)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: '12px',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'relative',
                  width: '100%',
                  paddingBottom: '75%',
                  overflow: 'hidden'
                }}>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3768.0095167348104!2d72.95020817425797!3d19.194786682034362!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b905e58b6475%3A0xdd6ba8c1b8b48da7!2sThane%20Small%20Scale%20Industries%20Association!5e0!3m2!1sen!2sin!4v1777372559990!5m2!1sen!2sin"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      border: 'none',
                      borderRadius: '12px',
                      filter: 'invert(0.92) hue-rotate(200deg)'
                    }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="TSSIA Location"
                  ></iframe>
                </div>
              </Card>
            </Col>

            <Col lg={6}>
              <div style={{ paddingLeft: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>
                  <i className="fas fa-map-marker-alt me-2" style={{ color: '#3b82f6' }}></i>
                  Venue Details
                </h3>

                <Card 
                  style={{
                    background: 'rgba(59, 130, 246, 0.05)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    borderRadius: '10px',
                    marginBottom: '1.5rem',
                    padding: '1.5rem'
                  }}
                >
                  <h5 style={{ marginBottom: '1rem' }}>Thane Small Scale Industries Association</h5>
                  <p style={{ color: '#d1d5db', marginBottom: '1rem' }}>
                    <i className="fas fa-map-pin me-2" style={{ color: '#3b82f6' }}></i>
                    Thane, Mumbai, India
                  </p>
                  <p style={{ color: '#9ca3af', marginBottom: 0, lineHeight: 1.6 }}>
                    State-of-the-art venue with modern conference facilities, high-speed WiFi, comfortable seating, and complimentary refreshments.
                  </p>
                </Card>

                <Row className="g-3">
                  <Col md={6}>
                    <div style={{
                      background: 'rgba(59, 130, 246, 0.1)',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                      borderRadius: '10px',
                      padding: '1.5rem',
                      textAlign: 'center'
                    }}>
                      <i className="fas fa-parking" style={{ fontSize: '1.8rem', color: '#3b82f6', marginBottom: '0.5rem', display: 'block' }}></i>
                      <div style={{ fontSize: '0.95rem', color: '#d1d5db' }}>Free Parking</div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div style={{
                      background: 'rgba(59, 130, 246, 0.1)',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                      borderRadius: '10px',
                      padding: '1.5rem',
                      textAlign: 'center'
                    }}>
                      <i className="fas fa-wifi" style={{ fontSize: '1.8rem', color: '#3b82f6', marginBottom: '0.5rem', display: 'block' }}></i>
                      <div style={{ fontSize: '0.95rem', color: '#d1d5db' }}>High-Speed WiFi</div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '3rem 0', background: '#0a0e27', textAlign: 'center' }}>
        <Container>
          <h2 style={{ marginBottom: '2rem', fontSize: '2rem' }}>Ready to Join Us?</h2>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Button 
              size="lg"
              style={{ 
                background: '#3b82f6',
                border: 'none',
                padding: '0.75rem 2rem',
                fontSize: '1rem'
              }}
              onClick={handleRegister}
            >
              Register Now
            </Button>
            <Button 
              size="lg"
              style={{ 
                background: 'transparent',
                border: '2px solid #3b82f6',
                color: '#3b82f6',
                padding: '0.75rem 2rem',
                fontSize: '1rem'
              }}
              onClick={handleBecomeMember}
            >
              Learn More
            </Button>
          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer style={{ 
        background: '#0f1835',
        borderTop: '1px solid rgba(59, 130, 246, 0.1)',
        padding: '3rem 0',
        textAlign: 'center'
      }}>
        <Container>
          <div style={{ marginBottom: '2rem' }}>
            <img src="/tssia-logo.svg" alt="TSSIA" height="50" style={{ marginBottom: '1rem' }} />
            <h4>EMS - Event Management System</h4>
            <p style={{ color: '#9ca3af', marginBottom: '1rem' }}>Making event organization seamless and efficient</p>
          </div>

          <div className="mb-3">
            <a href="#" style={{ color: '#3b82f6', marginRight: '1rem', textDecoration: 'none' }}>
              <i className="fab fa-facebook"></i>
            </a>
            <a href="#" style={{ color: '#3b82f6', marginRight: '1rem', textDecoration: 'none' }}>
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" style={{ color: '#3b82f6', marginRight: '1rem', textDecoration: 'none' }}>
              <i className="fab fa-linkedin"></i>
            </a>
            <a href="#" style={{ color: '#3b82f6', textDecoration: 'none' }}>
              <i className="fab fa-instagram"></i>
            </a>
          </div>

          <hr style={{ borderColor: 'rgba(59, 130, 246, 0.1)', margin: '1.5rem 0' }} />
          <p style={{ color: '#6b7280', marginBottom: 0, fontSize: '0.9rem' }}>
            © 2024 EMS - Event Management System. All rights reserved. Powered by{' '}
            <a href="https://tssia.org" style={{ color: '#3b82f6', textDecoration: 'none' }}>TSSIA</a>
          </p>
        </Container>
      </footer>

      <style>{`
        .landing-page {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        button {
          transition: all 0.3s ease !important;
        }

        button:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3) !important;
        }

        .card {
          transition: all 0.3s ease !important;
        }

        @media (max-width: 768px) {
          h1 { font-size: 2rem !important; }
          h2 { font-size: 1.5rem !important; }
          .d-flex { flex-direction: column !important; }
          button { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;

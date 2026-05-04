import React from 'react';
import { Container } from 'react-bootstrap';

const EventSelection = ({ onEventSelect, onLogout }) => {
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
    <div className="bento-container">
      <Container>
        <div className="d-flex justify-content-between align-items-center bento-header">
          <div>
            <h1 className="bento-title">Select Event</h1>
            <p className="bento-subtitle">Choose an event to start verifying attendees</p>
          </div>
          <button onClick={onLogout} className="bento-btn-outline" style={{ padding: '0.5rem 1rem' }}>
            Logout
          </button>
        </div>

        <div className="bento-grid">
          {events.map((event, index) => (
            <div 
              key={event.id} 
              className={`bento-box bento-box-hover ${index % 2 === 0 ? 'black' : ''}`}
            >
              <div className="d-flex justify-content-between align-items-start mb-4">
                <div className={`status-badge ${event.status === 'active' ? 'active' : 'upcoming'} ${index % 2 === 0 && event.status !== 'active' ? 'bg-light text-dark' : ''}`}>
                  {event.status === 'active' ? 'Active Now' : 'Upcoming'}
                </div>
                <div className={index % 2 === 0 ? 'text-white-50' : 'text-muted'}>
                  <i className="fas fa-users me-2"></i>
                  {event.attendees}
                </div>
              </div>
              
              <h3 className="fw-bold mb-3" style={{ fontSize: '1.5rem', letterSpacing: '-0.02em' }}>
                {event.name}
              </h3>
              
              <p className={`mb-4 flex-grow-1 ${index % 2 === 0 ? 'text-white-50' : 'text-muted'}`}>
                {event.description}
              </p>
              
              <div className="mb-4">
                <div className="d-flex align-items-center mb-2">
                  <i className="fas fa-calendar-alt me-3" style={{ opacity: 0.7 }}></i>
                  <span className="fw-medium">
                    {new Date(event.date).toLocaleDateString('en-IN', {
                      month: 'short', day: 'numeric', year: 'numeric'
                    })}
                  </span>
                </div>
                <div className="d-flex align-items-center">
                  <i className="fas fa-map-marker-alt me-3" style={{ opacity: 0.7 }}></i>
                  <span className="fw-medium">{event.location}</span>
                </div>
              </div>
              
              <button 
                className={index % 2 === 0 ? 'bento-btn w-100 bg-white text-dark' : 'bento-btn w-100'}
                onClick={() => onEventSelect(event)}
              >
                Verify Attendees &rarr;
              </button>
            </div>
          ))}
          
          <div className="bento-box d-flex flex-column justify-content-center align-items-center text-center" style={{ border: '2px dashed #ddd', backgroundColor: 'transparent', boxShadow: 'none' }}>
            <div className="bg-white rounded-circle d-flex align-items-center justify-content-center mb-3" style={{ width: '64px', height: '64px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <i className="fas fa-plus fs-4"></i>
            </div>
            <h4 className="fw-bold mb-2">More Events</h4>
            <p className="text-muted small">New events will appear here when assigned to you.</p>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default EventSelection;
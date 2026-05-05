import React from 'react';
import './Verifier.css';

const events = [
  {
    id: 1,
    name: 'Tech Conference 2024',
    date: '15 May 2024',
    location: 'Convention Center, Mumbai',
    attendees: 250,
    status: 'active',
    description: 'Annual technology conference featuring industry leaders and innovative solutions.',
  },
  {
    id: 2,
    name: 'Music Festival',
    date: '20 Jun 2024',
    location: 'City Park, Delhi',
    attendees: 500,
    status: 'upcoming',
    description: 'Three-day music extravaganza with international and local artists.',
  },
  {
    id: 3,
    name: 'Workshop on AI',
    date: '10 Jul 2024',
    location: 'Tech Hub, Bangalore',
    attendees: 100,
    status: 'active',
    description: 'Hands-on workshop covering latest AI technologies and practical applications.',
  },
];

const EventSelection = ({ onEventSelect, onLogout }) => {
  return (
    <div className="v-page">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1rem' }}>
        {/* Page header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
          <div>
            <h1 className="v-heading">Events</h1>
            <p className="v-subheading">Select an event to start verifying attendees</p>
          </div>
          <button onClick={onLogout} className="v-btn--ghost">
            Sign out
          </button>
        </div>

        {/* 3-column card grid */}
        <div className="v-event-grid">
          {events.map(event => (
            <div key={event.id} className="v-card v-card--hover" onClick={() => onEventSelect(event)}>
              {/* Top row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <span className={`v-badge v-badge--${event.status === 'active' ? 'active' : 'upcoming'}`}>
                  {event.status === 'active' ? 'Active now' : 'Upcoming'}
                </span>
                <span className="v-chip">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  {event.attendees}
                </span>
              </div>

              {/* Title */}
              <h3 className="v-card__title">{event.name}</h3>

              {/* Description */}
              <p className="v-card__desc">{event.description}</p>

              {/* Meta */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div className="v-card__meta">
                  <i className="fas fa-calendar-alt"></i>
                  {event.date}
                </div>
                <div className="v-card__meta">
                  <i className="fas fa-map-marker-alt"></i>
                  {event.location}
                </div>
              </div>

              {/* CTA */}
              <button className="v-btn" onClick={e => { e.stopPropagation(); onEventSelect(event); }}>
                Verify Attendees →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventSelection;
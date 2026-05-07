import React from 'react';
import './Verifier.css';

const EventSelection = ({ events = [], onEventSelect, onLogout }) => {
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
          {events.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 2rem', background: '#f9f9f9', borderRadius: 16 }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#666' }}>No events assigned to you</div>
              <p style={{ color: '#999', marginTop: '0.5rem' }}>Please contact administrator to assign events.</p>
            </div>
          ) : (
            events.map(event => (
              <div key={event.event_id} className="v-card v-card--hover" onClick={() => onEventSelect({
                id: event.event_id,
                name: event.event_name,
                // Fallback details if they are not in assigned_events object
                date: event.start_date_time || 'Check calendar',
                location: event.address || 'Event Location',
                attendees: event.total_registrations || 0,
                status: 'active', 
                description: event.description || 'Event verification portal'
              })}>
                {/* Top row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <span className="v-badge v-badge--active">
                    Assigned
                  </span>
                  <span className="v-chip">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    {event.total_registrations || 0}
                  </span>
                </div>

                {/* Title */}
                <h3 className="v-card__title">{event.event_name}</h3>

                {/* Description */}
                <p className="v-card__desc">{event.description || 'Verification access granted for this event.'}</p>

                {/* Meta */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div className="v-card__meta">
                    <i className="fas fa-calendar-alt"></i>
                    {event.start_date_time ? new Date(event.start_date_time).toLocaleDateString() : 'N/A'}
                  </div>
                  <div className="v-card__meta">
                    <i className="fas fa-map-marker-alt"></i>
                    {event.address || 'Assigned location'}
                  </div>
                </div>

                {/* CTA */}
                <button className="v-btn" onClick={e => { 
                  e.stopPropagation(); 
                  onEventSelect({
                    id: event.event_id,
                    name: event.event_name,
                    date: event.start_date_time ? new Date(event.start_date_time).toLocaleDateString() : 'N/A',
                    location: event.address || 'Assigned location',
                    attendees: event.total_registrations || 0
                  }); 
                }}>
                  Verify Attendees →
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EventSelection;
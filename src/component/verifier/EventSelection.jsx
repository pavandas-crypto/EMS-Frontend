import React from 'react';
import './Verifier.css';

const EventSelection = ({ events = [], onEventSelect, onLogout, userRole, onRefresh }) => {
  const badgeLabel = userRole === 'admin' ? 'Event' : 'Assigned';
  const emptyMessage = userRole === 'admin'
    ? 'No events available to verify.'
    : 'No events assigned to you';
  const emptyHint = userRole === 'admin'
    ? 'Create events in the admin panel or refresh the page.'
    : 'Please contact administrator to assign events.';

  // Check if event is within 2 hours of start time
  const isVerificationEnabled = (eventDateTime) => {
    if (!eventDateTime) return false;
    const eventTime = new Date(eventDateTime).getTime();
    const currentTime = new Date().getTime();
    const twoHoursInMs = 2 * 60 * 60 * 1000;
    const timeUntilEvent = eventTime - currentTime;
    
    // Enable if event is within 2 hours from now (and hasn't started yet)
    return timeUntilEvent <= twoHoursInMs && timeUntilEvent > 0;
  };

  // Get time remaining until verification can start
  const getTimeUntilEnabled = (eventDateTime) => {
    if (!eventDateTime) return '';
    const eventTime = new Date(eventDateTime).getTime();
    const currentTime = new Date().getTime();
    const timeUntilEvent = eventTime - currentTime;
    
    if (timeUntilEvent <= 0) return 'Event has started';
    
    const hoursRemaining = Math.floor(timeUntilEvent / (60 * 60 * 1000));
    const minutesRemaining = Math.floor((timeUntilEvent % (60 * 60 * 1000)) / (60 * 1000));
    
    if (hoursRemaining > 0) {
      return `Enabled in ${hoursRemaining}h ${minutesRemaining}m`;
    }
    return `Enabled in ${minutesRemaining}m`;
  };

  // Check if event has ended
  const hasEventEnded = (event) => {
    const endTime = event.end_date_time || event.start_date_time;
    if (!endTime) return false;
    const endTimestamp = new Date(endTime).getTime();
    const currentTime = new Date().getTime();
    return endTimestamp < currentTime;
  };

  // Filter out ended events
  const upcomingEvents = events.filter(event => !hasEventEnded(event));

  return (
    <div className="v-page">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1rem' }}>
        {/* Page header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
          <div>
            <h1 className="v-heading">Events</h1>
            <p className="v-subheading">Select an event to start verifying attendees</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {onRefresh && userRole === 'verifier' && (
              <button 
                onClick={onRefresh} 
                className="v-btn--ghost"
                title="Refresh assigned events"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36M20.49 15a9 9 0 01-14.85 3.36"/>
                </svg>
                Refresh
              </button>
            )}
            <button onClick={onLogout} className="v-btn--ghost">
              Sign out
            </button>
          </div>
        </div>

        {/* 3-column card grid */}
        <div className="v-event-grid">
          {upcomingEvents.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 2rem', background: '#f9f9f9', borderRadius: 16 }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#666' }}>{emptyMessage}</div>
              <p style={{ color: '#999', marginTop: '0.5rem' }}>{emptyHint}</p>
            </div>
          ) : (
            upcomingEvents.map(event => {
              const eventId = event.event_id || event.id;
              const registrationCount = event.total_registrations ?? event.attendee_count ?? event.registration_count ?? 0;
              return (
                <div key={eventId} className="v-card v-card--hover" onClick={() => onEventSelect({
                  id: eventId,
                  name: event.event_name || event.name || 'Untitled Event',
                  date: event.start_date_time || event.startDate || 'Check calendar',
                  location: event.address || event.location || 'Event Location',
                  attendees: registrationCount,
                  status: 'active',
                  description: event.description || 'Event verification portal'
                })}>
                  {/* Top row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <span className="v-badge v-badge--active">
                      {badgeLabel}
                    </span>
                    <span className="v-chip">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                      {registrationCount}
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
                      <i className="fas fa-clock"></i>
                      {event.start_date_time ? new Date(event.start_date_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                    </div>
                    <div className="v-card__meta">
                      <i className="fas fa-map-marker-alt"></i>
                      {event.address || 'Assigned location'}
                    </div>
                  </div>

                  {/* CTA */}
                  <div>
                    <button 
                      className="v-btn" 
                      disabled={!isVerificationEnabled(event.start_date_time)}
                      onClick={e => {
                        e.stopPropagation();
                        if (isVerificationEnabled(event.start_date_time)) {
                          onEventSelect({
                            id: eventId,
                            name: event.event_name || event.name || 'Untitled Event',
                            date: event.start_date_time ? new Date(event.start_date_time).toLocaleDateString() : 'N/A',
                            location: event.address || event.location || 'Assigned location',
                            attendees: registrationCount
                          });
                        }
                      }}
                      style={{
                        opacity: isVerificationEnabled(event.start_date_time) ? 1 : 0.5,
                        cursor: isVerificationEnabled(event.start_date_time) ? 'pointer' : 'not-allowed'
                      }}
                    >
                      Verify Attendees →
                    </button>
                    {!isVerificationEnabled(event.start_date_time) && (
                      <p style={{
                        fontSize: '0.75rem',
                        color: '#ff9800',
                        marginTop: '0.5rem',
                        textAlign: 'center'
                      }}>
                        {getTimeUntilEnabled(event.start_date_time)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default EventSelection;
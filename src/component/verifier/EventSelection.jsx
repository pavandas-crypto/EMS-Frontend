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

  // Check if verification is allowed
  const isVerificationEnabled = (event) => {
    if (!event || !event.start_date_time) return false;
    
    const startTime = new Date(event.start_date_time).getTime();
    const endTimeRaw = event.end_date_time ? new Date(event.end_date_time) : new Date(startTime + (24 * 60 * 60 * 1000));
    
    // Allow until end of day
    const endOfDay = new Date(endTimeRaw);
    endOfDay.setHours(23, 59, 59, 999);
    const endTime = endOfDay.getTime();
    
    const currentTime = new Date().getTime();
    const twoHoursInMs = 2 * 60 * 60 * 1000;
    
    return (currentTime >= startTime - twoHoursInMs) && (currentTime <= endTime);
  };

  // Get status text for verification button
  const getVerificationStatus = (event) => {
    if (!event || !event.start_date_time) return { label: 'Verification Disabled', color: '#666' };
    
    const startTime = new Date(event.start_date_time).getTime();
    const endTime = event.end_date_time ? new Date(event.end_date_time).getTime() : startTime + (24 * 60 * 60 * 1000);
    const currentTime = new Date().getTime();
    const twoHoursInMs = 2 * 60 * 60 * 1000;

    if (currentTime < startTime - twoHoursInMs) {
      // Too early
      const timeUntil = startTime - currentTime;
      const hours = Math.floor(timeUntil / (3600000));
      const minutes = Math.floor((timeUntil % 3600000) / 60000);
      return { 
        label: hours > 0 ? `Starts in ${hours}h ${minutes}m` : `Starts in ${minutes}m`, 
        color: '#f59e0b',
        enabled: false
      };
    } else if (currentTime >= startTime && currentTime <= endTime) {
      // In progress
      return { label: 'Verify Attendees →', color: '#10b981', enabled: true };
    } else if (currentTime >= startTime - twoHoursInMs && currentTime < startTime) {
      // Within window but not started
      return { label: 'Start Early Verification →', color: '#3b82f6', enabled: true };
    } else {
      // Ended - but allow if same day
      const endOfDay = new Date(endTime);
      endOfDay.setHours(23, 59, 59, 999);
      
      if (currentTime <= endOfDay.getTime()) {
        return { label: 'Finalize Verification →', color: '#6366f1', enabled: true };
      }
      return { label: 'Event Ended', color: '#ef4444', enabled: false };
    }
  };

  // Sort events: In Progress first, then Upcoming
  const filteredAndSortedEvents = events
    .filter(event => {
      const endTime = event.end_date_time ? new Date(event.end_date_time).getTime() : new Date(event.start_date_time).getTime() + (24 * 60 * 60 * 1000);
      return new Date().getTime() <= endTime;
    })
    .sort((a, b) => {
      const now = new Date().getTime();
      const startA = new Date(a.start_date_time).getTime();
      const startB = new Date(b.start_date_time).getTime();
      
      // Check if in progress
      const inProgressA = now >= startA && (!a.end_date_time || now <= new Date(a.end_date_time).getTime());
      const inProgressB = now >= startB && (!b.end_date_time || now <= new Date(b.end_date_time).getTime());
      
      if (inProgressA && !inProgressB) return -1;
      if (!inProgressA && inProgressB) return 1;
      
      // Otherwise sort by start time descending
      return startB - startA;
    });

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
          {filteredAndSortedEvents.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 2rem', background: '#f9f9f9', borderRadius: 16 }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#666' }}>{emptyMessage}</div>
              <p style={{ color: '#999', marginTop: '0.5rem' }}>{emptyHint}</p>
            </div>
          ) : (
            filteredAndSortedEvents.map(event => {
              const eventId = event.event_id || event.id;
              const registrationCount = event.total_registrations ?? event.attendee_count ?? event.registration_count ?? 0;
              const status = getVerificationStatus(event);
              
              return (
                <div key={eventId} className="v-card v-card--hover" onClick={() => {
                  if (status.enabled) {
                    onEventSelect({
                      id: eventId,
                      name: event.event_name || event.name || 'Untitled Event',
                      date: event.start_date_time || event.startDate || 'Check calendar',
                      location: event.address || event.location || 'Event Location',
                      attendees: registrationCount,
                      status: 'active',
                      description: event.description || 'Event verification portal'
                    });
                  }
                }}>
                  {/* Top row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <span className={`v-badge ${status.enabled ? 'v-badge--active' : 'v-badge--inactive'}`}>
                      {status.enabled ? 'Available' : 'Restricted'}
                    </span>
                    <span className="v-chip">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                      {registrationCount}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="v-card__title" style={{ marginBottom: '1.5rem' }}>{event.event_name}</h3>

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
                      disabled={!status.enabled}
                      onClick={e => {
                        e.stopPropagation();
                        if (status.enabled) {
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
                        background: status.color,
                        opacity: status.enabled ? 1 : 0.6,
                        cursor: status.enabled ? 'pointer' : 'not-allowed',
                        border: 'none',
                        color: 'white'
                      }}
                    >
                      {status.label}
                    </button>
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
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./eventlanding.css";

function EventLandingPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch event data from localStorage or API
    const fetchEvent = () => {
      try {
        // Try to get from localStorage first (demo purpose)
        const events = JSON.parse(localStorage.getItem("events")) || [];
        const foundEvent = events.find((e) => e.id === eventId);

        if (foundEvent) {
          setEvent(foundEvent);
        } else {
          console.warn("Event not found");
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleRegister = () => {
    navigate(`/event/${eventId}/register`);
  };

  if (loading) {
    return (
      <div className="event-landing">
        <div className="loading-spinner">Loading event details...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="event-landing">
        <div className="error-message">Event not found</div>
      </div>
    );
  }

  // Format date and time
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric", 
      year: "numeric" 
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", { 
      hour: "2-digit", 
      minute: "2-digit",
      hour12: true 
    });
  };

  return (
    <div className="event-landing">
      {/* Hero Section */}
      <div className="event-hero" style={{
        backgroundImage: event.imageUrl 
          ? `linear-gradient(135deg, rgba(99, 102, 241, 0.8), rgba(79, 70, 229, 0.8)), url(${event.imageUrl})`
          : "linear-gradient(135deg, rgba(99, 102, 241, 0.9), rgba(79, 70, 229, 0.9))",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}>
        <div className="event-hero-content">
          <div className="event-tag">{event.category || "EVENT"}</div>
          <h1 className="event-title">{event.title}</h1>
          <p className="event-tagline">{event.description}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="event-container">
        {/* Event Details Grid */}
        <div className="event-details-section">
          <div className="event-details-grid">
            {/* Date & Time */}
            <div className="detail-card">
              <div className="detail-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <div className="detail-content">
                <div className="detail-label">DATE & TIME</div>
                <div className="detail-value">
                  {formatDate(event.startDate)}<br/>
                  {formatTime(event.startDate)} - {formatTime(event.endDate)}
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="detail-card">
              <div className="detail-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div className="detail-content">
                <div className="detail-label">LOCATION</div>
                <div className="detail-value">{event.location}</div>
              </div>
            </div>

            {/* Capacity */}
            {event.capacity && (
              <div className="detail-card">
                <div className="detail-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <div className="detail-content">
                  <div className="detail-label">CAPACITY</div>
                  <div className="detail-value">{event.capacity} Attendees</div>
                </div>
              </div>
            )}

            {/* Entry Fee */}
            {event.entryFee !== undefined && (
              <div className="detail-card">
                <div className="detail-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v12M9 9h6a2 2 0 0 1 0 4H9a2 2 0 0 0 0 4h6"/>
                  </svg>
                </div>
                <div className="detail-content">
                  <div className="detail-label">ENTRY FEE</div>
                  <div className="detail-value">
                    {event.entryFee === 0 ? "Free" : `$${event.entryFee}`}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Description & Location Section */}
        <div className="event-content-grid">
          {/* Left: Description & Details */}
          <div className="event-main-content">
            <div className="content-section">
              <h2 className="section-title">About this event</h2>
              <p className="section-text">{event.description}</p>
            </div>

            {/* Additional Details */}
            {event.additionalInfo && (
              <div className="content-section">
                <h2 className="section-title">Event Details</h2>
                <p className="section-text">{event.additionalInfo}</p>
              </div>
            )}
          </div>

          {/* Right: Location & Organizer */}
          <div className="event-sidebar">
            {/* Location Section */}
            <div className="sidebar-card">
              <h3 className="sidebar-title">Location</h3>
              <div className="location-map">
                <iframe
                  width="100%"
                  height="300"
                  frameBorder="0"
                  style={{ borderRadius: "8px" }}
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyDNRWR-uKwXGQQj_f9YhB_mMgbIlRFDFTE&q=${encodeURIComponent(event.location)}`}
                  allowFullScreen=""
                  loading="lazy"
                />
              </div>
              <div className="location-address">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <span>{event.location}</span>
              </div>
            </div>

            {/* Organizer Section */}
            {event.organizer && (
              <div className="sidebar-card">
                <h3 className="sidebar-title">Organizer</h3>
                <div className="organizer-info">
                  {event.organizer.image && (
                    <img src={event.organizer.image} alt={event.organizer.name} className="organizer-image"/>
                  )}
                  <div className="organizer-details">
                    <div className="organizer-name">{event.organizer.name}</div>
                    <div className="organizer-role">{event.organizer.role || "Event Organizer"}</div>
                    {event.organizer.email && (
                      <div className="organizer-contact">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"/>
                        </svg>
                        <a href={`mailto:${event.organizer.email}`}>{event.organizer.email}</a>
                      </div>
                    )}
                    {event.organizer.phone && (
                      <div className="organizer-contact">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                        </svg>
                        <a href={`tel:${event.organizer.phone}`}>{event.organizer.phone}</a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* CTA Button */}
            <button className="btn-register" onClick={handleRegister}>
              Register Now
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="event-footer-cta">
        <h2>Ready to attend?</h2>
        <button className="btn-register-large" onClick={handleRegister}>
          Register Now
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default EventLandingPage;

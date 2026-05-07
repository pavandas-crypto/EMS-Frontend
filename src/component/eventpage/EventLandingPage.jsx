import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";
import "./eventlanding.css";

function EventLandingPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.getEvent(eventId);
        if (response.success) {
          const eventData = response.data;
          setEvent({
            id: eventData.event_id,
            title: eventData.event_name,
            description: eventData.description,
            startDate: eventData.start_date_time,
            endDate: eventData.end_date_time,
            location: eventData.address,
            category: eventData.category || "FEATURED EVENT",
            imageUrl: eventData.image_url,
            capacity: eventData.capacity,
            entryFee: eventData.entry_fee,
            additionalInfo: eventData.additional_info,
            organizer: {
              name: eventData.organizer_name,
              email: eventData.organizer_email,
              phone: eventData.organizer_phone,
              role: eventData.organizer_role,
            }
          });
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
      <div className="event-landing-loading">
        <div className="loader"></div>
        <p>Loading Event Excellence...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="event-landing-error">
        <h1>404</h1>
        <p>The event you are looking for has vanished into the cosmos.</p>
        <button onClick={() => navigate("/")}>Go Home</button>
      </div>
    );
  }

  // Format date and time
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric"
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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="event-landing-wrapper">
      {/* Navigation Header */}
      <nav className="event-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="logo-text">
              <span className="logo-brand">TSSIA</span>
              <span className="logo-sub">Event Hub</span>
            </div>
          </div>

          <div className="nav-actions">
            <a
              href="https://tssia.org/become-a-member"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-btn-member"
              style={{ textDecoration: 'none' }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>Become a Member</span>
            </a>

            {/* Mobile-only membership icon */}
            <a
              href="https://tssia.org/become-a-member"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-member-icon-mobile"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Image Section */}
      <section className="event-hero-image">
        <img
          src={event.imageUrl || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"}
          alt={event.title}
        />
      </section>

      {/* Content Section */}
      <main className="event-main-container">
        <div className="event-header-info">
          <span className="event-category-tag">{event.category}</span>
          <h1 className="event-main-title">{event.title}</h1>
          <div className="title-underline"></div>
          <p className="event-main-description">{event.description}</p>
        </div>

        {/* Quick Details Grid */}
        <div className="event-quick-details">
          <div className="detail-box">
            <div className="detail-box-icon date-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div className="detail-box-content">
              <span className="detail-box-label">DATE & TIME</span>
              <span className="detail-box-value">{formatDate(event.startDate)}</span>
              <span className="detail-box-sub">{formatTime(event.startDate)} — {formatTime(event.endDate)}</span>
            </div>
          </div>

          <div className="detail-box">
            <div className="detail-box-icon location-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div className="detail-box-content">
              <span className="detail-box-label">LOCATION</span>
              <span className="detail-box-value">{event.location.split(',')[0]}</span>
              <span className="detail-box-sub">{event.location.split(',').slice(1).join(',')}</span>
            </div>
          </div>

          <div className="detail-box">
            <div className="detail-box-icon entry-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="6" width="20" height="12" rx="2" />
                <path d="M6 12h.01M18 12h.01" />
              </svg>
            </div>
            <div className="detail-box-content">
              <span className="detail-box-label">ENTRY</span>
              <span className="detail-box-value">{event.entryFee > 0 ? `₹${event.entryFee}` : "Free Entry"}</span>
            </div>
          </div>
        </div>

        {/* Primary CTA with Share */}
        <div className="event-cta-section">
          <button className="btn-register-primary" onClick={handleRegister}>
            Register Now
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
          <button className="btn-share-secondary" onClick={handleShare}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            Share Event
          </button>
        </div>

        {/* Info Grid (Guide & Organizer) */}
        <div className="event-info-grid">
          <div className="info-card">
            <div className="info-card-header">
              <div className="info-icon blue">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
              </div>
              <h3>EVENT GUIDE</h3>
            </div>
            <p>{event.additionalInfo || "Bring your ticket/confirmation for entry."}</p>
          </div>

          <div className="info-card">
            <div className="info-card-header">
              <div className="info-icon blue">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <h3>CONTACT ORGANIZER</h3>
            </div>
            <p>For any refund or ticket related issues you can contact {event.organizer.name || "the organizer"} at</p>
            <a href={`tel:${event.organizer.phone || "+919826000000"}`} className="contact-link">
              {event.organizer.phone || "+91-9826000000"}
            </a>
          </div>
        </div>

        {/* Map Section */}
        <section className="event-map-section">
          <div className="map-header">
            <div className="map-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <h3>LOCATION</h3>
          </div>
          <div className="map-wrapper">
            <iframe
              width="100%"
              height="450"
              style={{ border: 0 }}
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3768.0095167348104!2d72.95020817425801!3d19.194786682034362!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b905e58b6475%3A0xdd6ba8c1b8b48da7!2sThane%20Small%20Scale%20Industries%20Association!5e0!3m2!1sen!2sin!4v1778155940346!5m2!1sen!2sin"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="map-overlay-card">
              <h4>{event.location.split(',')[0]}</h4>
              <p>{event.location.split(',').slice(1).join(',')}</p>
              <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`} target="_blank" rel="noreferrer">View on Google Maps</a>
            </div>
          </div>
        </section>
      </main>

      {/* New Footer */}
      <footer className="event-footer">
        <div className="footer-container">
          <div className="footer-left">
            <div className="footer-logo">
              <div className="logo-icon footer-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <div className="logo-text">
                <span className="logo-brand">TSSIA</span>
                <span className="logo-sub">Event Hub</span>
              </div>
            </div>
          </div>

          <div className="footer-middle">
            <p className="footer-copyright">© 2024 TSSIA Event Hub.</p>
          </div>

          <div className="footer-right">
            <div className="footer-socials">
              <span className="social-label">Follow Us</span>
              <div className="social-icons">
                <a href="#" className="social-link" aria-label="Facebook">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                </a>
                <a href="#" className="social-link" aria-label="Instagram">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
                </a>
                <a href="#" className="social-link" aria-label="Twitter">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" /></svg>
                </a>
                <a href="#" className="social-link" aria-label="LinkedIn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
                </a>
              </div>
            </div>
            <div className="footer-divider"></div>
            <a
              href="https://tssia.org/become-a-member"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-btn-member"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Become a Member
            </a>
          </div>
        </div>
      </footer>

      {/* Sticky Mobile CTA */}
      <div className="mobile-sticky-cta">
        <button className="btn-register-sticky" onClick={handleRegister}>
          Register Now
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default EventLandingPage;

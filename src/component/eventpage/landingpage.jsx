import { useState, useEffect } from "react";
import "./landing.css";
import api from "../../api/api";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how" },
  { label: "Events", href: "#events" },
];

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: "Seamless Registration",
    desc: "Lightning-fast registration flow with real-time validation, instant confirmations, and beautiful ticket generation.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
        <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
    title: "Event Management",
    desc: "Powerful admin dashboard to create, edit, and monitor events with real-time participant analytics.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
    title: "Smart Verification",
    desc: "QR-code based check-in with offline support and instant sync when connectivity is restored.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
        <path d="M4 18v-8"/><path d="M10 18v-4"/><path d="M16 18v-10"/>
        <path d="M22 18v-6"/><path d="M2 18h20"/>
      </svg>
    ),
    title: "Analytics & Reports",
    desc: "Comprehensive reports on attendance, demographics, and event performance exported in multiple formats.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
        <path d="M2 9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v1a2 2 0 0 0 0 4v1a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1a2 2 0 0 0 0-4V9z"/>
      </svg>
    ),
    title: "Digital Tickets",
    desc: "Customizable, branded digital tickets with QR codes delivered directly to attendees via email.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
        <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
        <path d="M4.93 4.93a10 10 0 0 0 0 14.14"/>
      </svg>
    ),
    title: "Live Monitoring",
    desc: "Real-time dashboard showing live attendance counts, check-in velocity, and capacity alerts.",
  },
];

const STEPS = [
  { num: "01", title: "Create Your Event", desc: "Set up event details, capacity, date, and custom registration fields in minutes." },
  { num: "02", title: "Publish & Share", desc: "Share your event's registration link. Attendees register instantly from any device." },
  { num: "03", title: "Manage Attendees", desc: "Review registrations, approve participants, and send digital tickets automatically." },
  { num: "04", title: "Verify & Check-in", desc: "Scan QR codes at the door for instant verification. Zero queues, zero friction." },
];

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total_events: 0, total_registrations: 0, total_scans: 0, total_users: 0 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);

    const fetchData = async () => {
      try {
        const eventsRes = await api.getEvents(1, 3);
        if (eventsRes.success) {
          setEvents(eventsRes.data.map(ev => ({
            id: ev.event_id,
            tag: ev.event_for === "all" ? "Public" : "Members",
            date: new Date(ev.start_date_time).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            title: ev.event_name,
            venue: ev.address,
            slots: ev.max_capacity ? ev.max_capacity - (ev.registration_count || 0) : "Open"
          })));
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }

      try {
        // Stats might fail for public users if it requires admin auth
        const statsRes = await api.getStats();
        if (statsRes.success) {
          setStats(statsRes.data.summary);
        }
      } catch (error) {
        console.warn("Stats restricted or unavailable for public users");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="lp-root">
      {/* ── Navbar ── */}
      <header className={`lp-nav${scrolled ? " lp-nav--scrolled" : ""}`}>
        <div className="lp-nav__inner">
          <a href="/" className="lp-logo">
            <img 
              src="/images/tssia logo.png" 
              alt="TSSIA Logo" 
              style={{ height: '40px', width: 'auto' }} 
            />
          </a>

          <nav className={`lp-nav__links${menuOpen ? " open" : ""}`}>
            {NAV_LINKS.map(l => (
              <a key={l.label} href={l.href} className="lp-nav__link" onClick={() => setMenuOpen(false)}>{l.label}</a>
            ))}
          </nav>

          <div className="lp-nav__actions">
            <a
              href="https://tssia.org/contact-us"
              target="_blank"
              rel="noopener noreferrer"
              className="lp-nav__action-icon"
              title="Contact Us"
              style={{ marginRight: '15px', color: 'var(--lp-primary)', display: 'flex', alignItems: 'center' }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </a>
            <a href="/login" className="lp-btn lp-btn--ghost">Admin Login</a>
            <a href="/register" className="lp-btn lp-btn--primary">Register Now</a>
          </div>

          <button className="lp-hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
            <span /><span /><span />
          </button>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="lp-hero">
        <div className="lp-hero__bg-grid" aria-hidden />
        <div className="lp-hero__orb lp-hero__orb--1" aria-hidden />
        <div className="lp-hero__orb lp-hero__orb--2" aria-hidden />

        <div className="lp-hero__content">
          <div className="lp-hero__badge">
            <span className="lp-badge-dot" />
            Powered by TSSIA
          </div>
          <h1 className="lp-hero__title">
            Manage Events<br />
            <span className="lp-hero__title--accent">Without the Chaos</span>
          </h1>
          <p className="lp-hero__subtitle">
            End-to-end event management — from seamless registration to real-time verification — designed for modern organizers.
          </p>
          <div className="lp-hero__cta">
            <a href="/register" className="lp-btn lp-btn--primary lp-btn--lg">
              Get Started Free
              <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
            </a>
            <a href="https://tssia.org/become-a-member" target="_blank" rel="noreferrer" className="lp-btn lp-btn--outline lp-btn--lg">
              Become a Member
            </a>
          </div>
        </div>

        {/* Floating card mockup */}
        <div className="lp-hero__mockup" aria-hidden>
          <div className="lp-mockup-card">
            <div className="lp-mockup-card__header">
              <div className="lp-mockup-dot" style={{background:"#ef4444"}} />
              <div className="lp-mockup-dot" style={{background:"#f59e0b"}} />
              <div className="lp-mockup-dot" style={{background:"#22c55e"}} />
            </div>
            <div className="lp-mockup-card__body">
              <div className="lp-mockup-row"><div className="lp-mockup-pill" style={{width:"55%"}} /><div className="lp-mockup-badge lp-mockup-badge--green">Live</div></div>
              <div className="lp-mockup-row"><div className="lp-mockup-pill" style={{width:"38%",height:10,opacity:.5}} /></div>
              <div className="lp-mockup-divider" />
              <div className="lp-mockup-stat-row">
                <div className="lp-mockup-stat"><div className="lp-mockup-stat__val">247</div><div className="lp-mockup-stat__lbl">Registered</div></div>
                <div className="lp-mockup-stat"><div className="lp-mockup-stat__val">198</div><div className="lp-mockup-stat__lbl">Checked In</div></div>
                <div className="lp-mockup-stat"><div className="lp-mockup-stat__val">80%</div><div className="lp-mockup-stat__lbl">Capacity</div></div>
              </div>
              <div className="lp-mockup-progress"><div className="lp-mockup-progress__bar" style={{width:"80%"}} /></div>
              <div className="lp-mockup-row lp-mockup-row--gap">
                <div className="lp-mockup-chip" />
                <div className="lp-mockup-chip" style={{opacity:.6}} />
                <div className="lp-mockup-chip" style={{opacity:.4}} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="lp-stats">
        <div className="lp-container">
          <div className="lp-stats__grid">
            <div className="lp-stat">
              <div className="lp-stat__value">{stats.total_registrations.toLocaleString()}</div>
              <div className="lp-stat__label">Registered Attendees</div>
            </div>
            <div className="lp-stat">
              <div className="lp-stat__value">{stats.total_events.toLocaleString()}</div>
              <div className="lp-stat__label">Events Managed</div>
            </div>
            <div className="lp-stat">
              <div className="lp-stat__value">{stats.total_scans.toLocaleString()}</div>
              <div className="lp-stat__label">Total Check-ins</div>
            </div>
            <div className="lp-stat">
              <div className="lp-stat__value">{stats.total_users.toLocaleString()}</div>
              <div className="lp-stat__label">Verified Users</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="lp-section" id="features">
        <div className="lp-container">
          <div className="lp-section__header">
            <span className="lp-eyebrow">Everything you need</span>
            <h2 className="lp-section__title">Built for every stage of your event</h2>
            <p className="lp-section__sub">From the first registration to the final check-in, EMS keeps every workflow smooth and accountable.</p>
          </div>
          <div className="lp-features__grid">
            {FEATURES.map(f => (
              <div key={f.title} className="lp-feature-card">
                <div className="lp-feature-card__icon">{f.icon}</div>
                <h3 className="lp-feature-card__title">{f.title}</h3>
                <p className="lp-feature-card__desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="lp-section lp-section--dark" id="how">
        <div className="lp-container">
          <div className="lp-section__header">
            <span className="lp-eyebrow lp-eyebrow--light">Simple process</span>
            <h2 className="lp-section__title lp-section__title--light">From setup to success in 4 steps</h2>
          </div>
          <div className="lp-steps">
            {STEPS.map((s, i) => (
              <div key={s.num} className="lp-step">
                <div className="lp-step__num">{s.num}</div>
                {i < STEPS.length - 1 && <div className="lp-step__line" aria-hidden />}
                <h3 className="lp-step__title">{s.title}</h3>
                <p className="lp-step__desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Upcoming Events ── */}
      <section className="lp-section" id="events">
        <div className="lp-container">
          <div className="lp-section__header">
            <span className="lp-eyebrow">Live on EMS</span>
            <h2 className="lp-section__title">Upcoming events</h2>
          </div>
          <div className="lp-events__grid">
            {loading ? (
              <div className="lp-loading">Loading events...</div>
            ) : events.length > 0 ? (
              events.map(ev => (
                <div key={ev.id} className="lp-event-card">
                  <div className="lp-event-card__top">
                    <span className="lp-event-tag">{ev.tag}</span>
                    <span className="lp-event-date">
                      <svg viewBox="0 0 16 16" fill="currentColor" width="13" height="13" style={{marginRight:4,verticalAlign:"middle"}}><path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-5 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z"/><path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/></svg>
                      {ev.date}
                    </span>
                  </div>
                  <h3 className="lp-event-card__title">{ev.title}</h3>
                  <p className="lp-event-card__venue">
                    <svg viewBox="0 0 16 16" fill="currentColor" width="13" height="13" style={{marginRight:4,verticalAlign:"middle"}}><path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/></svg>
                    {ev.venue}
                  </p>
                  <div className="lp-event-card__footer">
                    <span className="lp-event-slots"><span className="lp-event-slots__dot" />{ev.slots} {ev.slots === 'Open' ? '' : 'slots left'}</span>
                    <a href={`/event/${ev.id}`} className="lp-btn lp-btn--sm lp-btn--primary">View Details</a>
                  </div>
                </div>
              ))
            ) : (
              <div className="lp-no-events">No upcoming events found.</div>
            )}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="lp-cta-banner">
        <div className="lp-cta-banner__orb" aria-hidden />
        <div className="lp-container lp-cta-banner__inner">
          <h2 className="lp-cta-banner__title">Ready to run your next event?</h2>
          <p className="lp-cta-banner__sub">Join thousands of organizers who trust EMS for seamless event experiences.</p>
          <div className="lp-cta-banner__actions">
            <a href="/register" className="lp-btn lp-btn--primary lp-btn--lg">Start for Free</a>
            <a href="/login" className="lp-btn lp-btn--outline-light lp-btn--lg">Admin Portal →</a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="lp-footer">
        <div className="lp-container lp-footer__inner">
          <div className="lp-footer__brand">
            <a href="/" className="lp-logo lp-logo--light">
              <img 
                src="/images/tssia logo.png" 
                alt="TSSIA Logo" 
                style={{ height: '50px', width: 'auto', filter: 'brightness(0) invert(1)' }} 
              />
            </a>
            <p className="lp-footer__tagline">Streamlining events from discovery to verification.</p>
          </div>
          <div className="lp-footer__links">
            <div className="lp-footer__col">
              <div className="lp-footer__col-title">Platform</div>
              <a href="#features" className="lp-footer__link">Features</a>
              <a href="#how" className="lp-footer__link">How it works</a>
              <a href="#events" className="lp-footer__link">Events</a>
            </div>
            <div className="lp-footer__col">
              <div className="lp-footer__col-title">Access</div>
              <a href="/register" className="lp-footer__link">Register</a>
              <a href="/login" className="lp-footer__link">Admin Login</a>
              <a href="/verifier" className="lp-footer__link">Verifier Portal</a>
            </div>
            <div className="lp-footer__col">
              <div className="lp-footer__col-title">Organization</div>
              <a href="https://tssia.org" target="_blank" rel="noreferrer" className="lp-footer__link">TSSIA</a>
              <a href="https://tssia.org/become-a-member" target="_blank" rel="noreferrer" className="lp-footer__link">Become a Member</a>
            </div>
          </div>
        </div>
        <div className="lp-footer__bottom">
          <div className="lp-container">© 2025 EMS · TSSIA. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}

function VerifierApp() {
  const events = [
    { title: "Leadership Summit", time: "Jun 3, 2025", location: "City Hall" },
    { title: "Community Training", time: "Jun 21, 2025", location: "Online" },
    { title: "Volunteer Orientation", time: "Jul 5, 2025", location: "Youth Center" },
  ];

  return (
    <div className="page-shell">
      <section className="section">
        <div className="card">
          <div className="card-header panel-header">
            <div>
              <p className="panel-label">Verifier portal</p>
              <h1 className="page-title">Ready to verify attendees</h1>
            </div>
            <a href="/" className="button button-outline button-sm">
              Back to site
            </a>
          </div>
          <div className="card-body">
            <p className="panel-copy">Select an event and follow the verification guidance. The flow is presented as design validation only.</p>

            <div className="section-grid columns-3" style={{ marginTop: "1.5rem" }}>
              {events.map((event) => (
                <div key={event.title} className="card" style={{ border: "1px solid rgba(15, 23, 42, 0.08)" }}>
                  <div className="card-body">
                    <h3 style={{ margin: 0 }}>{event.title}</h3>
                    <p className="card-copy" style={{ marginTop: "0.75rem" }}>
                      {event.time} · {event.location}
                    </p>
                    <div style={{ marginTop: "1rem" }}>
                      <a href="/verifier" className="button button-primary button-sm">
                        Select event
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default VerifierApp;

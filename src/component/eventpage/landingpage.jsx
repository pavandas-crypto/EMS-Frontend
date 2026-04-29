function LandingPage() {
  return (
    <div className="page-shell landing-shell">
      <header className="site-header">
        <div className="site-brand">
          <span className="brand-icon">EMS</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>Event Management System</div>
            <div className="form-note">Simplified frontend design and validation UI.</div>
          </div>
        </div>

        <div className="admin-tools">
          <a href="/register" className="button button-outline">
            Register
          </a>
          <a href="/login" className="button button-secondary">
            Admin login
          </a>
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="panel-label">Powered by TSSIA Design</p>
          <h1 className="hero-title">A clean event journey from discovery to verification.</h1>
          <p className="page-copy" style={{ color: "rgba(255,255,255,0.8)", marginTop: "1rem" }}>
            The EMS frontend is rebuilt around simple validation interactions, a consistent design system, and easy access to registration and admin workflows.
          </p>

          <div className="hero-cta">
            <a href="/register" className="button button-primary">
              Join event
            </a>
            <a href="https://tssia.org/become-a-member" target="_blank" rel="noreferrer" className="button button-outline">
              Become a member
            </a>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="section-grid columns-3">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Public registration</h2>
            </div>
            <div className="card-body">
              <p className="card-copy">A short registration flow validates email, phone, and event details without backend state dependencies.</p>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Admin dashboard</h2>
            </div>
            <div className="card-body">
              <p className="card-copy">A lightweight admin shell focuses on event and registration management with the design system in place.</p>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Verifier flow</h2>
            </div>
            <div className="card-body">
              <p className="card-copy">Verifier screens are simplified to event selection and validation instructions, removing extra workflow logic.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-grid columns-2">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Designed for clarity</h2>
            </div>
            <div className="card-body">
              <p className="card-copy">Typography, spacing, and components follow a single visual direction so every page feels consistent and easy to scan.</p>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Validation first</h2>
            </div>
            <div className="card-body">
              <p className="card-copy">Forms highlight required fields, data format checks, and success notifications while leaving actual backend actions out of scope.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;

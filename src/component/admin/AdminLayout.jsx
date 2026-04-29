import { Link, Outlet } from "react-router-dom";

function AdminLayout() {
  return (
<<<<<<< HEAD
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <nav
        className="bg-gradient text-white p-0 position-fixed"
        style={{
          width: sidebarOpen ? "280px" : "0",
          minWidth: sidebarOpen ? "280px" : "0",
          minHeight: "100vh",
          transition: "width 0.3s ease",
          zIndex: 1050,
          top: 0,
          left: 0,
          position: "fixed",
          background: "linear-gradient(180deg, #2c3e50 0%, #34495e 100%)",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {/* Sidebar Header */}
        <div className="p-3 border-bottom border-secondary">
          <div className="d-flex align-items-center gap-2 mb-3">
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                fontWeight: "bold",
              }}
            >
              ⚙️
            </div>
            <h5 className="mb-0 fw-bold">EMS Admin</h5>
          </div>

          {userEmail && (
            <div className="bg-dark p-2 rounded-2">
              <small className="text-muted d-block">Logged in as:</small>
              <strong className="text-truncate d-block">{userEmail}</strong>
            </div>
          )}
=======
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="brand">
          <div className="brand-icon">E</div>
          <div>
            <div style={{ fontWeight: 700 }}>EMS Admin</div>
            <p className="form-note">Design system dashboard</p>
          </div>

        </div>

        <div className="nav-label">Navigation</div>
        <ul className="nav-list">
          <li>
            <Link className="nav-link" to="dashboard">
              Dashboard
            </Link>
          </li>
          <li>
            <Link className="nav-link" to="events/create">
              Create event
            </Link>
          </li>
          <li>
            <Link className="nav-link" to="events/manage">
              Manage events
            </Link>
          </li>
          <li>
            <Link className="nav-link" to="registrations">
              Registrations
            </Link>
          </li>
          <li>
            <Link className="nav-link" to="tickets">
              Generate tickets
            </Link>
          </li>
          <li>
            <Link className="nav-link" to="verifiers">
              Verifiers
            </Link>
          </li>
        </ul>

        <div style={{ marginTop: "2rem" }}>
          <a href="/login" className="button button-outline button-sm" style={{ width: "100%" }}>
            Logout
          </a>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <p className="panel-label">Admin console</p>
            <h1 className="page-title">Event management</h1>
          </div>
          <div className="admin-tools">
            <a href="/" className="button button-outline button-sm">
              View public site
            </a>
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;

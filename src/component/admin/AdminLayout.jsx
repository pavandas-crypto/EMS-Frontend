import { Link, Outlet } from "react-router-dom";

function AdminLayout() {
  return (
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

import { Link, Outlet } from "react-router-dom";

function AdminLayout() {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar sticky-sidebar">
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
            <Link className="nav-link" to="events/manage">
              Events
            </Link>
          </li>
          <li>
            <Link className="nav-link" to="registrations">
              Participants
            </Link>
          </li>
          <li>
            <Link className="nav-link" to="verifiers">
              Verifiers
            </Link>
          </li>
          <li>
            <Link className="nav-link" to="tickets">
              Tickets
            </Link>
          </li>
          <li>
            <Link className="nav-link" to="reports">
              Reports
            </Link>
          </li>
        </ul>

        <div className="sidebar-footer">
          <a href="/login" className="button button-danger button-sm sidebar-logout">
            Logout
          </a>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;

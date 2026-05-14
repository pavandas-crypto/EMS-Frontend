import { Link, Outlet, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function AdminLayout() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRaw = localStorage.getItem("user");

    if (!token || !userRaw) {
      setChecking(false);
      return;
    }

    try {
      const user = JSON.parse(userRaw);
      if (user?.role === "admin") {
        setAuthorized(true);
      }
    } catch {
      // malformed user JSON
    }
    setChecking(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  useEffect(() => {
    // Close sidebar on route change
    closeMobileMenu();
  }, [navigate]);

  if (checking) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        justifyContent: "center", background: "#f8f9fa"
      }}>
        <div style={{ color: "#6b7280", fontSize: 14 }}>Verifying access…</div>
      </div>
    );
  }

  if (!authorized) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="admin-shell">
      {/* Mobile Top Bar */}
      <div className="mobile-nav-toggle">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="brand-icon" style={{ width: '32px', height: '32px', borderRadius: '8px' }}>E</div>
          <span style={{ fontWeight: 700, fontSize: '14px' }}>EMS Admin</span>
        </div>
        <button 
          onClick={toggleMobileMenu}
          className="button button-ghost button-sm"
          style={{ padding: '8px' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {mobileMenuOpen ? (
              <line x1="18" y1="6" x2="6" y2="18"></line>
            ) : (
              <>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Overlay */}
      <div 
        className={`sidebar-overlay ${mobileMenuOpen ? 'active' : ''}`} 
        onClick={closeMobileMenu}
      />

      <aside className={`admin-sidebar sticky-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="brand">
          <div className="brand-icon">EMS</div>
          <div>
            <div style={{ fontWeight: 700 }}>EMS Admin</div>
            <p className="form-note">Design system dashboard</p>
          </div>
        </div>

        <div className="nav-label">Navigation</div>
        <ul className="nav-list">
          <li>
            <Link className="nav-link" to="dashboard" onClick={closeMobileMenu}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link className="nav-link" to="registrations" onClick={closeMobileMenu}>
              Participants
            </Link>
          </li>
          <li>
            <Link className="nav-link" to="verifiers" onClick={closeMobileMenu}>
              Verifiers
            </Link>
          </li>
          <li>
            <Link className="nav-link" to="tickets" onClick={closeMobileMenu}>
              Tickets
            </Link>
          </li>

          <li>
            <Link className="nav-link" to="reports" onClick={closeMobileMenu}>
              Reports
            </Link>
          </li>
        </ul>


        <div className="sidebar-footer">
          <button onClick={handleLogout} className="button button-danger button-sm sidebar-logout">
            Logout
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;

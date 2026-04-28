import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userEmail, setUserEmail] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (email) {
      setUserEmail(email);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  const isActive = (path) => location.pathname.includes(path);

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <nav
        className="bg-gradient text-white p-0 position-fixed position-md-relative"
        style={{
          width: sidebarOpen ? "280px" : "0",
          minHeight: "100vh",
          transition: "width 0.3s ease",
          zIndex: 1050,
          background: "linear-gradient(180deg, #2c3e50 0%, #34495e 100%)",
          overflowY: "auto",
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
            <div className="bg-dark bg-opacity-50 p-2 rounded-2">
              <small className="text-muted d-block">Logged in as:</small>
              <strong className="text-truncate d-block">{userEmail}</strong>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <ul className="nav flex-column gap-1 p-3">
          <li className="nav-item">
            <Link
              to="/admin/dashboard"
              className={`nav-link px-3 py-2 rounded-2 transition ${
                isActive("dashboard") ? "bg-primary text-white" : "text-white-50 hover-link"
              }`}
              style={{ transition: "all 0.2s ease" }}
            >
              <i className="bi bi-house me-2"></i>Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/admin/events/create"
              className={`nav-link px-3 py-2 rounded-2 transition ${
                isActive("create") ? "bg-primary text-white" : "text-white-50 hover-link"
              }`}
            >
              <i className="bi bi-plus-circle me-2"></i>Create Event
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/admin/events/manage"
              className={`nav-link px-3 py-2 rounded-2 transition ${
                isActive("manage") ? "bg-primary text-white" : "text-white-50 hover-link"
              }`}
            >
              <i className="bi bi-calendar-event me-2"></i>Manage Events
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/admin/registrations"
              className={`nav-link px-3 py-2 rounded-2 transition ${
                isActive("registrations") ? "bg-primary text-white" : "text-white-50 hover-link"
              }`}
            >
              <i className="bi bi-person-check me-2"></i>Approve Registrations
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/admin/tickets"
              className={`nav-link px-3 py-2 rounded-2 transition ${
                isActive("tickets") ? "bg-primary text-white" : "text-white-50 hover-link"
              }`}
            >
              <i className="bi bi-ticket-perforated me-2"></i>Generate Tickets
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/admin/verifiers"
              className={`nav-link px-3 py-2 rounded-2 transition ${
                isActive("verifiers") ? "bg-primary text-white" : "text-white-50 hover-link"
              }`}
            >
              <i className="bi bi-shield-check me-2"></i>Manage Verifiers
            </Link>
          </li>
        </ul>

        {/* Sidebar Footer */}
        <div className="p-3 border-top border-secondary mt-auto">
          <button
            onClick={handleLogout}
            className="btn btn-outline-danger w-100 btn-sm"
          >
            <i className="bi bi-box-arrow-right me-2"></i>Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ flex: 1, marginLeft: sidebarOpen ? "0" : "-280px" }} className="w-100">
        {/* Top Header */}
        <header className="bg-white border-bottom shadow-sm sticky-top">
          <div className="container-fluid px-3 px-md-4 py-2">
            <div className="d-flex justify-content-between align-items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="btn btn-light d-md-none"
              >
                <i className="bi bi-list"></i>
              </button>
              <h6 className="mb-0 flex-grow-1 ms-2 ms-md-0">Event Management System</h6>
              <div className="dropdown">
                <button
                  className="btn btn-sm btn-outline-secondary dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                >
                  <i className="bi bi-person-circle me-1"></i>Profile
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <button
                      onClick={handleLogout}
                      className="dropdown-item text-danger"
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-3 p-md-4">
          <div className="container-fluid">
            <Outlet />
          </div>
        </main>
      </div>

      <style>{`
        .hover-link {
          transition: all 0.2s ease;
        }
        .hover-link:hover {
          background-color: rgba(255, 255, 255, 0.1) !important;
          transform: translateX(5px);
        }
        nav {
          box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
        }
        @media (max-width: 768px) {
          nav {
            box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
          }
        }
      `}</style>
    </div>
  );
}

export default AdminLayout;

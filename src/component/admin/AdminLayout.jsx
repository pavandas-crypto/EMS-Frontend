import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

function AdminLayout() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");

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

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <nav className="bg-dark text-white p-3" style={{ width: "250px", minHeight: "100vh" }}>
        <h4 className="mb-3">EMS Admin</h4>
        {userEmail && (
          <div className="mb-4">
            <small className="text-muted">Logged in as:</small>
            <br />
            <strong>{userEmail}</strong>
          </div>
        )}
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <Link to="/admin/dashboard" className="nav-link text-white">
              Dashboard
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/admin/events/create" className="nav-link text-white">
              Create Event
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/admin/events/manage" className="nav-link text-white">
              Manage Events
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/admin/registrations" className="nav-link text-white">
              Approve Participants
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/admin/tickets" className="nav-link text-white">
              Generate Tickets
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/admin/verifiers" className="nav-link text-white">
              Manage Verifiers
            </Link>
          </li>
        </ul>

        <div className="mt-5 pt-4 border-top">
          <button onClick={handleLogout} className="btn btn-outline-light w-100">
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ flex: 1 }} className="bg-light min-vh-100">
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;

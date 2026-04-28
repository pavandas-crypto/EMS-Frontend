import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Registrations() {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([
    {
      registration_id: 1,
      participant_name: "John Doe",
      email: "john@example.com",
      organization: "TechCorp",
      status: "pending",
      created_at: "2024-04-20",
    },
    {
      registration_id: 2,
      participant_name: "Jane Smith",
      email: "jane@example.com",
      organization: "InnovateLabs",
      status: "approved",
      created_at: "2024-04-18",
    },
  ]);

  const handleApprove = (registrationId) => {
    setRegistrations(
      registrations.map((reg) =>
        reg.registration_id === registrationId ? { ...reg, status: "approved" } : reg
      )
    );
  };

  const handleReject = (registrationId) => {
    setRegistrations(
      registrations.map((reg) =>
        reg.registration_id === registrationId ? { ...reg, status: "rejected" } : reg
      )
    );
  };

  const pendingCount = registrations.filter((r) => r.status === "pending").length;
  const approvedCount = registrations.filter((r) => r.status === "approved").length;

  return (
    <div>
      {/* Page Header */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <h1 className="h3 fw-bold mb-1">Approve Registrations</h1>
            <p className="text-muted">Review and approve participant registrations</p>
          </div>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="btn btn-outline-secondary"
          >
            <i className="bi bi-arrow-left me-2"></i>Back to Dashboard
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        <div className="col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm bg-warning bg-opacity-10">
            <div className="card-body p-3">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted small mb-1">Pending</p>
                  <h4 className="mb-0 fw-bold">{pendingCount}</h4>
                </div>
                <div style={{ fontSize: "24px" }}>⏳</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm bg-success bg-opacity-10">
            <div className="card-body p-3">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted small mb-1">Approved</p>
                  <h4 className="mb-0 fw-bold">{approvedCount}</h4>
                </div>
                <div style={{ fontSize: "24px" }}>✅</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Registrations Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-light border-0 py-3">
          <h5 className="mb-0 fw-bold">
            <i className="bi bi-person-lines-fill me-2 text-info"></i>All Registrations
          </h5>
        </div>
        <div className="card-body p-0">
          {registrations.length === 0 ? (
            <div className="alert alert-info m-3 mb-0">
              <i className="bi bi-info-circle me-2"></i>
              No registrations found.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="py-3 fw-bold">Name</th>
                    <th className="py-3 fw-bold">Email</th>
                    <th className="py-3 fw-bold">Organization</th>
                    <th className="py-3 fw-bold text-center">Status</th>
                    <th className="py-3 fw-bold">Date</th>
                    <th className="py-3 fw-bold text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((reg) => (
                    <tr key={reg.registration_id} className="align-middle">
                      <td>
                        <strong>{reg.participant_name}</strong>
                      </td>
                      <td>
                        <small className="text-muted">{reg.email}</small>
                      </td>
                      <td>
                        <small>{reg.organization}</small>
                      </td>
                      <td className="text-center">
                        <span
                          className={`badge ${
                            reg.status === "approved"
                              ? "bg-success"
                              : reg.status === "rejected"
                              ? "bg-danger"
                              : "bg-warning"
                          }`}
                        >
                          {reg.status.charAt(0).toUpperCase() + reg.status.slice(1)}
                        </span>
                      </td>
                      <td>
                        <small className="text-muted">{reg.created_at}</small>
                      </td>
                      <td>
                        <div className="d-flex justify-content-end gap-2">
                          {reg.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleApprove(reg.registration_id)}
                                className="btn btn-sm btn-success"
                                title="Approve"
                              >
                                <i className="bi bi-check-lg"></i>
                              </button>
                              <button
                                onClick={() => handleReject(reg.registration_id)}
                                className="btn btn-sm btn-danger"
                                title="Reject"
                              >
                                <i className="bi bi-x-lg"></i>
                              </button>
                            </>
                          )}
                          {reg.status !== "pending" && (
                            <span className="text-muted small">No actions</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .table tbody tr:hover {
          background-color: #f8f9fa;
        }
      `}</style>
    </div>
  );
}

export default Registrations;

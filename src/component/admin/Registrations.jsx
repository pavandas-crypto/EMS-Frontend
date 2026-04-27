import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Registrations() {
  const navigate = useNavigate();
  const [registrations] = useState([
    {
      registration_id: 1,
      participant_name: "John Doe",
      email: "john@example.com",
      organization: "TechCorp",
      status: "pending",
    },
    {
      registration_id: 2,
      participant_name: "Jane Smith",
      email: "jane@example.com",
      organization: "InnovateLabs",
      status: "approved",
    },
  ]);

  const handleApprove = (registrationId) => {
    console.log("Approved registration:", registrationId);
  };

  const handleReject = (registrationId) => {
    console.log("Rejected registration:", registrationId);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>Approve Participants</h1>
          <p className="text-muted">Review pending registrations and approve participants.</p>
        </div>
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="btn btn-secondary"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="card shadow">
        <div className="card-header bg-white border-bottom">
          <h5 className="mb-0">Registrations</h5>
        </div>
        <div className="card-body">
          {registrations.length === 0 ? (
            <div className="alert alert-info mb-0">No registrations found.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Participant Name</th>
                    <th>Email</th>
                    <th>Organization</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((reg) => (
                    <tr key={reg.registration_id}>
                      <td>{reg.participant_name}</td>
                      <td>{reg.email}</td>
                      <td>{reg.organization}</td>
                      <td>
                        <span
                          className={`badge ${
                            reg.status === "approved" ? "bg-success" : "bg-warning"
                          }`}
                        >
                          {reg.status.charAt(0).toUpperCase() + reg.status.slice(1)}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleApprove(reg.registration_id)}
                          className="btn btn-sm btn-success me-2"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(reg.registration_id)}
                          className="btn btn-sm btn-danger"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Registrations;

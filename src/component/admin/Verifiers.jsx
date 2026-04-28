import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Verifiers() {
  const navigate = useNavigate();
  const [verifiers] = useState([
    {
      verifier_id: 1,
      name: "Alice Johnson",
      email: "alice@example.com",
      event: "Tech Conference 2024",
    },
    {
      verifier_id: 2,
      name: "Bob Williams",
      email: "bob@example.com",
      event: "Networking Breakfast",
    },
  ]);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>Manage Verifiers</h1>
          <p className="text-muted">Create verifiers, assign them to events, and manage their access.</p>
        </div>
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="btn btn-secondary"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="row">
        <div className="col-lg-6 mb-4">
          <div className="card shadow">
            <div className="card-header bg-white border-bottom">
              <h5 className="mb-0">Create Verifier</h5>
            </div>
            <div className="card-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="verifier_name" className="form-label">
                    Name <span className="text-danger">*</span>
                  </label>
                  <input type="text" id="verifier_name" className="form-control" required />
                </div>

                <div className="mb-3">
                  <label htmlFor="verifier_email" className="form-label">
                    Email <span className="text-danger">*</span>
                  </label>
                  <input type="email" id="verifier_email" className="form-control" required />
                </div>

                <div className="mb-3">
                  <label htmlFor="verifier_password" className="form-label">
                    Password <span className="text-danger">*</span>
                  </label>
                  <input type="password" id="verifier_password" className="form-control" required />
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  Create Verifier
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-6 mb-4">
          <div className="card shadow">
            <div className="card-header bg-white border-bottom">
              <h5 className="mb-0">Existing Verifiers</h5>
            </div>
            <div className="card-body">
              {verifiers.length === 0 ? (
                <div className="alert alert-info mb-0">No verifiers created yet.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-sm table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Event</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {verifiers.map((verifier) => (
                        <tr key={verifier.verifier_id}>
                          <td>{verifier.name}</td>
                          <td>{verifier.email}</td>
                          <td>{verifier.event}</td>
                          <td>
                            <button className="btn btn-sm btn-danger">Delete</button>
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
      </div>
    </div>
  );
}

export default Verifiers;

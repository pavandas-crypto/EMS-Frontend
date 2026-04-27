import { useState } from "react";
import { Link } from "react-router-dom";

function AdminDashboard() {
  const [events] = useState([
    {
      event_id: 1,
      event_name: "Tech Conference 2024",
      start_date_time: "2024-05-15 09:00",
      end_date_time: "2024-05-15 17:00",
      total_registrations: 120,
    },
    {
      event_id: 2,
      event_name: "Networking Breakfast",
      start_date_time: "2024-06-10 08:00",
      end_date_time: "2024-06-10 10:00",
      total_registrations: 45,
    },
  ]);

  const [eventCount] = useState(events.length);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>Admin Dashboard</h1>
          <p className="text-muted">
            Manage events, registration forms, approvals, and ticket generation from one place.
          </p>
        </div>
      </div>

      {/* Action Cards */}
      <div className="row mb-4">
        <div className="col-md-6 col-lg-4 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">Create Event</h5>
              <p className="card-text text-muted">
                Create a new event with title, description, dates, location, image, and approval mode.
              </p>
              <Link to="/admin/events/create" className="btn btn-primary btn-sm">
                Create Event
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">Manage Registration Form</h5>
              <p className="card-text text-muted">
                Add custom questions and configure success/approval messaging for each event.
              </p>
              <Link to="/admin/events/manage" className="btn btn-primary btn-sm">
                Manage Form
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">Approve Participants</h5>
              <p className="card-text text-muted">
                Review pending registrations per event and approve participants before ticket generation.
              </p>
              <Link to="/admin/registrations" className="btn btn-primary btn-sm">
                Manage Registrations
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">Generate Tickets</h5>
              <p className="card-text text-muted">
                Choose a ticket template and bulk-generate tickets only for approved registrations.
              </p>
              <Link to="/admin/tickets" className="btn btn-primary btn-sm">
                Generate Tickets
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">Manage Verifiers</h5>
              <p className="card-text text-muted">
                Create verifiers, assign them to events, and manage their access permissions.
              </p>
              <Link to="/admin/verifiers" className="btn btn-primary btn-sm">
                Manage Verifiers
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Events Table */}
      <div className="card shadow-sm">
        <div className="card-header bg-white border-bottom">
          <h5 className="mb-0">Recent Events</h5>
          <small className="text-muted">Total events: <strong>{eventCount}</strong></small>
        </div>
        <div className="card-body">
          {events.length === 0 ? (
            <div className="alert alert-info mb-0">
              No events have been created yet. Use the Create Event button above.
            </div>
          ) : (
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Event Name</th>
                  <th>Start / End</th>
                  <th>Registrations</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.event_id}>
                    <td>{event.event_name}</td>
                    <td>
                      <small>
                        {new Date(event.start_date_time).toLocaleString()} <br />
                        to <br />
                        {new Date(event.end_date_time).toLocaleString()}
                      </small>
                    </td>
                    <td>{event.total_registrations}</td>
                    <td>
                      <div className="btn-group btn-group-sm" role="group">
                        <Link
                          to={`/admin/events/edit/${event.event_id}`}
                          className="btn btn-outline-secondary"
                        >
                          Edit
                        </Link>
                        <Link
                          to={`/admin/events/${event.event_id}/form`}
                          className="btn btn-outline-secondary"
                        >
                          Form
                        </Link>
                        <Link
                          to={`/admin/registrations?event_id=${event.event_id}`}
                          className="btn btn-outline-secondary"
                        >
                          Registrations
                        </Link>
                        <Link
                          to={`/admin/tickets?event_id=${event.event_id}`}
                          className="btn btn-outline-secondary"
                        >
                          Tickets
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

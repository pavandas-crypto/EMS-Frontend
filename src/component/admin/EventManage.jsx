import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function EventManage() {
  const navigate = useNavigate();
  const [events] = useState([
    {
      event_id: 1,
      event_name: "Tech Conference 2024",
      start_date_time: "2024-05-15 09:00",
      end_date_time: "2024-05-15 17:00",
      total_registrations: 120,
      status: "active",
    },
    {
      event_id: 2,
      event_name: "Networking Breakfast",
      start_date_time: "2024-06-10 08:00",
      end_date_time: "2024-06-10 10:00",
      total_registrations: 45,
      status: "pending",
    },
  ]);

  return (
    <div>
      {/* Page Header */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <h1 className="h3 fw-bold mb-1">Manage Events</h1>
            <p className="text-muted">View and manage all events</p>
          </div>
          <div className="d-flex gap-2">
            <Link to="/admin/events/create" className="btn btn-primary">
              <i className="bi bi-plus-circle me-2"></i>New Event
            </Link>
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="btn btn-outline-secondary"
            >
              <i className="bi bi-arrow-left me-2"></i>Back
            </button>
          </div>
        </div>
      </div>

      {/* Events Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-light border-0 py-3">
          <h5 className="mb-0 fw-bold">
            <i className="bi bi-list-check me-2 text-info"></i>All Events
          </h5>
        </div>
        <div className="card-body p-0">
          {events.length === 0 ? (
            <div className="alert alert-info m-3 mb-0">
              <i className="bi bi-info-circle me-2"></i>
              No events found. Create your first event to get started.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="py-3 fw-bold">Event Name</th>
                    <th className="py-3 fw-bold">Start Date</th>
                    <th className="py-3 fw-bold">End Date</th>
                    <th className="py-3 fw-bold text-center">Registrations</th>
                    <th className="py-3 fw-bold text-center">Status</th>
                    <th className="py-3 fw-bold text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr key={event.event_id} className="align-middle">
                      <td>
                        <strong>{event.event_name}</strong>
                      </td>
                      <td>
                        <small className="text-muted">
                          {new Date(event.start_date_time).toLocaleString()}
                        </small>
                      </td>
                      <td>
                        <small className="text-muted">
                          {new Date(event.end_date_time).toLocaleString()}
                        </small>
                      </td>
                      <td className="text-center">
                        <span className="badge bg-secondary">
                          <i className="bi bi-people me-1"></i>
                          {event.total_registrations}
                        </span>
                      </td>
                      <td className="text-center">
                        <span
                          className={`badge ${
                            event.status === "active" ? "bg-success" : "bg-warning"
                          }`}
                        >
                          <i className={`bi bi-${event.status === "active" ? "check-circle" : "clock"} me-1`}></i>
                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex justify-content-end gap-2">
                          <Link
                            to={`/admin/events/edit/${event.event_id}`}
                            className="btn btn-sm btn-outline-primary"
                            title="Edit Event"
                          >
                            <i className="bi bi-pencil-square"></i>
                          </Link>
                          <Link
                            to={`/admin/events/${event.event_id}/form`}
                            className="btn btn-sm btn-outline-info"
                            title="Manage Form"
                          >
                            <i className="bi bi-file-text"></i>
                          </Link>
                          <Link
                            to={`/admin/registrations?event_id=${event.event_id}`}
                            className="btn btn-sm btn-outline-success"
                            title="Registrations"
                          >
                            <i className="bi bi-person-check"></i>
                          </Link>
                          <Link
                            to={`/admin/tickets?event_id=${event.event_id}`}
                            className="btn btn-sm btn-outline-warning"
                            title="Generate Tickets"
                          >
                            <i className="bi bi-ticket-detailed"></i>
                          </Link>
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
        @media (max-width: 768px) {
          .table {
            font-size: 0.875rem;
          }
          .btn-sm {
            padding: 0.25rem 0.5rem;
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}

export default EventManage;

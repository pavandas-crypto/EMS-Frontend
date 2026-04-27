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
    },
    {
      event_id: 2,
      event_name: "Networking Breakfast",
      start_date_time: "2024-06-10 08:00",
      end_date_time: "2024-06-10 10:00",
      total_registrations: 45,
    },
  ]);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>Manage Events</h1>
          <p className="text-muted">View, edit, and manage all events.</p>
        </div>
        <div>
          <Link to="/admin/events/create" className="btn btn-primary me-2">
            Create New Event
          </Link>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="btn btn-secondary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      <div className="card shadow">
        <div className="card-header bg-white border-bottom">
          <h5 className="mb-0">All Events</h5>
        </div>
        <div className="card-body">
          {events.length === 0 ? (
            <div className="alert alert-info mb-0">
              No events have been created yet.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Event Name</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Registrations</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr key={event.event_id}>
                      <td>
                        <strong>{event.event_name}</strong>
                      </td>
                      <td>
                        <small>
                          {new Date(event.start_date_time).toLocaleString()}
                        </small>
                      </td>
                      <td>
                        <small>
                          {new Date(event.end_date_time).toLocaleString()}
                        </small>
                      </td>
                      <td>
                        <span className="badge bg-info">
                          {event.total_registrations}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm" role="group">
                          <Link
                            to={`/admin/events/edit/${event.event_id}`}
                            className="btn btn-outline-primary"
                          >
                            Edit
                          </Link>
                          <Link
                            to={`/admin/events/${event.event_id}/form`}
                            className="btn btn-outline-primary"
                          >
                            Form
                          </Link>
                          <Link
                            to={`/admin/registrations?event_id=${event.event_id}`}
                            className="btn btn-outline-primary"
                          >
                            Registrations
                          </Link>
                          <Link
                            to={`/admin/tickets?event_id=${event.event_id}`}
                            className="btn btn-outline-primary"
                          >
                            Tickets
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
    </div>
  );
}

export default EventManage;

import { Link } from "react-router-dom";

const events = [
  { name: "Leadership Summit", date: "June 3", venue: "City Hall", status: "active" },
  { name: "Community Training", date: "June 21", venue: "Online", status: "upcoming" },
  { name: "Volunteer Orientation", date: "July 5", venue: "Youth Center", status: "active" },
];

function EventManage() {
  return (
    <div className="page-shell">
      <section className="section">
        <div className="card">
          <div className="card-header">
            <h1 className="card-title">Manage events</h1>
            <p className="form-note" style={{ marginTop: "0.75rem" }}>
              Review event list and navigate to edit or form settings.
            </p>
          </div>
          <div className="card-body table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Event name</th>
                  <th>Date</th>
                  <th>Venue</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.name}>
                    <td>{event.name}</td>
                    <td>{event.date}</td>
                    <td>{event.venue}</td>
                    <td>
                      <span className={`badge ${event.status === "active" ? "success" : "info"}`}>{event.status}</span>
                    </td>
                    <td>
                      <Link to="/admin/events/edit/0" className="button button-outline button-sm" style={{ padding: "0.65rem 0.9rem" }}>
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

export default EventManage;

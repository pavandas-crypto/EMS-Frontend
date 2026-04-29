import { Link } from "react-router-dom";

const stats = [
  { title: "Live events", value: "8", label: "Current active programs" },
  { title: "Pending registrations", value: "24", label: "New sign-ups this week" },
  { title: "Verified attendees", value: "184", label: "Checked-in participants" },
  { title: "Saved drafts", value: "3", label: "Draft events awaiting review" },
];

const actions = [
  { title: "Create a new event", description: "Design and validate a new program in one place.", to: "events/create" },
  { title: "Review registrations", description: "Check new registrations and ensure data accuracy.", to: "registrations" },
  { title: "Prepare tickets", description: "Validate ticket generation settings and output.", to: "tickets" },
];

const recentEvents = [
  { name: "Leadership Bootcamp", date: "Apr 18", status: "active", attendees: "68" },
  { name: "Volunteer Meetup", date: "May 1", status: "coming soon", attendees: "42" },
  { name: "Capacity Building", date: "May 12", status: "active", attendees: "74" },
];

function AdminDashboard() {
  return (
    <div className="page-shell">
      <section className="section">
        <div className="section-grid columns-2" style={{ gap: "1.5rem" }}>
          {stats.map((item) => (
            <div key={item.title} className="card">
              <div className="card-body">
                <h2 className="card-title">{item.value}</h2>
                <p className="card-copy" style={{ marginTop: "0.75rem" }}>{item.title}</p>
                <p className="form-note" style={{ marginTop: "0.75rem" }}>{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section section-alt">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Quick actions</h2>
          </div>
          <div className="card-body section-grid columns-3">
            {actions.map((action) => (
              <div key={action.title} className="card" style={{ boxShadow: "none", border: "1px solid rgba(15, 23, 42, 0.08)" }}>
                <div className="card-body">
                  <h3 style={{ margin: 0, fontSize: "1.05rem" }}>{action.title}</h3>
                  <p className="card-copy" style={{ marginTop: "0.75rem" }}>{action.description}</p>
                  <Link to={`/admin/${action.to}`} className="button button-outline button-sm" style={{ marginTop: "1rem" }}>
                    Go there
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Recent events</h2>
          </div>
          <div className="card-body table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Date</th>
                  <th>Attendees</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentEvents.map((event) => (
                  <tr key={event.name}>
                    <td>{event.name}</td>
                    <td>{event.date}</td>
                    <td>{event.attendees}</td>
                    <td>
                      <span className={`badge ${event.status === "active" ? "success" : "warning"}`}>{event.status}</span>
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

export default AdminDashboard;

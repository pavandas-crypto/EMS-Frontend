const registrations = [
  { name: "Asha Patel", event: "Leadership Summit", status: "confirmed" },
  { name: "Rohan Sharma", event: "Community Training", status: "pending" },
  { name: "Nisha Verma", event: "Volunteer Orientation", status: "confirmed" },
];

function Registrations() {
  return (
    <div className="page-shell">
      <section className="section">
        <div className="card">
          <div className="card-header">
            <h1 className="card-title">Registrations</h1>
            <p className="form-note" style={{ marginTop: "0.75rem" }}>
              Registration information is displayed for review. No action handlers are attached.
            </p>
          </div>
          <div className="card-body table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Participant</th>
                  <th>Event</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((item) => (
                  <tr key={item.name + item.event}>
                    <td>{item.name}</td>
                    <td>{item.event}</td>
                    <td>
                      <span className={`badge ${item.status === "confirmed" ? "success" : "warning"}`}>{item.status}</span>
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

export default Registrations;

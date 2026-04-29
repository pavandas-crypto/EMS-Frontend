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

  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState("event_name");
  const [sortOrder, setSortOrder] = useState("asc");
  const rowsPerPage = 10;
  
  const sortedEvents = [...events].sort((a, b) => {
    let aValue = a[sortColumn];
    let bValue = b[sortColumn];
    
    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });
  
  const totalPages = Math.max(1, Math.ceil(sortedEvents.length / rowsPerPage));
  const recentEvents = sortedEvents.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };
  
  const getSortIcon = (column) => {
    if (sortColumn !== column) return "↕️";
    return sortOrder === "asc" ? "↑" : "↓";
  };

  const [eventCount] = useState(events.length);
  const totalRegistrations = events.reduce((sum, e) => sum + e.total_registrations, 0);

  const stats = [
    {
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 18v-8" />
          <path d="M10 18v-4" />
          <path d="M16 18v-10" />
          <path d="M22 18v-6" />
          <path d="M2 18h20" />
        </svg>
      ),
      label: "Total Events",
      value: eventCount,
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      label: "Total Reg",
      value: totalRegistrations,
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      ),
      label: "Approved",
      value: 85,
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2h12" />
          <path d="M6 22h12" />
          <path d="M8 2h8v6l-4 4-4-4V2z" />
          <path d="M16 16h-8v4h8v-4z" />
        </svg>
      ),
      label: "Pending",
      value: 60,
    },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="h3 fw-bold mb-2">Dashboard</h1>
        <p className="text-muted">Welcome to your Event Management System admin panel</p>
      </div>

      {/* Statistics Cards */}
      <div className="bw-stats-grid mb-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bw-stat-card">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start gap-3">
                <div>
                  <p className="text-uppercase text-muted small mb-2">{stat.label}</p>
                  <h3 className="mb-0 bw-stat-value">{stat.value}</h3>
                </div>
                <div className="bw-stat-icon">{stat.icon}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Events Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-bottom py-3">
          <div className="row align-items-center">
            <div className="col">
              <h5 className="mb-0 fw-bold">Recent Events</h5>
            </div>
            <div className="col-auto">
              <Link to="/admin/events/create" className="btn btn-sm btn-primary">
                <i className="bi bi-plus me-1"></i>New Event
              </Link>
            </div>
          </div>
        </div>
        <div className="card-body p-0">
          {events.length === 0 ? (
            <div className="alert alert-info mb-0 rounded-0">
              <i className="bi bi-info-circle me-2"></i>
              No events have been created yet. Create your first event to get started.
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="py-3" style={{ cursor: "pointer" }} onClick={() => handleSort("event_name")}>
                        Event Name <span style={{ opacity: 0.6 }}>{getSortIcon("event_name")}</span>
                      </th>
                      <th className="py-3" style={{ cursor: "pointer" }} onClick={() => handleSort("start_date_time")}>
                        Date & Time <span style={{ opacity: 0.6 }}>{getSortIcon("start_date_time")}</span>
                      </th>
                      <th className="py-3 text-center" style={{ cursor: "pointer" }} onClick={() => handleSort("total_registrations")}>
                        Registrations <span style={{ opacity: 0.6 }}>{getSortIcon("total_registrations")}</span>
                      </th>
                      <th className="py-3 text-center" style={{ cursor: "pointer" }} onClick={() => handleSort("status")}>
                        Status <span style={{ opacity: 0.6 }}>{getSortIcon("status")}</span>
                      </th>
                      <th className="py-3 text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedEvents.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-4 text-muted">No events to display</td>
                      </tr>
                    ) : (
                    recentEvents.map((event) => (
                      <tr key={event.event_id} className="align-middle">
                        <td className="fw-bold">{event.event_name}</td>
                        <td>
                          <small>
                            <strong>Start:</strong> {new Date(event.start_date_time).toLocaleString()}
                            <br />
                            <strong>End:</strong> {new Date(event.end_date_time).toLocaleString()}
                          </small>
                        </td>
                        <td className="text-center">
                          <span className="badge bg-secondary">{event.total_registrations}</span>
                        </td>
                        <td className="text-center">
                          <span
                            className={`badge bg-${event.status === "active" ? "success" : "warning"}`}
                          >
                            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                          </span>
                        </td>
                        <td className="text-end">
                          <div className="btn-group btn-group-sm" role="group">
                            <Link
                              to={`/admin/events/edit/${event.event_id}`}
                              className="btn btn-outline-primary"
                              title="Edit"
                            >
                              <i className="bi bi-pencil"></i>
                            </Link>
                            <Link
                              to={`/admin/events/${event.event_id}/form`}
                              className="btn btn-outline-info"
                              title="Form"
                            >
                              <i className="bi bi-file-text"></i>
                            </Link>
                            <Link
                              to={`/admin/registrations?event_id=${event.event_id}`}
                              className="btn btn-outline-success"
                              title="Registrations"
                            >
                              <i className="bi bi-people"></i>
                            </Link>
                            <Link
                              to={`/admin/tickets?event_id=${event.event_id}`}
                              className="btn btn-outline-warning"
                              title="Tickets"
                            >
                              <i className="bi bi-ticket"></i>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="d-flex align-items-center justify-content-between p-3 border-top">
                <div className="text-muted">
                  Showing {recentEvents.length} of {sortedEvents.length} events
                </div>
                <div className="btn-group" role="group">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    disabled={totalPages <= 1 || currentPage === 1}
                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    disabled={totalPages <= 1 || currentPage === totalPages}
                    onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        .hover-card {
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15) !important;
        }
        .table tbody tr:hover {
          background-color: #f8f9fa;
        }
      `}</style>
    </div>
  );
}

export default AdminDashboard;

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

  const [eventCount] = useState(events.length);
  const totalRegistrations = events.reduce((sum, e) => sum + e.total_registrations, 0);

  const stats = [
    {
      icon: "📊",
      label: "Total Events",
      value: eventCount,
      color: "primary",
      bg: "bg-primary bg-opacity-10",
    },
    {
      icon: "👥",
      label: "Total Registrations",
      value: totalRegistrations,
      color: "success",
      bg: "bg-success bg-opacity-10",
    },
    {
      icon: "✅",
      label: "Approved",
      value: 85,
      color: "info",
      bg: "bg-info bg-opacity-10",
    },
    {
      icon: "⏳",
      label: "Pending",
      value: 60,
      color: "warning",
      bg: "bg-warning bg-opacity-10",
    },
  ];

  const actionCards = [
    {
      title: "Create Event",
      description: "Create a new event with details, dates, location, and approval mode.",
      icon: "plus-circle",
      link: "/admin/events/create",
      color: "primary",
    },
    {
      title: "Manage Events",
      description: "View, edit, and manage all your events and their configurations.",
      icon: "calendar-event",
      link: "/admin/events/manage",
      color: "info",
    },
    {
      title: "Approve Registrations",
      description: "Review and approve participant registrations for events.",
      icon: "person-check",
      link: "/admin/registrations",
      color: "success",
    },
    {
      title: "Generate Tickets",
      description: "Create and bulk generate tickets for approved participants.",
      icon: "ticket-perforated",
      link: "/admin/tickets",
      color: "warning",
    },
    {
      title: "Manage Verifiers",
      description: "Create verifier accounts and assign them to events.",
      icon: "shield-check",
      link: "/admin/verifiers",
      color: "danger",
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
      <div className="row g-3 mb-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="col-6 col-md-3">
            <div className={`card border-0 shadow-sm ${stat.bg}`}>
              <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="text-muted small mb-1">{stat.label}</p>
                    <h3 className="mb-0 fw-bold text-dark">{stat.value}</h3>
                  </div>
                  <div style={{ fontSize: "28px" }}>{stat.icon}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Cards */}
      <div className="row g-3 mb-4">
        {actionCards.map((action, idx) => (
          <div key={idx} className="col-md-6 col-lg-4">
            <Link to={action.link} className="text-decoration-none">
              <div className="card border-0 shadow-sm h-100 hover-card">
                <div className={`card-header bg-${action.color} bg-opacity-10 border-0 py-3`}>
                  <i className={`bi bi-${action.icon} text-${action.color} me-2`}></i>
                  <strong className="text-dark">{action.title}</strong>
                </div>
                <div className="card-body">
                  <p className="card-text text-muted small mb-0">{action.description}</p>
                </div>
                <div className="card-footer bg-transparent border-top-0 py-2">
                  <span className={`text-${action.color} small fw-bold`}>
                    Go to {action.title} <i className="bi bi-arrow-right ms-1"></i>
                  </span>
                </div>
              </div>
            </Link>
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
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="py-3">Event Name</th>
                    <th className="py-3">Date & Time</th>
                    <th className="py-3 text-center">Registrations</th>
                    <th className="py-3 text-center">Status</th>
                    <th className="py-3 text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
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
                  ))}
                </tbody>
              </table>
            </div>
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

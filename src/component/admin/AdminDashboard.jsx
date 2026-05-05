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
  
  const SortIcon = ({ column }) => {
    const base = { width: 14, height: 14, display: "inline-block", verticalAlign: "middle", marginLeft: 4 };
    if (sortColumn !== column)
      return (
        <svg style={{ ...base, opacity: 0.35 }} viewBox="0 0 16 16" fill="currentColor">
          <path d="M3.5 2.5a.5.5 0 0 0-1 0v8.793L1.354 10.146a.5.5 0 1 0-.708.708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L3.5 11.293V2.5zm6.5 1a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zM10 8a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3A.5.5 0 0 1 10 8zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5z"/>
        </svg>
      );
    return sortOrder === "asc" ? (
      <svg style={{ ...base, opacity: 0.85 }} viewBox="0 0 16 16" fill="currentColor">
        <path fillRule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8 5.707 5.354 8.354a.5.5 0 1 1-.708-.708l3-3z"/>
      </svg>
    ) : (
      <svg style={{ ...base, opacity: 0.85 }} viewBox="0 0 16 16" fill="currentColor">
        <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
      </svg>
    );
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
      <div className="ems-table-card">
        <div className="ems-table-header">
          <h5 className="ems-table-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8, verticalAlign: "text-bottom" }}>
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Recent Events
          </h5>
          <Link to="/admin/events/create" className="ems-btn-new">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ marginRight: 6, verticalAlign: "middle" }}>
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Event
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="ems-empty-state">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#adb5bd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <p>No events yet. Create your first event to get started.</p>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="ems-table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort("event_name")} className="sortable">
                      Event Name <SortIcon column="event_name" />
                    </th>
                    <th onClick={() => handleSort("start_date_time")} className="sortable">
                      Date & Time <SortIcon column="start_date_time" />
                    </th>
                    <th onClick={() => handleSort("total_registrations")} className="sortable text-center">
                      Registrations <SortIcon column="total_registrations" />
                    </th>
                    <th onClick={() => handleSort("status")} className="sortable text-center">
                      Status <SortIcon column="status" />
                    </th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEvents.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-muted">No events to display</td>
                    </tr>
                  ) : (
                    recentEvents.map((event) => (
                      <tr key={event.event_id}>
                        <td>
                          <span className="ems-event-name">{event.event_name}</span>
                        </td>
                        <td>
                          <span className="ems-date-primary">
                            {new Date(event.start_date_time).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                          <span className="ems-date-secondary">
                            {new Date(event.start_date_time).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </td>
                        <td className="text-center">
                          <span className="ems-reg-badge">{event.total_registrations}</span>
                        </td>
                        <td className="text-center">
                          <span className={`ems-status-badge ems-status-${event.status}`}>
                            {event.status === "active" ? (
                              <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor" style={{ marginRight: 5 }}><circle cx="4" cy="4" r="4"/></svg>
                            ) : (
                              <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor" style={{ marginRight: 5 }}><circle cx="4" cy="4" r="4"/></svg>
                            )}
                            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                          </span>
                        </td>
                        <td className="text-end">
                          <div className="ems-action-group">
                            <Link to={`/admin/events/edit/${event.event_id}`} className="ems-action-btn" title="Edit event">
                              <i className="bi bi-pencil"></i>
                            </Link>
                            <Link to={`/admin/events/${event.event_id}/form`} className="ems-action-btn" title="Preview">
                              <i className="bi bi-eye"></i>
                            </Link>
                            <Link to={`/admin/registrations?event_id=${event.event_id}`} className="ems-action-btn" title="Registrations">
                              <i className="bi bi-people"></i>
                            </Link>
                            <Link to={`/admin/tickets?event_id=${event.event_id}`} className="ems-action-btn" title="Tickets">
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

            <div className="ems-table-footer">
              <span className="ems-count-label">
                {recentEvents.length} of {sortedEvents.length} events
              </span>
              <div className="ems-pagination">
                <button
                  className="ems-page-btn"
                  disabled={totalPages <= 1 || currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/></svg>
                  Prev
                </button>
                <span className="ems-page-num">{currentPage} / {totalPages}</span>
                <button
                  className="ems-page-btn"
                  disabled={totalPages <= 1 || currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/></svg>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <style>{`
        /* Table card */
        .ems-table-card {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.05);
          overflow: hidden;
        }
        .ems-table-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 24px;
          border-bottom: 1px solid #f0f0f0;
        }
        .ems-table-title {
          font-size: 15px;
          font-weight: 700;
          color: #1a202c;
          margin: 0;
        }
        .ems-btn-new {
          display: inline-flex;
          align-items: center;
          padding: 7px 14px;
          background: #2563eb;
          color: #fff;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          transition: background 0.15s;
        }
        .ems-btn-new:hover { background: #1d4ed8; color: #fff; }

        /* Table */
        .ems-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }
        .ems-table thead tr {
          background: #f8f9fb;
          border-bottom: 1px solid #eaecf0;
        }
        .ems-table th {
          padding: 11px 20px;
          font-size: 11.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #6b7280;
          white-space: nowrap;
          user-select: none;
        }
        .ems-table th.sortable { cursor: pointer; }
        .ems-table th.sortable:hover { color: #374151; }
        .ems-table td {
          padding: 14px 20px;
          border-bottom: 1px solid #f3f4f6;
          vertical-align: middle;
          color: #374151;
        }
        .ems-table tbody tr:last-child td { border-bottom: none; }
        .ems-table tbody tr:hover td { background: #f9fafb; }

        /* Cell content */
        .ems-event-name { font-weight: 600; color: #111827; }
        .ems-date-primary { display: block; font-weight: 500; color: #111827; }
        .ems-date-secondary { display: block; font-size: 12px; color: #9ca3af; margin-top: 1px; }
        .ems-reg-badge {
          display: inline-block;
          min-width: 36px;
          padding: 3px 10px;
          background: #eff6ff;
          color: #2563eb;
          border-radius: 20px;
          font-size: 12.5px;
          font-weight: 700;
          text-align: center;
        }
        .ems-status-badge {
          display: inline-flex;
          align-items: center;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }
        .ems-status-active { background: #dcfce7; color: #16a34a; }
        .ems-status-pending { background: #fef9c3; color: #b45309; }
        .ems-status-cancelled { background: #fee2e2; color: #dc2626; }

        /* Action buttons */
        .ems-action-group { display: inline-flex; gap: 4px; }
        .ems-action-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          border-radius: 7px;
          color: #6b7280;
          background: transparent;
          border: 1px solid #e5e7eb;
          text-decoration: none;
          font-size: 13px;
          transition: all 0.12s;
        }
        .ems-action-btn:hover { background: #f3f4f6; color: #111827; border-color: #d1d5db; }

        /* Footer */
        .ems-table-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 24px;
          border-top: 1px solid #f0f0f0;
          background: #fafafa;
        }
        .ems-count-label { font-size: 13px; color: #9ca3af; }
        .ems-pagination { display: flex; align-items: center; gap: 6px; }
        .ems-page-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 5px 12px;
          border: 1px solid #e5e7eb;
          border-radius: 7px;
          background: #fff;
          font-size: 13px;
          font-weight: 500;
          color: #374151;
          cursor: pointer;
          transition: all 0.12s;
        }
        .ems-page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .ems-page-btn:not(:disabled):hover { background: #f3f4f6; }
        .ems-page-num { font-size: 13px; color: #6b7280; padding: 0 4px; }

        /* Empty state */
        .ems-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 48px 24px;
          gap: 12px;
          color: #9ca3af;
          font-size: 14px;
        }
        .ems-empty-state p { margin: 0; }
      `}</style>
    </div>
  );
}

export default AdminDashboard;

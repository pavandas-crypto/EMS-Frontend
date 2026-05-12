import { useState, useEffect } from "react";
import api from "../../api/api";

// Icons
const Icon = {
  Download: (s = 20) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  Printer: (s = 20) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="6 9 6 2 18 2 18 9" />
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M6 18h.01" />
      <path d="M18 18h.01" />
    </svg>
  ),
  QR: (s = 20) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor">
      <rect x="3" y="3" width="7" height="7" fill="currentColor" />
      <rect x="14" y="3" width="7" height="7" fill="currentColor" />
      <rect x="3" y="14" width="7" height="7" fill="currentColor" />
      <rect x="14" y="14" width="2" height="2" fill="currentColor" />
    </svg>
  ),
  Eye: (s = 20) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Trash: (s = 20) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  ),
  Clock: (s = 20) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Mail: (s = 20) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
  Building: (s = 20) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="2" width="18" height="20" rx="2" />
      <line x1="9" y1="2" x2="9" y2="22" />
      <line x1="15" y1="2" x2="15" y2="22" />
      <line x1="3" y1="7" x2="21" y2="7" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="17" x2="21" y2="17" />
    </svg>
  ),
};

function TicketManagement() {
  const [tickets, setTickets] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      fetchTickets();
    }
  }, [selectedEvent, page]);

  const fetchEvents = async () => {
    try {
      const res = await api.getEvents(1, 100);
      if (res.success) setEvents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await api.getEventTickets(selectedEvent, page, pageSize);
      if (res.success) {
        setTickets(res.data);
        setTotal(res.pagination?.total || 0);
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", msg: "Failed to fetch tickets" });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (ticket) => {
    try {
      const res = await api.markTicketDownloaded(ticket.ticket_id);
      if (res.success) {
        setStatus({ type: "success", msg: "Ticket marked as downloaded" });
        fetchTickets();
        setTimeout(() => setStatus({ type: "", msg: "" }), 3000);
      }
    } catch (err) {
      setStatus({ type: "error", msg: err.message });
    }
  };

  const handlePrint = async (ticket) => {
    try {
      const res = await api.markTicketPrinted(ticket.ticket_id);
      if (res.success) {
        setStatus({ type: "success", msg: "Ticket marked as printed" });
        fetchTickets();
        setTimeout(() => setStatus({ type: "", msg: "" }), 3000);
      }
    } catch (err) {
      setStatus({ type: "error", msg: err.message });
    }
  };

  const handleDelete = async (ticketId) => {
    if (!window.confirm("Are you sure you want to delete this ticket?")) return;
    try {
      const res = await api.deleteTicket(ticketId);
      if (res.success) {
        setStatus({ type: "success", msg: "Ticket deleted successfully" });
        fetchTickets();
        setTimeout(() => setStatus({ type: "", msg: "" }), 3000);
      }
    } catch (err) {
      setStatus({ type: "error", msg: err.message });
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div style={{ height: "calc(100vh - 100px)", padding: "1rem", background: "#04060d", color: "#fff", display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>Ticket Management</h1>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <select
            value={selectedEvent}
            onChange={(e) => { setSelectedEvent(e.target.value); setPage(1); }}
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "12px",
              border: "1px solid #334155",
              background: "#0b1627",
              color: "#fff",
              fontSize: "0.95rem",
              cursor: "pointer"
            }}
          >
            <option value="">Select an event...</option>
            {events.map((e) => (
              <option key={e.event_id} value={e.event_id}>{e.event_name}</option>
            ))}
          </select>
          <span style={{ color: "#94a3b8", fontSize: "0.9rem" }}>Total: {total}</span>
        </div>
      </div>

      {/* Status Message */}
      {status.msg && (
        <div style={{
          padding: "1rem",
          borderRadius: "12px",
          background: status.type === "success" ? "#064e3b" : "#7f1d1d",
          color: "#fff",
          fontSize: "0.95rem"
        }}>
          {status.msg}
        </div>
      )}

      {/* Tickets List */}
      <div style={{ flex: 1, overflow: "auto", background: "#08101f", borderRadius: "16px", border: "1px solid #22314f", padding: "1rem" }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", color: "#94a3b8" }}>
            Loading tickets...
          </div>
        ) : tickets.length === 0 ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", color: "#94a3b8" }}>
            No tickets found. Approve participants to generate tickets.
          </div>
        ) : (
          <div style={{ display: "grid", gap: "0.75rem" }}>
            {tickets.map((ticket) => (
              <div
                key={ticket.ticket_id}
                style={{
                  background: "#0b1627",
                  border: "1px solid #1e293b",
                  borderRadius: "12px",
                  padding: "1rem",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr auto",
                  gap: "1rem",
                  alignItems: "center",
                  transition: "all 0.2s",
                  cursor: "pointer",
                  _hover: { borderColor: "#334155" }
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: "#fff", marginBottom: "0.25rem" }}>
                    {ticket.participant_name}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#94a3b8", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <Icon.Mail s={14} /> {ticket.participant_email}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "0.25rem" }}>Event</div>
                  <div style={{ fontWeight: 600, color: "#fff" }}>{ticket.event_name}</div>
                </div>

                <div>
                  <div style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "0.25rem" }}>Pass & Status</div>
                  <div style={{ fontWeight: 600, color: "#fff", display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                    <span style={{ background: "#1e293b", padding: "0.25rem 0.6rem", borderRadius: "6px", fontSize: "0.8rem" }}>
                      {ticket.pass_number}
                    </span>
                    {ticket.is_downloaded && (
                      <span style={{ background: "#065f46", color: "#86efac", padding: "0.25rem 0.6rem", borderRadius: "6px", fontSize: "0.8rem" }}>
                        ✓ Downloaded
                      </span>
                    )}
                    {ticket.is_printed && (
                      <span style={{ background: "#064e3b", color: "#67e8f9", padding: "0.25rem 0.6rem", borderRadius: "6px", fontSize: "0.8rem" }}>
                        ✓ Printed
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                  <button
                    onClick={() => { setSelectedTicket(ticket); setShowPreview(true); }}
                    title="Preview Ticket"
                    style={{
                      background: "transparent",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                      color: "#94a3b8",
                      padding: "0.6rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justify: "center",
                      transition: "all 0.2s"
                    }}
                  >
                    <Icon.Eye s={16} />
                  </button>
                  <button
                    onClick={() => handleDownload(ticket)}
                    title="Mark as Downloaded"
                    style={{
                      background: ticket.is_downloaded ? "#065f46" : "transparent",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                      color: ticket.is_downloaded ? "#86efac" : "#94a3b8",
                      padding: "0.6rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      transition: "all 0.2s"
                    }}
                  >
                    <Icon.Download s={16} />
                  </button>
                  <button
                    onClick={() => handlePrint(ticket)}
                    title="Mark as Printed"
                    style={{
                      background: ticket.is_printed ? "#064e3b" : "transparent",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                      color: ticket.is_printed ? "#67e8f9" : "#94a3b8",
                      padding: "0.6rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      transition: "all 0.2s"
                    }}
                  >
                    <Icon.Printer s={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(ticket.ticket_id)}
                    title="Delete Ticket"
                    style={{
                      background: "transparent",
                      border: "1px solid #7f1d1d",
                      borderRadius: "8px",
                      color: "#ef4444",
                      padding: "0.6rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      transition: "all 0.2s"
                    }}
                  >
                    <Icon.Trash s={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && tickets.length > 0 && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "1rem", borderTop: "1px solid #334155" }}>
          <div style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
            Page {page} of {totalPages} ({total} total)
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              style={{
                padding: "0.6rem 1rem",
                borderRadius: "8px",
                border: "1px solid #334155",
                background: "transparent",
                color: "#fff",
                cursor: page === 1 ? "not-allowed" : "pointer",
                opacity: page === 1 ? 0.5 : 1
              }}
            >
              Previous
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              style={{
                padding: "0.6rem 1rem",
                borderRadius: "8px",
                border: "1px solid #334155",
                background: "transparent",
                color: "#fff",
                cursor: page === totalPages ? "not-allowed" : "pointer",
                opacity: page === totalPages ? 0.5 : 1
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Ticket Preview Modal */}
      {showPreview && selectedTicket && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.8)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "#08101f",
            border: "1px solid #22314f",
            borderRadius: "16px",
            padding: "2rem",
            maxWidth: "500px",
            maxHeight: "80vh",
            overflow: "auto"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700 }}>Ticket Details</h2>
              <button
                onClick={() => setShowPreview(false)}
                style={{ background: "transparent", border: "none", color: "#94a3b8", fontSize: "1.5rem", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ padding: "1rem", background: "#0b1627", borderRadius: "12px" }}>
                <div style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "0.25rem" }}>Participant</div>
                <div style={{ fontWeight: 600, color: "#fff" }}>{selectedTicket.participant_name}</div>
                <div style={{ fontSize: "0.85rem", color: "#64748b" }}>{selectedTicket.participant_email}</div>
              </div>

              <div style={{ padding: "1rem", background: "#0b1627", borderRadius: "12px" }}>
                <div style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "0.25rem" }}>Event Details</div>
                <div style={{ fontWeight: 600, color: "#fff" }}>{selectedTicket.event_name}</div>
                <div style={{ fontSize: "0.85rem", color: "#64748b", display: "flex", gap: "0.5rem", marginTop: "0.25rem" }}>
                  <Icon.Clock s={14} /> {new Date(selectedTicket.event_date).toLocaleDateString()}
                </div>
                <div style={{ fontSize: "0.85rem", color: "#64748b", display: "flex", gap: "0.5rem" }}>
                  <Icon.Building s={14} /> {selectedTicket.event_location}
                </div>
              </div>

              <div style={{ padding: "1rem", background: "#0b1627", borderRadius: "12px" }}>
                <div style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "0.25rem" }}>Pass Information</div>
                <div style={{ fontWeight: 700, color: "#fff", marginBottom: "0.5rem" }}>{selectedTicket.pass_number}</div>
                <div style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Icon.QR s={16} /> QR Code:
                </div>
                <div style={{ background: "#f0f0f0", padding: "0.5rem", borderRadius: "8px", textAlign: "center" }}>
                  {selectedTicket.qr_code ? (
                    <img src={selectedTicket.qr_code} alt="QR Code" style={{ maxWidth: "150px" }} />
                  ) : (
                    <span style={{ color: "#64748b" }}>QR code pending generation...</span>
                  )}
                </div>
              </div>

              <div style={{ padding: "1rem", background: "#0b1627", borderRadius: "12px" }}>
                <div style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "0.5rem" }}>Additional Info</div>
                {selectedTicket.organization && (
                  <div style={{ fontSize: "0.9rem", color: "#fff", marginBottom: "0.25rem" }}>
                    <span style={{ color: "#94a3b8" }}>Organization:</span> {selectedTicket.organization}
                  </div>
                )}
                {selectedTicket.designation && (
                  <div style={{ fontSize: "0.9rem", color: "#fff", marginBottom: "0.25rem" }}>
                    <span style={{ color: "#94a3b8" }}>Designation:</span> {selectedTicket.designation}
                  </div>
                )}
              </div>
            </div>

            <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem" }}>
              <button
                onClick={() => setShowPreview(false)}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  borderRadius: "12px",
                  border: "1px solid #334155",
                  background: "transparent",
                  color: "#fff",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TicketManagement;

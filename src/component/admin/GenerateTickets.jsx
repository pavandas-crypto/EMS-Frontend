import { useState, useEffect } from "react";
import api from "../../api/api";
import { QRCodeSVG } from "qrcode.react";

function GenerateTickets() {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [loading, setLoading] = useState(true);
  const [regLoading, setRegLoading] = useState(false);
  const [error, setError] = useState("");
  const [eventError, setEventError] = useState("");

  // Validation
  const validateEventSelection = () => {
    if (!selectedEvent) {
      setEventError("Please select an event to view registrations.");
      return false;
    }
    setEventError("");
    return true;
  };

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await api.getEvents(1, 100);
        if (response.success) {
          setEvents(response.data);
        }
      } catch (err) {
        setError(err.message || "Failed to fetch events.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Fetch registrations for selected event
  const fetchRegistrations = async () => {
    if (!validateEventSelection()) return;
    try {
      setRegLoading(true);
      setError("");
      const response = await api.getEventRegistrations(selectedEvent, 1, 200);
      if (response.success) {
        setRegistrations(response.data);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch registrations.");
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif", paddingBottom: 48 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", margin: "0 0 4px", letterSpacing: "-0.025em" }}>
          Generate Tickets
        </h1>
        <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>
          Select an event to view and generate participant tickets
        </p>
      </div>

      {/* Event Selection */}
      <div style={{
        background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12,
        padding: 20, marginBottom: 20
      }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            <label style={{
              display: "block", fontSize: 12, fontWeight: 700,
              color: "#374151", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em"
            }}>
              Event
            </label>
            {loading ? (
              <div style={{ padding: "10px 14px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, color: "#94a3b8" }}>
                Loading events...
              </div>
            ) : (
              <select
                id="ticket-event-select"
                value={selectedEvent}
                onChange={e => { setSelectedEvent(e.target.value); setEventError(""); setRegistrations([]); }}
                style={{
                  width: "100%", padding: "10px 14px", border: `1px solid ${eventError ? "#ef4444" : "#e2e8f0"}`,
                  borderRadius: 8, fontSize: 13, color: "#0f172a", background: "#f8fafc",
                  outline: "none", cursor: "pointer"
                }}
              >
                <option value="">— Select an event —</option>
                {events.map(ev => (
                  <option key={ev.event_id} value={ev.event_id}>{ev.event_name}</option>
                ))}
              </select>
            )}
            {eventError && (
              <div style={{ color: "#ef4444", fontSize: 12, marginTop: 6 }}>{eventError}</div>
            )}
          </div>
          <button
            id="ticket-fetch-btn"
            onClick={fetchRegistrations}
            disabled={regLoading || loading}
            style={{
              padding: "10px 20px", background: "#0f172a", color: "#fff",
              border: "none", borderRadius: 8, fontWeight: 700, fontSize: 13,
              cursor: regLoading ? "not-allowed" : "pointer", marginTop: 28,
              opacity: regLoading ? 0.7 : 1, whiteSpace: "nowrap"
            }}
          >
            {regLoading ? "Loading..." : "Load Registrations"}
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div style={{
          background: "#fef2f2", border: "1px solid #fca5a5",
          color: "#dc2626", borderRadius: 10, padding: "12px 16px",
          fontSize: 13, marginBottom: 20
        }}>
          {error}
        </div>
      )}

      {/* Registrations Table */}
      {registrations.length > 0 && (
        <div style={{
          background: "#fff", border: "1px solid #e2e8f0",
          borderRadius: 12, overflow: "hidden"
        }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 20px", borderBottom: "1px solid #f1f5f9", background: "#fafafa"
          }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a" }}>
              Registrations
              <span style={{
                marginLeft: 8, background: "#0f172a", color: "#fff",
                fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 10
              }}>
                {registrations.length}
              </span>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
                  <th style={thStyle}>#</th>
                  <th style={thStyle}>Participant</th>
                  <th style={thStyle}>QR Code</th>
                  <th style={thStyle}>Pass ID</th>
                  <th style={thStyle}>Status</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((reg, idx) => (
                  <tr key={reg.registration_id} style={{ borderBottom: "1px solid #f8fafc" }}>
                    <td style={tdStyle}><span style={{ color: "#cbd5e1", fontWeight: 600 }}>{idx + 1}</span></td>
                    <td style={tdStyle}>
                      <div style={{ fontWeight: 600, color: "#0f172a", fontSize: 13 }}>{reg.participant_name}</div>
                      <div style={{ fontSize: 11.5, color: "#94a3b8", marginTop: 1 }}>{reg.participant_email}</div>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ background: "#fff", padding: 6, borderRadius: 6, display: "inline-block", border: "1px solid #e2e8f0" }}>
                        <QRCodeSVG
                          value={`PASS-${reg.registration_id}`}
                          size={60}
                          level="M"
                          includeMargin={false}
                        />
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <span style={{
                        fontFamily: "monospace", fontSize: 12, fontWeight: 700,
                        background: "#f1f5f9", padding: "4px 8px", borderRadius: 5, border: "1px solid #e2e8f0"
                      }}>
                        PASS-{reg.registration_id}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <span style={{
                        padding: "3px 10px", borderRadius: 20, fontSize: 11.5,
                        fontWeight: 600, whiteSpace: "nowrap",
                        ...(reg.status_name?.toLowerCase() === "approved"
                          ? { background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0" }
                          : reg.status_name?.toLowerCase() === "attended"
                          ? { background: "#fefce8", color: "#854d0e", border: "1px solid #fde68a" }
                          : { background: "#f8fafc", color: "#64748b", border: "1px solid #e2e8f0" })
                      }}>
                        {reg.status_name || "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!regLoading && registrations.length === 0 && selectedEvent && !error && (
        <div style={{
          textAlign: "center", padding: "52px 24px",
          background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12,
          color: "#94a3b8"
        }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🎫</div>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#475569" }}>No registrations found</div>
          <div style={{ fontSize: 12, marginTop: 4 }}>No participants have registered for this event yet.</div>
        </div>
      )}
    </div>
  );
}

const thStyle = {
  padding: "10px 16px", fontSize: 11, fontWeight: 700,
  textTransform: "uppercase", letterSpacing: "0.06em",
  color: "#94a3b8", textAlign: "left", whiteSpace: "nowrap"
};
const tdStyle = {
  padding: "13px 16px", verticalAlign: "middle", color: "#374151"
};

export default GenerateTickets;

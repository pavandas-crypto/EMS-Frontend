import { useState, useEffect, useRef } from "react";
import api from "../../api/api";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { TEMPLATES } from "./TicketDesigner";
import { QRCodeCanvas } from "qrcode.react";

const TicketRenderer = ({ config, ticket, ticketRef }) => {
  const getPos = (id) => config?.fieldPositions?.[id] || { x: 0, y: 0 };
  const getPosTransform = (id) => `translate(${getPos(id).x}px, ${getPos(id).y}px)`;
  
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", { day: '2-digit', month: 'short', year: 'numeric' });
  };
  const formatTime = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' });
  };

  const getInitials = (name) => {
    if (!name) return "??";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  return (
    <div 
      ref={ticketRef}
      style={{ 
        width: "350px", 
        height: "650px", 
        borderRadius: "0", 
        position: "relative", 
        overflow: "hidden",
        background: config?.backgroundType === "image" && config?.backgroundImage 
          ? `url(${config.backgroundImage}) center/cover no-repeat`
          : config?.backgroundType === "solid" 
            ? (config?.primary || "#111") 
            : `linear-gradient(${config?.gradientAngle || 0}deg, ${config?.gradientStart || "#000"}, ${config?.gradientEnd || "#111"})`,
        border: `2px solid ${(config?.accent || "#6366f1")}44`,
        fontFamily: "Inter, sans-serif",
        color: "#fff"
      }}
    >
      {/* Header: Event Name */}
      {(config?.selectedFields || []).includes("event_name") && (
      <div style={{ 
        position: "absolute", zIndex: 10, transform: getPosTransform("event_name"), width: 270, textAlign: "center", 
        fontSize: `${(config?.fieldStyles?.event_name?.size || 100) / 100 * 1.8}rem`, 
        fontWeight: 900, letterSpacing: "-1px",
        rotate: `${config?.fieldStyles?.event_name?.rotation || 0}deg`
      }}>
        {ticket.event_name}
      </div>
      )}

      {/* PASS Label */}
      {(config?.selectedFields || []).includes("ticket_id") && (
      <div style={{ 
        position: "absolute", zIndex: 10, transform: getPosTransform("pass_label"), width: 70, textAlign: "center", opacity: 0.6, 
        fontSize: `${(config?.fieldStyles?.pass_label?.size || 100) / 100 * 0.8}rem`, 
        fontWeight: 700, letterSpacing: "2px",
        rotate: `${config?.fieldStyles?.pass_label?.rotation || 0}deg`
      }}>
        PASS
      </div>
      )}

      {/* Avatar Circle */}
      {(config?.selectedFields || []).includes("user_icon") && (
      <div style={{ 
        position: "absolute", zIndex: 10, transform: getPosTransform("user_icon"), 
        width: 150 * ((config?.fieldStyles?.user_icon?.size || 100) / 100), 
        height: 150 * ((config?.fieldStyles?.user_icon?.size || 100) / 100), 
        borderRadius: "50%", border: "4px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.2)", 
        display: "flex", alignItems: "center", justifyContent: "center",
        rotate: `${config?.fieldStyles?.user_icon?.rotation || 0}deg`
      }}>
        <svg width="60" height="60" viewBox="0 0 24 24" fill="rgba(255,255,255,0.3)"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
      </div>
      )}

      {/* TSSIA Icon */}
      {(config?.selectedFields || []).includes("tssia_icon") && (
      <div style={{ 
        position: "absolute", zIndex: 10, transform: getPosTransform("tssia_icon") || "translate(135px, 340px)", 
        width: 80 * ((config?.fieldStyles?.tssia_icon?.size || 100) / 100), 
        height: 80 * ((config?.fieldStyles?.tssia_icon?.size || 100) / 100), 
        display: "flex", alignItems: "center", justifyContent: "center",
        rotate: `${config?.fieldStyles?.tssia_icon?.rotation || 0}deg`
      }}>
        <img src="/images/tssia logo.png" alt="TSSIA Logo" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
      </div>
      )}

      {/* Participant Details */}
      {(config?.selectedFields || []).includes("participant_name") && (
      <div style={{ 
        position: "absolute", zIndex: 10, transform: getPosTransform("participant_name"), width: 270, textAlign: "center", 
        fontSize: `${(config?.fieldStyles?.participant_name?.size || 100) / 100 * 1.4}rem`, 
        fontWeight: 800,
        rotate: `${config?.fieldStyles?.participant_name?.rotation || 0}deg`
      }}>
        {ticket.participant_name}
      </div>
      )}

      {(config?.selectedFields || []).includes("organization") && (
      <div style={{ 
        position: "absolute", zIndex: 10, transform: getPosTransform("organization"), width: 270, textAlign: "center", opacity: 0.7, 
        fontSize: `${(config?.fieldStyles?.organization?.size || 100) / 100 * 0.85}rem`, 
        fontWeight: 500,
        rotate: `${config?.fieldStyles?.organization?.rotation || 0}deg`
      }}>
        {ticket.designation || "Participant"} {ticket.organization ? `• ${ticket.organization}` : ""}
      </div>
      )}

      {/* Address & Date/Time Section */}
      {(config?.selectedFields || []).includes("event_location") && (
      <div style={{ 
        position: "absolute", zIndex: 10, transform: getPosTransform("event_location"), width: 270, textAlign: "left", 
        fontSize: `${(config?.fieldStyles?.event_location?.size || 100) / 100 * 0.85}rem`,
        rotate: `${config?.fieldStyles?.event_location?.rotation || 0}deg`
      }}>
        <div style={{ opacity: 0.5, fontSize: "0.7rem", marginBottom: "4px" }}>Event Address</div>
        {ticket.address || "TBA"}
      </div>
      )}

      {((config?.selectedFields || []).includes("event_date") || (config?.selectedFields || []).includes("event_time")) && (
      <div style={{ 
        position: "absolute", zIndex: 10, transform: getPosTransform("event_date"), width: 270, display: "flex", gap: "2rem",
        fontSize: `${(config?.fieldStyles?.event_date?.size || 100) / 100 * 1}em`,
        rotate: `${config?.fieldStyles?.event_date?.rotation || 0}deg`
      }}>
        {(config?.selectedFields || []).includes("event_date") && (
        <div>
          <div style={{ opacity: 0.5, fontSize: "0.7rem", marginBottom: "4px" }}>Date</div>
          <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>{formatDate(ticket.start_date_time)}</div>
        </div>
        )}
        {(config?.selectedFields || []).includes("event_time") && (
        <div style={{ borderLeft: "1px solid rgba(255,255,255,0.1)", paddingLeft: (config?.selectedFields || []).includes("event_date") ? "1.5rem" : "0" }}>
          <div style={{ opacity: 0.5, fontSize: "0.7rem", marginBottom: "4px" }}>Time</div>
          <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>{formatTime(ticket.start_date_time)}</div>
        </div>
        )}
      </div>
      )}

      {config?.customText?.sponsorText && (
      <div style={{ position: "absolute", zIndex: 10, transform: getPosTransform("sponsor_text") || "translate(100px, 340px)", width: 150, textAlign: "center", opacity: 0.8, fontSize: "0.85rem", fontWeight: 600 }}>
        {config.customText.sponsorText}
      </div>
      )}

      {config?.logo && (
      <div style={{ position: "absolute", zIndex: 10, transform: getPosTransform("sponsor_logo") || "translate(145px, 370px)", width: 60, height: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img src={config.logo} alt="Sponsor Logo" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
      </div>
      )}

      {/* Bottom Bar Background ONLY */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 160, background: "rgba(255,255,255,0.03)", borderTop: "1px solid rgba(255,255,255,0.05)" }} />

      {(config?.selectedFields || []).includes("ticket_id") && (
      <div style={{ position: "absolute", zIndex: 10, transform: getPosTransform("ticket_id") }}>
        <div style={{ 
          transform: `rotate(${(config?.fieldStyles?.ticket_id?.rotation || 0)}deg)`, 
          opacity: 0.3, 
          fontSize: `${(config?.fieldStyles?.ticket_id?.size || 100) / 100 * 0.8}rem`, 
          fontWeight: 700, whiteSpace: "nowrap" 
        }}>
          {ticket.pass_number}
        </div>
      </div>
      )}
      
      {(config?.selectedFields || []).includes("qr_code") && (
      <div style={{ position: "absolute", zIndex: 10, transform: getPosTransform("qr_code") }}>
        <div style={{ 
          transform: `rotate(${config?.fieldStyles?.qr_code?.rotation || 0}deg)`, 
          width: (config?.fieldStyles?.qr_code?.size || 84) + 16, 
          height: (config?.fieldStyles?.qr_code?.size || 84) + 16, 
          background: "#fff", padding: "8px", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center" 
        }}>
          <QRCodeCanvas value={ticket.qr_code || ticket.pass_number || ""} size={config?.fieldStyles?.qr_code?.size || 84} />
        </div>
      </div>
      )}
    </div>
  );
};

const TicketManagement = ({ onSwitchToDesigner, activeTab }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
  const [templates, setTemplates] = useState({});
  const [downloading, setDownloading] = useState(false);
  const ticketRefs = useRef({});

  useEffect(() => {
    fetchEvents();
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPagination(prev => ({ ...prev, page: 1 }));
      fetchTickets();
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchTickets();
  }, [selectedEventId, pagination.page, pageSize, sortConfig]);

  useEffect(() => {
    const fetchTemplates = async () => {
      const eventIds = [...new Set(tickets.map(t => t.event_id))];
      const newTemplates = { ...templates };
      let changed = false;
      for (let id of eventIds) {
        if (!newTemplates[id] && id) {
          try {
            const res = await api.getTicketTemplate(id);
            if (res.success && res.data) {
              newTemplates[id] = { 
                ...res.data.config, 
                customText: res.data.custom_text, 
                logo: res.data.logo 
              };
              changed = true;
            }
          } catch (e) {
            console.error("Failed to fetch template for event", id);
          }
        }
      }
      if (changed) setTemplates(newTemplates);
    };
    if (tickets.length > 0) fetchTemplates();
  }, [tickets]);

  const fetchEvents = async () => {
    try {
      const res = await api.getEvents(1, 100);
      if (res.success) setEvents(res.data || []);
    } catch (err) { console.error(err); }
  };

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const { key, direction } = sortConfig;
      const res = selectedEventId 
        ? await api.getEventTickets(selectedEventId, pagination.page, pageSize, key, direction, search)
        : await api.getAllTickets(pagination.page, pageSize, key, direction, search);
      
      if (res.success) {
        setTickets(res.data || []);
        setPagination(prev => ({ ...prev, totalPages: res.pagination?.totalPages || 1 }));
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const SortIcon = ({ column }) => {
    const isActive = sortConfig.key === column;
    const isAsc = sortConfig.direction === 'asc';
    
    return (
      <svg 
        width="12" height="12" viewBox="0 0 24 24" fill="none" 
        stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
        style={{ marginLeft: '8px', opacity: isActive ? 1 : 0.3, transition: 'all 0.2s', transform: (isActive && !isAsc) ? 'rotate(180deg)' : 'none' }}
      >
        <path d="M12 5v14M5 12l7-7 7 7"/>
      </svg>
    );
  };

  const handleDelete = async (ticketId) => {
    if (!window.confirm("Are you sure you want to delete this ticket?")) return;
    try {
      const res = await api.deleteTicket(ticketId);
      if (res.success) {
        setTickets(tickets.filter(t => t.ticket_id !== ticketId));
      }
    } catch (err) { console.error(err); }
  };

  const handleDownloadSingle = async (ticketId) => {
    setDownloading(true);
    try {
      const el = ticketRefs.current[ticketId];
      if (!el) throw new Error("Ticket element not found");
      const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: null });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [350, 650] });
      pdf.addImage(imgData, "PNG", 0, 0, 350, 650);
      
      const eventName = tickets.find(t => t.ticket_id === ticketId)?.event_name?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || "event";
      const participantName = tickets.find(t => t.ticket_id === ticketId)?.participant_name?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || "participant";
      const passNumber = tickets.find(t => t.ticket_id === ticketId)?.pass_number || "pass";
      pdf.save(`Ticket_${passNumber}_${participantName}.pdf`);
      
      // Update download status optionally
      await api.markTicketDownloaded(ticketId);
      setTickets(tickets.map(t => t.ticket_id === ticketId ? { ...t, is_downloaded: true } : t));
    } catch (err) {
      console.error("Download failed", err);
      alert("Failed to download ticket.");
    } finally {
      setDownloading(false);
    }
  };

  const handleBulkDownload = async () => {
    if (tickets.length === 0) return;
    setDownloading(true);
    try {
      const zip = new JSZip();
      for (let i = 0; i < tickets.length; i++) {
        const ticketId = tickets[i].ticket_id;
        const el = ticketRefs.current[ticketId];
        if (el) {
          const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: null });
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [350, 650] });
          pdf.addImage(imgData, "PNG", 0, 0, 350, 650);
          
          const participantName = tickets[i].participant_name?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || "participant";
          const passNumber = tickets[i].pass_number || "pass";
          
          zip.file(`Ticket_${passNumber}_${participantName}.pdf`, pdf.output('blob'));
        }
      }
      const eventName = events.find(e => e.event_id.toString() === selectedEventId)?.event_name?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || "all_events";
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `bulk_tickets_${eventName}.zip`);
      
      // Optionally update status for all
      for (let t of tickets) {
        if (!t.is_downloaded) {
            await api.markTicketDownloaded(t.ticket_id);
        }
      }
      fetchTickets();
    } catch (err) {
      console.error("Bulk download failed", err);
      alert("Failed to bulk download tickets.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", height: "100%", display: "flex", flexDirection: "column", background: "#181818", color: "#fff" }}>
      {/* Navigation Toggle */}
      <div style={{ 
        display: "flex", 
        background: "#1e1e1e", 
        padding: "4px", 
        borderRadius: "10px", 
        border: "1px solid #333",
        marginBottom: "2rem",
        width: "fit-content"
      }}>
        <button 
          onClick={onSwitchToDesigner}
          style={{ 
            padding: "8px 24px", borderRadius: "8px", border: "none", 
            background: activeTab === "designer" ? "#6366f1" : "transparent",
            color: activeTab === "designer" ? "#fff" : "#888",
            fontWeight: 700, fontSize: "0.85rem", cursor: "pointer"
          }}
        >
          Ticket Designer
        </button>
        <button 
          style={{ 
            padding: "8px 24px", borderRadius: "8px", border: "none", 
            background: activeTab === "management" ? "#6366f1" : "transparent",
            color: activeTab === "management" ? "#fff" : "#888",
            fontWeight: 700, fontSize: "0.85rem", cursor: "pointer"
          }}
        >
          Pass Management
        </button>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1.5rem" }}>
        <h2 style={{ fontWeight: 800, margin: 0 }}>Pass Management</h2>
        
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <div style={{ position: "relative" }}>
            <input 
              type="text" 
              placeholder="Search participant or event..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ 
                padding: "0.6rem 1rem 0.6rem 2.5rem", 
                borderRadius: "8px", 
                border: "1px solid #333", 
                background: "#121212", 
                color: "#fff", 
                width: "250px",
                outline: "none"
              }}
            />
            <svg style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", opacity: 0.5 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>

          <select 
            value={selectedEventId}
            onChange={(e) => { setSelectedEventId(e.target.value); setPagination({ ...pagination, page: 1 }); }}
            style={{ padding: "0.6rem 1rem", borderRadius: "8px", border: "1px solid #333", background: "#121212", color: "#fff", fontWeight: 600 }}
          >
            <option value="">All Events</option>
            {events.map(e => <option key={e.event_id} value={e.event_id}>{e.event_name}</option>)}
          </select>
          <button 
            onClick={() => fetchTickets()}
            style={{ padding: "0.6rem 1.25rem", borderRadius: "8px", background: "#333", color: "#fff", border: "none", fontWeight: 700, cursor: "pointer" }}
          >
            Refresh
          </button>
          <button 
            onClick={handleBulkDownload}
            disabled={downloading || tickets.length === 0}
            style={{ padding: "0.6rem 1.25rem", borderRadius: "8px", background: "#6366f1", color: "#fff", border: "none", fontWeight: 700, cursor: "pointer", opacity: (downloading || tickets.length === 0) ? 0.7 : 1 }}
          >
            {downloading ? "Processing..." : "Bulk Download PDF"}
          </button>
        </div>
      </div>

      <div style={{ background: "#121212", borderRadius: "16px", border: "1px solid #333", overflow: "hidden", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, overflowY: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "#1e1e1e", borderBottom: "1px solid #333" }}>
                <th 
                  onClick={() => handleSort('pass_number')}
                  style={{ padding: "1.25rem", color: "#888", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", cursor: 'pointer', userSelect: 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    Pass Number <SortIcon column="pass_number" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('participant_name')}
                  style={{ padding: "1.25rem", color: "#888", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", cursor: 'pointer', userSelect: 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    Participant <SortIcon column="participant_name" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('event_name')}
                  style={{ padding: "1.25rem", color: "#888", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", cursor: 'pointer', userSelect: 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    Event <SortIcon column="event_name" />
                  </div>
                </th>
                <th style={{ padding: "1.25rem", color: "#888", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" style={{ padding: "4rem", textAlign: "center", color: "#666" }}>Loading data...</td></tr>
              ) : tickets.length === 0 ? (
                <tr><td colSpan="5" style={{ padding: "4rem", textAlign: "center", color: "#666" }}>No tickets found</td></tr>
              ) : (
                tickets.map(ticket => (
                  <tr key={ticket.ticket_id} style={{ borderBottom: "1px solid #1e1e1e" }}>
                    <td style={{ padding: "1.25rem" }}>
                      <code style={{ color: "#6366f1", fontWeight: 700 }}>{ticket.pass_number}</code>
                    </td>
                    <td style={{ padding: "1.25rem" }}>
                      <div style={{ fontWeight: 700 }}>{ticket.participant_name}</div>
                      <div style={{ fontSize: "0.75rem", color: "#666" }}>{ticket.participant_email}</div>
                    </td>
                    <td style={{ padding: "1.25rem" }}>
                      <div style={{ fontSize: "0.85rem", opacity: 0.8 }}>{ticket.event_name}</div>
                    </td>
                    <td style={{ padding: "1.25rem", textAlign: "right" }}>
                      <button 
                        onClick={() => handleDownloadSingle(ticket.ticket_id)}
                        disabled={downloading}
                        style={{ border: "1px solid #333", background: "#1e1e1e", color: "#fff", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "0.75rem", fontWeight: 700, marginRight: "8px", opacity: downloading ? 0.5 : 1 }}
                      >
                        Download PDF
                      </button>
                      <button 
                        onClick={() => handleDelete(ticket.ticket_id)}
                        style={{ border: "none", background: "transparent", color: "#ef4444", padding: "6px 8px", cursor: "pointer", fontSize: "0.75rem", fontWeight: 700 }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ fontSize: "0.85rem", color: "#888" }}>Rows per page:</span>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {[10, 25, 50].map(size => (
              <button
                key={size}
                onClick={() => { setPageSize(size); setPagination({ ...pagination, page: 1 }); }}
                style={{
                  padding: "4px 10px", borderRadius: "6px", border: "1px solid #333",
                  background: pageSize === size ? "#6366f1" : "#121212",
                  color: "#fff", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer"
                }}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {pagination.totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem" }}>
            {Array.from({ length: pagination.totalPages }).map((_, i) => (
              <button 
                key={i}
                onClick={() => setPagination({ ...pagination, page: i + 1 })}
                style={{ 
                  width: "36px", height: "36px", borderRadius: "8px", border: "1px solid #333",
                  background: pagination.page === i + 1 ? "#6366f1" : "#121212",
                  color: "#fff",
                  fontWeight: 700, cursor: "pointer"
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Hidden Render Area for Tickets */}
      <div style={{ position: "absolute", top: "-9999px", left: "-9999px", zIndex: -1 }}>
        {tickets.map(ticket => (
          <TicketRenderer 
            key={ticket.ticket_id} 
            config={templates[ticket.event_id] || TEMPLATES.classic} 
            ticket={ticket} 
            ticketRef={(el) => ticketRefs.current[ticket.ticket_id] = el} 
          />
        ))}
      </div>
    </div>
  );
};

export default TicketManagement;

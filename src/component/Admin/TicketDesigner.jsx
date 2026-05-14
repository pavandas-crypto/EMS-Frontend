import { useState, useEffect, useRef, forwardRef } from "react";
import api from "../../api/api";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";
import Draggable from "react-draggable";
import { jsPDF } from "jspdf";

export const TEMPLATES = {
  classic: {
    name: "Classic",
    primary: "#111827",
    secondary: "#ffffff",
    accent: "#6366f1",
    font: "Inter, sans-serif",
    backgroundType: "solid",
    gradientStart: "#1e293b",
    gradientEnd: "#0f172a",
    gradientAngle: 150,
    selectedFields: ["event_name", "participant_name", "event_location", "event_date", "event_time", "qr_code", "organization", "designation"],
    fieldPositions: {
      event_name: { x: 40, y: 40 },
      pass_label: { x: 140, y: 110 },
      avatar: { x: 100, y: 150 },
      participant_name: { x: 40, y: 310 },
      org_desig: { x: 40, y: 345 },
      event_address: { x: 40, y: 410 },
      date_time: { x: 40, y: 460 },
      pass_code: { x: 20, y: 510 },
      qr_code: { x: 210, y: 510 }
    }
  },
  premium: {
    name: "Premium",
    primary: "#0f172a",
    secondary: "#f8fafc",
    accent: "#f59e0b",
    font: "Space Grotesk, sans-serif",
    backgroundType: "gradient",
    gradientStart: "#0f172a",
    gradientEnd: "#6366f1",
    gradientAngle: 140,
    selectedFields: ["event_name", "participant_name", "qr_code"],
    fieldPositions: {
      event_name: { x: 40, y: 40 },
      pass_label: { x: 140, y: 110 },
      avatar: { x: 100, y: 150 },
      participant_name: { x: 40, y: 310 },
      org_desig: { x: 40, y: 345 },
      event_address: { x: 40, y: 410 },
      date_time: { x: 40, y: 460 },
      pass_code: { x: 20, y: 510 },
      qr_code: { x: 210, y: 510 }
    }
  },
  modern: {
    name: "QR Modern",
    primary: "#ffffff",
    secondary: "#000000",
    accent: "#10b981",
    font: "Inter, sans-serif",
    backgroundType: "solid",
    selectedFields: ["event_name", "participant_name", "event_location", "event_date", "event_time", "qr_code", "pass_code"],
    fieldPositions: {
      event_name: { x: 20, y: 40 },
      date_time: { x: 20, y: 100 },
      event_address: { x: 20, y: 160 },
      participant_name: { x: 180, y: 160 },
      pass_code: { x: 180, y: 220 },
      qr_code: { x: 60, y: 300 }
    }
  }
};

const FIELD_OPTIONS = [
  { id: "event_name", label: "Event Name" },
  { id: "event_date", label: "Event Date" },
  { id: "event_time", label: "Event Time" },
  { id: "event_location", label: "Event Location" },
  { id: "event_description", label: "Event Description" },
  { id: "participant_name", label: "Participant Name" },
  { id: "organization", label: "Organization" },
  { id: "ticket_id", label: "Ticket ID" },
  { id: "qr_code", label: "QR Code" }
];

// Helper component to fix react-draggable React 19 findDOMNode issue
const DraggableItem = ({ children, position, onDrag, bounds, ...props }) => {
  const nodeRef = useRef(null);
  return (
    <Draggable 
      nodeRef={nodeRef} 
      position={position} 
      onDrag={onDrag} 
      bounds={bounds}
      {...props}
    >
      <div ref={nodeRef} style={{ position: "absolute", cursor: "move", zIndex: 10 }}>
        {children}
      </div>
    </Draggable>
  );
};

const TicketDesigner = () => {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [activeTemplate, setActiveTemplate] = useState("classic");
  const [customConfig, setCustomConfig] = useState(TEMPLATES.classic);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [sponsorText, setSponsorText] = useState("");
  const [sponsorLogo, setSponsorLogo] = useState(null);
  const [demoQrCode, setDemoQrCode] = useState("TSSIA-09832-20226");
  const ticketRef = useRef(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const res = await api.getEvents(1, 100);
        if (res && res.success) {
          setEvents(Array.isArray(res.data) ? res.data : []);
        }
      } catch (err) {
        console.error("Failed to load events:", err);
      }
    };
    loadEvents();
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      const loadTemplateAndData = async () => {
        try {
          const res = await api.getTicketTemplate(selectedEventId);
          if (res && res.success && res.data) {
            setCustomConfig(prev => ({ 
              ...prev, 
              ...res.data.config,
              fieldPositions: { ...(prev.fieldPositions || {}), ...(res.data.config.fieldPositions || {}) }
            }));
            setActiveTemplate(res.data.template_type || "custom");
            if (res.data.custom_text?.sponsorText) setSponsorText(res.data.custom_text.sponsorText);
            else setSponsorText("");
            if (res.data.logo) setSponsorLogo(res.data.logo);
            else setSponsorLogo(null);
          }

          const ticketsRes = await api.getEventTickets(selectedEventId, 1, 1);
          if (ticketsRes?.success && ticketsRes.data?.length > 0) {
            const t = ticketsRes.data[0];
            setDemoQrCode(t.qr_code || JSON.stringify({ pass_number: t.pass_number, ticket_id: t.ticket_id }));
          } else {
            setDemoQrCode("TSSIA-09832-20226");
          }
        } catch (err) {
          console.error("Failed to load template or data:", err);
        }
      };
      loadTemplateAndData();
    } else {
      setDemoQrCode("TSSIA-09832-20226");
    }
  }, [selectedEventId]);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setSponsorLogo(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handlePositionChange = (fieldId, x, y) => {
    setCustomConfig(prev => ({
      ...prev,
      fieldPositions: {
        ...(prev.fieldPositions || {}),
        [fieldId]: { x, y }
      }
    }));
  };

  const handleSave = async () => {
    if (!selectedEventId) {
      setStatus({ type: "error", msg: "Please select an event." });
      return;
    }
    setSaving(true);
    try {
      await api.saveTicketTemplate({
        event_id: selectedEventId,
        template_type: activeTemplate,
        config: customConfig,
        customText: { sponsorText },
        logo: sponsorLogo
      });
      setStatus({ type: "success", msg: "Template saved!" });
    } catch (err) {
      setStatus({ type: "error", msg: "Failed to save." });
    } finally {
      setSaving(false);
      setTimeout(() => setStatus({ type: "", msg: "" }), 3000);
    }
  };

  const handleDownload = async () => {
    if (!ticketRef.current) return;
    try {
      const canvas = await html2canvas(ticketRef.current, { scale: 2, useCORS: true, backgroundColor: null });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width / 2, canvas.height / 2]
      });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
      
      const eventName = selectedEvent?.event_name ? selectedEvent.event_name.replace(/[^a-z0-9]/gi, '_').toLowerCase() : "design";
      pdf.save(`${eventName}_template.pdf`);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  const selectedEvent = (events || []).find(e => e.event_id?.toString() === selectedEventId?.toString());
  
  const fieldValues = {
    event_name: selectedEvent?.event_name || "Event Name",
    event_date: "12 Sep 2026",
    event_time: "12:00 PM",
    event_location: selectedEvent?.address || "Event Address",
    participant_name: "Participant Name",
    organization: "Organization",
    designation: "Designation",
    pass_number: "TSSIA-09832-20226",
    qr_code: "TSSIA-09832-20226"
  };

  const getPos = (id) => customConfig.fieldPositions?.[id] || { x: 0, y: 0 };

  return (
    <div style={{ 
      display: "grid", 
      gridTemplateColumns: "400px 1fr", 
      gap: "0", 
      height: "100%", 
      background: "#181818",
      color: "#fff",
      fontFamily: "Inter, sans-serif"
    }}>
      {/* Sidebar Controls */}
      <div style={{ 
        background: "#121212", 
        padding: "1.5rem", 
        borderRight: "1px solid #333", 
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem"
      }}>
        <div>
          <label style={{ display: "block", fontSize: "0.75rem", color: "#888", marginBottom: "6px", textTransform: "uppercase", fontWeight: 700 }}>Select Event</label>
          <select 
            value={selectedEventId} 
            onChange={(e) => setSelectedEventId(e.target.value)}
            style={{ width: "100%", padding: "0.7rem", borderRadius: "8px", border: "1px solid #333", background: "#1e1e1e", color: "#fff" }}
          >
            <option value="">Choose an event...</option>
            {(events || []).map(e => <option key={e.event_id} value={e.event_id}>{e.event_name}</option>)}
          </select>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", color: "#888", marginBottom: "6px", textTransform: "uppercase", fontWeight: 700 }}>Background</label>
            <div style={{ display: "flex", gap: "4px" }}>
              <button 
                onClick={() => setCustomConfig(p => ({ ...p, backgroundType: "solid" }))}
                style={{ flex: 1, padding: "6px", borderRadius: "4px", border: "1px solid #333", background: customConfig.backgroundType === "solid" ? "#333" : "transparent", color: "#fff", cursor: "pointer", fontSize: "0.8rem" }}
              >Solid</button>
              <button 
                onClick={() => setCustomConfig(p => ({ ...p, backgroundType: "gradient" }))}
                style={{ flex: 1, padding: "6px", borderRadius: "4px", border: "1px solid #333", background: customConfig.backgroundType === "gradient" ? "#333" : "transparent", color: "#fff", cursor: "pointer", fontSize: "0.8rem" }}
              >Gradient</button>
            </div>
            {customConfig.backgroundType === "gradient" && (
              <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <input type="color" value={customConfig.gradientStart || "#1e293b"} onChange={(e) => setCustomConfig(p => ({ ...p, gradientStart: e.target.value }))} style={{ width: "30px", height: "30px", border: "none", cursor: "pointer", background: "none" }} />
                  <span style={{ fontSize: "0.7rem", color: "#888" }}>Start</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <input type="color" value={customConfig.gradientEnd || "#0f172a"} onChange={(e) => setCustomConfig(p => ({ ...p, gradientEnd: e.target.value }))} style={{ width: "30px", height: "30px", border: "none", cursor: "pointer", background: "none" }} />
                  <span style={{ fontSize: "0.7rem", color: "#888" }}>End</span>
                </div>
              </div>
            )}
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", color: "#888", marginBottom: "6px", textTransform: "uppercase", fontWeight: 700 }}>Templates</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              {Object.entries(TEMPLATES).map(([key, t]) => (
                <div 
                  key={key} 
                  onClick={() => { setActiveTemplate(key); setCustomConfig(TEMPLATES[key]); }}
                  style={{ fontSize: "0.8rem", padding: "2px 4px", cursor: "pointer", color: activeTemplate === key ? "#6366f1" : "#888", fontWeight: activeTemplate === key ? 700 : 400 }}
                >
                  • {t.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label style={{ display: "block", fontSize: "0.75rem", color: "#888", marginBottom: "6px", textTransform: "uppercase", fontWeight: 700 }}>Accent Color</label>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
             <input 
              type="color" 
              value={customConfig.accent || "#6366f1"} 
              onChange={(e) => setCustomConfig(p => ({ ...p, accent: e.target.value }))}
              style={{ width: "40px", height: "40px", border: "none", borderRadius: "50%", cursor: "pointer", background: "none" }}
            />
            <span style={{ fontSize: "0.8rem", color: "#888" }}>{customConfig.accent}</span>
          </div>
        </div>

        <div>
          <label style={{ display: "block", fontSize: "0.75rem", color: "#888", marginBottom: "8px", textTransform: "uppercase", fontWeight: 700 }}>Ticket Fields</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            {FIELD_OPTIONS.map(f => (
              <label key={f.id} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.75rem", cursor: "pointer" }}>
                <input 
                  type="checkbox" 
                  checked={(customConfig.selectedFields || []).includes(f.id)}
                  onChange={() => {
                    const next = (customConfig.selectedFields || []).includes(f.id)
                      ? customConfig.selectedFields.filter(id => id !== f.id)
                      : [...(customConfig.selectedFields || []), f.id];
                    setCustomConfig(p => ({ ...p, selectedFields: next }));
                  }}
                />
                {f.label}
              </label>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", color: "#888", marginBottom: "6px", textTransform: "uppercase", fontWeight: 700 }}>Sponsors</label>
            <input 
              type="text" 
              placeholder="Text"
              value={sponsorText}
              onChange={(e) => setSponsorText(e.target.value)}
              style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #333", background: "#1e1e1e", color: "#fff", fontSize: "0.8rem" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", color: "#888", marginBottom: "6px", textTransform: "uppercase", fontWeight: 700 }}>Sponsors Logo</label>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <input type="file" onChange={handleLogoUpload} style={{ width: "100%", fontSize: "0.7rem", color: "#888" }} />
              {sponsorLogo && <button onClick={() => setSponsorLogo(null)} style={{ background: "transparent", color: "#ef4444", border: "none", cursor: "pointer", fontSize: "0.8rem" }}>Remove</button>}
            </div>
          </div>
        </div>

        <div>
          <label style={{ display: "block", fontSize: "0.75rem", color: "#888", marginBottom: "8px", textTransform: "uppercase", fontWeight: 700 }}>Element Properties</label>
          <div style={{ display: "grid", gap: "10px", background: "#1e1e1e", padding: "10px", borderRadius: "8px", border: "1px solid #333" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.7rem", color: "#ccc" }}>QR Size ({customConfig.qrSize || 84}px)</span>
              <input type="range" min="40" max="200" value={customConfig.qrSize || 84} onChange={(e) => setCustomConfig(p => ({ ...p, qrSize: parseInt(e.target.value) }))} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.7rem", color: "#ccc" }}>QR Rotation ({customConfig.qrRotation || 0}°)</span>
              <input type="range" min="-180" max="180" value={customConfig.qrRotation || 0} onChange={(e) => setCustomConfig(p => ({ ...p, qrRotation: parseInt(e.target.value) }))} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.7rem", color: "#ccc" }}>Pass Rotation ({customConfig.passRotation ?? -90}°)</span>
              <input type="range" min="-180" max="180" value={customConfig.passRotation ?? -90} onChange={(e) => setCustomConfig(p => ({ ...p, passRotation: parseInt(e.target.value) }))} />
            </div>
          </div>
        </div>

        <div style={{ marginTop: "auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", paddingTop: "1rem", borderTop: "1px solid #333" }}>
          <button 
            onClick={handleSave} 
            disabled={saving}
            style={{ padding: "10px", borderRadius: "8px", border: "1px solid #fff", background: "transparent", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: "0.85rem" }}
          >
            {saving ? "Saving..." : "Save Template"}
          </button>
          <button 
            onClick={handleDownload}
            style={{ padding: "10px", borderRadius: "8px", border: "none", background: "#eee", color: "#000", fontWeight: 700, cursor: "pointer", fontSize: "0.85rem" }}
          >
            Download Ticket
          </button>
        </div>
        {status.msg && <div style={{ textAlign: "center", fontSize: "0.8rem", color: status.type === "success" ? "#10b981" : "#ef4444" }}>{status.msg}</div>}
      </div>

      {/* Preview Area */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", background: "#1e1e1e", padding: "2rem", overflow: "auto" }}>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", top: "-30px", left: "0", color: "#666", fontSize: "0.75rem", fontWeight: 700 }}>TICKET PREVIEW:</div>
          <div 
            ref={ticketRef}
            style={{ 
              width: "350px", 
              height: "650px", 
              borderRadius: "0", 
              position: "relative", 
              overflow: "hidden",
              background: customConfig.backgroundType === "solid" ? (customConfig.primary || "#111") : `linear-gradient(${customConfig.gradientAngle || 0}deg, ${customConfig.gradientStart || "#000"}, ${customConfig.gradientEnd || "#111"})`,
              boxShadow: "0 40px 100px rgba(0,0,0,0.8)",
              border: `2px solid ${(customConfig.accent || "#6366f1")}44`
            }}
          >
            {/* Header: Event Name */}
            {(customConfig.selectedFields || []).includes("event_name") && (
            <DraggableItem position={getPos("event_name")} onDrag={(e, d) => handlePositionChange("event_name", d.x, d.y)} bounds="parent">
              <div style={{ width: 270, textAlign: "center", color: customConfig.accent || "#fff", fontSize: "1.8rem", fontWeight: 900, letterSpacing: "-1px" }}>
                {fieldValues.event_name}
              </div>
            </DraggableItem>
            )}

            {/* PASS Label */}
            {(customConfig.selectedFields || []).includes("ticket_id") && (
            <DraggableItem position={getPos("pass_label")} onDrag={(e, d) => handlePositionChange("pass_label", d.x, d.y)} bounds="parent">
              <div style={{ width: 70, textAlign: "center", color: customConfig.accent || "#fff", opacity: 0.6, fontSize: "0.8rem", fontWeight: 700, letterSpacing: "2px" }}>
                PASS
              </div>
            </DraggableItem>
            )}

            {/* Avatar Circle */}
            <DraggableItem position={getPos("avatar")} onDrag={(e, d) => handlePositionChange("avatar", d.x, d.y)} bounds="parent">
              <div style={{ width: 150, height: 150, borderRadius: "50%", border: "4px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="60" height="60" viewBox="0 0 24 24" fill="rgba(255,255,255,0.3)"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
              </div>
            </DraggableItem>

            {/* Participant Details */}
            {(customConfig.selectedFields || []).includes("participant_name") && (
            <DraggableItem position={getPos("participant_name")} onDrag={(e, d) => handlePositionChange("participant_name", d.x, d.y)} bounds="parent">
              <div style={{ width: 270, textAlign: "center", color: customConfig.accent || "#fff", fontSize: "1.4rem", fontWeight: 800 }}>
                {fieldValues.participant_name}
              </div>
            </DraggableItem>
            )}

            {(customConfig.selectedFields || []).includes("organization") && (
            <DraggableItem position={getPos("org_desig")} onDrag={(e, d) => handlePositionChange("org_desig", d.x, d.y)} bounds="parent">
              <div style={{ width: 270, textAlign: "center", color: customConfig.accent || "#fff", opacity: 0.7, fontSize: "0.85rem", fontWeight: 500 }}>
                {fieldValues.designation} • {fieldValues.organization}
              </div>
            </DraggableItem>
            )}

            {/* Address & Date/Time Section */}
            {(customConfig.selectedFields || []).includes("event_location") && (
            <DraggableItem position={getPos("event_address")} onDrag={(e, d) => handlePositionChange("event_address", d.x, d.y)} bounds="parent">
              <div style={{ width: 270, textAlign: "left", color: customConfig.accent || "#fff", fontSize: "0.85rem" }}>
                <div style={{ opacity: 0.5, fontSize: "0.7rem", marginBottom: "4px" }}>Event Address</div>
                {fieldValues.event_location}
              </div>
            </DraggableItem>
            )}

            {((customConfig.selectedFields || []).includes("event_date") || (customConfig.selectedFields || []).includes("event_time")) && (
            <DraggableItem position={getPos("date_time")} onDrag={(e, d) => handlePositionChange("date_time", d.x, d.y)} bounds="parent">
              <div style={{ width: 270, display: "flex", gap: "2rem", color: customConfig.accent || "#fff" }}>
                {(customConfig.selectedFields || []).includes("event_date") && (
                  <div>
                    <div style={{ opacity: 0.5, fontSize: "0.7rem", marginBottom: "4px" }}>Date</div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>{fieldValues.event_date}</div>
                  </div>
                )}
                {(customConfig.selectedFields || []).includes("event_time") && (
                  <div style={{ borderLeft: `1px solid ${(customConfig.accent || "#fff")}44`, paddingLeft: (customConfig.selectedFields || []).includes("event_date") ? "1.5rem" : "0", borderLeftWidth: (customConfig.selectedFields || []).includes("event_date") ? "1px" : "0" }}>
                    <div style={{ opacity: 0.5, fontSize: "0.7rem", marginBottom: "4px" }}>Time</div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>{fieldValues.event_time}</div>
                  </div>
                )}
              </div>
            </DraggableItem>
            )}

            {sponsorText && (
            <DraggableItem position={getPos("sponsor_text") || { x: 100, y: 340 }} onDrag={(e, d) => handlePositionChange("sponsor_text", d.x, d.y)} bounds="parent">
              <div style={{ width: 150, textAlign: "center", color: customConfig.accent || "#fff", opacity: 0.8, fontSize: "0.85rem", fontWeight: 600 }}>
                {sponsorText}
              </div>
            </DraggableItem>
            )}

            {sponsorLogo && (
            <DraggableItem position={getPos("sponsor_logo") || { x: 145, y: 370 }} onDrag={(e, d) => handlePositionChange("sponsor_logo", d.x, d.y)} bounds="parent">
              <div style={{ width: 60, height: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img src={sponsorLogo} alt="Sponsor Logo" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
              </div>
            </DraggableItem>
            )}

            {/* Bottom Bar Background ONLY */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 160, background: customConfig.backgroundType === "solid" && customConfig.primary === "#ffffff" ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.03)", borderTop: customConfig.backgroundType === "solid" && customConfig.primary === "#ffffff" ? "1px solid rgba(0,0,0,0.05)" : "1px solid rgba(255,255,255,0.05)" }} />
            
            {(customConfig.selectedFields || []).includes("ticket_id") && (
            <DraggableItem position={getPos("pass_code")} onDrag={(e, d) => handlePositionChange("pass_code", d.x, d.y)} bounds="parent">
              <div style={{ transform: `rotate(${customConfig.passRotation ?? -90}deg)`, color: customConfig.accent || "#fff", opacity: 0.8, fontSize: "0.8rem", fontWeight: 700, whiteSpace: "nowrap" }}>
                {fieldValues.pass_number}
              </div>
            </DraggableItem>
            )}

            {(customConfig.selectedFields || []).includes("qr_code") && (
            <DraggableItem position={getPos("qr_code")} onDrag={(e, d) => handlePositionChange("qr_code", d.x, d.y)} bounds="parent">
              <div style={{ transform: `rotate(${customConfig.qrRotation || 0}deg)`, width: (customConfig.qrSize || 84) + 16, height: (customConfig.qrSize || 84) + 16, background: "#fff", padding: "8px", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.5)", border: `2px solid ${(customConfig.accent || "#fff")}44`, display: "flex", justifyContent: "center", alignItems: "center" }}>
                <QRCodeCanvas value={demoQrCode} size={customConfig.qrSize || 84} />
              </div>
            </DraggableItem>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDesigner;

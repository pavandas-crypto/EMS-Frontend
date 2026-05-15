import { useState, useEffect, useRef, forwardRef } from "react";
import api from "../../api/api";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";
import Draggable from "react-draggable";
import { jsPDF } from "jspdf";

export const TEMPLATES = {
  classic: {
    name: "Classic",
    primary: "#0f172a",
    secondary: "#ffffff",
    accent: "#ffffff",
    font: "Inter, sans-serif",
    backgroundType: "solid",
    selectedFields: ["event_name", "participant_name", "event_location", "event_date", "event_time", "qr_code", "organization", "ticket_id", "user_icon"],
    fieldPositions: {
      pass_label: { x: 140, y: 40 },
      event_name: { x: 40, y: 70 },
      user_icon: { x: 100, y: 140 },
      participant_name: { x: 40, y: 360 },
      organization: { x: 40, y: 400 },
      event_date: { x: 40, y: 460 },
      event_location: { x: 40, y: 530 },
      ticket_id: { x: 40, y: 580 },
      qr_code: { x: 125, y: 610 }
    }
  },
  premium: {
    name: "Premium",
    primary: "#0f172a",
    secondary: "#f8fafc",
    accent: "#f59e0b",
    font: "Inter, sans-serif",
    backgroundType: "gradient",
    gradientStart: "#0f172a",
    gradientEnd: "#1e1b4b",
    gradientAngle: 150,
    selectedFields: ["event_name", "participant_name", "event_location", "event_date", "event_time", "qr_code", "organization", "ticket_id", "user_icon"],
    fieldPositions: {
      pass_label: { x: 140, y: 40 },
      event_name: { x: 40, y: 70 },
      user_icon: { x: 100, y: 140 },
      participant_name: { x: 40, y: 360 },
      organization: { x: 40, y: 400 },
      event_date: { x: 40, y: 460 },
      event_location: { x: 40, y: 530 },
      ticket_id: { x: 40, y: 580 },
      qr_code: { x: 125, y: 610 }
    }
  },
  modern: {
    name: "QR Modern",
    primary: "#ffffff",
    secondary: "#000000",
    accent: "#000000",
    font: "Inter, sans-serif",
    backgroundType: "gradient",
    gradientStart: "#ffffff",
    gradientEnd: "#0f172a",
    gradientAngle: 180,
    selectedFields: ["event_name", "participant_name", "event_location", "event_date", "event_time", "qr_code", "tssia_icon", "ticket_id"],
    fieldPositions: {
      pass_label: { x: 140, y: 30 },
      event_name: { x: 40, y: 60 },
      tssia_icon: { x: 100, y: 120 },
      participant_name: { x: 40, y: 360 },
      event_date: { x: 40, y: 430 },
      event_location: { x: 40, y: 510 },
      ticket_id: { x: 40, y: 580 },
      qr_code: { x: 125, y: 620 }
    }
  }
};

const FIELD_OPTIONS = [
  { id: "event_name", label: "Event Name" },
  { id: "event_date", label: "Event Date" },
  { id: "event_time", label: "Event Time" },
  { id: "event_location", label: "Event Location" },
  { id: "participant_name", label: "Participant Name" },
  { id: "organization", label: "Organization" },
  { id: "ticket_id", label: "Ticket ID" },
  { id: "qr_code", label: "QR Code" },
  { id: "user_icon", label: "User Icon" },
  { id: "tssia_icon", label: "TSSIA Icon" }
];

const getInitials = (name) => {
  if (!name) return "??";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0].substring(0, 2).toUpperCase();
};

// Helper component to fix react-draggable React 19 findDOMNode issue
const DraggableItem = ({ children, position, onDrag, bounds, onClick, isSelected, ...props }) => {
  const nodeRef = useRef(null);
  return (
    <Draggable 
      nodeRef={nodeRef} 
      position={position} 
      onDrag={onDrag} 
      bounds={bounds}
      {...props}
    >
      <div 
        ref={nodeRef} 
        onClick={onClick}
        style={{ 
          position: "absolute", 
          cursor: "move", 
          zIndex: 10,
          outline: isSelected ? "2px solid #6366f1" : "none",
          outlineOffset: "4px",
          transition: "outline 0.2s"
        }}
      >
        {children}
      </div>
    </Draggable>
  );
};

const TicketDesigner = ({ onSwitchToManagement, activeTab }) => {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [activeTemplate, setActiveTemplate] = useState("classic");
  const [customConfig, setCustomConfig] = useState(TEMPLATES.classic);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [sponsorText, setSponsorText] = useState("");
  const [sponsorLogo, setSponsorLogo] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [selectedField, setSelectedField] = useState(null);
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
            if (res.data.config?.backgroundImage) setBackgroundImage(res.data.config.backgroundImage);
            else setBackgroundImage(null);
          }

          const ticketsRes = await api.getEventTickets(selectedEventId, 1, 1);
          if (ticketsRes?.success && ticketsRes.data?.length > 0) {
            const t = ticketsRes.data[0];
            setDemoQrCode(t.qr_code || t.pass_number || "TSSIA-DEMO-001");
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

  const handleBgUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackgroundImage(e.target.result);
        setCustomConfig(p => ({ ...p, backgroundImage: e.target.result, backgroundType: "image" }));
      };
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
      setStatus({ type: "success", msg: "Template Saved" });
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
        {/* Navigation Toggle Inside Sidebar */}
        <div style={{ 
          display: "flex", 
          background: "#1e1e1e", 
          padding: "4px", 
          borderRadius: "10px", 
          border: "1px solid #333",
          marginBottom: "1rem"
        }}>
          <button 
            style={{ 
              flex: 1, padding: "8px", borderRadius: "8px", border: "none", 
              background: activeTab === "designer" ? "#6366f1" : "transparent",
              color: activeTab === "designer" ? "#fff" : "#888",
              fontWeight: 700, fontSize: "0.75rem", cursor: "pointer"
            }}
          >
            Designer
          </button>
          <button 
            onClick={onSwitchToManagement}
            style={{ 
              flex: 1, padding: "8px", borderRadius: "8px", border: "none", 
              background: activeTab === "management" ? "#6366f1" : "transparent",
              color: activeTab === "management" ? "#fff" : "#888",
              fontWeight: 700, fontSize: "0.75rem", cursor: "pointer"
            }}
          >
            Management
          </button>
        </div>
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

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
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
            <label style={{ display: "block", fontSize: "0.75rem", color: "#888", marginBottom: "6px", textTransform: "uppercase", fontWeight: 700 }}>Bg Image</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <input type="file" onChange={handleBgUpload} style={{ width: "100%", fontSize: "0.7rem", color: "#888" }} />
              {backgroundImage && <button onClick={() => { setBackgroundImage(null); setCustomConfig(p => ({ ...p, backgroundImage: null, backgroundType: "solid" })); }} style={{ background: "transparent", color: "#ef4444", border: "none", cursor: "pointer", fontSize: "0.75rem", textAlign: "left" }}>Remove</button>}
            </div>
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
          <div style={{ background: "#1e1e1e", padding: "1.25rem", borderRadius: "12px", border: "1px solid #333" }}>
            {!selectedField ? (
              <div style={{ textAlign: "center", padding: "1rem", color: "#666", fontSize: "0.8rem", fontStyle: "italic" }}>
                Select an element on the ticket to edit its properties
              </div>
            ) : (
              <div style={{ display: "grid", gap: "1.25rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#6366f1" }}></div>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#fff", textTransform: "uppercase" }}>
                    {FIELD_OPTIONS.find(f => f.id === selectedField)?.label || selectedField.replace('_', ' ')}
                  </span>
                </div>

                <div style={{ display: "grid", gap: "12px" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span style={{ fontSize: "0.7rem", color: "#888" }}>Size / Scale</span>
                      <span style={{ fontSize: "0.7rem", color: "#6366f1", fontWeight: 700 }}>{customConfig.fieldStyles?.[selectedField]?.size || (selectedField === 'qr_code' ? 84 : 100)}%</span>
                    </div>
                    <input 
                      type="range" min="20" max="300" 
                      value={customConfig.fieldStyles?.[selectedField]?.size || (selectedField === 'qr_code' ? 84 : 100)} 
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setCustomConfig(p => ({
                          ...p,
                          fieldStyles: { ...(p.fieldStyles || {}), [selectedField]: { ...(p.fieldStyles?.[selectedField] || {}), size: val } }
                        }));
                      }} 
                      style={{ width: "100%", accentColor: "#6366f1" }}
                    />
                  </div>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span style={{ fontSize: "0.7rem", color: "#888" }}>Rotation</span>
                      <span style={{ fontSize: "0.7rem", color: "#6366f1", fontWeight: 700 }}>{customConfig.fieldStyles?.[selectedField]?.rotation || 0}°</span>
                    </div>
                    <input 
                      type="range" min="-180" max="180" 
                      value={customConfig.fieldStyles?.[selectedField]?.rotation || 0} 
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setCustomConfig(p => ({
                          ...p,
                          fieldStyles: { ...(p.fieldStyles || {}), [selectedField]: { ...(p.fieldStyles?.[selectedField] || {}), rotation: val } }
                        }));
                      }} 
                      style={{ width: "100%", accentColor: "#6366f1" }}
                    />
                  </div>
                </div>
                
                <button 
                  onClick={() => setSelectedField(null)}
                  style={{ marginTop: "4px", padding: "6px", background: "transparent", border: "1px solid #333", borderRadius: "6px", color: "#888", fontSize: "0.7rem", cursor: "pointer" }}
                >
                  Deselect Element
                </button>
              </div>
            )}
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
            Download Template
          </button>
        </div>

        {/* Floating Notification */}
        {status.msg && (
          <div style={{ 
            position: "fixed", top: "2rem", right: "2rem", zIndex: 1000,
            background: status.type === "success" ? "#10b981" : "#ef4444",
            color: "#fff", padding: "12px 24px", borderRadius: "12px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)", fontWeight: 700,
            animation: "slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            display: "flex", alignItems: "center", gap: "10px"
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              {status.type === "success" ? <path d="M20 6L9 17l-5-5" /> : <path d="M18 6L6 18M6 6l12 12" />}
            </svg>
            {status.msg}
          </div>
        )}
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
              background: customConfig.backgroundType === "image" && customConfig.backgroundImage
                ? `url(${customConfig.backgroundImage}) center/cover no-repeat`
                : customConfig.backgroundType === "solid"
                  ? (customConfig.primary || "#111")
                  : `linear-gradient(${customConfig.gradientAngle || 0}deg, ${customConfig.gradientStart || "#000"}, ${customConfig.gradientEnd || "#111"})`,
              boxShadow: "0 40px 100px rgba(0,0,0,0.8)",
              border: `2px solid ${(customConfig.accent || "#6366f1")}44`
            }}
          >
            {/* Header: Event Name */}
            {(customConfig.selectedFields || []).includes("event_name") && (
              <DraggableItem position={getPos("event_name")} onDrag={(e, d) => handlePositionChange("event_name", d.x, d.y)} bounds="parent" onClick={() => setSelectedField("event_name")} isSelected={selectedField === "event_name"}>
                <div style={{ width: 270, textAlign: "center", color: customConfig.accent || "#fff", fontSize: `${(customConfig.fieldStyles?.event_name?.size || 100) / 100 * 1.8}rem`, fontWeight: 900, letterSpacing: "-1px", transform: `rotate(${customConfig.fieldStyles?.event_name?.rotation || 0}deg)` }}>
                  {fieldValues.event_name}
                </div>
              </DraggableItem>
            )}

            {/* PASS Label */}
            {(customConfig.selectedFields || []).includes("ticket_id") && (
              <DraggableItem position={getPos("pass_label")} onDrag={(e, d) => handlePositionChange("pass_label", d.x, d.y)} bounds="parent" onClick={() => setSelectedField("pass_label")} isSelected={selectedField === "pass_label"}>
                <div style={{ width: 70, textAlign: "center", color: customConfig.accent || "#fff", opacity: 0.6, fontSize: `${(customConfig.fieldStyles?.pass_label?.size || 100) / 100 * 0.8}rem`, fontWeight: 700, letterSpacing: "2px", transform: `rotate(${customConfig.fieldStyles?.pass_label?.rotation || 0}deg)` }}>
                  PASS
                </div>
              </DraggableItem>
            )}

            {/* Avatar Circle */}
            {(customConfig.selectedFields || []).includes("user_icon") && (
              <DraggableItem position={getPos("user_icon")} onDrag={(e, d) => handlePositionChange("user_icon", d.x, d.y)} bounds="parent" onClick={() => setSelectedField("user_icon")} isSelected={selectedField === "user_icon"}>
                <div style={{ width: 150 * ((customConfig.fieldStyles?.user_icon?.size || 100) / 100), height: 150 * ((customConfig.fieldStyles?.user_icon?.size || 100) / 100), borderRadius: "50%", border: "4px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", transform: `rotate(${customConfig.fieldStyles?.user_icon?.rotation || 0}deg)` }}>
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="rgba(255,255,255,0.3)"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                </div>
              </DraggableItem>
            )}

            {/* TSSIA Icon */}
            {(customConfig.selectedFields || []).includes("tssia_icon") && (
              <DraggableItem position={getPos("tssia_icon") || { x: 135, y: 340 }} onDrag={(e, d) => handlePositionChange("tssia_icon", d.x, d.y)} bounds="parent" onClick={() => setSelectedField("tssia_icon")} isSelected={selectedField === "tssia_icon"}>
                <div style={{ width: 80 * ((customConfig.fieldStyles?.tssia_icon?.size || 100) / 100), height: 80 * ((customConfig.fieldStyles?.tssia_icon?.size || 100) / 100), display: "flex", alignItems: "center", justifyContent: "center", transform: `rotate(${customConfig.fieldStyles?.tssia_icon?.rotation || 0}deg)` }}>
                  <img src="/images/tssia logo.png" alt="TSSIA Logo" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                </div>
              </DraggableItem>
            )}

            {/* Participant Details */}
            {(customConfig.selectedFields || []).includes("participant_name") && (
              <DraggableItem position={getPos("participant_name")} onDrag={(e, d) => handlePositionChange("participant_name", d.x, d.y)} bounds="parent" onClick={() => setSelectedField("participant_name")} isSelected={selectedField === "participant_name"}>
                <div style={{ width: 270, textAlign: "center", color: customConfig.accent || "#fff", fontSize: `${(customConfig.fieldStyles?.participant_name?.size || 100) / 100 * 1.4}rem`, fontWeight: 800, transform: `rotate(${customConfig.fieldStyles?.participant_name?.rotation || 0}deg)` }}>
                  {fieldValues.participant_name}
                </div>
              </DraggableItem>
            )}

            {(customConfig.selectedFields || []).includes("organization") && (
              <DraggableItem position={getPos("organization")} onDrag={(e, d) => handlePositionChange("organization", d.x, d.y)} bounds="parent" onClick={() => setSelectedField("organization")} isSelected={selectedField === "organization"}>
                <div style={{ width: 270, textAlign: "center", color: customConfig.accent || "#fff", opacity: 0.7, fontSize: `${(customConfig.fieldStyles?.organization?.size || 100) / 100 * 0.85}rem`, fontWeight: 500, transform: `rotate(${customConfig.fieldStyles?.organization?.rotation || 0}deg)` }}>
                  {fieldValues.designation} • {fieldValues.organization}
                </div>
              </DraggableItem>
            )}

            {/* Address & Date/Time Section */}
            {(customConfig.selectedFields || []).includes("event_location") && (
              <DraggableItem position={getPos("event_location")} onDrag={(e, d) => handlePositionChange("event_location", d.x, d.y)} bounds="parent" onClick={() => setSelectedField("event_location")} isSelected={selectedField === "event_location"}>
                <div style={{ width: 270, textAlign: "left", color: customConfig.accent || "#fff", fontSize: `${(customConfig.fieldStyles?.event_location?.size || 100) / 100 * 0.85}rem`, transform: `rotate(${customConfig.fieldStyles?.event_location?.rotation || 0}deg)` }}>
                  <div style={{ opacity: 0.5, fontSize: "0.7rem", marginBottom: "4px" }}>Event Address</div>
                  {fieldValues.event_location}
                </div>
              </DraggableItem>
            )}

            {((customConfig.selectedFields || []).includes("event_date") || (customConfig.selectedFields || []).includes("event_time")) && (
              <DraggableItem position={getPos("event_date")} onDrag={(e, d) => handlePositionChange("event_date", d.x, d.y)} bounds="parent" onClick={() => setSelectedField("event_date")} isSelected={selectedField === "event_date"}>
                <div style={{ width: 270, display: "flex", gap: "2rem", color: customConfig.accent || "#fff", fontSize: `${(customConfig.fieldStyles?.event_date?.size || 100) / 100 * 1}em`, transform: `rotate(${customConfig.fieldStyles?.event_date?.rotation || 0}deg)` }}>
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
              <DraggableItem position={getPos("ticket_id")} onDrag={(e, d) => handlePositionChange("ticket_id", d.x, d.y)} bounds="parent" onClick={() => setSelectedField("ticket_id")} isSelected={selectedField === "ticket_id"}>
                <div style={{ transform: `rotate(${(customConfig.fieldStyles?.ticket_id?.rotation || -90)}deg)`, color: customConfig.accent || "#fff", opacity: 0.8, fontSize: `${(customConfig.fieldStyles?.ticket_id?.size || 100) / 100 * 0.8}rem`, fontWeight: 700, whiteSpace: "nowrap" }}>
                  {fieldValues.pass_number}
                </div>
              </DraggableItem>
            )}

            {(customConfig.selectedFields || []).includes("qr_code") && (
              <DraggableItem position={getPos("qr_code")} onDrag={(e, d) => handlePositionChange("qr_code", d.x, d.y)} bounds="parent" onClick={() => setSelectedField("qr_code")} isSelected={selectedField === "qr_code"}>
                <div style={{ transform: `rotate(${customConfig.fieldStyles?.qr_code?.rotation || 0}deg)`, width: (customConfig.fieldStyles?.qr_code?.size || 84) + 16, height: (customConfig.fieldStyles?.qr_code?.size || 84) + 16, background: "#fff", padding: "8px", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.5)", border: `2px solid ${(customConfig.accent || "#fff")}44`, display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <QRCodeCanvas value={demoQrCode} size={customConfig.fieldStyles?.qr_code?.size || 84} />
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

const style = document.createElement("style");
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%) scale(0.9); opacity: 0; }
    to { transform: translateX(0) scale(1); opacity: 1; }
  }
`;
document.head.appendChild(style);

import { useState, useEffect, useRef } from "react";
import api from "../../api/api";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas";

const TEMPLATES = {
  classic: {
    name: "Classic",
    primary: "#ffffff",
    secondary: "#111827",
    accent: "#3b82f6",
    font: "Inter, sans-serif",
    backgroundType: "solid",
    gradientStart: "#10b981",
    gradientEnd: "#3b82f6",
    gradientAngle: 150,
    selectedFields: ["event_name", "event_date", "event_location", "participant_name", "pass_number"],
    fieldPositions: {
      event_name: { x: 24, y: 140 },
      event_date: { x: 24, y: 210 },
      event_location: { x: 24, y: 280 },
      participant_name: { x: 24, y: 350 },
      pass_number: { x: 24, y: 420 },
      qr_code: { x: 236, y: 320 }
    }
  },
  pro: {
    name: "Pro",
    primary: "#0f172a",
    secondary: "#f8fafc",
    accent: "#6366f1",
    font: "Space Grotesk, sans-serif",
    backgroundType: "gradient",
    gradientStart: "#0f172a",
    gradientEnd: "#6366f1",
    gradientAngle: 140,
    selectedFields: ["event_name", "event_date", "event_time", "event_location", "participant_name", "pass_number"],
    fieldPositions: {
      event_name: { x: 24, y: 140 },
      event_date: { x: 24, y: 206 },
      event_time: { x: 24, y: 260 },
      event_location: { x: 24, y: 314 },
      participant_name: { x: 24, y: 370 },
      pass_number: { x: 24, y: 420 },
      qr_code: { x: 236, y: 320 }
    }
  },
  premium: {
    name: "Premium",
    primary: "#111827",
    secondary: "#fbbf24",
    accent: "#fbbf24",
    font: "Playfair Display, serif",
    backgroundType: "gradient",
    gradientStart: "#111827",
    gradientEnd: "#fbbf24",
    gradientAngle: 130,
    selectedFields: ["event_name", "event_date", "event_location", "organization", "participant_name", "pass_number"],
    fieldPositions: {
      event_name: { x: 24, y: 140 },
      event_date: { x: 24, y: 206 },
      event_location: { x: 24, y: 260 },
      organization: { x: 24, y: 324 },
      participant_name: { x: 24, y: 388 },
      pass_number: { x: 24, y: 440 },
      qr_code: { x: 236, y: 320 }
    }
  },
  custom: {
    name: "Custom",
    primary: "#ffffff",
    secondary: "#111827",
    accent: "#3b82f6",
    font: "Inter, sans-serif",
    backgroundType: "gradient",
    gradientStart: "#10b981",
    gradientEnd: "#3b82f6",
    gradientAngle: 135,
    selectedFields: ["event_name", "event_date", "event_time", "event_location", "participant_name", "pass_number"],
    fieldPositions: {
      event_name: { x: 24, y: 140 },
      event_date: { x: 24, y: 210 },
      event_time: { x: 24, y: 270 },
      event_location: { x: 24, y: 330 },
      participant_name: { x: 24, y: 390 },
      pass_number: { x: 24, y: 450 },
      qr_code: { x: 236, y: 320 }
    }
  }
};

const DEFAULT_CONFIG = {
  ...TEMPLATES.custom,
  selectedFields: TEMPLATES.custom.selectedFields,
  fieldPositions: TEMPLATES.custom.fieldPositions
};

const FIELD_OPTIONS = [
  { id: "event_name", label: "Event Name" },
  { id: "event_date", label: "Event Date" },
  { id: "event_time", label: "Event Time" },
  { id: "event_location", label: "Event Location" },
  { id: "participant_name", label: "Participant Name" },
  { id: "organization", label: "Organization" },
  { id: "pass_number", label: "Pass Number" },
  { id: "ticket_id", label: "Ticket ID" },
  { id: "event_description", label: "Event Description" },
  { id: "qr_code", label: "QR Code" }
];

function TicketDesigner() {
  const [activeTab, setActiveTab] = useState("designer");
  const [events, setEvents] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [activeTemplate, setActiveTemplate] = useState("classic");
  const [customConfig, setCustomConfig] = useState(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [customText, setCustomText] = useState({
    title: "",
    subtitle: "",
    footer: "Scan for Entry",
    sponsorText: "",
    sponsorLogos: []
  });
  const [logo, setLogo] = useState(null);
  const [draggingField, setDraggingField] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [managerLoading, setManagerLoading] = useState(true);
  const ticketRef = useRef(null);

  useEffect(() => {
    fetchEvents();
    fetchTemplates();
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      fetchTemplate();
    }
  }, [selectedEventId]);

  const fetchEvents = async () => {
    try {
      const res = await api.getEvents(1, 100);
      if (res.success) setEvents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    setManagerLoading(true);
    try {
      const res = await api.getTicketTemplatesList();
      if (res.success) setTemplates(res.data);
    } catch (err) {
      console.error("Failed to load ticket templates:", err);
    } finally {
      setManagerLoading(false);
    }
  };

  const fetchTemplate = async () => {
    try {
      const res = await api.getTicketTemplate(selectedEventId);
      if (res.success && res.data) {
        const config = { ...DEFAULT_CONFIG, ...res.data.config };
        setActiveTemplate(res.data.template_type || "custom");
        setCustomConfig(config);
        setCustomText({
          title: res.data.customText?.title || "",
          subtitle: res.data.customText?.subtitle || "",
          footer: res.data.customText?.footer || "Scan for Entry",
          sponsorText: res.data.customText?.sponsorText || "",
          sponsorLogos: res.data.customText?.sponsorLogos || []
        });
        setLogo(res.data.logo || null);
      } else {
        handleTemplateChange("classic");
        setCustomText({ title: "", subtitle: "", footer: "Scan for Entry", sponsorText: "", sponsorLogos: [] });
        setLogo(null);
      }
    } catch (err) {
      console.error("Failed to fetch template:", err);
    }
  };

  const handleTemplateChange = (key) => {
    setActiveTemplate(key);
    setCustomConfig({ ...DEFAULT_CONFIG, ...TEMPLATES[key] });
  };

  const handleFieldToggle = (fieldId) => {
    const nextFields = customConfig.selectedFields.includes(fieldId)
      ? customConfig.selectedFields.filter((id) => id !== fieldId)
      : [...customConfig.selectedFields, fieldId];

    setCustomConfig((prev) => ({ ...prev, selectedFields: nextFields }));
  };

  const startDrag = (fieldId, e) => {
    if (activeTemplate !== "custom") return;
    e.preventDefault();
    e.stopPropagation();
    const rect = ticketRef.current?.getBoundingClientRect();
    if (!rect) return;
    const current = customConfig.fieldPositions[fieldId] || { x: 24, y: 140 };
    setDraggingField(fieldId);
    setDragOffset({ 
      x: e.clientX - rect.left - current.x, 
      y: e.clientY - rect.top - current.y 
    });
  };

  const selectedEvent = events.find((e) => e.event_id.toString() === selectedEventId);

  const fieldValues = {
    event_name: selectedEvent?.event_name || "Awesome Tech Event",
    event_date: selectedEvent
      ? new Date(selectedEvent.start_date_time).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
      : "12 Sep 2026",
    event_time: selectedEvent
      ? new Date(selectedEvent.start_date_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "12:00 PM",
    event_location: selectedEvent?.address || "World Trade Center, Mumbai",
    participant_name: "Participant Name",
    organization: selectedEvent?.organization || "Organization",
    pass_number: selectedEvent?.pass_number || "PASS-12345",
    ticket_id: selectedEvent?.ticket_id || "TSSA-09832-2026",
    event_description: selectedEvent?.description || "Event description goes here.",
    qr_code: selectedEvent?.ticket_id || "TSSA-09832-2026"
  };

  const handleSave = async () => {
    if (!selectedEventId) {
      setStatus({ type: "error", msg: "Please select an event first." });
      return;
    }
    setSaving(true);
    try {
      await api.saveTicketTemplate({
        event_id: selectedEventId,
        template_type: activeTemplate,
        config: customConfig,
        customText,
        logo
      });
      setStatus({ type: "success", msg: "Ticket template saved successfully!" });
      await fetchTemplates();
    } catch (err) {
      setStatus({ type: "error", msg: err.message });
    } finally {
      setSaving(false);
      setTimeout(() => setStatus({ type: "", msg: "" }), 3000);
    }
  };

  const handleDownload = async () => {
    if (!ticketRef.current) return;
    try {
      const canvas = await html2canvas(ticketRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true
      });
      const link = document.createElement("a");
      link.download = `ticket-${selectedEvent?.event_name || "template"}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
      setStatus({ type: "error", msg: "Download failed. Please try again." });
      setTimeout(() => setStatus({ type: "", msg: "" }), 3000);
    }
  };

  return (
    <div className="ticket-designer-container" style={{ display: "flex", gap: "2rem", padding: "1rem", height: "calc(100vh - 100px)" }}>
      <div
        className="designer-sidebar"
        style={{
          width: "380px",
          background: "#fff",
          padding: "1.75rem",
          borderRadius: "18px",
          border: "1px solid #e5e7eb",
          overflowY: "auto"
        }}
      >
        <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "1.5rem" }}>Ticket Designer</h2>

        <div className="form-group">
          <label className="form-label">Select Event</label>
          <select
            className="select-field"
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
          >
            <option value="">Choose an event...</option>
            {events.map((ev) => (
              <option key={ev.event_id} value={ev.event_id}>
                {ev.event_name}
              </option>
            ))}
          </select>
        </div>

        <div className="template-selector" style={{ marginTop: "2rem" }}>
          <label className="form-label">Templates</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "0.5rem" }}>
            {Object.entries(TEMPLATES).map(([key, t]) => (
              <button
                key={key}
                onClick={() => handleTemplateChange(key)}
                style={{
                  padding: "0.8rem 0.5rem",
                  borderRadius: "14px",
                  border: activeTemplate === key ? "2px solid #6366f1" : "1px solid #e5e7eb",
                  background: activeTemplate === key ? "#eef2ff" : "#fff",
                  cursor: "pointer",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  textAlign: "center"
                }}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>

        <div className="customization-panel" style={{ marginTop: "2rem" }}>
          <label className="form-label">Background</label>
          <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}>
            {["solid", "gradient"].map((type) => (
              <button
                key={type}
                onClick={() => setCustomConfig((prev) => ({ ...prev, backgroundType: type }))}
                style={{
                  flex: 1,
                  padding: "0.8rem 0.5rem",
                  borderRadius: 12,
                  border: customConfig.backgroundType === type ? "2px solid #6366f1" : "1px solid #e5e7eb",
                  background: customConfig.backgroundType === type ? "#eef2ff" : "#fff",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: "0.82rem"
                }}
              >
                {type[0].toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          {customConfig.backgroundType === "solid" ? (
            <div className="form-group">
              <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>Background Color</span>
              <input
                type="color"
                value={customConfig.primary}
                onChange={(e) => setCustomConfig((prev) => ({ ...prev, primary: e.target.value }))}
                style={{ width: "100%", height: "42px", border: "none", padding: 0, cursor: "pointer", marginTop: "0.5rem" }}
              />
            </div>
          ) : (
            <>
              <div className="form-group">
                <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>Gradient Start</span>
                <input
                  type="color"
                  value={customConfig.gradientStart}
                  onChange={(e) => setCustomConfig((prev) => ({ ...prev, gradientStart: e.target.value }))}
                  style={{ width: "100%", height: "42px", border: "none", padding: 0, cursor: "pointer", marginTop: "0.5rem" }}
                />
              </div>
              <div className="form-group">
                <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>Gradient End</span>
                <input
                  type="color"
                  value={customConfig.gradientEnd}
                  onChange={(e) => setCustomConfig((prev) => ({ ...prev, gradientEnd: e.target.value }))}
                  style={{ width: "100%", height: "42px", border: "none", padding: 0, cursor: "pointer", marginTop: "0.5rem" }}
                />
              </div>
              <div className="form-group" style={{ marginTop: "1rem" }}>
                <span style={{ fontSize: "0.8rem", color: "#6b7280", display: "block", marginBottom: "0.5rem" }}>Angle</span>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={customConfig.gradientAngle}
                  onChange={(e) => setCustomConfig((prev) => ({ ...prev, gradientAngle: Number(e.target.value) }))}
                  style={{ width: "100%" }}
                />
                <div style={{ fontSize: "0.8rem", color: "#4b5563", marginTop: "0.25rem" }}>{customConfig.gradientAngle}°</div>
              </div>
            </>
          )}

          <div className="form-group" style={{ marginTop: "1.5rem" }}>
            <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>Accent Color</span>
            <input
              type="color"
              value={customConfig.accent}
              onChange={(e) => setCustomConfig((prev) => ({ ...prev, accent: e.target.value }))}
              style={{ width: "100%", height: "42px", border: "none", padding: 0, cursor: "pointer", marginTop: "0.5rem" }}
            />
          </div>
        </div>

        <div className="customization-panel" style={{ marginTop: "2rem" }}>
          <label className="form-label">Ticket Fields</label>
          {FIELD_OPTIONS.map((field) => (
            <label key={field.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, fontSize: "0.9rem" }}>
              <input
                type="checkbox"
                checked={customConfig.selectedFields.includes(field.id)}
                onChange={() => handleFieldToggle(field.id)}
              />
              {field.label}
            </label>
          ))}
          {activeTemplate === "custom" && (
            <div style={{ marginTop: "1rem", color: "#475569", fontSize: "0.85rem" }}>
              Drag fields directly on the preview to reposition them.
            </div>
          )}
        </div>

        <div className="text-customization" style={{ marginTop: "2rem" }}>
          <label className="form-label">Custom Text</label>
          <div className="form-group">
            <input
              type="text"
              placeholder="Custom Title"
              value={customText.title}
              onChange={(e) => setCustomText({ ...customText, title: e.target.value })}
              style={{ width: "100%", padding: "0.75rem", border: "1px solid #e5e7eb", borderRadius: "10px" }}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Custom Subtitle"
              value={customText.subtitle}
              onChange={(e) => setCustomText({ ...customText, subtitle: e.target.value })}
              style={{ width: "100%", padding: "0.75rem", border: "1px solid #e5e7eb", borderRadius: "10px" }}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Footer Text"
              value={customText.footer}
              onChange={(e) => setCustomText({ ...customText, footer: e.target.value })}
              style={{ width: "100%", padding: "0.75rem", border: "1px solid #e5e7eb", borderRadius: "10px" }}
            />
          </div>
        </div>

        <div className="logo-upload" style={{ marginTop: "2rem" }}>
          <label className="form-label">Logo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = () => setLogo(reader.result);
                reader.readAsDataURL(file);
              }
            }}
            style={{ width: "100%", padding: "0.75rem", border: "1px solid #e5e7eb", borderRadius: "10px" }}
          />
          {logo && <img src={logo} alt="Logo" style={{ width: "100%", marginTop: "0.75rem", borderRadius: "12px", objectFit: "contain" }} />}
        </div>

        <button
          className="button button-primary"
          style={{ width: "100%", marginTop: "2rem", padding: "0.95rem", borderRadius: "14px" }}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Template"}
        </button>

        <button
          className="button button-secondary"
          style={{ width: "100%", marginTop: "1rem", padding: "0.95rem", borderRadius: "14px" }}
          onClick={handleDownload}
          disabled={!selectedEventId}
        >
          Download Ticket
        </button>

        {status.msg && (
          <div className={`alert alert-${status.type}`} style={{ marginTop: "1rem", fontSize: "0.88rem" }}>
            {status.msg}
          </div>
        )}
      </div>

      <div
        className="designer-preview"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: "#f8fafc",
          borderRadius: "18px",
          padding: "2rem",
          overflow: "hidden"
        }}
      >
        <div style={{ marginBottom: "1rem", color: "#64748b", fontSize: "0.95rem", fontWeight: 600 }}>Mobile Preview</div>

        <div
          ref={ticketRef}
          className="ticket-mockup"
          style={{
            width: "375px",
            height: "667px",
            background: customConfig.backgroundType === "gradient"
              ? `linear-gradient(${customConfig.gradientAngle}deg, ${customConfig.gradientStart}, ${customConfig.gradientEnd})`
              : customConfig.primary,
            borderRadius: "24px",
            boxShadow: "0 30px 70px rgba(15,23,42,0.16)",
            position: "relative",
            overflow: "hidden",
            color: customConfig.secondary,
            fontFamily: customConfig.font,
            border: activeTemplate === "premium" ? `4px solid ${customConfig.secondary}` : "none",
            userSelect: draggingField ? "none" : "auto"
          }}
          onMouseMove={(e) => {
            if (!draggingField) return;
            const rect = ticketRef.current?.getBoundingClientRect();
            if (!rect) return;
            const nextX = e.clientX - rect.left - dragOffset.x;
            const nextY = e.clientY - rect.top - dragOffset.y;
            setCustomConfig((prev) => ({
              ...prev,
              fieldPositions: {
                ...prev.fieldPositions,
                [draggingField]: {
                  x: Math.max(0, Math.min(nextX, rect.width - 180)),
                  y: Math.max(0, Math.min(nextY, rect.height - 180))
                }
              }
            }));
          }}
          onMouseUp={() => setDraggingField(null)}
          onMouseLeave={() => setDraggingField(null)}
        >
          <div style={{ padding: "2.5rem 1.5rem", textAlign: "center", zIndex: 2 }}>
            {logo && (
              <img
                src={logo}
                alt="Logo"
                style={{ width: "60px", height: "60px", marginBottom: "1rem", borderRadius: "12px", objectFit: "contain" }}
              />
            )}
            <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.24em", opacity: 0.8, marginBottom: "0.75rem", fontWeight: 700 }}>
              {activeTemplate === "premium" ? "✦ Exclusive Invitation ✦" : "Official Event Entry"}
            </div>
            <h1 style={{ fontSize: activeTemplate === "premium" ? "1.9rem" : "1.55rem", fontWeight: 900, margin: 0, lineHeight: 1.05 }}>
              {customText.title || selectedEvent?.event_name || "Awesome Tech Event"}
            </h1>
            {customText.subtitle && <p style={{ fontSize: "0.92rem", opacity: 0.85, margin: "0.5rem 0 0" }}>{customText.subtitle}</p>}
          </div>

          {(customConfig.selectedFields || []).map((fieldId) => {
            const position = customConfig.fieldPositions?.[fieldId] || { x: 24, y: 140 };
            const label = {
              event_name: "Event",
              event_date: "Date",
              event_time: "Time",
              event_location: "Location",
              participant_name: "Name",
              organization: "Organization",
              pass_number: "Pass No.",
              ticket_id: "Ticket ID",
              event_description: "Description"
            }[fieldId] || "";
            const value = fieldValues[fieldId];

            if (fieldId === "qr_code") {
              return (
                <div
                  key={fieldId}
                  onMouseDown={(e) => startDrag(fieldId, e)}
                  style={{
                    position: "absolute",
                    left: position.x,
                    top: position.y,
                    width: 140,
                    height: 140,
                    background: "#ffffff",
                    borderRadius: 24,
                    padding: 12,
                    boxShadow: "0 18px 40px rgba(15,23,42,0.16)",
                    cursor: activeTemplate === "custom" ? "grab" : "default",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: draggingField === fieldId ? "none" : "box-shadow 0.2s",
                    boxShadow: draggingField === fieldId 
                      ? "0 25px 50px rgba(15,23,42,0.25)" 
                      : "0 18px 40px rgba(15,23,42,0.16)"
                  }}
                >
                  <QRCodeSVG value={value} size={116} fgColor={customConfig.secondary === "#ffffff" ? "#000" : customConfig.secondary} />
                </div>
              );
            }

            return (
              <div
                key={fieldId}
                onMouseDown={(e) => startDrag(fieldId, e)}
                style={{
                  position: "absolute",
                  top: position.y,
                  left: position.x,
                  minWidth: 170,
                  maxWidth: 180,
                  padding: "0.95rem 1rem",
                  borderRadius: 18,
                  background: "rgba(255,255,255,0.92)",
                  color: "#111827",
                  boxShadow: draggingField === fieldId 
                    ? "0 25px 50px rgba(15,23,42,0.25)" 
                    : "0 18px 40px rgba(15,23,42,0.16)",
                  cursor: activeTemplate === "custom" ? "grab" : "default",
                  border: `1px solid ${customConfig.accent}22`,
                  transition: draggingField === fieldId ? "none" : "box-shadow 0.2s",
                  userSelect: "none"
                }}
              >
                <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8, color: customConfig.accent }}>
                  {label}
                </div>
                <div style={{ fontSize: "1rem", fontWeight: 800, lineHeight: 1.2 }}>{value}</div>
              </div>
            );
          })}

          <div style={{ position: "absolute", bottom: 18, left: 24, right: 24, height: 10, background: customConfig.accent, borderRadius: 999, opacity: 0.8 }} />

          {customText.footer && (
            <div style={{ position: "absolute", bottom: 34, left: 24, right: 24, textAlign: "center", fontSize: "0.78rem", letterSpacing: "0.14em", color: customConfig.secondary, opacity: 0.85 }}>
              {customText.footer}
            </div>
          )}
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .ticket-designer-container .form-group { margin-bottom: 1.5rem; }
        .ticket-designer-container .form-label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: #374151; font-size: 0.9rem; }
        .ticket-designer-container .select-field { width: 100%; padding: 0.75rem; border: 1px solid #e5e7eb; border-radius: 10px; font-size: 0.9rem; }
      `
        }}
      />
    </div>
  );
}

export default TicketDesigner;
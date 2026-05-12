import { useState, useEffect, useRef } from "react";
import api from "../../api/api";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas";

// Drag and drop helper component
const DraggableField = ({ 
  fieldId, 
  isSelected, 
  onMouseDown, 
  isDragging, 
  children, 
  showDragHandle = false
}) => {
  const isDraggable = isSelected && !isDragging;
  
  return (
    <div
      onMouseDown={isDraggable ? onMouseDown : null}
      style={{
        position: 'relative',
        cursor: isDraggable ? 'grab' : 'default',
        opacity: isDraggable ? 1 : 0.7,
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.4rem'
      }}
      title={isDraggable ? 'Drag to reposition' : 'Enable field to drag'}
    >
      <div style={{ flex: 1 }}>
        {children}
      </div>
    </div>
  );
};

const TEMPLATES = {
  classic: {
    name: "Custom",
    primary: "#ffffff",
    secondary: "#111827",
    accent: "#111827",
    font: "Inter, sans-serif",
    backgroundType: "solid",
    gradientStart: "#10b981",
    gradientEnd: "#3b82f6",
    gradientAngle: 150,
    selectedFields: ["event_name", "event_date", "event_location", "participant_name", "ticket_id", "qr_code"],
    fieldPositions: {
      event_name: { x: 24, y: 140 },
      event_date: { x: 24, y: 210 },
      event_location: { x: 24, y: 280 },
      participant_name: { x: 24, y: 350 },
      ticket_id: { x: 24, y: 420 },
      qr_code: { x: 236, y: 320 }
    }
  },
  pro: {
    name: "Premium",
    primary: "#111827",
    secondary: "#f8fafc",
    accent: "#f59e0b",
    font: "Space Grotesk, sans-serif",
    backgroundType: "gradient",
    gradientStart: "#0f172a",
    gradientEnd: "#6366f1",
    gradientAngle: 140,
    selectedFields: ["event_name", "event_date", "event_time", "event_location", "participant_name", "qr_code"],
    fieldPositions: {
      event_name: { x: 24, y: 140 },
      event_date: { x: 24, y: 206 },
      event_time: { x: 24, y: 260 },
      event_location: { x: 24, y: 314 },
      participant_name: { x: 24, y: 370 },
      qr_code: { x: 236, y: 320 }
    }
  },
  premium: {
    name: "Classic",
    primary: "#111827",
    secondary: "#fbbf24",
    accent: "#fbbf24",
    font: "Playfair Display, serif",
    backgroundType: "gradient",
    gradientStart: "#111827",
    gradientEnd: "#fbbf24",
    gradientAngle: 130,
    selectedFields: ["event_name", "event_date", "event_location", "organization", "participant_name", "qr_code"],
    fieldPositions: {
      event_name: { x: 24, y: 140 },
      event_date: { x: 24, y: 206 },
      event_location: { x: 24, y: 260 },
      organization: { x: 24, y: 324 },
      participant_name: { x: 24, y: 388 },
      qr_code: { x: 236, y: 320 }
    }
  }
};

const DEFAULT_CONFIG = {
  ...TEMPLATES.classic,
  selectedFields: TEMPLATES.classic.selectedFields,
  fieldPositions: TEMPLATES.classic.fieldPositions
};

const FIELD_OPTIONS = [
  { id: "event_name", label: "Event Name" },
  { id: "event_date", label: "Event Date" },
  { id: "event_time", label: "Event Time" },
  { id: "event_location", label: "Event Location" },
  { id: "participant_name", label: "Participant Name" },
  { id: "organization", label: "Organization" },
  { id: "ticket_id", label: "Ticket ID" },
  { id: "event_description", label: "Event Description" },
  { id: "logo", label: "Event Logo" },
  { id: "qr_code", label: "QR Code" }
];

function TicketPage() {
  const [activeTab, setActiveTab] = useState("designer");
  const [events, setEvents] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [activeTemplate, setActiveTemplate] = useState("classic");
  const [customConfig, setCustomConfig] = useState(DEFAULT_CONFIG);
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

  // Auto-save template on changes (debounced)
  useEffect(() => {
    if (!selectedEventId) return;
    
    const autoSaveTimer = setTimeout(async () => {
      try {
        await api.saveTicketTemplate({
          event_id: selectedEventId,
          template_type: activeTemplate,
          config: customConfig,
          customText,
          logo
        });
        console.log('✅ Template auto-saved');
      } catch (err) {
        console.error('Auto-save failed:', err);
      }
    }, 1500); // Save after 1.5 seconds of inactivity

    return () => clearTimeout(autoSaveTimer);
  }, [customConfig, customText, logo, activeTemplate, selectedEventId]);

  const fetchEvents = async () => {
    try {
      const res = await api.getEvents(1, 100);
      if (res.success) setEvents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTemplates = async () => {
    setManagerLoading(true);
    try {
      const res = await api.getTicketTemplatesList();
      if (res.success) setTemplates(res.data);
    } catch (err) {
      console.error(err);
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
      console.error(err);
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
    if (!selectedEventId) return;
    e.stopPropagation();
    const rect = ticketRef.current?.getBoundingClientRect();
    if (!rect) return;
    const current = customConfig.fieldPositions[fieldId] || { x: 28, y: 180 };
    setDraggingField(fieldId);
    setDragOffset({ x: e.clientX - rect.left - current.x, y: e.clientY - rect.top - current.y });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!draggingField || !ticketRef.current) return;
      const rect = ticketRef.current.getBoundingClientRect();
      const nextX = e.clientX - rect.left - dragOffset.x;
      const nextY = e.clientY - rect.top - dragOffset.y;
      setCustomConfig((prev) => ({
        ...prev,
        fieldPositions: {
          ...prev.fieldPositions,
          [draggingField]: {
            x: Math.max(10, Math.min(nextX, rect.width - 160)),
            y: Math.max(120, Math.min(nextY, rect.height - 160))
          }
        }
      }));
    };

    const handleMouseUp = () => {
      if (draggingField) setDraggingField(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggingField, dragOffset]);

  const selectedEvent = events.find((e) => e.event_id.toString() === selectedEventId);

  const fieldValues = {
    event_name: selectedEvent?.event_name || "Event Name",
    event_date: selectedEvent
      ? new Date(selectedEvent.start_date_time).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
      : "12 Sep 2026",
    event_time: selectedEvent
      ? new Date(selectedEvent.start_date_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "12:00 PM",
    event_location: selectedEvent?.address || "World Trade Center, Mumbai",
    participant_name: "Participant Name",
    organization: selectedEvent?.organization || "Organization",
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
      console.error(err);
      setStatus({ type: "error", msg: "Download failed. Please try again." });
      setTimeout(() => setStatus({ type: "", msg: "" }), 3000);
    }
  };

  const handleLogoUpload = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setLogo(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSponsorLogoUpload = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setCustomText((prev) => ({ ...prev, sponsorLogos: [...(prev.sponsorLogos || []), reader.result] }));
    };
    reader.readAsDataURL(file);
  };

  const removeSponsorLogo = (index) => {
    setCustomText((prev) => ({ ...prev, sponsorLogos: prev.sponsorLogos.filter((_, idx) => idx !== index) }));
  };

  return (
    <div style={{ height: 'calc(100vh - 100px)', padding: '1rem', background: '#04060d', color: '#fff', display: 'flex', gap: '1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '1rem', width: '100%', height: '100%' }}>
        <div style={{ background: '#08101f', border: '1px solid #22314f', borderRadius: '28px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', overflow: 'hidden', height: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid #16203a', flexShrink: 0 }}>
            <button
              onClick={() => setActiveTab('designer')}
              style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '0.95rem', fontWeight: 700, opacity: activeTab === 'designer' ? 1 : 0.65, cursor: 'pointer', padding: 0 }}
            >
              Designer
            </button>
            <div style={{ width: 1, height: 20, background: '#334155', margin: '0 0.75rem' }} />
            <button
              onClick={() => setActiveTab('manager')}
              style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '0.95rem', fontWeight: 700, opacity: activeTab === 'manager' ? 1 : 0.65, cursor: 'pointer', padding: 0 }}
            >
              Manager
            </button>
          </div>

          <div style={{ display: 'grid', gap: '0.75rem', overflowY: 'auto', flex: 1, paddingRight: '0.5rem' }}>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              <label style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600 }}>Select Event</label>
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                style={{ width: '100%', borderRadius: '14px', border: '1px solid #334155', background: '#0b1627', color: '#fff', padding: '0.75rem 0.85rem', fontSize: '0.9rem' }}
              >
                <option value='' style={{ color: '#64748b' }}>Choose an event...</option>
                {events.map((event) => (
                  <option key={event.event_id} value={event.event_id}>{event.event_name}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div style={{ border: '1px solid #334155', borderRadius: '16px', padding: '0.85rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.65rem', color: '#fff' }}>Background</div>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  {['solid', 'gradient'].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setCustomConfig((prev) => ({ ...prev, backgroundType: mode }))}
                      style={{
                        flex: 1,
                        borderRadius: '10px',
                        border: customConfig.backgroundType === mode ? '1px solid #fff' : '1px solid #334155',
                        background: customConfig.backgroundType === mode ? '#fff' : 'transparent',
                        color: customConfig.backgroundType === mode ? '#0f172a' : '#cbd5e1',
                        padding: '0.6rem 0.5rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                      }}
                    >
                      {mode === 'solid' ? 'Solid' : 'Grad'}
                    </button>
                  ))}
                </div>
                <div style={{ marginTop: '0.75rem', display: 'grid', gap: '0.6rem' }}>
                  {customConfig.backgroundType === 'solid' ? (
                    <input
                      type='color'
                      value={customConfig.primary}
                      onChange={(e) => setCustomConfig((prev) => ({ ...prev, primary: e.target.value }))}
                      style={{ width: '100%', height: '40px', borderRadius: '12px', border: 'none', cursor: 'pointer' }}
                    />
                  ) : (
                    <>
                      <input
                        type='color'
                        value={customConfig.gradientStart}
                        onChange={(e) => setCustomConfig((prev) => ({ ...prev, gradientStart: e.target.value }))}
                        style={{ width: '100%', height: '40px', borderRadius: '12px', border: 'none', cursor: 'pointer' }}
                      />
                      <input
                        type='color'
                        value={customConfig.gradientEnd}
                        onChange={(e) => setCustomConfig((prev) => ({ ...prev, gradientEnd: e.target.value }))}
                        style={{ width: '100%', height: '40px', borderRadius: '12px', border: 'none', cursor: 'pointer' }}
                      />
                    </>
                  )}
                </div>
              </div>

              <div style={{ border: '1px solid #334155', borderRadius: '16px', padding: '0.85rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.65rem', color: '#fff' }}>Templates</div>
                <div style={{ display: 'grid', gap: '0.4rem', paddingLeft: '0.5rem' }}>
                  {Object.entries(TEMPLATES).map(([key, template]) => (
                    <button
                      key={key}
                      onClick={() => { handleTemplateChange(key); setActiveTab('designer'); }}
                      style={{
                        textAlign: 'left',
                        padding: '0.4rem 0',
                        border: 'none',
                        background: 'transparent',
                        color: activeTemplate === key ? '#fff' : '#94a3b8',
                        fontWeight: activeTemplate === key ? 700 : 500,
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      • {template.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ border: '1px solid #334155', borderRadius: '16px', padding: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>Accent Color</div>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: customConfig.accent, border: '1px solid #fff' }} />
              </div>
              <input
                type='color'
                value={customConfig.accent}
                onChange={(e) => setCustomConfig((prev) => ({ ...prev, accent: e.target.value }))}
                style={{ width: '100%', height: '40px', borderRadius: '12px', border: 'none', cursor: 'pointer' }}
              />
            </div>

            <div style={{ border: '1px solid #334155', borderRadius: '16px', padding: '0.85rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.65rem', color: '#fff' }}>Ticket Fields</div>
              <div style={{ display: 'grid', gap: '0.5rem', paddingLeft: '0.5rem' }}>
                {FIELD_OPTIONS.map((field) => (
                  <label 
                    key={field.id} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.6rem', 
                      color: customConfig.selectedFields.includes(field.id) ? '#ffffff' : '#94a3b8',
                      fontSize: '0.9rem',
                      padding: '0.4rem 0.4rem',
                      borderRadius: '8px',
                      background: customConfig.selectedFields.includes(field.id) ? 'rgba(100, 150, 255, 0.08)' : 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <input
                      type='checkbox'
                      checked={customConfig.selectedFields.includes(field.id)}
                      onChange={() => handleFieldToggle(field.id)}
                      style={{ 
                        accent: customConfig.accent, 
                        width: '16px', 
                        height: '16px',
                        cursor: 'pointer'
                      }}
                    />
                    <span>{field.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div style={{ border: '1px solid #334155', borderRadius: '16px', padding: '0.85rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.6rem', color: '#fff' }}>Sponsors</div>
                <input
                  type='text'
                  placeholder='Text'
                  value={customText.sponsorText || ''}
                  onChange={(e) => setCustomText((prev) => ({ ...prev, sponsorText: e.target.value }))}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid #334155', background: '#0b1627', color: '#fff', fontSize: '0.9rem' }}
                />
              </div>
              <div style={{ border: '1px solid #334155', borderRadius: '16px', padding: '0.85rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.6rem', color: '#fff' }}>Sponsors Logo</div>
                <input
                  type='file'
                  accept='image/*'
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleSponsorLogoUpload(file);
                  }}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid #334155', background: '#0b1627', color: '#fff', cursor: 'pointer', fontSize: '0.9rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{ flex: 1, padding: '0.8rem', borderRadius: '14px', border: '1px solid #fff', background: 'transparent', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleDownload}
                disabled={!selectedEventId}
                style={{ flex: 1, padding: '0.8rem', borderRadius: '14px', border: '1px solid #fff', background: '#fff', color: '#0f172a', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}
              >
                Download
              </button>
            </div>

            {status.msg && (
              <div style={{ marginTop: '0.5rem', padding: '0.8rem', borderRadius: '12px', background: status.type === 'success' ? '#064e3b' : '#7f1d1d', color: '#fff', fontSize: '0.85rem' }}>
                {status.msg}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
          {activeTab === 'designer' ? (
            <div style={{ background: '#04060d', borderRadius: '24px', padding: '1.5rem', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Ticket Preview */}
              <div style={{ borderRadius: '24px', padding: '1.5rem', flex: 1, overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div
                ref={ticketRef}
                style={{
                  width: '280px',
                  height: '450px',
                  background: customConfig.backgroundType === 'gradient'
                    ? `linear-gradient(${customConfig.gradientAngle}deg, ${customConfig.gradientStart}, ${customConfig.gradientEnd})`
                    : customConfig.primary,
                  borderRadius: '16px',
                  boxShadow: draggingField ? '0 32px 120px rgba(0, 100, 255, 0.4)' : '0 32px 90px rgba(0, 0, 0, 0.32)',
                  position: 'relative',
                  overflow: 'hidden',
                  color: customConfig.secondary,
                  fontFamily: customConfig.font,
                  border: draggingField ? '2px solid rgba(100, 150, 255, 0.5)' : '2px solid rgba(255,255,255,0.15)',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
              >
                {/* Title Row - Conditional */}
                {customConfig.selectedFields.includes('event_name') && (
                  <DraggableField 
                    fieldId="event_name" 
                    isSelected={customConfig.selectedFields.includes('event_name')}
                    isDragging={draggingField === 'event_name'}
                    onMouseDown={(e) => startDrag('event_name', e)}
                    showDragHandle={true}
                  >
                    <div style={{ textAlign: 'center', paddingBottom: '6px', borderBottom: '1px solid rgba(255,255,255,0.15)', width: '100%' }}>
                      <div
                        style={{
                          position: 'relative',
                          fontSize: '1.4rem',
                          fontWeight: 900,
                          lineHeight: 1.1,
                          color: '#ffffff'
                        }}
                      >
                        {selectedEvent?.event_name || 'Event Name'}
                      </div>
                      <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', marginTop: '3px', opacity: 0.9 }}>PASS</div>
                    </div>
                  </DraggableField>
                )}

                {/* Participant Avatar & Info */}
                {(customConfig.selectedFields.includes('participant_name') || customConfig.selectedFields.includes('organization')) && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', paddingY: '8px' }}>
                    <div
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.92)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem',
                        fontWeight: 900,
                        color: customConfig.accent,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                      }}
                    >
                      👤
                    </div>
                    <div style={{ textAlign: 'center', color: '#ffffff' }}>
                      {customConfig.selectedFields.includes('participant_name') && (
                        <DraggableField 
                          fieldId="participant_name" 
                          isSelected={true}
                          isDragging={draggingField === 'participant_name'}
                          onMouseDown={(e) => startDrag('participant_name', e)}
                          showDragHandle={true}
                        >
                          <div
                            style={{
                              fontSize: '0.85rem',
                              fontWeight: 800,
                              position: 'relative'
                            }}
                          >
                            {fieldValues.participant_name}
                          </div>
                        </DraggableField>
                      )}
                      {customConfig.selectedFields.includes('organization') && (
                        <DraggableField 
                          fieldId="organization" 
                          isSelected={true}
                          isDragging={draggingField === 'organization'}
                          onMouseDown={(e) => startDrag('organization', e)}
                          showDragHandle={true}
                        >
                          <div
                            style={{
                              fontSize: '0.65rem',
                              opacity: 0.85,
                              marginTop: '1px',
                              position: 'relative'
                            }}
                          >
                            {fieldValues.organization || 'Organization'}
                          </div>
                        </DraggableField>
                      )}
                    </div>
                  </div>
                )}

                {/* Event Address - Conditional */}
                {customConfig.selectedFields.includes('event_location') && (
                  <DraggableField 
                    fieldId="event_location" 
                    isSelected={true}
                    isDragging={draggingField === 'event_location'}
                    onMouseDown={(e) => startDrag('event_location', e)}
                    showDragHandle={true}
                  >
                    <div
                      style={{
                        fontSize: '0.7rem',
                        textAlign: 'center',
                        opacity: 0.9,
                        paddingY: '4px',
                        position: 'relative'
                      }}
                    >
                      {fieldValues.event_location}
                    </div>
                  </DraggableField>
                )}

                {/* Bottom Section: Date/Time/PassCode | QR Code */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', flex: 1 }}>
                  {/* Left Column: Date, Time, PassCode */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                      {customConfig.selectedFields.includes('event_date') && (
                        <DraggableField 
                          fieldId="event_date" 
                          isSelected={true}
                          isDragging={draggingField === 'event_date'}
                          onMouseDown={(e) => startDrag('event_date', e)}
                          showDragHandle={true}
                        >
                          <div style={{ fontSize: '0.6rem', opacity: 0.8, textAlign: 'center' }}>
                            <div style={{ fontSize: '0.7rem', fontWeight: 700 }}>
                              {fieldValues.event_date}
                            </div>
                            <div style={{ fontSize: '0.55rem', opacity: 0.8 }}>Date</div>
                          </div>
                        </DraggableField>
                      )}
                      {customConfig.selectedFields.includes('event_time') && (
                        <DraggableField 
                          fieldId="event_time" 
                          isSelected={true}
                          isDragging={draggingField === 'event_time'}
                          onMouseDown={(e) => startDrag('event_time', e)}
                          showDragHandle={true}
                        >
                          <div style={{ fontSize: '0.6rem', opacity: 0.8, textAlign: 'center' }}>
                            <div style={{ fontSize: '0.7rem', fontWeight: 700 }}>
                              {fieldValues.event_time}
                            </div>
                            <div style={{ fontSize: '0.55rem', opacity: 0.8 }}>Time</div>
                          </div>
                        </DraggableField>
                      )}
                    </div>
                    {customConfig.selectedFields.includes('ticket_id') && (
                      <DraggableField 
                        fieldId="ticket_id" 
                        isSelected={true}
                        isDragging={draggingField === 'ticket_id'}
                        onMouseDown={(e) => startDrag('ticket_id', e)}
                        showDragHandle={true}
                      >
                        <div style={{ border: '1px solid rgba(255,255,255,0.3)', borderRadius: '8px', padding: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                          <div style={{ fontSize: '0.6rem', fontWeight: 700, opacity: 0.8 }}>PassCode</div>
                          <div
                            style={{
                              fontSize: '0.65rem',
                              fontWeight: 700,
                              letterSpacing: '0.08em',
                              color: '#ffffff',
                              textAlign: 'center',
                              wordBreak: 'break-all',
                              padding: '4px 2px'
                            }}
                          >
                            {fieldValues.ticket_id}
                          </div>
                        </div>
                      </DraggableField>
                    )}
                  </div>

                  {/* Right Column: Main QR Code - Conditional */}
                  {customConfig.selectedFields.includes('qr_code') && (
                    <DraggableField 
                      fieldId="qr_code" 
                      isSelected={true}
                      isDragging={draggingField === 'qr_code'}
                      onMouseDown={(e) => startDrag('qr_code', e)}
                      showDragHandle={true}
                    >
                      <div
                        style={{
                          border: '1px solid rgba(255,255,255,0.3)',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                          flex: 1
                        }}
                      >
                        <QRCodeSVG value={fieldValues.qr_code} size={100} fgColor={customConfig.secondary === '#ffffff' ? '#000' : customConfig.secondary} />
                      </div>
                    </DraggableField>
                  )}
                </div>
              </div>
            </div>
            </div>
          ) : (
            <div style={{ background: '#0b1627', borderRadius: '22px', padding: '1.5rem', flex: 1, overflowY: 'auto', overflowX: 'hidden', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', gap: '1rem', flexWrap: 'wrap' }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800 }}>Ticket Management</h2>
                  <p style={{ margin: '0.35rem 0 0', color: '#94a3b8', fontSize: '0.85rem' }}>Manage saved templates</p>
                </div>
                <button
                  onClick={() => setActiveTab('designer')}
                  style={{ padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #fff', background: 'transparent', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 }}
                >
                  New Ticket
                </button>
              </div>

              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {managerLoading ? (
                  <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Loading ticket templates…</div>
                ) : templates.length === 0 ? (
                  <div style={{ padding: '1.25rem', borderRadius: '16px', background: '#0f172a', color: '#94a3b8', fontSize: '0.9rem' }}>
                    No ticket templates saved yet.
                  </div>
                ) : (
                  templates.map((template) => {
                    const event = events.find((evt) => evt.event_id === template.event_id);
                    return (
                      <div key={template.event_id} style={{ borderRadius: '14px', border: '1px solid #334155', padding: '1rem', display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', wordBreak: 'break-word' }}>{event?.event_name || `Event ${template.event_id}`}</div>
                          <div style={{ marginTop: '0.25rem', color: '#94a3b8', fontSize: '0.8rem' }}>{(template.config?.selectedFields || []).length} Fields · {new Date(template.updated_at).toLocaleDateString()}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                          <button
                            onClick={() => {
                              setSelectedEventId(template.event_id.toString());
                              setActiveTab('designer');
                            }}
                            style={{ padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #fff', background: 'transparent', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={handleDownload}
                            style={{ padding: '0.65rem 0.85rem', borderRadius: '10px', border: 'none', background: '#fff', color: '#0f172a', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                          >
                            Download
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TicketPage;

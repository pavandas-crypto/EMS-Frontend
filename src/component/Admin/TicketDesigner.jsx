import { useState, useEffect } from "react";
import api from "../../api/api";
import { QRCodeSVG } from "qrcode.react";

const TEMPLATES = {
  classic: {
    name: "Classic",
    primary: "#ffffff",
    secondary: "#111827",
    accent: "#3b82f6",
    font: "Inter, sans-serif",
    layout: "centered"
  },
  pro: {
    name: "Pro",
    primary: "#0f172a",
    secondary: "#f8fafc",
    accent: "#6366f1",
    font: "Space Grotesk, sans-serif",
    layout: "modern"
  },
  premium: {
    name: "Premium",
    primary: "#1a1a1a",
    secondary: "#fbbf24",
    accent: "#fbbf24",
    font: "Playfair Display, serif",
    layout: "luxury"
  }
};

function TicketDesigner() {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [activeTemplate, setActiveTemplate] = useState("classic");
  const [customConfig, setCustomConfig] = useState(TEMPLATES.classic);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", msg: "" });

  useEffect(() => {
    fetchEvents();
  }, []);

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

  useEffect(() => {
    if (selectedEventId) {
      fetchTemplate();
    }
  }, [selectedEventId]);

  const fetchTemplate = async () => {
    try {
      const res = await api.getTicketTemplate(selectedEventId);
      if (res.success && res.data) {
        setActiveTemplate(res.data.template_type);
        setCustomConfig(res.data.config);
      } else {
        // Reset to default for new event
        handleTemplateChange("classic");
      }
    } catch (err) {
      console.error("Failed to fetch template:", err);
    }
  };

  const handleTemplateChange = (key) => {
    setActiveTemplate(key);
    setCustomConfig(TEMPLATES[key]);
  };

  const handleSave = async () => {
    if (!selectedEventId) {
      setStatus({ type: "error", msg: "Please select an event first" });
      return;
    }
    setSaving(true);
    try {
      await api.saveTicketTemplate({ 
        event_id: selectedEventId, 
        template_type: activeTemplate, 
        config: customConfig 
      });
      setStatus({ type: "success", msg: "Ticket template saved successfully!" });
    } catch (err) {
      setStatus({ type: "error", msg: err.message });
    } finally {
      setSaving(false);
      setTimeout(() => setStatus({ type: "", msg: "" }), 3000);
    }
  };

  const selectedEvent = events.find(e => e.event_id.toString() === selectedEventId);

  return (
    <div className="ticket-designer-container" style={{ display: 'flex', gap: '2rem', padding: '1rem', height: 'calc(100vh - 100px)' }}>
      {/* Sidebar - Controls */}
      <div className="designer-sidebar" style={{ width: '350px', background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e5e7eb', overflowY: 'auto' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Ticket Designer</h2>
        
        <div className="form-group">
          <label className="form-label">Select Event</label>
          <select 
            className="select-field" 
            value={selectedEventId} 
            onChange={(e) => setSelectedEventId(e.target.value)}
          >
            <option value="">Choose an event...</option>
            {events.map(ev => (
              <option key={ev.event_id} value={ev.event_id}>{ev.event_name}</option>
            ))}
          </select>
        </div>

        <div className="template-selector" style={{ marginTop: '2rem' }}>
          <label className="form-label">Templates</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
            {Object.entries(TEMPLATES).map(([key, t]) => (
              <button
                key={key}
                onClick={() => handleTemplateChange(key)}
                style={{
                  padding: '0.75rem 0.5rem',
                  borderRadius: '12px',
                  border: activeTemplate === key ? '2px solid #6366f1' : '1px solid #e5e7eb',
                  background: activeTemplate === key ? '#f5f3ff' : '#fff',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>

        <div className="customization-panel" style={{ marginTop: '2rem' }}>
          <label className="form-label">Colors & Branding</label>
          <div className="form-group">
            <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>Primary Color</span>
            <input 
              type="color" 
              value={customConfig.primary} 
              onChange={(e) => setCustomConfig({...customConfig, primary: e.target.value})}
              style={{ width: '100%', height: '40px', border: 'none', padding: 0, background: 'none', cursor: 'pointer' }}
            />
          </div>
          <div className="form-group">
            <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>Secondary Color</span>
            <input 
              type="color" 
              value={customConfig.secondary} 
              onChange={(e) => setCustomConfig({...customConfig, secondary: e.target.value})}
              style={{ width: '100%', height: '40px', border: 'none', padding: 0, background: 'none', cursor: 'pointer' }}
            />
          </div>
          <div className="form-group">
            <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>Accent Color</span>
            <input 
              type="color" 
              value={customConfig.accent} 
              onChange={(e) => setCustomConfig({...customConfig, accent: e.target.value})}
              style={{ width: '100%', height: '40px', border: 'none', padding: 0, background: 'none', cursor: 'pointer' }}
            />
          </div>
        </div>

        <button 
          className="button button-primary" 
          style={{ width: '100%', marginTop: '2rem' }}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Template"}
        </button>

        {status.msg && (
          <div className={`alert alert-${status.type}`} style={{ marginTop: '1rem', fontSize: '0.8rem' }}>
            {status.msg}
          </div>
        )}
      </div>

      {/* Preview Area */}
      <div className="designer-preview" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#f1f5f9', borderRadius: '16px', padding: '2rem', overflow: 'hidden' }}>
        <div style={{ marginBottom: '1rem', color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>Mobile Preview</div>
        
        {/* Ticket Mockup (Mobile Screen) */}
        <div 
          className="ticket-mockup" 
          style={{ 
            width: '375px', 
            height: '667px', 
            background: customConfig.primary, 
            borderRadius: '24px', 
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            position: 'relative',
            color: customConfig.secondary,
            fontFamily: customConfig.font,
            border: activeTemplate === 'premium' ? `4px solid ${customConfig.secondary}` : 'none'
          }}
        >
          {/* Decorative Pattern for Premium */}
          {activeTemplate === 'premium' && (
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1, backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
          )}

          {/* Top Notch Effect */}
          <div style={{ height: '30px', background: 'rgba(0,0,0,0.05)', width: '100%', position: 'relative', zIndex: 2 }}></div>

          {/* Ticket Header */}
          <div style={{ padding: '2.5rem 1.5rem', textAlign: 'center', position: 'relative', zIndex: 2 }}>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.8, marginBottom: '0.75rem', fontWeight: 700 }}>
              {activeTemplate === 'premium' ? "✦ Exclusive Invitation ✦" : "Official Event Entry"}
            </div>
            <h1 style={{ 
              fontSize: activeTemplate === 'premium' ? '1.8rem' : '1.5rem', 
              fontWeight: 900, 
              margin: 0, 
              lineHeight: 1.1,
              fontFamily: customConfig.font
            }}>
              {selectedEvent?.event_name || "Awesome Tech Event"}
            </h1>
          </div>

          {/* Ticket Main Content */}
          <div style={{ flex: 1, padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: `1px ${activeTemplate === 'premium' ? 'solid' : 'dashed'} ${customConfig.secondary}44`, paddingTop: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '0.65rem', opacity: 0.6, fontWeight: 700, letterSpacing: '0.05em' }}>DATE</div>
                <div style={{ fontSize: '1rem', fontWeight: 700 }}>{selectedEvent ? new Date(selectedEvent.start_date_time).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'}) : "JUN 15, 2026"}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.65rem', opacity: 0.6, fontWeight: 700, letterSpacing: '0.05em' }}>TIME</div>
                <div style={{ fontSize: '1rem', fontWeight: 700 }}>{selectedEvent ? new Date(selectedEvent.start_date_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "09:00 AM"}</div>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.65rem', opacity: 0.6, fontWeight: 700, letterSpacing: '0.05em' }}>LOCATION</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>{selectedEvent?.address || "World Trade Center, Mumbai"}</div>
            </div>

            <div style={{ 
              background: activeTemplate === 'pro' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)', 
              padding: '1.25rem', 
              borderRadius: '16px',
              border: activeTemplate === 'premium' ? `1px solid ${customConfig.secondary}33` : 'none'
            }}>
              <div style={{ fontSize: '0.65rem', opacity: 0.6, fontWeight: 700, letterSpacing: '0.05em' }}>PARTICIPANT</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900 }}>John Doe</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.7, fontWeight: 600, marginTop: '2px' }}>Pass ID: DX-2026-001</div>
            </div>

            {/* QR Code Section */}
            <div style={{ 
              marginTop: 'auto', 
              marginBottom: '2.5rem',
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              gap: '1.25rem'
            }}>
              <div style={{ 
                padding: '1.25rem', 
                background: '#fff', 
                borderRadius: '20px',
                boxShadow: activeTemplate === 'pro' ? `0 0 20px ${customConfig.accent}44` : '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                border: activeTemplate === 'premium' ? `2px solid ${customConfig.secondary}` : 'none'
              }}>
                <QRCodeSVG 
                  value="QR_SAMPLE_DATA" 
                  size={140} 
                  fgColor={activeTemplate === 'classic' ? '#000' : customConfig.primary === '#ffffff' ? '#000' : (activeTemplate === 'pro' ? '#000' : '#000')}
                />
              </div>
              <div style={{ 
                fontSize: '0.65rem', 
                opacity: 0.5, 
                fontWeight: 800, 
                letterSpacing: '0.3em',
                color: activeTemplate === 'pro' ? customConfig.accent : 'inherit'
              }}>
                SCAN FOR ENTRY
              </div>
            </div>
          </div>

          {/* Bottom Cutout Effect */}
          <div style={{ 
            height: '12px', 
            background: activeTemplate === 'pro' ? `linear-gradient(90deg, ${customConfig.accent}, ${customConfig.secondary})` : customConfig.accent, 
            width: '100%',
            marginTop: 'auto',
            position: 'relative',
            zIndex: 2
          }}></div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .ticket-designer-container .form-group { margin-bottom: 1.5rem; }
        .ticket-designer-container .form-label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: #374151; font-size: 0.9rem; }
        .ticket-designer-container .select-field { width: 100%; padding: 0.75rem; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 0.9rem; }
      `}} />
    </div>
  );
}

export default TicketDesigner;

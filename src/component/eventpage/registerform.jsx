import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";

function RegisterForm() {
  const { eventId: urlEventId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    event: urlEventId || "",
  });
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{8,15}$/;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.getEvents(1, 100);
        if (response.success) {
          setEvents(response.data);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setStatus({ type: "", message: "" });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {};

    if (!formData.name.trim()) nextErrors.name = "Full name is required.";
    if (!formData.email.trim()) nextErrors.email = "Email address is required.";
    else if (!emailRegex.test(formData.email)) nextErrors.email = "Enter a valid email address.";
    if (!formData.phone.trim()) nextErrors.phone = "Phone number is required.";
    else if (!phoneRegex.test(formData.phone)) nextErrors.phone = "Enter a valid numeric phone number.";
    if (!formData.event) nextErrors.event = "Please select the event you want to join.";

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus({ type: "error", message: "Please fix the highlighted fields." });
      return;
    }

    setLoading(true);
    try {
      const response = await api.registerForEvent({
        event_id: formData.event,
        participant_name: formData.name,
        participant_email: formData.email,
        participant_phone: formData.phone,
      });

      if (response.success) {
        setStatus({ type: "success", message: "Registration successful! You will receive your ticket via email." });
        // Optionally redirect or show success screen
        setTimeout(() => navigate(`/event/${formData.event}`), 3000);
      }
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Registration failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell auth-shell">
      <div className="panel card" style={{ maxWidth: "640px", margin: "0 auto" }}>
        <div className="card-header panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p className="panel-label">Event registration</p>
            <h1 className="page-title">Register for an event</h1>
          </div>
          <button 
            onClick={() => navigate(-1)} 
            className="button button-text"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666', fontWeight: 600 }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
            Back
          </button>
        </div>

        <div className="card-body">
          <p className="panel-copy">Complete the form below to validate participant details and event selection.</p>

          {status.message && (
            <div className={`alert ${status.type === "success" ? "alert-success" : "alert-error"}`}>
              {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className={`input-field ${errors.name ? "input-error" : ""}`}
                placeholder="Jane Doe"
              />
              {errors.name && <div className="field-error">{errors.name}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`input-field ${errors.email ? "input-error" : ""}`}
                placeholder="name@example.com"
              />
              {errors.email && <div className="field-error">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                Phone number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className={`input-field ${errors.phone ? "input-error" : ""}`}
                placeholder="9840xxxxxx"
              />
              {errors.phone && <div className="field-error">{errors.phone}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="event" className="form-label">
                Select event
              </label>
              <select
                id="event"
                name="event"
                value={formData.event}
                onChange={handleChange}
                className={`select-field ${errors.event ? "input-error" : ""}`}
              >
                <option value="">Choose an event</option>
                {events.map(ev => (
                  <option key={ev.event_id} value={ev.event_id}>
                    {ev.event_name}
                  </option>
                ))}
              </select>
              {errors.event && <div className="field-error">{errors.event}</div>}
            </div>

            <button 
              type="submit" 
              className="button button-primary" 
              style={{ width: "100%" }}
              disabled={loading}
            >
              {loading ? "Registering..." : "Validate registration"}
            </button>
          </form>

          <p className="form-note" style={{ marginTop: "1rem" }}>
            Only validation behavior is active in this demo. The form is styled to match the EMS design system.
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;

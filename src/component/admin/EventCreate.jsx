import { useState } from "react";
import RegistrationFormBuilder from "./RegistrationFormBuilder";
import SuccessPageBuilder from "./SuccessPageBuilder";

// Utility function to generate unique event ID
const generateEventId = () => {
  return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

function EventCreate() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    capacity: "",
    entryFee: "",
    category: "EVENT",
    additionalInfo: "",
  });
  const [organizer, setOrganizer] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Event Organizer",
    image: "",
  });
  const [registrationFields, setRegistrationFields] = useState([]);
  const [successPageConfig, setSuccessPageConfig] = useState(null);
  const [status, setStatus] = useState({ type: "", message: "", eventId: "" });
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState("event-details");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setStatus({ type: "", message: "", eventId: "" });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleOrganizerChange = (event) => {
    const { name, value } = event.target;
    setOrganizer((prev) => ({ ...prev, [name]: value }));
    setStatus({ type: "", message: "", eventId: "" });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};

    if (!formData.title.trim()) nextErrors.title = "Event title is required.";
    if (!formData.description.trim()) nextErrors.description = "Event description is required.";
    if (!formData.startDate) nextErrors.startDate = "Start date and time are required.";
    if (!formData.endDate) nextErrors.endDate = "End date and time are required.";
    if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
      nextErrors.endDate = "End time must be later than start time.";
    }
    if (!formData.location.trim()) nextErrors.location = "Event location is required.";

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus({ type: "error", message: "Please fix the highlighted fields to continue.", eventId: "" });
      return;
    }

    // Create new event object
    const eventId = generateEventId();
    const newEvent = {
      id: eventId,
      ...formData,
      capacity: formData.capacity ? parseInt(formData.capacity) : null,
      entryFee: formData.entryFee ? parseFloat(formData.entryFee) : 0,
      organizer: organizer.name ? organizer : null,
      registrationFields,
      successPageConfig,
      createdAt: new Date().toISOString(),
    };

    // Store event in localStorage
    try {
      const existingEvents = JSON.parse(localStorage.getItem("events")) || [];
      existingEvents.push(newEvent);
      localStorage.setItem("events", JSON.stringify(existingEvents));

      const landingPageUrl = `/event/${eventId}`;
      
      setStatus({
        type: "success",
        message: `Event "${formData.title}" created successfully! 🎉`,
        eventId: eventId,
        landingPageUrl: landingPageUrl,
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        location: "",
        capacity: "",
        entryFee: "",
        category: "EVENT",
        additionalInfo: "",
      });
      setOrganizer({
        name: "",
        email: "",
        phone: "",
        role: "Event Organizer",
        image: "",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: "Error creating event. Please try again.",
        eventId: "",
      });
      console.error("Event creation error:", error);
    }
  };

  return (
    <div className="page-shell">
      <div className="card" style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div className="card-header panel-header">
          <div>
            <p className="panel-label">Event builder</p>
            <h1 className="page-title">Create new event</h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="ec-tabs">
          <button
            className={`ec-tab ${activeTab === "event-details" ? "ec-tab--active" : ""}`}
            onClick={() => setActiveTab("event-details")}
          >
            Event Details
          </button>
          <button
            className={`ec-tab ${activeTab === "registration-form" ? "ec-tab--active" : ""}`}
            onClick={() => setActiveTab("registration-form")}
          >
            Registration Form
          </button>
          <button
            className={`ec-tab ${activeTab === "success-page" ? "ec-tab--active" : ""}`}
            onClick={() => setActiveTab("success-page")}
          >
            Success Page
          </button>
        </div>

        <div className="card-body">
          {/* Event Details Tab */}
          {activeTab === "event-details" && (
            <>
              <p className="panel-copy">Configure the basic event information and schedule.</p>

              {status.message && (
                <div className={`alert ${status.type === "success" ? "alert-success" : "alert-error"}`}>
                  {status.message}
                  {status.type === "success" && status.eventId && (
                    <div style={{ marginTop: "1rem" }}>
                      <p style={{ margin: "0.5rem 0 0" }}>
                        <strong>Landing Page URL:</strong>
                      </p>
                      <a 
                        href={status.landingPageUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-block",
                          marginTop: "0.5rem",
                          padding: "0.5rem 1rem",
                          background: "rgba(255, 255, 255, 0.2)",
                          borderRadius: "6px",
                          color: "white",
                          textDecoration: "none",
                          fontWeight: "500",
                          transition: "background 0.2s",
                        }}
                        onMouseOver={(e) => e.target.style.background = "rgba(255, 255, 255, 0.3)"}
                        onMouseOut={(e) => e.target.style.background = "rgba(255, 255, 255, 0.2)"}
                      >
                        View Event Landing Page →
                      </a>
                    </div>
                  )}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="title" className="form-label">
                    Event title
                  </label>
                  <input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`input-field ${errors.title ? "input-error" : ""}`}
                    placeholder="Enter event title"
                  />
                  {errors.title && <div className="field-error">{errors.title}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    className={`textarea-field ${errors.description ? "input-error" : ""}`}
                    placeholder="Describe the event purpose and expected outcomes"
                  />
                  {errors.description && <div className="field-error">{errors.description}</div>}
                </div>

                <div className="section-grid columns-2">
                  <div className="form-group">
                    <label htmlFor="startDate" className="form-label">
                      Start date & time
                    </label>
                    <input
                      id="startDate"
                      name="startDate"
                      type="datetime-local"
                      value={formData.startDate}
                      onChange={handleChange}
                      className={`input-field ${errors.startDate ? "input-error" : ""}`}
                    />
                    {errors.startDate && <div className="field-error">{errors.startDate}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="endDate" className="form-label">
                      End date & time
                    </label>
                    <input
                      id="endDate"
                      name="endDate"
                      type="datetime-local"
                      value={formData.endDate}
                      onChange={handleChange}
                      className={`input-field ${errors.endDate ? "input-error" : ""}`}
                    />
                    {errors.endDate && <div className="field-error">{errors.endDate}</div>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="location" className="form-label">
                    Location
                  </label>
                  <input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className={`input-field ${errors.location ? "input-error" : ""}`}
                    placeholder="Enter venue or online link"
                  />
                  {errors.location && <div className="field-error">{errors.location}</div>}
                </div>

                <div className="section-grid columns-2">
                  <div className="form-group">
                    <label htmlFor="category" className="form-label">
                      Event Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="input-field"
                    >
                      <option value="EVENT">Event</option>
                      <option value="CONFERENCE">Conference</option>
                      <option value="WORKSHOP">Workshop</option>
                      <option value="WEBINAR">Webinar</option>
                      <option value="MEETUP">Meetup</option>
                      <option value="GALA">Gala</option>
                      <option value="TRAINING">Training</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="capacity" className="form-label">
                      Capacity (Optional)
                    </label>
                    <input
                      id="capacity"
                      name="capacity"
                      type="number"
                      value={formData.capacity}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Maximum number of attendees"
                      min="1"
                    />
                  </div>
                </div>

                <div className="section-grid columns-2">
                  <div className="form-group">
                    <label htmlFor="entryFee" className="form-label">
                      Entry Fee (Optional)
                    </label>
                    <input
                      id="entryFee"
                      name="entryFee"
                      type="number"
                      value={formData.entryFee}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="additionalInfo" className="form-label">
                    Additional Information (Optional)
                  </label>
                  <textarea
                    id="additionalInfo"
                    name="additionalInfo"
                    rows="3"
                    value={formData.additionalInfo}
                    onChange={handleChange}
                    className="textarea-field"
                    placeholder="Any additional details about the event..."
                  />
                </div>

                {/* Organizer Section */}
                <div style={{
                  padding: "1.5rem",
                  background: "#f9fafb",
                  borderRadius: "8px",
                  marginTop: "2rem",
                  marginBottom: "1rem",
                  border: "1px solid #e5e7eb"
                }}>
                  <h3 style={{
                    fontSize: "1.1rem",
                    fontWeight: "700",
                    marginBottom: "1rem",
                    color: "#111827"
                  }}>Organizer Information (Optional)</h3>

                  <div className="section-grid columns-2">
                    <div className="form-group">
                      <label htmlFor="organizer-name" className="form-label">
                        Organizer Name
                      </label>
                      <input
                        id="organizer-name"
                        name="name"
                        value={organizer.name}
                        onChange={handleOrganizerChange}
                        className="input-field"
                        placeholder="Your name or organization"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="organizer-role" className="form-label">
                        Role/Title
                      </label>
                      <input
                        id="organizer-role"
                        name="role"
                        value={organizer.role}
                        onChange={handleOrganizerChange}
                        className="input-field"
                        placeholder="e.g., Event Manager"
                      />
                    </div>
                  </div>

                  <div className="section-grid columns-2">
                    <div className="form-group">
                      <label htmlFor="organizer-email" className="form-label">
                        Email
                      </label>
                      <input
                        id="organizer-email"
                        name="email"
                        type="email"
                        value={organizer.email}
                        onChange={handleOrganizerChange}
                        className="input-field"
                        placeholder="contact@example.com"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="organizer-phone" className="form-label">
                        Phone
                      </label>
                      <input
                        id="organizer-phone"
                        name="phone"
                        value={organizer.phone}
                        onChange={handleOrganizerChange}
                        className="input-field"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>
                </div>

                <button type="submit" className="button button-primary">
                  Create Event & Generate Landing Page
                </button>
              </form>
            </>
          )}

          {/* Registration Form Tab */}
          {activeTab === "registration-form" && (
            <>
              <p className="panel-copy">Customize the participant registration form fields.</p>
              <RegistrationFormBuilder
                onSave={(fields) => {
                  setRegistrationFields(fields);
                  setStatus({ type: "success", message: "Registration form fields saved successfully!" });
                }}
              />
            </>
          )}

          {/* Success Page Tab */}
          {activeTab === "success-page" && (
            <>
              <p className="panel-copy">Configure the page participants see after successful registration.</p>
              <SuccessPageBuilder
                onSave={(config) => {
                  setSuccessPageConfig(config);
                  setStatus({ type: "success", message: "Success page configuration saved successfully!" });
                }}
              />
            </>
          )}
        </div>
      </div>

      <style>{`
        .ec-tabs {
          display: flex;
          gap: 8px;
          border-bottom: 1px solid #e5e7eb;
          padding: 0 20px;
          background: #f9fafb;
        }

        .ec-tab {
          padding: 12px 16px;
          border: none;
          background: transparent;
          border-bottom: 3px solid transparent;
          font-size: 13px;
          font-weight: 600;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .ec-tab:hover {
          color: #111827;
          background: #f3f4f6;
        }

        .ec-tab--active {
          border-bottom-color: #fbbf24;
          color: #111827;
        }
      `}</style>
    </div>
  );
}

export default EventCreate;

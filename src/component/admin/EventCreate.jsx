import { useState, useEffect } from "react";
import RegistrationFormBuilder from "./RegistrationFormBuilder";
import SuccessPageBuilder from "./SuccessPageBuilder";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";

// Utility function to generate unique event ID
const generateEventId = () => {
  return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

function EventCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    startTime: "09:00",
    startPeriod: "AM",
    endDate: "",
    endTime: "05:00",
    endPeriod: "PM",
    location: "",
    capacity: "",
    entryFee: "",
    category: "EVENT",
    eventFor: "all",
    additionalInfo: "",
  });
  const [organizer, setOrganizer] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Event Organizer",
    image: "",
  });
  const [registrationFields, setRegistrationFields] = useState([
    { id: "participant_name", label: "Participant Name", type: "text", required: true, order: 1 },
    { id: "designation", label: "Designation", type: "text", required: false, order: 2 },
    { id: "company_name", label: "Company Name", type: "text", required: false, order: 3 },
    { id: "email", label: "Email", type: "email", required: true, order: 4 },
    { id: "mobile_number", label: "Mobile Number", type: "tel", required: true, order: 5 },
    { id: "gst_number", label: "GST Number", type: "text", required: false, order: 6 },
    { id: "membership_number", label: "Membership Number", type: "text", required: false, order: 7 },
  ]);
  const [successPageConfig, setSuccessPageConfig] = useState(null);
  const [status, setStatus] = useState({ type: "", message: "", eventId: "", landingPageUrl: "" });
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState("event-details");
  const [createdEventId, setCreatedEventId] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const steps = [
    { id: "event-details", label: "Event Details" },
    { id: "registration-form", label: "Registration Form" },
    { id: "success-page", label: "Success Page" }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === activeTab);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      // Validate current step before proceeding
      if (activeTab === "event-details") {
        const nextErrors = {};

        if (!formData.title.trim()) nextErrors.title = "Event title is required.";
        if (!formData.description.trim()) nextErrors.description = "Event description is required.";
        if (!formData.startDate) nextErrors.startDate = "Start date and time are required.";
        if (!formData.endDate) nextErrors.endDate = "End date and time are required.";
        if (formData.startDate && formData.endDate) {
          const startDT = new Date(`${formData.startDate}T${convertTo24Hour(formData.startTime, formData.startPeriod)}:00`);
          const endDT = new Date(`${formData.endDate}T${convertTo24Hour(formData.endTime, formData.endPeriod)}:00`);
          
          if (endDT <= startDT) {
            nextErrors.endDate = "End date and time must be later than start date and time.";
          }
        }
        if (!formData.location.trim()) nextErrors.location = "Event location is required.";

        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
          setStatus({ type: "error", message: "Please complete all required fields before proceeding to the next step." });
          // Scroll to first error field
          setTimeout(() => {
            const firstErrorField = Object.keys(nextErrors)[0];
            const element = document.getElementById(firstErrorField);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              element.focus();
            }
          }, 100);
          return;
        }
      }

      setActiveTab(steps[currentStepIndex + 1].id);
      setStatus({ type: "", message: "" });
      // Scroll to top of new tab
      setTimeout(() => {
        const cardElement = document.querySelector('.card');
        if (cardElement) {
          cardElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setActiveTab(steps[currentStepIndex - 1].id);
      // Scroll to top of new tab
      setTimeout(() => {
        const cardElement = document.querySelector('.card');
        if (cardElement) {
          cardElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    }
  };

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

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.title.trim()) nextErrors.title = "Event title is required.";
    if (!formData.description.trim()) nextErrors.description = "Event description is required.";
    if (!formData.startDate) nextErrors.startDate = "Start date is required.";
    if (!formData.endDate) nextErrors.endDate = "End date is required.";

    if (formData.startDate && formData.endDate) {
      const startDT = new Date(`${formData.startDate}T${convertTo24Hour(formData.startTime, formData.startPeriod)}:00`);
      const endDT = new Date(`${formData.endDate}T${convertTo24Hour(formData.endTime, formData.endPeriod)}:00`);
      
      if (endDT <= startDT) {
        nextErrors.endDate = "End date and time must be later than start date and time.";
      }
    }
    if (!formData.location.trim()) nextErrors.location = "Event location is required.";

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus({ type: "error", message: "Please fix the highlighted fields to continue.", eventId: "" });
      return false;
    }

    setStatus({ type: "", message: "" });
    return true;
  };

  const convertTo24Hour = (time, period) => {
    let [hours, minutes] = time.split(':');
    hours = parseInt(hours);
    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // This is for form navigation only - actual event creation happens in handleCreateEvent
  };

  const handleCreateEvent = async () => {
    if (!validateForm()) {
      setActiveTab("event-details");
      return;
    }

    // Prepare date-time strings
    const startDateTime = `${formData.startDate}T${convertTo24Hour(formData.startTime, formData.startPeriod)}:00`;
    const endDateTime = `${formData.endDate}T${convertTo24Hour(formData.endTime, formData.endPeriod)}:00`;

    // Map to backend schema
    const eventPayload = {
      event_name: formData.title,
      description: formData.description,
      start_date_time: startDateTime,
      end_date_time: endDateTime,
      address: formData.location,
      event_for: formData.eventFor,
      capacity: formData.capacity ? parseInt(formData.capacity) : null,
      entry_fee: formData.entryFee ? parseFloat(formData.entryFee) : 0,
      category: formData.category,
      additional_info: formData.additionalInfo,
      organizer_details: organizer.name ? organizer : null,
      registration_fields: registrationFields,
      success_page_config: successPageConfig
    };

    try {
      setStatus({ type: "loading", message: "Creating event in database..." });
      const response = await api.createEvent(eventPayload);

      if (response.success) {
        const eventId = response.data.event_id;
        const landingPageUrl = `/event/${eventId}`;
        
        setCreatedEventId(eventId);
        setShowSuccessPopup(true);
        setStatus({
          type: "success",
          message: `Event "${formData.title}" created successfully! 🎉`,
          eventId: eventId,
          landingPageUrl: landingPageUrl,
        });
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Error creating event. Please try again.",
        eventId: "",
        landingPageUrl: "",
      });
      console.error("Event creation error:", error);
    }
  };

  const handlePreviewLandingPage = () => {
    if (status.landingPageUrl) {
      window.open(status.landingPageUrl, '_blank', 'width=1200,height=800');
    }
  };

  const handleCreateAnother = () => {
    // Reset all form data
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
    setRegistrationFields([]);
    setSuccessPageConfig(null);
    setStatus({ type: "", message: "", eventId: "", landingPageUrl: "" });
    setCreatedEventId(null);
    setActiveTab("event-details");
  };

  return (
    <div className="page-shell">
      <div className="card" style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div className="card-header panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p className="panel-label">Event builder</p>
            <h1 className="page-title">Create new event</h1>
          </div>
          <button 
            onClick={() => navigate("/admin/dashboard")} 
            className="button button-text"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666', fontWeight: 600 }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
            Back to Dashboard
          </button>
        </div>

        {/* Tabs */}
        <div className="ec-tabs">
          <button
            type="button"
            className={`ec-tab ${activeTab === "event-details" ? "ec-tab--active" : ""}`}
            disabled
          >
            Event Details
          </button>
          <button
            type="button"
            className={`ec-tab ${activeTab === "registration-form" ? "ec-tab--active" : ""}`}
            disabled
          >
            Registration Form
          </button>
          <button
            type="button"
            className={`ec-tab ${activeTab === "success-page" ? "ec-tab--active" : ""}`}
            disabled
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

              <form onSubmit={(e) => { e.preventDefault(); }}>
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
                      Start date
                    </label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <input
                        id="startDate"
                        name="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={handleChange}
                        className={`input-field ${errors.startDate ? "input-error" : ""}`}
                        style={{ flex: 2 }}
                      />
                      <input
                        name="startTime"
                        type="time"
                        value={formData.startTime}
                        onChange={handleChange}
                        className="input-field"
                        style={{ flex: 1 }}
                      />
                      <select
                        name="startPeriod"
                        value={formData.startPeriod}
                        onChange={handleChange}
                        className="input-field"
                        style={{ width: "70px" }}
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                    {errors.startDate && <div className="field-error">{errors.startDate}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="endDate" className="form-label">
                      End date
                    </label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <input
                        id="endDate"
                        name="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={handleChange}
                        className={`input-field ${errors.endDate ? "input-error" : ""}`}
                        style={{ flex: 2 }}
                      />
                      <input
                        name="endTime"
                        type="time"
                        value={formData.endTime}
                        onChange={handleChange}
                        className="input-field"
                        style={{ flex: 1 }}
                      />
                      <select
                        name="endPeriod"
                        value={formData.endPeriod}
                        onChange={handleChange}
                        className="input-field"
                        style={{ width: "70px" }}
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
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
                    <label htmlFor="eventFor" className="form-label">
                      Event For
                    </label>
                    <select
                      id="eventFor"
                      name="eventFor"
                      value={formData.eventFor}
                      onChange={handleChange}
                      className="input-field"
                    >
                      <option value="all">Everyone</option>
                      <option value="tssia_members">TSSIA Members</option>
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
              </form>
            </>
          )}

          {/* Registration Form Tab */}
          {activeTab === "registration-form" && (
            <>
              <p className="panel-copy">Customize the participant registration form fields.</p>
              <RegistrationFormBuilder
                initialFields={registrationFields}
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
              
              {status.message && (
                <div className={`alert ${status.type === "success" ? "alert-success" : "alert-error"}`}>
                  <div>{status.message}</div>
                  {status.type === "success" && status.eventId && (
                    <div style={{ marginTop: "1rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                      <button
                        type="button"
                        className="button button-primary"
                        onClick={handlePreviewLandingPage}
                        style={{
                          padding: "0.6rem 1.2rem",
                          fontSize: "0.95rem",
                          fontWeight: "600",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                        Preview Landing Page
                      </button>
                      <button
                        type="button"
                        className="button button-secondary"
                        onClick={handleCreateAnother}
                        style={{
                          padding: "0.6rem 1.2rem",
                          fontSize: "0.95rem",
                          fontWeight: "600",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="12" y1="5" x2="12" y2="19"/>
                          <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        Create Another Event
                      </button>
                    </div>
                  )}
                </div>
              )}

              {!createdEventId && (
                <>
                  <SuccessPageBuilder
                    onSave={(config) => {
                      setSuccessPageConfig(config);
                      setStatus({ type: "success", message: "Success page configuration saved successfully!" });
                    }}
                  />
                  <div className="success-action-row">
                    <button
                      type="button"
                      className="button button-primary"
                      onClick={handleCreateEvent}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.75rem",
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"/>
                        <polyline points="17 17 12 12 7 17"/>
                        <polyline points="12 12 12 3"/>
                      </svg>
                      Create Event & Generate Landing Page
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="ec-footer">
          {currentStepIndex > 0 && (
            <button
              className="button button-secondary ec-nav-button"
              onClick={handlePrevious}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
              Previous
            </button>
          )}
          {currentStepIndex === 0 && (
            <div style={{ width: "120px" }}></div>
          )}
          <div className="ec-step-indicator">
            Step {currentStepIndex + 1} of {steps.length}: {steps[currentStepIndex].label}
          </div>
          {currentStepIndex < steps.length - 1 && (
            <button
              className="button button-primary ec-nav-button"
              onClick={handleNext}
            >
              Next
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          )}
          {currentStepIndex === steps.length - 1 && (
            <div style={{ width: "120px" }}></div>
          )}
        </div>
      </div>

      {showSuccessPopup && (
        <div className="modal-overlay">
          <div className="modal-content success-popup">
            <div className="success-icon-container">
              <div className="success-icon-bg">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            </div>

            <h2 className="success-title">Event Created!</h2>
            <p className="success-message">
              Your event <strong>"{formData.title}"</strong> has been successfully created and is now live.
            </p>

            <div className="success-actions-vertical">
              <button 
                className="button button-primary" 
                onClick={handlePreviewLandingPage}
                style={{ width: '100%', marginBottom: '1rem' }}
              >
                View Landing Page
              </button>
              <button 
                className="button button-secondary" 
                onClick={() => {
                  setShowSuccessPopup(false);
                  handleCreateAnother();
                }}
                style={{ width: '100%' }}
              >
                Create Another Event
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .success-popup {
          background: white;
          border-radius: 16px;
          max-width: 450px;
          width: 100%;
          padding: 2.5rem;
          text-align: center;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          animation: scaleUp 0.3s ease-out;
        }

        @keyframes scaleUp {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .success-icon-container {
          display: flex;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .success-icon-bg {
          background: #fbbf24;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 20px rgba(251, 191, 36, 0.3);
        }

        .success-title {
          font-size: 24px;
          font-weight: 800;
          color: #111827;
          margin-bottom: 0.75rem;
        }

        .success-message {
          color: #6b7280;
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .success-actions-vertical {
          display: flex;
          flex-direction: column;
        }

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

        .ec-tab:disabled {
          cursor: default;
          opacity: 1;
          background: transparent;
        }

        .ec-tab--active {
          border-bottom-color: #fbbf24;
          color: #111827;
        }

        .ec-navigation {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          background: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
        }

        .ec-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: linear-gradient(135deg, var(--color-primary-50) 0%, var(--color-neutral-50) 100%);
          border-top: 1px solid var(--color-neutral-200);
          border-radius: 0 0 var(--radius-lg) var(--radius-lg);
          box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.05);
        }

        .ec-step-indicator {
          font-size: 14px;
          font-weight: 600;
          color: var(--color-neutral-700);
          background: rgba(255, 255, 255, 0.8);
          padding: 8px 16px;
          border-radius: var(--radius-md);
          border: 1px solid var(--color-neutral-200);
        }

        .ec-nav-button {
          min-width: 120px;
          font-weight: 600;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .ec-nav-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }

        .ec-nav-button:hover::before {
          left: 100%;
        }

        .ec-nav-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .success-action-row {
          display: flex;
          justify-content: flex-end;
          margin-top: 1.5rem;
        }
      `}</style>
    </div>
  );
}

export default EventCreate;

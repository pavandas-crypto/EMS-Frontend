import { useState, useEffect } from "react";
import RegistrationFormBuilder from "./RegistrationFormBuilder";
import SuccessPageBuilder from "./SuccessPageBuilder";
import api from "../../api/api";
import { useParams, useNavigate } from "react-router-dom";

function EventEdit() {
  const { eventId } = useParams();
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
    category: "EVENT",
    eventFor: "all",
    capacity: "",
    entryFee: "",
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
  const [status, setStatus] = useState({ type: "", message: "" });
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState("event-details");
  const [loading, setLoading] = useState(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        const response = await api.getEvent(eventId);
        if (response.success) {
          const e = response.data;
          
          // Parse start date and time
          const startDT = new Date(e.start_date_time);
          const endDT = new Date(e.end_date_time);
          
          const formatTime = (date) => {
            let hours = date.getHours();
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const period = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;
            return {
              time: `${hours.toString().padStart(2, '0')}:${minutes}`,
              period
            };
          };

          const startT = formatTime(startDT);
          const endT = formatTime(endDT);

          setFormData({
            title: e.event_name,
            description: e.description,
            startDate: startDT.toISOString().split('T')[0],
            startTime: startT.time,
            startPeriod: startT.period,
            endDate: endDT.toISOString().split('T')[0],
            endTime: endT.time,
            endPeriod: endT.period,
            location: e.address,
            category: e.category || "EVENT",
            eventFor: e.event_for || "all",
            capacity: e.capacity || "",
            entryFee: e.entry_fee || "",
            additionalInfo: e.additional_info || "",
          });
          setOrganizer({
            name: e.organizer_name || "",
            email: e.organizer_email || "",
            phone: e.organizer_phone || "",
            role: e.organizer_role || "Event Organizer",
            image: "",
          });
          setRegistrationFields(e.registration_fields || []);
          setSuccessPageConfig(e.success_page_config || null);
        }
      } catch (error) {
        setStatus({ type: "error", message: "Failed to load event data." });
      } finally {
        setLoading(false);
      }
    };

    if (eventId) fetchEventData();
  }, [eventId]);

  const convertTo24Hour = (time, period) => {
    let [hours, minutes] = time.split(':');
    hours = parseInt(hours);
    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  };

  const steps = [
    { id: "event-details", label: "Event Details" },
    { id: "registration-form", label: "Registration Form" },
    { id: "success-page", label: "Success Page" }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === activeTab);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      if (activeTab === "event-details") {
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

        if (!formData.location.trim()) nextErrors.location = "Location is required.";
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) {
          setStatus({ type: "error", message: "Please complete all required fields." });
          return;
        }
      }
      setActiveTab(steps[currentStepIndex + 1].id);
      setStatus({ type: "", message: "" });
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setActiveTab(steps[currentStepIndex - 1].id);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleOrganizerChange = (event) => {
    const { name, value } = event.target;
    setOrganizer((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateEvent = async () => {
    // Validate before update
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

    if (!formData.location.trim()) nextErrors.location = "Location is required.";
    
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setActiveTab("event-details");
      setStatus({ type: "error", message: "Please fix the validation errors." });
      return;
    }

    const startDateTime = `${formData.startDate}T${convertTo24Hour(formData.startTime, formData.startPeriod)}:00`;
    const endDateTime = `${formData.endDate}T${convertTo24Hour(formData.endTime, formData.endPeriod)}:00`;

    const eventPayload = {
      event_name: formData.title,
      description: formData.description,
      start_date_time: startDateTime,
      end_date_time: endDateTime,
      address: formData.location,
      event_for: formData.eventFor,
      category: formData.category,
      capacity: formData.capacity ? parseInt(formData.capacity) : null,
      entry_fee: formData.entryFee ? parseFloat(formData.entryFee) : 0,
      additional_info: formData.additionalInfo,
      organizer_details: organizer.name ? organizer : null,
      registration_fields: registrationFields,
      success_page_config: successPageConfig
    };

    try {
      setStatus({ type: "loading", message: "Updating event..." });
      const response = await api.updateEvent(eventId, eventPayload);
      if (response.success) {
        setStatus({ type: "success", message: "Event updated successfully! 🎉" });
        setShowSuccessPopup(true);
      }
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Update failed." });
    }
  };

  if (loading) return <div className="page-shell"><div className="card">Loading event...</div></div>;

  return (
    <div className="page-shell">
      <div className="card" style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div className="card-header panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p className="panel-label">Event editor</p>
            <h1 className="page-title">Edit Event</h1>
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

        <div className="ec-tabs">
          {steps.map(step => (
            <button
              key={step.id}
              className={`ec-tab ${activeTab === step.id ? "ec-tab--active" : ""}`}
              onClick={() => setActiveTab(step.id)}
            >
              {step.label}
            </button>
          ))}
        </div>

        <div className="card-body">
          {status.message && (
            <div className={`alert ${status.type === "success" ? "alert-success" : (status.type === "loading" ? "alert-info" : "alert-error")}`}>
              {status.message}
            </div>
          )}

          {activeTab === "event-details" && (
            <div className="form-container">
              <p className="panel-copy">Update the basic event information and schedule.</p>

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
            </div>
          )}

          {activeTab === "registration-form" && (
            <RegistrationFormBuilder initialFields={registrationFields} onSave={setRegistrationFields} />
          )}

          {activeTab === "success-page" && (
            <div>
              <SuccessPageBuilder initialConfig={successPageConfig} onSave={setSuccessPageConfig} />
              <div style={{ marginTop: "2rem", display: "flex", justifyContent: "flex-end" }}>
                <button className="button button-primary" onClick={handleUpdateEvent}>Update Event</button>
              </div>
            </div>
          )}
        </div>

        <div className="ec-footer">
          {currentStepIndex > 0 && (
            <button className="button button-secondary" onClick={handlePrevious}>Previous</button>
          )}
          {! (currentStepIndex > 0) && <div></div>}
          <span>Step {currentStepIndex + 1} of 3</span>
          {currentStepIndex < steps.length - 1 && (
            <button className="button button-primary" onClick={handleNext}>Next</button>
          )}
          {! (currentStepIndex < steps.length - 1) && <div></div>}
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

            <h2 className="success-title">Event Updated!</h2>
            <p className="success-message">
              Changes to <strong>"{formData.title}"</strong> have been saved successfully.
            </p>

            <div className="success-actions-vertical">
              <button 
                className="button button-primary" 
                onClick={() => window.open(`/event/${eventId}`, '_blank')}
                style={{ width: '100%', marginBottom: '1rem' }}
              >
                View Landing Page
              </button>
              <button 
                className="button button-secondary" 
                onClick={() => navigate("/admin/dashboard")}
                style={{ width: '100%' }}
              >
                Back to Dashboard
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

        .ec-tabs { display: flex; gap: 8px; padding: 0 20px; border-bottom: 1px solid #e5e7eb; background: #f9fafb; }
        .ec-tab { padding: 12px 20px; border: none; background: transparent; cursor: pointer; font-weight: 600; color: #6b7280; border-bottom: 3px solid transparent; transition: 0.2s; }
        .ec-tab--active { color: #111827; border-bottom-color: #fbbf24; }
        .ec-footer { display: flex; justify-content: space-between; align-items: center; padding: 20px; border-top: 1px solid #e5e7eb; background: #fff; }
        .form-container { display: flex; flex-direction: column; gap: 1.5rem; }
      `}</style>
    </div>
  );
}

export default EventEdit;

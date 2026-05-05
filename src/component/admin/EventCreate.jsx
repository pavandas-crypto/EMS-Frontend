import { useState } from "react";
import RegistrationFormBuilder from "./RegistrationFormBuilder";
import SuccessPageBuilder from "./SuccessPageBuilder";

function EventCreate() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
  });
  const [registrationFields, setRegistrationFields] = useState([]);
  const [successPageConfig, setSuccessPageConfig] = useState(null);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState("event-details");

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
        if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
          nextErrors.endDate = "End time must be later than start time.";
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
    setStatus({ type: "", message: "" });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
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
      setStatus({ type: "error", message: "Please fix the highlighted fields to continue." });
      // Scroll to first error field
      setTimeout(() => {
        const firstErrorField = Object.keys(nextErrors)[0];
        const element = document.getElementById(firstErrorField);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.focus();
        }
      }, 100);
      return false;
    }

    setStatus({ type: "", message: "" });
    return true;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setStatus({ type: "success", message: "Event form is valid. Event creation remains a UI-only demo." });
  };

  const handleCreateEvent = () => {
    if (!validateForm()) {
      setActiveTab("event-details");
      return;
    }

    setStatus({ type: "success", message: "Event created successfully! This is a UI-only demo." });
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
              <div className="success-action-row">
                <button
                  type="button"
                  className="button button-primary"
                  onClick={handleCreateEvent}
                >
                  Create Event
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="ec-footer">
          <button
            className="button button-secondary ec-nav-button"
            onClick={handlePrevious}
            disabled={currentStepIndex === 0}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
            Previous
          </button>
          <div className="ec-step-indicator">
            Step {currentStepIndex + 1} of {steps.length}: {steps[currentStepIndex].label}
          </div>
          <button
            className="button button-primary ec-nav-button"
            onClick={handleNext}
            disabled={currentStepIndex === steps.length - 1}
          >
            Next
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
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

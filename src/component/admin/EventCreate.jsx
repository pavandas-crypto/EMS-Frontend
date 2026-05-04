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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setStatus({ type: "", message: "" });
    setErrors((prev) => ({ ...prev, [name]: "" }));
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
      setStatus({ type: "error", message: "Please fix the highlighted fields to continue." });
      return;
    }

    setStatus({ type: "success", message: "Event form is valid. Event creation remains a UI-only demo." });
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

                <button type="submit" className="button button-primary">
                  Validate event details
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

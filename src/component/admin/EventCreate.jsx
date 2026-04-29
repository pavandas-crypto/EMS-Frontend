import { useState } from "react";

function EventCreate() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [errors, setErrors] = useState({});

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
      <div className="card" style={{ maxWidth: "760px", margin: "0 auto" }}>
        <div className="card-header panel-header">
          <div>
            <p className="panel-label">Event builder</p>
            <h1 className="page-title">Create new event</h1>
          </div>
        </div>
        <div className="card-body">
          <p className="panel-copy">Use this form to validate event metadata and schedule information.</p>

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
              Validate event
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EventCreate;

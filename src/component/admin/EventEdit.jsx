import { useState } from "react";

function EventEdit() {
  const [formData, setFormData] = useState({
    title: "Community Impact Gala",
    description: "An evening of learning and celebration focused on partnership and impact.",
    startDate: "2025-05-10T17:00",
    endDate: "2025-05-10T20:00",
    location: "City Conference Hall",
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
      setStatus({ type: "error", message: "Please fix the highlighted fields before saving." });
      return;
    }

    setStatus({ type: "success", message: "Changes are valid. Event editing is presented as UI validation only." });
  };

  return (
    <div className="page-shell">
      <div className="card" style={{ maxWidth: "760px", margin: "0 auto" }}>
        <div className="card-header panel-header">
          <div>
            <p className="panel-label">Event editing</p>
            <h1 className="page-title">Edit event details</h1>
          </div>
        </div>
        <div className="card-body">
          <p className="panel-copy">Update event fields and validate your changes. All modifications remain client-side only.</p>

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
              Validate changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EventEdit;

import { useState } from "react";
import { useNavigate } from "react-router-dom";

function EventCreate() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    event_name: "",
    description: "",
    start_date_time: "",
    end_date_time: "",
    address: "",
    event_for: "all",
    event_image: null,
    success_title: "Registration Successful 🎉",
    success_message: "You have successfully registered for the event.",
    show_approval_notice: false,
    approval_message: "Your registration is under review. Please wait for approval confirmation via email.",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      event_image: e.target.files[0],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.event_name || !formData.start_date_time || !formData.end_date_time) {
      setError("Event title, start date/time, and end date/time are required.");
      return;
    }

    if (new Date(formData.start_date_time) >= new Date(formData.end_date_time)) {
      setError("End date/time must be later than start date/time.");
      return;
    }

    setSuccess("Event created successfully! Redirecting...");
    setTimeout(() => {
      navigate("/admin/dashboard");
    }, 1500);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h1 className="h3 fw-bold mb-1">Create New Event</h1>
            <p className="text-muted">Set up event details, dates, and approval workflow</p>
          </div>
          <button onClick={() => navigate("/admin/dashboard")} className="btn btn-outline-secondary">
            <i className="bi bi-arrow-left me-2"></i>Back to Dashboard
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="bi bi-exclamation-circle me-2"></i>
          {error}
          <button type="button" className="btn-close" onClick={() => setError("")}></button>
        </div>
      )}
      {success && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <i className="bi bi-check-circle me-2"></i>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <div className="card border-0 shadow-sm mb-3">
          <div className="card-header bg-light border-0 py-3">
            <h5 className="mb-0 fw-bold">
              <i className="bi bi-info-circle me-2 text-primary"></i>Basic Information
            </h5>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-12">
                <label htmlFor="event_name" className="form-label fw-bold">
                  Event Title <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="event_name"
                  name="event_name"
                  className="form-control form-control-lg"
                  value={formData.event_name}
                  onChange={handleChange}
                  placeholder="e.g., Tech Conference 2024"
                  required
                />
              </div>

              <div className="col-12">
                <label htmlFor="description" className="form-label fw-bold">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  className="form-control"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Event description and details..."
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="start_date_time" className="form-label fw-bold">
                  Start Date & Time <span className="text-danger">*</span>
                </label>
                <input
                  type="datetime-local"
                  id="start_date_time"
                  name="start_date_time"
                  className="form-control form-control-lg"
                  value={formData.start_date_time}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="end_date_time" className="form-label fw-bold">
                  End Date & Time <span className="text-danger">*</span>
                </label>
                <input
                  type="datetime-local"
                  id="end_date_time"
                  name="end_date_time"
                  className="form-control form-control-lg"
                  value={formData.end_date_time}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="event_for" className="form-label fw-bold">
                  Visible To <span className="text-danger">*</span>
                </label>
                <select
                  id="event_for"
                  name="event_for"
                  className="form-select form-select-lg"
                  value={formData.event_for}
                  onChange={handleChange}
                  required
                >
                  <option value="all">All Participants</option>
                  <option value="tssia_members">TSSIA Members Only</option>
                </select>
              </div>

              <div className="col-md-6">
                <label htmlFor="address" className="form-label fw-bold">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  className="form-control form-control-lg"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Event location"
                />
              </div>

              <div className="col-12">
                <label htmlFor="event_image" className="form-label fw-bold">
                  Event Banner Image
                </label>
                <div className="input-group">
                  <input
                    type="file"
                    id="event_image"
                    name="event_image"
                    className="form-control"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
                <small className="text-muted d-block mt-2">
                  <i className="bi bi-info-circle me-1"></i>
                  Supported formats: JPG, PNG, GIF, WEBP (Max 5MB)
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* Success & Approval Settings */}
        <div className="card border-0 shadow-sm mb-3">
          <div className="card-header bg-light border-0 py-3">
            <h5 className="mb-0 fw-bold">
              <i className="bi bi-check-circle me-2 text-success"></i>Success & Approval Settings
            </h5>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-12">
                <label htmlFor="success_title" className="form-label fw-bold">
                  Success Page Title
                </label>
                <input
                  type="text"
                  id="success_title"
                  name="success_title"
                  className="form-control form-control-lg"
                  value={formData.success_title}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12">
                <label htmlFor="success_message" className="form-label fw-bold">
                  Success Page Message
                </label>
                <textarea
                  id="success_message"
                  name="success_message"
                  className="form-control"
                  rows="3"
                  value={formData.success_message}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12">
                <div className="form-check form-switch">
                  <input
                    type="checkbox"
                    id="show_approval_notice"
                    name="show_approval_notice"
                    className="form-check-input"
                    checked={formData.show_approval_notice}
                    onChange={handleChange}
                  />
                  <label className="form-check-label fw-bold" htmlFor="show_approval_notice">
                    Require approval before sending confirmation
                  </label>
                </div>
                <small className="text-muted d-block mt-2">
                  Enable this to manually approve registrations before participants receive confirmation
                </small>
              </div>

              {formData.show_approval_notice && (
                <div className="col-12">
                  <label htmlFor="approval_message" className="form-label fw-bold">
                    Approval Notice Message
                  </label>
                  <textarea
                    id="approval_message"
                    name="approval_message"
                    className="form-control"
                    rows="3"
                    value={formData.approval_message}
                    onChange={handleChange}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="d-flex gap-2 justify-content-end">
          <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
            className="btn btn-lg btn-outline-secondary"
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-lg btn-primary">
            <i className="bi bi-check me-2"></i>Create Event
          </button>
        </div>
      </form>
    </div>
  );
}

export default EventCreate;

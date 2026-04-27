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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>Create Event</h1>
          <p className="text-muted">
            Configure the event details, image, and approval mode for attendee registration.
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="btn btn-secondary"
        >
          Back to Dashboard
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card shadow">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="event_name" className="form-label">
                  Event Title <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="event_name"
                  name="event_name"
                  className="form-control"
                  value={formData.event_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="event_for" className="form-label">
                  Visible To <span className="text-danger">*</span>
                </label>
                <select
                  id="event_for"
                  name="event_for"
                  className="form-select"
                  value={formData.event_for}
                  onChange={handleChange}
                  required
                >
                  <option value="all">All Participants</option>
                  <option value="tssia_members">TSSIA Members Only</option>
                </select>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="start_date_time" className="form-label">
                  Start Date and Time <span className="text-danger">*</span>
                </label>
                <input
                  type="datetime-local"
                  id="start_date_time"
                  name="start_date_time"
                  className="form-control"
                  value={formData.start_date_time}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="end_date_time" className="form-label">
                  End Date and Time <span className="text-danger">*</span>
                </label>
                <input
                  type="datetime-local"
                  id="end_date_time"
                  name="end_date_time"
                  className="form-control"
                  value={formData.end_date_time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="address" className="form-label">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                className="form-control"
                rows="3"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="event_image" className="form-label">
                Event Image
              </label>
              <input
                type="file"
                id="event_image"
                name="event_image"
                className="form-control"
                accept="image/*"
                onChange={handleFileChange}
              />
              <small className="text-muted">
                Upload a banner image for the event. Allowed: JPG, PNG, GIF, WEBP.
              </small>
            </div>

            <hr />

            <h5 className="mb-3">Success Page Settings</h5>

            <div className="mb-3">
              <label htmlFor="success_title" className="form-label">
                Success Page Title
              </label>
              <input
                type="text"
                id="success_title"
                name="success_title"
                className="form-control"
                value={formData.success_title}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="success_message" className="form-label">
                Success Page Message
              </label>
              <textarea
                id="success_message"
                name="success_message"
                className="form-control"
                rows="4"
                value={formData.success_message}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3 form-check">
              <input
                type="checkbox"
                id="show_approval_notice"
                name="show_approval_notice"
                className="form-check-input"
                checked={formData.show_approval_notice}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="show_approval_notice">
                Require approval before confirmation
              </label>
            </div>

            <div className="mb-4">
              <label htmlFor="approval_message" className="form-label">
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

            <button type="submit" className="btn btn-primary btn-lg w-100">
              Create Event
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EventCreate;

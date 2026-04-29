import { useState } from "react";

function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    event: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [errors, setErrors] = useState({});
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{8,15}$/;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setStatus({ type: "", message: "" });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};

    if (!formData.name.trim()) nextErrors.name = "Full name is required.";
    if (!formData.email.trim()) nextErrors.email = "Email address is required.";
    else if (!emailRegex.test(formData.email)) nextErrors.email = "Enter a valid email address.";
    if (!formData.phone.trim()) nextErrors.phone = "Phone number is required.";
    else if (!phoneRegex.test(formData.phone)) nextErrors.phone = "Enter a valid numeric phone number.";
    if (!formData.event.trim()) nextErrors.event = "Please select the event you want to join.";

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus({ type: "error", message: "Please fix the highlighted fields." });
      return;
    }

    setStatus({ type: "success", message: "Registration form is valid. No external submission is performed." });
  };

  return (
    <div className="page-shell auth-shell">
      <div className="panel card" style={{ maxWidth: "640px", margin: "0 auto" }}>
        <div className="card-header panel-header">
          <div>
            <p className="panel-label">Event registration</p>
            <h1 className="page-title">Register for an event</h1>
          </div>
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
                <option value="spring-conference">Spring Leadership Conference</option>
                <option value="community-gala">Community Impact Gala</option>
                <option value="training-series">Training Workshop Series</option>
              </select>
              {errors.event && <div className="field-error">{errors.event}</div>}
            </div>

            <button type="submit" className="button button-primary" style={{ width: "100%" }}>
              Validate registration
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

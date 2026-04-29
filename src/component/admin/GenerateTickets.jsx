import { useState } from "react";

function GenerateTickets() {
  const [formData, setFormData] = useState({ eventName: "", template: "" });
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

    if (!formData.eventName) nextErrors.eventName = "Select an event first.";
    if (!formData.template) nextErrors.template = "Choose a ticket template.";

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus({ type: "error", message: "Please select both event and template." });
      return;
    }

    setStatus({ type: "success", message: "Ticket generation settings are valid. This remains a frontend-only prototype." });
  };

  return (
    <div className="page-shell">
      <div className="card" style={{ maxWidth: "680px", margin: "0 auto" }}>
        <div className="card-header panel-header">
          <div>
            <p className="panel-label">Ticket tools</p>
            <h1 className="page-title">Generate tickets</h1>
          </div>
        </div>
        <div className="card-body">
          <p className="panel-copy">Validate ticket options with the EMS interface. Actual file generation is not performed.</p>

          {status.message && (
            <div className={`alert ${status.type === "success" ? "alert-success" : "alert-error"}`}>
              {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="eventName" className="form-label">
                Event selector
              </label>
              <select
                id="eventName"
                name="eventName"
                value={formData.eventName}
                onChange={handleChange}
                className={`select-field ${errors.eventName ? "input-error" : ""}`}
              >
                <option value="">Choose an event</option>
                <option value="Leadership Summit">Leadership Summit</option>
                <option value="Community Training">Community Training</option>
                <option value="Volunteer Orientation">Volunteer Orientation</option>
              </select>
              {errors.eventName && <div className="field-error">{errors.eventName}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="template" className="form-label">
                Ticket template
              </label>
              <select
                id="template"
                name="template"
                value={formData.template}
                onChange={handleChange}
                className={`select-field ${errors.template ? "input-error" : ""}`}
              >
                <option value="">Choose template style</option>
                <option value="standard">Standard pass</option>
                <option value="vip">VIP pass</option>
              </select>
              {errors.template && <div className="field-error">{errors.template}</div>}
            </div>

            <button type="submit" className="button button-primary">
              Validate ticket settings
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default GenerateTickets;

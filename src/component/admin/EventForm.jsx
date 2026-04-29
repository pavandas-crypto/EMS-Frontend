import { useState } from "react";

function EventForm() {
  const [formData, setFormData] = useState({ fieldName: "", fieldType: "text" });
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

    if (!formData.fieldName.trim()) nextErrors.fieldName = "Field name is required.";

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus({ type: "error", message: "Please provide a valid field name." });
      return;
    }

    setStatus({ type: "success", message: "Custom form field is valid. No persistence is performed." });
  };

  return (
    <div className="page-shell">
      <div className="card" style={{ maxWidth: "720px", margin: "0 auto" }}>
        <div className="card-header panel-header">
          <div>
            <p className="panel-label">Registration form</p>
            <h1 className="page-title">Customize form fields</h1>
          </div>
        </div>
        <div className="card-body">
          <p className="panel-copy">Add a new custom field for event registration and verify that required fields are set correctly.</p>

          {status.message && (
            <div className={`alert ${status.type === "success" ? "alert-success" : "alert-error"}`}>
              {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="fieldName" className="form-label">
                Field label
              </label>
              <input
                id="fieldName"
                name="fieldName"
                value={formData.fieldName}
                onChange={handleChange}
                className={`input-field ${errors.fieldName ? "input-error" : ""}`}
                placeholder="e.g. Company name"
              />
              {errors.fieldName && <div className="field-error">{errors.fieldName}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="fieldType" className="form-label">
                Field type
              </label>
              <select
                id="fieldType"
                name="fieldType"
                value={formData.fieldType}
                onChange={handleChange}
                className="select-field"
              >
                <option value="text">Text</option>
                <option value="email">Email</option>
                <option value="phone">Phone</option>
              </select>
            </div>

            <button type="submit" className="button button-primary">
              Validate field
            </button>
          </form>

          <div className="section" style={{ paddingTop: "2rem" }}>
            <h2 className="card-title">Existing form fields</h2>
            <div className="section-grid columns-2" style={{ marginTop: "1rem" }}>
              <div className="card">
                <div className="card-body">
                  <h3 style={{ margin: 0 }}>Name</h3>
                  <p className="card-copy" style={{ marginTop: "0.5rem" }}>Required text input.</p>
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <h3 style={{ margin: 0 }}>Email</h3>
                  <p className="card-copy" style={{ marginTop: "0.5rem" }}>Required email address field.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventForm;

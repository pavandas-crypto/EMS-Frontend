import { useState } from "react";

const verifiers = [
  { name: "Ritu Singh", role: "Lead verifier" },
  { name: "Deepak Joshi", role: "Event support" },
  { name: "Smita Das", role: "Venue compliance" },
];

function Verifiers() {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [errors, setErrors] = useState({});
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setStatus({ type: "", message: "" });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};

    if (!formData.name.trim()) nextErrors.name = "Verifier name is required.";
    if (!formData.email.trim()) nextErrors.email = "Verifier email is required.";
    else if (!emailRegex.test(formData.email)) nextErrors.email = "Enter a valid email address.";

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus({ type: "error", message: "Please fix the highlighted fields." });
      return;
    }

    setStatus({ type: "success", message: "Verifier details are valid. This remains a preview screen." });
  };

  return (
    <div className="page-shell">
      <div className="section-grid columns-2" style={{ gap: "1.5rem" }}>
        <div className="card">
          <div className="card-header">
            <h1 className="card-title">Verifier setup</h1>
            <p className="form-note" style={{ marginTop: "0.75rem" }}>
              Validate verifier registration fields in the admin interface.
            </p>
          </div>
          <div className="card-body">
            {status.message && (
              <div className={`alert ${status.type === "success" ? "alert-success" : "alert-error"}`}>
                {status.message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Verifier name
                </label>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`input-field ${errors.name ? "input-error" : ""}`}
                  placeholder="Enter verifier name"
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
                  placeholder="email@example.com"
                />
                {errors.email && <div className="field-error">{errors.email}</div>}
              </div>

              <button type="submit" className="button button-primary">
                Validate verifier
              </button>
            </form>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Active verifiers</h2>
          </div>
          <div className="card-body">
            <div className="section-grid columns-1">
              {verifiers.map((item) => (
                <div key={item.name} className="card" style={{ boxShadow: "none", border: "1px solid rgba(15, 23, 42, 0.08)" }}>
                  <div className="card-body" style={{ padding: "1rem" }}>
                    <h3 style={{ margin: 0 }}>{item.name}</h3>
                    <p className="form-note" style={{ marginTop: "0.5rem" }}>{item.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Verifiers;

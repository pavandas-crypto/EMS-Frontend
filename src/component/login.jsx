import { useState } from "react";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [status, setStatus] = useState({ type: "", message: "" });
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setStatus({ type: "", message: "" });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formData.email || !formData.password) {
      setStatus({ type: "error", message: "Email and password are required." });
      return;
    }

    if (!emailRegex.test(formData.email)) {
      setStatus({ type: "error", message: "Please enter a valid email address." });
      return;
    }

    if (formData.password.length < 6) {
      setStatus({ type: "error", message: "Password should be at least 6 characters long." });
      return;
    }

    setStatus({
      type: "success",
      message: "Login fields are valid. Admin access is shown for design validation only.",
    });
  };

  return (
    <div className="page-shell auth-shell">
      <div className="panel card" style={{ maxWidth: "520px", margin: "0 auto" }}>
        <div className="card-header panel-header">
          <div>
            <p className="panel-label">Admin access</p>
            <h1 className="page-title">Sign in</h1>
          </div>
        </div>

        <div className="card-body">
          <p className="panel-copy">Enter valid credentials for validation UI. No backend authentication is configured.</p>

          {status.message && (
            <div className={`alert ${status.type === "success" ? "alert-success" : "alert-error"}`}>
              {status.message}
            </div>
          )}

          <form className="form-stack" onSubmit={handleSubmit}>
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
                className="input-field"
                placeholder="name@example.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your password"
              />
            </div>

            <button type="submit" className="button button-primary" style={{ width: "100%" }}>
              Validate login
            </button>
          </form>

          <p className="form-note" style={{ marginTop: "1rem" }}>
            This page is designed to show field validation and layout interactions. Use any email format and password for the demo.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;

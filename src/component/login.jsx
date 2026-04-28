import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    // Check admin credentials
    if (email === "admin@gmail.com" && password === "123456") {
      // Store admin login state
      localStorage.setItem("adminToken", "admin_logged_in");
      localStorage.setItem("userRole", "admin");
      localStorage.setItem("userEmail", email);

      // Redirect to admin dashboard
      navigate("/admin/dashboard");
    } else {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-sm p-4" style={{ maxWidth: "420px", width: "100%" }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold">EMS Sign In</h2>
          <p className="text-muted mb-0">Access your employee management account</p>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              id="email"
              type="email"
              className="form-control"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@example.com"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="form-control"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="rememberMe" />
              <label className="form-check-label" htmlFor="rememberMe">
                Remember me
              </label>
            </div>
            <a href="#" className="small text-decoration-none">
              Forgot password?
            </a>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Sign in
          </button>
        </form>

        <div className="text-center mt-4 text-muted small">
          <strong>Admin Login:</strong> admin@gmail.com / 123456
        </div>
      </div>
    </div>
  );
}

export default Login;

import { useState } from "react";
import { useNavigate } from "react-router-dom";

function RegisterForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    designation: "",
    organisation: "",
    gstNo: "",
    tssiaMembership: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Registration submitted:", formData);
    // Add registration logic here.
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h3 className="card-title mb-0">Event Registration</h3>
              <button
                type="button"
                className="btn btn-light btn-sm"
                onClick={() => navigate('/')}
              >
                <i className="fas fa-arrow-left me-1"></i>
                Back
              </button>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="name" className="form-label">
                      Full Name *
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="email" className="form-label">
                      Email Address *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="mobile" className="form-label">
                      Mobile Number *
                    </label>
                    <input
                      id="mobile"
                      name="mobile"
                      type="tel"
                      className="form-control"
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="Enter mobile number"
                      pattern="[0-9]{10}"
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="designation" className="form-label">
                      Designation *
                    </label>
                    <input
                      id="designation"
                      name="designation"
                      type="text"
                      className="form-control"
                      value={formData.designation}
                      onChange={handleChange}
                      placeholder="Your job title"
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="organisation" className="form-label">
                    Organisation *
                  </label>
                  <input
                    id="organisation"
                    name="organisation"
                    type="text"
                    className="form-control"
                    value={formData.organisation}
                    onChange={handleChange}
                    placeholder="Company or organization name"
                    required
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="gstNo" className="form-label">
                      Organisation GST No.
                    </label>
                    <input
                      id="gstNo"
                      name="gstNo"
                      type="text"
                      className="form-control"
                      value={formData.gstNo}
                      onChange={handleChange}
                      placeholder="GST number (optional)"
                      pattern="^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$"
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="tssiaMembership" className="form-label">
                      TSSIA Membership No.
                    </label>
                    <input
                      id="tssiaMembership"
                      name="tssiaMembership"
                      type="text"
                      className="form-control"
                      value={formData.tssiaMembership}
                      onChange={handleChange}
                      placeholder="Membership number (optional)"
                    />
                  </div>
                </div>

                <div className="d-grid">
                  <button type="submit" className="btn btn-primary btn-lg">
                    Register for Event
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
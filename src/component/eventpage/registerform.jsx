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
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[0-9]{10}$/;
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

    if (!formData.name.trim()) newErrors.name = "Please enter your full name.";
    if (!emailRegex.test(formData.email)) newErrors.email = "Enter a valid email address.";
    if (!mobileRegex.test(formData.mobile)) newErrors.mobile = "Enter a valid 10-digit mobile number.";
    if (!formData.designation.trim()) newErrors.designation = "Please enter your designation.";
    if (!formData.organisation.trim()) newErrors.organisation = "Please enter your organisation.";
    if (formData.gstNo && !gstRegex.test(formData.gstNo)) newErrors.gstNo = "Enter a valid GST number.";

    return newErrors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: undefined,
    }));
    setSubmitted(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmitted(false);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      console.log("Registration submitted:", formData);
    }, 800);
  };

  const getInputClass = (field) => {
    const requiredFields = ["name", "email", "mobile", "designation", "organisation"];

    if (errors[field]) return "form-control is-invalid";
    if (formData[field] || (submitted && requiredFields.includes(field))) return "form-control is-valid";
    return "form-control";
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-xl-8 col-lg-9">
          <div className="text-center mb-4 animate-slide-down">
            <p className="text-primary text-uppercase fw-semibold mb-2">Ready to join?</p>
            <h1 className="display-5 fw-bold">Event Registration</h1>
            <p className="text-muted mx-auto" style={{ maxWidth: 640 }}>
              Fill in your details below to secure your spot. All required fields are marked with an asterisk.
            </p>
          </div>

          <div className="card shadow-lg border-0 rounded-4 animate-card">
            <div className="card-header bg-gradient-primary text-white rounded-top-4 py-3 d-flex justify-content-between align-items-center">
              <div>
                <h2 className="h5 mb-0">Participant Registration</h2>
                <small className="text-white-75">Fast, responsive, and secure.</small>
              </div>
              <button
                type="button"
                className="btn btn-light btn-sm"
                onClick={() => navigate('/')}
              >
                <span className="bi bi-arrow-left-short me-1"></span>
                Back
              </button>
            </div>

            <div className="card-body p-4">
              {submitted && (
                <div className="alert alert-success alert-dismissible fade show animate-fade-in" role="alert">
                  <strong>Success!</strong> Your registration has been received.
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="name" className="form-label fw-semibold">
                      Full Name <span className="text-danger">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      className={getInputClass("name")}
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      autoComplete="name"
                    />
                    <div className="invalid-feedback">{errors.name}</div>
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="email" className="form-label fw-semibold">
                      Email Address <span className="text-danger">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className={getInputClass("email")}
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      autoComplete="email"
                    />
                    <div className="invalid-feedback">{errors.email}</div>
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="mobile" className="form-label fw-semibold">
                      Mobile Number <span className="text-danger">*</span>
                    </label>
                    <input
                      id="mobile"
                      name="mobile"
                      type="tel"
                      className={getInputClass("mobile")}
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="Enter 10-digit mobile"
                      autoComplete="tel"
                    />
                    <div className="invalid-feedback">{errors.mobile}</div>
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="designation" className="form-label fw-semibold">
                      Designation <span className="text-danger">*</span>
                    </label>
                    <input
                      id="designation"
                      name="designation"
                      type="text"
                      className={getInputClass("designation")}
                      value={formData.designation}
                      onChange={handleChange}
                      placeholder="Your job title"
                      autoComplete="organization-title"
                    />
                    <div className="invalid-feedback">{errors.designation}</div>
                  </div>

                  <div className="col-12">
                    <label htmlFor="organisation" className="form-label fw-semibold">
                      Organisation <span className="text-danger">*</span>
                    </label>
                    <input
                      id="organisation"
                      name="organisation"
                      type="text"
                      className={getInputClass("organisation")}
                      value={formData.organisation}
                      onChange={handleChange}
                      placeholder="Company or organization name"
                      autoComplete="organization"
                    />
                    <div className="invalid-feedback">{errors.organisation}</div>
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="gstNo" className="form-label fw-semibold">
                      Organisation GST No.
                    </label>
                    <input
                      id="gstNo"
                      name="gstNo"
                      type="text"
                      className={getInputClass("gstNo")}
                      value={formData.gstNo}
                      onChange={handleChange}
                      placeholder="GST number (optional)"
                    />
                    <div className="invalid-feedback">{errors.gstNo}</div>
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="tssiaMembership" className="form-label fw-semibold">
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

                <div className="mt-4 d-grid">
                  <button type="submit" className="btn btn-primary btn-lg btn-shadow">
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Registering...
                      </>
                    ) : (
                      "Register for Event"
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-4 text-center text-muted small animate-fade-in delay-3">
                <p className="mb-1">After submitting, please check your inbox for confirmation details.</p>
                <p className="mb-0">We protect your information and do not share it without consent.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .bg-gradient-primary {
          background: linear-gradient(135deg, #3b82f6 0%, #0f172a 100%);
        }

        .rounded-top-4 {
          border-top-left-radius: 1.5rem !important;
          border-top-right-radius: 1.5rem !important;
        }

        .btn-shadow {
          box-shadow: 0 0.9rem 1.8rem rgba(15, 23, 42, 0.14);
        }

        .animate-card {
          animation: popIn 0.8s ease-out both;
        }

        .animate-slide-down {
          opacity: 0;
          transform: translateY(-18px);
          animation: slideDown 0.75s ease-out forwards;
        }

        .animate-fade-in {
          opacity: 0;
          animation: fadeIn 1s ease-out forwards;
        }

        .delay-3 {
          animation-delay: 0.15s;
        }

        @keyframes popIn {
          from {
            opacity: 0;
            transform: translateY(24px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes slideDown {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default RegisterForm;

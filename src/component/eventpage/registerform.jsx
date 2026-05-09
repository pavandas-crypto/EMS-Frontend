import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";

function RegisterForm() {
  const { eventId: urlEventId } = useParams();
  const navigate = useNavigate();
  const [eventDetails, setEventDetails] = useState(null);
  const [registrationFields, setRegistrationFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [status, setStatus] = useState({ type: "", message: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{8,15}$/;

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!urlEventId) {
        setStatus({ type: "error", message: "No event selected. Please choose an event from the listings." });
        setPageLoading(false);
        return;
      }

      try {
        setPageLoading(true);
        const response = await api.getEvent(urlEventId);
        if (response.success) {
          const event = response.data;
          setEventDetails(event);
          
          const fields = event.registration_fields || [
            { id: "participant_name", label: "Full Name", type: "text", required: true },
            { id: "email", label: "Email Address", type: "email", required: true },
            { id: "mobile_number", label: "Phone Number", type: "tel", required: true }
          ];
          
          setRegistrationFields(fields);
          
          // Initialize form data
          const initialData = {};
          fields.forEach(f => {
            initialData[f.id] = "";
          });
          setFormData(initialData);
        } else {
          setStatus({ type: "error", message: "Event not found." });
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
        setStatus({ type: "error", message: "Failed to load event details." });
      } finally {
        setPageLoading(false);
      }
    };

    fetchEventDetails();
  }, [urlEventId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setStatus({ type: "", message: "" });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {};

    registrationFields.forEach(field => {
      const val = String(formData[field.id] || "").trim();
      if (field.required && !val) {
        nextErrors[field.id] = `${field.label} is required.`;
      } else if (val) {
        if (field.type === "email" && !emailRegex.test(val)) {
          nextErrors[field.id] = "Enter a valid email address.";
        } else if (field.type === "tel" && !phoneRegex.test(val)) {
          nextErrors[field.id] = "Enter a valid numeric phone number.";
        }
      }
    });

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus({ type: "error", message: "Please fix the highlighted fields." });
      return;
    }

    setLoading(true);
    try {
      // Map fields to API expectations
      const payload = {
        event_id: urlEventId,
        participant_name: formData.participant_name || formData.Full_Name || formData.name,
        participant_email: formData.email || formData.Email_Address || formData.participant_email,
        participant_phone: formData.mobile_number || formData.Phone_Number || formData.phone,
        organization: formData.company_name || formData.organization,
        designation: formData.designation,
        tssia_membership_id: formData.membership_number || formData.tssia_membership_id,
        form_data: formData 
      };

      const response = await api.registerForEvent(payload);

      if (response.success) {
        setStatus({ type: "success", message: "Registration successful!" });
        setShowSuccessPopup(true);
      }
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Registration failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="page-shell auth-shell">
        <div className="panel card" style={{ maxWidth: "640px", margin: "0 auto", textAlign: "center", padding: "4rem" }}>
          <div className="loading-spinner"></div>
          <p style={{ marginTop: "1rem", color: "#6b7280" }}>Loading event details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell auth-shell">
      <div className="panel card" style={{ maxWidth: "640px", margin: "0 auto" }}>
        <div className="card-header panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p className="panel-label">Event registration</p>
            <h1 className="page-title">{eventDetails?.event_name || "Register for Event"}</h1>
            {eventDetails && (
              <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "4px" }}>
                {new Date(eventDetails.start_date_time).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            )}
          </div>
          <button 
            onClick={() => navigate(-1)} 
            className="button button-text"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666', fontWeight: 600 }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
            Back
          </button>
        </div>

        <div className="card-body">
          <p className="panel-copy" style={{ marginBottom: "2rem" }}>
            Complete the form below to register for this event. All fields marked with <span style={{ color: '#ef4444' }}>*</span> are required.
          </p>

          {status.message && (
            <div className={`alert ${status.type === "success" ? "alert-success" : "alert-error"}`} style={{ marginBottom: "2rem" }}>
              {status.message}
            </div>
          )}

          {eventDetails && (
            <form onSubmit={handleSubmit}>
              <div className="section-grid columns-2">
                {registrationFields.map((field) => (
                  <div className="form-group" key={field.id} style={{ gridColumn: field.type === 'textarea' ? 'span 2' : 'auto' }}>
                    <label htmlFor={field.id} className="form-label">
                      {field.label} {field.required && <span style={{ color: '#ef4444' }}>*</span>}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea
                        id={field.id}
                        name={field.id}
                        value={formData[field.id] || ""}
                        onChange={handleChange}
                        className={`textarea-field ${errors[field.id] ? "input-error" : ""}`}
                        rows="3"
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                      />
                    ) : (
                      <input
                        id={field.id}
                        name={field.id}
                        type={field.type}
                        value={formData[field.id] || ""}
                        onChange={handleChange}
                        className={`input-field ${errors[field.id] ? "input-error" : ""}`}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                      />
                    )}
                    {errors[field.id] && <div className="field-error">{errors[field.id]}</div>}
                  </div>
                ))}
              </div>

              <button 
                type="submit" 
                className="button button-primary" 
                style={{ width: "100%", marginTop: "2rem", height: "48px", fontSize: "16px" }}
                disabled={loading}
              >
                {loading ? "Processing..." : "Complete Registration"}
              </button>
            </form>
          )}

          {!eventDetails && !pageLoading && (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <p style={{ color: "#ef4444", fontWeight: 600 }}>Please select a valid event to continue.</p>
              <button className="button button-secondary" onClick={() => navigate('/events')} style={{ marginTop: "1rem" }}>
                View All Events
              </button>
            </div>
          )}

          <p className="form-note" style={{ marginTop: "2rem", textAlign: "center", fontSize: "12px", color: "#9ca3af" }}>
            By registering, you agree to our terms and conditions. Your ticket will be generated upon successful registration.
          </p>
        </div>
      </div>
      
      {showSuccessPopup && (
        <div className="modal-overlay">
          <div className="modal-content success-popup">
            <div className="success-icon-container">
              <div className="success-icon-bg">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            </div>

            <h2 className="success-title">
              {eventDetails?.success_page_config?.title || "Registration Successful!"}
            </h2>
            <p className="success-message">
              {eventDetails?.success_page_config?.message || "Thank you for registering for our event. We look forward to seeing you there!"}
            </p>

            {eventDetails?.success_page_config?.displayFields?.length > 0 && (
              <div className="success-details-box">
                <h4 className="details-header">Registration Details</h4>
                <div className="details-grid">
                  {eventDetails.success_page_config.displayFields.map(fieldKey => {
                    // Try to find the field label and value
                    const fieldDef = registrationFields.find(f => f.id === fieldKey) || 
                                     registrationFields.find(f => f.id.toLowerCase() === fieldKey.replace('_', '').toLowerCase());
                    
                    const label = fieldDef?.label || fieldKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                    const value = formData[fieldKey] || formData[fieldDef?.id] || "N/A";

                    if (!value || value === "N/A") return null;

                    return (
                      <div key={fieldKey} className="detail-item">
                        <span className="detail-label">{label}:</span>
                        <span className="detail-value">{value}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="success-actions">
              <button 
                className="button button-primary" 
                style={{ width: '100%' }}
                onClick={() => navigate(`/event/${urlEventId}`)}
              >
                Back to Event
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #fbbf24;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .success-popup {
          background: white;
          border-radius: 16px;
          max-width: 500px;
          width: 100%;
          padding: 2.5rem;
          text-align: center;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          animation: scaleUp 0.3s ease-out;
        }

        @keyframes scaleUp {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .success-icon-container {
          display: flex;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .success-icon-bg {
          background: #10b981;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
        }

        .success-title {
          font-size: 24px;
          font-weight: 800;
          color: #111827;
          margin-bottom: 0.75rem;
        }

        .success-message {
          color: #6b7280;
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .success-details-box {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 1.25rem;
          margin-bottom: 2rem;
          text-align: left;
        }

        .details-header {
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          color: #9ca3af;
          letter-spacing: 0.05em;
          margin-bottom: 1rem;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 0.5rem;
        }

        .details-grid {
          display: grid;
          gap: 0.75rem;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
        }

        .detail-label {
          color: #6b7280;
          font-weight: 500;
        }

        .detail-value {
          color: #111827;
          font-weight: 600;
        }

        .success-actions {
          display: flex;
          gap: 1rem;
        }
      `}</style>
    </div>
  );
}

export default RegisterForm;

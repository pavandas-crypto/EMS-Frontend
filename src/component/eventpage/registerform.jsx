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
  const phoneRegex = /^[0-9]{10}$/;

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
          
          // Parse JSON fields if they are strings
          if (typeof event.registration_fields === 'string') {
            try { event.registration_fields = JSON.parse(event.registration_fields); } catch(e) {}
          }
          if (typeof event.success_page_config === 'string') {
            try { event.success_page_config = JSON.parse(event.success_page_config); } catch(e) {}
          }
          
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
    const { name, value, type } = e.target;
    let finalValue = value;
    let error = "";

    // Identify field types/ids for specific validation
    const isPhoneField = type === 'tel' || 
                         name.toLowerCase().includes('phone') || 
                         name.toLowerCase().includes('mobile') ||
                         name.toLowerCase().includes('contact');
                         
    const isAlphabetField = name.toLowerCase().includes('name') || 
                            name.toLowerCase().includes('designation');
                            
    const isEmailField = type === 'email' || 
                         name.toLowerCase().includes('email');

    if (isPhoneField) {
      // Real-time numeric restriction and length cap
      finalValue = value.replace(/\D/g, '').slice(0, 10);
      if (finalValue.length > 0 && finalValue.length < 10) {
        error = "Please enter exactly 10 digits.";
      } else if (finalValue.length === 10) {
        if (finalValue.startsWith('0')) {
          error = "Invalid phone number starting with 0.";
        }
      }
    } else if (isAlphabetField) {
      // Real-time alphabet-only restriction (allows spaces)
      finalValue = value.replace(/[^a-zA-Z\s]/g, '');
      if (finalValue.length > 0 && finalValue.trim().length === 0) {
        error = "Please enter a valid name/title.";
      }
    } else if (isEmailField) {
      // Real-time email format check
      if (value && !emailRegex.test(value)) {
        error = "Please enter a valid email address.";
      }
    }

    // Required field check (real-time feedback when field is emptied)
    const fieldDef = registrationFields.find(f => f.id === name);
    if (fieldDef?.required && !finalValue.trim() && value.length > 0) {
      error = `${fieldDef.label} is required.`;
    }

    setFormData((prev) => ({ ...prev, [name]: finalValue }));
    setStatus({ type: "", message: "" });
    setErrors((prev) => ({ ...prev, [name]: error }));
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
          nextErrors[field.id] = "Enter a valid 10-digit phone number.";
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
      <div className="modern-reg-container">
        <div className="modern-reg-loader">
          <div className="loader-ring"></div>
          <p>Preparing your registration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modern-reg-container">
      <div className="modern-reg-card">
        {/* Header Section with optional Image */}
        <div className="modern-reg-header">
          <button onClick={() => navigate(-1)} className="modern-back-btn" aria-label="Go back">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span className="modern-back-text">Back</span>
          </button>
          
          <div className="modern-header-content">
            <div className="modern-header-badge">Event Registration</div>
            <h1 className="modern-event-title">{eventDetails?.event_name}</h1>
            {eventDetails && (
              <div className="modern-event-meta">
                <span className="meta-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  {new Date(eventDetails.start_date_time).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
                <span className="meta-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  {eventDetails.address}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="modern-reg-body">
          <div className="modern-info-banner">
            <div className="info-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            </div>
            <p>Please ensure your <strong>email address</strong> and <strong>phone number</strong> are correct to receive your entry pass QR code.</p>
          </div>

          {status.message && (
            <div className={`modern-alert ${status.type === 'success' ? 'alert-success' : 'alert-error'}`}>
              {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="modern-form">
            <div className="form-grid">
              {registrationFields.map((field) => (
                <div className={`modern-form-group ${field.type === 'textarea' ? 'span-full' : ''}`} key={field.id}>
                  <label htmlFor={field.id} className="modern-label">
                    {field.label} {field.required && <span className="required-star">*</span>}
                  </label>
                  <div className="input-wrapper">
                    {field.type === 'textarea' ? (
                      <textarea
                        id={field.id}
                        name={field.id}
                        value={formData[field.id] || ""}
                        onChange={handleChange}
                        className={`modern-textarea ${errors[field.id] ? "has-error" : ""}`}
                        rows="3"
                        placeholder={`Enter ${field.label.toLowerCase()}...`}
                      />
                    ) : (
                      <input
                        id={field.id}
                        name={field.id}
                        type={field.type}
                        value={formData[field.id] || ""}
                        onChange={handleChange}
                        className={`modern-input ${errors[field.id] ? "has-error" : ""}`}
                        placeholder={`Enter ${field.label.toLowerCase()}...`}
                      />
                    )}
                    {errors[field.id] && <div className="error-message">{errors[field.id]}</div>}
                  </div>
                </div>
              ))}
            </div>

            <button type="submit" className="modern-submit-btn" disabled={loading}>
              {loading ? (
                <span className="btn-loading">
                  <span className="dot"></span><span className="dot"></span><span className="dot"></span>
                </span>
              ) : (
                <>
                  Confirm Registration
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </>
              )}
            </button>
          </form>

          <p className="modern-footer-note">
            By clicking confirm, you agree to the event's terms and privacy policy. 
            A digital pass will be generated instantly upon approval.
          </p>
        </div>
      </div>

      {showSuccessPopup && (
        <div className="modern-modal-overlay">
          <div className="modern-success-card">
            <div className="success-processing-icon">
              <div className="iconic-spinner-outer">
                <svg className="iconic-spinner" viewBox="0 0 50 50">
                  <circle className="iconic-spinner-path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                </svg>
              </div>
            </div>
            
            <h2 className="success-title">Confirmation <span>In Progress</span></h2>
            <p className="success-desc">
              Your information has been received — We'll confirm shortly
            </p>

            <div className="registration-timeline">
              <div className="timeline-step step-submitted">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                Submitted
              </div>
              <div className="timeline-line"></div>
              <div className="timeline-step step-review">
                <div className="iconic-spinner-outer" style={{ width: '12px', height: '12px', display: 'flex' }}>
                  <svg viewBox="0 0 50 50" style={{ width: '100%', height: '100%' }}>
                    <circle className="iconic-spinner-path" cx="25" cy="25" r="20" fill="none" strokeWidth="8"></circle>
                  </svg>
                </div>
                Under Review
              </div>
              <div className="timeline-line"></div>
              <div className="timeline-step step-confirmed">
                Confirmed
              </div>
            </div>

            {eventDetails?.success_page_config?.displayFields?.length > 0 && (
              <div className="registration-details-card">
                <h3 className="details-header">Registration Details</h3>
                <div className="details-grid">
                  {eventDetails.success_page_config.displayFields.map((fieldId) => {
                    const field = registrationFields.find(f => f.id === fieldId);
                    let value = formData[fieldId];
                    let label = field?.label || fieldId.replace(/_/g, ' ');

                    // Handle special non-form fields
                    if (fieldId === 'event_name') {
                      value = eventDetails?.event_name;
                      label = "Event Name";
                    } else if (fieldId === 'event_date_time') {
                      value = eventDetails?.start_date_time ? new Date(eventDetails.start_date_time).toLocaleString(undefined, { 
                        dateStyle: 'medium', 
                        timeStyle: 'short' 
                      }) : null;
                      label = "Date & Time";
                    }

                    if (!value) return null;
                    return (
                      <div key={fieldId} className="detail-item">
                        <span className="detail-label">{label}</span>
                        <span className="detail-value">{value}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="success-action-area">
              <button onClick={() => navigate(`/event/${urlEventId}`)} className="modern-btn-primary" style={{ width: '100%' }}>
                View Event Page
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .modern-reg-container {
          min-height: 100vh;
          background: #f8fafc;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 4rem 1rem;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }

        .modern-reg-card {
          width: 100%;
          max-width: 800px;
          background: #ffffff;
          border-radius: 24px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .modern-reg-header {
          background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%);
          padding: 3rem;
          border-bottom: 1px solid #f1f5f9;
          position: relative;
        }

        .modern-back-btn {
          position: absolute;
          top: 2rem;
          left: 2rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          padding: 0.5rem 1rem;
          border-radius: 12px;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 600;
          font-size: 14px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }

        .modern-back-btn:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          color: #1e293b;
          transform: translateX(-4px);
        }

        .modern-header-content {
          margin-top: 2rem;
        }

        .modern-header-badge {
          display: inline-block;
          background: #fef3c7;
          color: #92400e;
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 6px 12px;
          border-radius: 100px;
          margin-bottom: 1rem;
        }

        .modern-event-title {
          font-size: 2.5rem;
          font-weight: 900;
          color: #0f172a;
          line-height: 1.1;
          letter-spacing: -0.03em;
          margin: 0;
        }

        .modern-event-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          margin-top: 1.5rem;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #64748b;
          font-size: 14px;
          font-weight: 500;
        }

        .modern-reg-body {
          padding: 3rem;
        }

        .modern-info-banner {
          background: #f0f9ff;
          border-left: 4px solid #0ea5e9;
          padding: 1.25rem 1.5rem;
          border-radius: 12px;
          display: flex;
          gap: 1rem;
          align-items: flex-start;
          margin-bottom: 2.5rem;
        }

        .info-icon { color: #0ea5e9; margin-top: 2px; }
        .modern-info-banner p {
          margin: 0;
          font-size: 14px;
          line-height: 1.6;
          color: #0c4a6e;
        }

        .modern-alert {
          padding: 1.25rem;
          border-radius: 12px;
          margin-bottom: 2rem;
          font-weight: 600;
          font-size: 14px;
          animation: fadeIn 0.3s ease;
        }
        .alert-error { background: #fef2f2; color: #991b1b; border: 1px solid #fee2e2; }
        .alert-success { background: #f0fdf4; color: #166534; border: 1px solid #dcfce7; }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }

        .span-full { grid-column: span 2; }

        .modern-form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .modern-label {
          font-size: 14px;
          font-weight: 700;
          color: #334155;
          margin-left: 4px;
        }

        .required-star { color: #ef4444; }

        .modern-input, .modern-textarea {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 1rem 1.25rem;
          font-size: 15px;
          font-weight: 500;
          color: #0f172a;
          width: 100%;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .modern-input:focus, .modern-textarea:focus {
          outline: none;
          background: #ffffff;
          border-color: #0ea5e9;
          box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.1);
        }

        .has-error { border-color: #ef4444 !important; background: #fff1f2 !important; }
        .error-message { color: #ef4444; font-size: 12px; font-weight: 600; margin: 4px 0 0 4px; }

        .modern-submit-btn {
          width: 100%;
          background: #0f172a;
          color: #ffffff;
          border: none;
          border-radius: 16px;
          padding: 1.25rem;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          margin-top: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .modern-submit-btn:hover {
          background: #1e293b;
          transform: translateY(-2px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .modern-submit-btn:disabled {
          background: #94a3b8;
          cursor: not-allowed;
          transform: none;
        }

        .modern-footer-note {
          text-align: center;
          margin-top: 2rem;
          font-size: 12px;
          color: #94a3b8;
          line-height: 1.5;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }

        /* Modal Styles */
        .modern-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          z-index: 1000;
          animation: fadeIn 0.4s ease;
        }

        .modern-success-card {
          background: #ffffff;
          border-radius: 24px;
          padding: 2rem;
          width: 100%;
          max-width: 500px;
          text-align: center;
          animation: zoomIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }

        .modern-success-card::-webkit-scrollbar {
          display: none; /* Chrome, Safari and Opera */
        }

        .success-processing-icon {
          width: 80px;
          height: 80px;
          background: #2563eb;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          color: white;
          box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.4);
          position: relative;
        }

        .iconic-spinner {
          width: 44px;
          height: 44px;
        }

        .iconic-spinner-path {
          stroke: white;
          stroke-linecap: round;
          animation: iconic-dash 1.5s ease-in-out infinite;
        }

        @keyframes iconic-dash {
          0% {
            stroke-dasharray: 1, 150;
            stroke-dashoffset: 0;
          }
          50% {
            stroke-dasharray: 90, 150;
            stroke-dashoffset: -35;
          }
          100% {
            stroke-dasharray: 90, 150;
            stroke-dashoffset: -124;
          }
        }

        .iconic-spinner-outer {
          animation: iconic-rotate 2s linear infinite;
        }

        @keyframes iconic-rotate {
          100% { transform: rotate(360deg); }
        }

        .registration-timeline {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 2rem;
          padding: 0.5rem;
        }

        .timeline-step {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          padding: 0.4rem 0.8rem;
          border-radius: 20px;
          letter-spacing: 0.05em;
        }

        .step-submitted { background: #ecfdf5; color: #10b981; border: 1px solid #d1fae5; }
        .step-review { background: #eff6ff; color: #2563eb; border: 1px solid #dbeafe; }
        .step-confirmed { background: #f8fafc; color: #94a3b8; border: 1px solid #f1f5f9; }

        .timeline-line {
          height: 2px;
          width: 20px;
          background: #e2e8f0;
        }

        .success-title { 
          font-size: clamp(24px, 5vw, 32px); 
          font-weight: 900; 
          color: #0f172a; 
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: -0.01em;
        }
        .success-title span { color: #2563eb; }

        .success-desc { 
          color: #64748b; 
          line-height: 1.5; 
          margin-bottom: 2rem; 
          font-size: 13px; 
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .registration-details-card {
          background: #f8fafc;
          border-radius: 16px;
          padding: 1.25rem;
          margin-bottom: 1.5rem;
          text-align: left;
          border: 1px solid #e2e8f0;
        }

        .details-header {
          font-size: 12px;
          font-weight: 800;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.75rem;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 0.4rem;
        }

        .details-grid {
          display: grid;
          gap: 0.5rem;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.4rem 0;
          border-bottom: 1px dashed #f1f5f9;
        }
        
        .detail-item:last-child { border-bottom: none; }

        .detail-label {
          color: #64748b;
          font-weight: 500;
          font-size: 13px;
          min-width: 100px;
        }

        .detail-value {
          color: #0f172a;
          font-weight: 700;
          font-size: 13px;
          text-align: right;
          word-break: break-word;
        }

        @media (max-width: 480px) {
          .registration-timeline {
            gap: 0.5rem;
            flex-wrap: wrap;
          }
          .timeline-step {
            padding: 0.3rem 0.6rem;
            font-size: 10px;
          }
          .timeline-line { width: 10px; }
          .modern-modal-overlay {
            padding: 1rem;
          }
          .modern-success-card {
            padding: 1.5rem;
            border-radius: 20px;
          }
          .success-title { font-size: 18px; }
          .success-desc { font-size: 11px; }
          .detail-item {
            flex-direction: column;
            gap: 0.15rem;
            align-items: flex-start;
          }
          .detail-value {
            text-align: left;
            font-size: 14px;
          }
        }

        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }

        .checkmark-circle {
          stroke-dasharray: 166;
          stroke-dashoffset: 166;
          stroke-width: 2;
          stroke-miterlimit: 10;
          stroke: #10b981;
          fill: none;
          animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
        }

        .checkmark-check {
          transform-origin: 50% 50%;
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
        }

        @keyframes stroke { 100% { stroke-dashoffset: 0; } }
        @keyframes fill { 100% { box-shadow: inset 0px 0px 0px 30px #ffffff; } }

        .success-action-area { display: flex; flex-direction: column; gap: 0.75rem; }
        .modern-btn-primary {
          background: #0f172a;
          color: white;
          padding: 0.85rem;
          border-radius: 12px;
          border: none;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .modern-btn-secondary {
          background: #f1f5f9;
          color: #475569;
          padding: 0.85rem;
          border-radius: 12px;
          border: none;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .modern-btn-primary:hover { background: #1e293b; transform: translateY(-1px); }
        .modern-btn-secondary:hover { background: #e2e8f0; transform: translateY(-1px); }

        /* Loader Styles */
        .modern-reg-loader { text-align: center; color: #64748b; font-weight: 600; }
        .loader-ring {
          width: 48px;
          height: 48px;
          border: 4px solid #e2e8f0;
          border-top-color: #0f172a;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1.5rem;
        }

        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        /* Responsive Design */
        @media (max-width: 768px) {
          .modern-reg-container { padding: 0; background: #ffffff; }
          .modern-reg-card { border-radius: 0; box-shadow: none; }
          .modern-reg-header { padding: 4rem 2rem 2rem; border-radius: 0; }
          .modern-back-btn { top: 1.5rem; left: 1.5rem; padding: 0.4rem; border-radius: 50%; }
          .modern-back-text { display: none; }
          .modern-event-title { font-size: 2rem; }
          .modern-reg-body { padding: 2rem; }
          .form-grid { grid-template-columns: 1fr; gap: 1.25rem; }
          .span-full { grid-column: auto; }
          .modern-success-card { border-radius: 0; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; padding: 2rem; }
        }
      `}</style>
    </div>
  );
}

export default RegisterForm;

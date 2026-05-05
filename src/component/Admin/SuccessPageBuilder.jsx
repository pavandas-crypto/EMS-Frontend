import { useState } from "react";

export default function SuccessPageBuilder({ onSave }) {
  const [successConfig, setSuccessConfig] = useState({
    title: "Registration Successful!",
    message: "Thank you for registering for our event. We look forward to seeing you there!",
    displayFields: ["participant_name", "email", "mobile_number"],
  });

  const availableFields = [
    { value: "participant_name", label: "Participant Name" },
    { value: "designation", label: "Designation" },
    { value: "company_name", label: "Company Name" },
    { value: "email", label: "Email" },
    { value: "mobile_number", label: "Mobile Number" },
    { value: "gst_number", label: "GST Number" },
    { value: "membership_number", label: "Membership Number" },
  ];

  const handleFieldChange = (field, value) => {
    setSuccessConfig({ ...successConfig, [field]: value });
  };

  const toggleDisplayField = (fieldValue) => {
    setSuccessConfig({
      ...successConfig,
      displayFields: successConfig.displayFields.includes(fieldValue)
        ? successConfig.displayFields.filter((f) => f !== fieldValue)
        : [...successConfig.displayFields, fieldValue],
    });
  };

  const handleSave = () => {
    onSave(successConfig);
  };

  return (
    <div className="spb-container">
      <div className="spb-header">
        <h3 className="spb-title">Success Page Configuration</h3>
        <p className="spb-subtitle">Customize what participants see after registration</p>
      </div>

      <div className="spb-form">
        <div className="form-group">
          <label className="form-label">Success Page Title</label>
          <input
            type="text"
            className="input-field"
            value={successConfig.title}
            onChange={(e) => handleFieldChange("title", e.target.value)}
            placeholder="e.g., Registration Successful!"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Success Message</label>
          <textarea
            className="textarea-field"
            rows="4"
            value={successConfig.message}
            onChange={(e) => handleFieldChange("message", e.target.value)}
            placeholder="Enter the message participants will see after successful registration"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Display Registered Information</label>
          <p className="form-note">Select which participant fields to display on success page</p>
          <div className="spb-fields-grid">
            {availableFields.map((field) => (
              <label key={field.value} className="spb-field-checkbox">
                <input
                  type="checkbox"
                  checked={successConfig.displayFields.includes(field.value)}
                  onChange={() => toggleDisplayField(field.value)}
                />
                <span>{field.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="spb-preview">
          <h4 className="spb-preview-title">Preview</h4>
          <div className="spb-preview-box">
            <h2 style={{ color: "#111827", marginBottom: "8px" }}>{successConfig.title}</h2>
            <p style={{ color: "#6b7280", marginBottom: "16px" }}>{successConfig.message}</p>

            {successConfig.displayFields.length > 0 && (
              <div className="spb-preview-item">
                <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "8px" }}>Registration Details:</div>
                {successConfig.displayFields.map((field) => {
                  const fieldLabel = availableFields.find((f) => f.value === field)?.label;
                  return (
                    <div key={field} style={{ fontSize: "13px", color: "#374151", marginBottom: "4px" }}>
                      <strong>{fieldLabel}:</strong> [value]
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .spb-container {
          background: #fff;
          border: 1px solid #e9ecef;
          border-radius: 12px;
          padding: 20px;
          margin-top: 20px;
        }

        .spb-header {
          margin-bottom: 20px;
        }

        .spb-title {
          font-size: 16px;
          font-weight: 700;
          color: #111827;
          margin: 0 0 4px;
        }

        .spb-subtitle {
          font-size: 13px;
          color: #9ca3af;
          margin: 0;
        }

        .spb-form {
          display: grid;
          gap: 18px;
        }

        .spb-checkbox-group {
          display: grid;
          gap: 10px;
        }

        .spb-checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-size: 13px;
          color: #374151;
          user-select: none;
        }

        .spb-checkbox-label input {
          cursor: pointer;
        }

        .spb-fields-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 12px;
          margin-top: 12px;
        }

        .spb-field-checkbox {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          background: #f9fafb;
          cursor: pointer;
          transition: all 0.12s;
          font-size: 13px;
        }

        .spb-field-checkbox:hover {
          border-color: #fbbf24;
          background: #fffdf0;
        }

        .spb-field-checkbox input {
          cursor: pointer;
        }

        .spb-field-checkbox input:checked + span {
          font-weight: 600;
          color: #111827;
        }

        .spb-preview {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 16px;
        }

        .spb-preview-title {
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #9ca3af;
          margin: 0 0 12px;
        }

        .spb-preview-box {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          padding: 16px;
        }

        .spb-preview-item {
          padding-top: 12px;
          border-top: 1px solid #e5e7eb;
          margin-top: 12px;
        }

        .spb-preview-qr {
          width: 120px;
          height: 120px;
          background: #e5e7eb;
          border: 1px dashed #9ca3af;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 12px;
        }
      `}</style>
    </div>
  );
}

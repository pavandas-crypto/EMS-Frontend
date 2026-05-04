import { useState } from "react";

export default function RegistrationFormBuilder({ onSave }) {
  const DEFAULT_FIELDS = [
    { id: "participant_name", label: "Participant Name", type: "text", required: true, order: 1 },
    { id: "designation", label: "Designation", type: "text", required: false, order: 2 },
    { id: "company_name", label: "Company Name", type: "text", required: false, order: 3 },
    { id: "email", label: "Email", type: "email", required: true, order: 4 },
    { id: "mobile_number", label: "Mobile Number", type: "tel", required: true, order: 5 },
    { id: "gst_number", label: "GST Number", type: "text", required: false, order: 6 },
    { id: "membership_number", label: "Membership Number", type: "text", required: false, order: 7 },
  ];

  const [fields, setFields] = useState(DEFAULT_FIELDS);
  const [newField, setNewField] = useState({ label: "", type: "text", required: false });
  const [showAddField, setShowAddField] = useState(false);

  const updateField = (id, updates) => {
    setFields(fields.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const removeField = (id) => {
    setFields(fields.filter((f) => f.id !== id));
  };

  const addCustomField = () => {
    if (!newField.label.trim()) {
      alert("Field label is required");
      return;
    }
    const customFieldId = `custom_${Date.now()}`;
    const maxOrder = Math.max(...fields.map((f) => f.order), 0);
    setFields([
      ...fields,
      {
        id: customFieldId,
        label: newField.label,
        type: newField.type,
        required: newField.required,
        order: maxOrder + 1,
        isCustom: true,
      },
    ]);
    setNewField({ label: "", type: "text", required: false });
    setShowAddField(false);
  };

  const moveField = (id, direction) => {
    const index = fields.findIndex((f) => f.id === id);
    if (direction === "up" && index > 0) {
      const newFields = [...fields];
      [newFields[index], newFields[index - 1]] = [newFields[index - 1], newFields[index]];
      setFields(newFields);
    } else if (direction === "down" && index < fields.length - 1) {
      const newFields = [...fields];
      [newFields[index], newFields[index + 1]] = [newFields[index + 1], newFields[index]];
      setFields(newFields);
    }
  };

  const handleSave = () => {
    onSave(fields);
  };

  return (
    <div className="rfb-container">
      <div className="rfb-header">
        <h3 className="rfb-title">Registration Form Fields</h3>
        <p className="rfb-subtitle">Customize which fields participants must fill out</p>
      </div>

      <div className="rfb-fields-list">
        {fields.map((field, index) => (
          <div key={field.id} className="rfb-field-item">
            <div className="rfb-field-info">
              <div className="rfb-field-drag">⋮⋮</div>
              <div className="rfb-field-details">
                <div className="rfb-field-label">{field.label}</div>
                <div className="rfb-field-meta">{field.type} • {field.required ? "Required" : "Optional"}</div>
              </div>
            </div>

            <div className="rfb-field-controls">
              <button
                className="rfb-btn-icon"
                onClick={() => updateField(field.id, { required: !field.required })}
                title={field.required ? "Make optional" : "Make required"}
              >
                {field.required ? "✓ Required" : "○ Optional"}
              </button>

              <button
                className="rfb-btn-icon"
                onClick={() => moveField(field.id, "up")}
                disabled={index === 0}
                title="Move up"
              >
                ↑
              </button>

              <button
                className="rfb-btn-icon"
                onClick={() => moveField(field.id, "down")}
                disabled={index === fields.length - 1}
                title="Move down"
              >
                ↓
              </button>

              {field.isCustom && (
                <button
                  className="rfb-btn-delete"
                  onClick={() => removeField(field.id)}
                  title="Delete field"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {!showAddField ? (
        <button
          className="rfb-btn-add-field"
          onClick={() => setShowAddField(true)}
        >
          + Add Custom Field
        </button>
      ) : (
        <div className="rfb-add-field-form">
          <div className="form-group">
            <label className="form-label">Field Label</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Company Registration Number"
              value={newField.label}
              onChange={(e) => setNewField({ ...newField, label: e.target.value })}
            />
          </div>

          <div className="section-grid columns-2">
            <div className="form-group">
              <label className="form-label">Field Type</label>
              <select
                className="select-field"
                value={newField.type}
                onChange={(e) => setNewField({ ...newField, type: e.target.value })}
              >
                <option value="text">Text</option>
                <option value="email">Email</option>
                <option value="tel">Phone</option>
                <option value="number">Number</option>
                <option value="date">Date</option>
                <option value="textarea">Text Area</option>
              </select>
            </div>

            <div className="form-group" style={{ display: "flex", alignItems: "flex-end" }}>
              <label className="form-label" style={{ marginBottom: "0.5rem" }}>
                <input
                  type="checkbox"
                  checked={newField.required}
                  onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
                  style={{ marginRight: "0.5rem" }}
                />
                Make this field required
              </label>
            </div>
          </div>

          <div className="form-group" style={{ display: "flex", gap: "0.75rem" }}>
            <button
              type="button"
              className="button button-primary"
              onClick={addCustomField}
              style={{ flex: 1 }}
            >
              Add Field
            </button>
            <button
              type="button"
              className="button button-secondary"
              onClick={() => setShowAddField(false)}
              style={{ flex: 1 }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <style>{`
        .rfb-container {
          background: #fff;
          border: 1px solid #e9ecef;
          border-radius: 12px;
          padding: 20px;
          margin-top: 20px;
        }

        .rfb-header {
          margin-bottom: 20px;
        }

        .rfb-title {
          font-size: 16px;
          font-weight: 700;
          color: #111827;
          margin: 0 0 4px;
        }

        .rfb-subtitle {
          font-size: 13px;
          color: #9ca3af;
          margin: 0;
        }

        .rfb-fields-list {
          display: grid;
          gap: 12px;
          margin-bottom: 16px;
        }

        .rfb-field-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 14px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .rfb-field-item:hover {
          background: #f3f4f6;
          border-color: #d1d5db;
        }

        .rfb-field-info {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        .rfb-field-drag {
          color: #d1d5db;
          font-size: 12px;
          cursor: move;
          user-select: none;
        }

        .rfb-field-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .rfb-field-label {
          font-size: 13px;
          font-weight: 600;
          color: #111827;
        }

        .rfb-field-meta {
          font-size: 11px;
          color: #9ca3af;
        }

        .rfb-field-controls {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .rfb-btn-icon {
          padding: 5px 10px;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          background: #fff;
          font-size: 12px;
          font-weight: 600;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.12s;
          white-space: nowrap;
        }

        .rfb-btn-icon:hover:not(:disabled) {
          background: #fbbf24;
          border-color: #fbbf24;
          color: #111827;
        }

        .rfb-btn-icon:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .rfb-btn-delete {
          padding: 5px 8px;
          border: 1px solid #fee2e2;
          border-radius: 6px;
          background: #fef2f2;
          color: #dc2626;
          cursor: pointer;
          font-weight: 600;
          font-size: 12px;
          transition: all 0.12s;
        }

        .rfb-btn-delete:hover {
          background: #fee2e2;
          border-color: #dc2626;
        }

        .rfb-btn-add-field {
          width: 100%;
          padding: 12px;
          border: 2px dashed #d1d5db;
          border-radius: 8px;
          background: #f9fafb;
          color: #6b7280;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.12s;
        }

        .rfb-btn-add-field:hover {
          border-color: #fbbf24;
          color: #111827;
          background: #fffdf0;
        }

        .rfb-add-field-form {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 12px;
        }
      `}</style>
    </div>
  );
}

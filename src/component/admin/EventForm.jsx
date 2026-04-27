import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EventForm() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [successSettings, setSuccessSettings] = useState({
    success_title: "Registration Successful 🎉",
    success_message: "You have successfully registered for the event.",
    show_approval_notice: false,
    approval_message: "Your registration is under review. Please wait for approval confirmation via email.",
  });

  const [newField, setNewField] = useState({
    field_name: "",
    field_type: "text",
    placeholder: "",
    options: "",
    validation_regex: "",
    required: false,
    sort_order: 1,
  });

  const [customFields, setCustomFields] = useState([
    { field_id: 1, field_name: "Name", field_type: "text", required: true },
    { field_id: 2, field_name: "Email", field_type: "email", required: true },
  ]);

  const fieldTypes = ["text", "email", "tel", "number", "date", "textarea", "dropdown", "radio", "checkbox"];

  const handleSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSuccessSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFieldChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewField((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setMessage("Success page settings have been saved.");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleAddField = (e) => {
    e.preventDefault();
    if (!newField.field_name) {
      setError("Field name is required.");
      return;
    }

    const newFieldWithId = {
      field_id: customFields.length + 1,
      ...newField,
    };

    setCustomFields([...customFields, newFieldWithId]);
    setNewField({
      field_name: "",
      field_type: "text",
      placeholder: "",
      options: "",
      validation_regex: "",
      required: false,
      sort_order: 1,
    });
    setMessage("Field added successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleDeleteField = (fieldId) => {
    setCustomFields(customFields.filter((f) => f.field_id !== fieldId));
    setMessage("Field deleted successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>Manage Event Form</h1>
          <p className="text-muted">
            Customize the registration experience and control the approval or auto-confirmation workflow.
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="btn btn-secondary"
        >
          Back to Dashboard
        </button>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        <div className="col-lg-6 mb-4">
          <div className="card shadow">
            <div className="card-header bg-white border-bottom">
              <h5 className="mb-0">Success / Approval Settings</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSaveSettings}>
                <div className="mb-3">
                  <label htmlFor="success_title" className="form-label">
                    Success Page Title
                  </label>
                  <input
                    type="text"
                    id="success_title"
                    name="success_title"
                    className="form-control"
                    value={successSettings.success_title}
                    onChange={handleSettingsChange}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="success_message" className="form-label">
                    Success Page Message
                  </label>
                  <textarea
                    id="success_message"
                    name="success_message"
                    className="form-control"
                    rows="4"
                    value={successSettings.success_message}
                    onChange={handleSettingsChange}
                  />
                </div>

                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    id="show_approval_notice"
                    name="show_approval_notice"
                    className="form-check-input"
                    checked={successSettings.show_approval_notice}
                    onChange={handleSettingsChange}
                  />
                  <label className="form-check-label" htmlFor="show_approval_notice">
                    Show approval notice
                  </label>
                </div>

                <div className="mb-3">
                  <label htmlFor="approval_message" className="form-label">
                    Approval Notice Message
                  </label>
                  <textarea
                    id="approval_message"
                    name="approval_message"
                    className="form-control"
                    rows="3"
                    value={successSettings.approval_message}
                    onChange={handleSettingsChange}
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  Save Settings
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-6 mb-4">
          <div className="card shadow">
            <div className="card-header bg-white border-bottom">
              <h5 className="mb-0">Add Custom Registration Field</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleAddField}>
                <div className="mb-3">
                  <label htmlFor="field_name" className="form-label">
                    Field Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="field_name"
                    name="field_name"
                    className="form-control"
                    value={newField.field_name}
                    onChange={handleFieldChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="field_type" className="form-label">
                    Field Type <span className="text-danger">*</span>
                  </label>
                  <select
                    id="field_type"
                    name="field_type"
                    className="form-select"
                    value={newField.field_type}
                    onChange={handleFieldChange}
                    required
                  >
                    {fieldTypes.map((type) => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="placeholder" className="form-label">
                    Placeholder Text
                  </label>
                  <input
                    type="text"
                    id="placeholder"
                    name="placeholder"
                    className="form-control"
                    value={newField.placeholder}
                    onChange={handleFieldChange}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="options" className="form-label">
                    Options (one per line - for dropdown/radio/checkbox)
                  </label>
                  <textarea
                    id="options"
                    name="options"
                    className="form-control"
                    rows="3"
                    value={newField.options}
                    onChange={handleFieldChange}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="sort_order" className="form-label">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    id="sort_order"
                    name="sort_order"
                    className="form-control"
                    value={newField.sort_order}
                    onChange={handleFieldChange}
                    min="1"
                  />
                </div>

                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    id="required"
                    name="required"
                    className="form-check-input"
                    checked={newField.required}
                    onChange={handleFieldChange}
                  />
                  <label className="form-check-label" htmlFor="required">
                    Required field
                  </label>
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  Add Field
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow">
        <div className="card-header bg-white border-bottom">
          <h5 className="mb-0">Existing Custom Fields</h5>
        </div>
        <div className="card-body">
          {customFields.length === 0 ? (
            <div className="alert alert-info mb-0">
              No custom fields have been added for this event yet.
            </div>
          ) : (
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Field Name</th>
                  <th>Field Type</th>
                  <th>Required</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customFields.map((field) => (
                  <tr key={field.field_id}>
                    <td>{field.field_name}</td>
                    <td>{field.field_type}</td>
                    <td>
                      <span className={`badge ${field.required ? "bg-success" : "bg-secondary"}`}>
                        {field.required ? "Yes" : "No"}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDeleteField(field.field_id)}
                        className="btn btn-sm btn-danger"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventForm;

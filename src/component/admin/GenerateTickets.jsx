import { useState } from "react";
import { useNavigate } from "react-router-dom";

function GenerateTickets() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [events] = useState([
    { event_id: 1, event_name: "Tech Conference 2024" },
    { event_id: 2, event_name: "Networking Breakfast" },
  ]);

  const [templates, setTemplates] = useState([
    {
      template_id: 1,
      template_name: "Standard Ticket",
      layout_json: '{\n  "title": "Event Pass",\n  "fields": ["event_name", "participant_name", "pass_number"]\n}',
      created_at: "2024-04-20",
    },
  ]);

  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [templateName, setTemplateName] = useState("");
  const [layoutJson, setLayoutJson] = useState('{\n  "title": "Event Pass",\n  "fields": []\n}');

  const handleGenerateTickets = (e) => {
    e.preventDefault();

    if (!selectedEvent) {
      setError("Please select an event to generate tickets.");
      return;
    }

    setMessage("Generated 45 tickets. 0 failed.");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleCreateTemplate = (e) => {
    e.preventDefault();

    if (!templateName || !layoutJson.trim()) {
      setError("Template name and layout JSON are required.");
      return;
    }

    try {
      JSON.parse(layoutJson);
    } catch {
      setError("Template layout must be valid JSON.");
      return;
    }

    const newTemplate = {
      template_id: templates.length + 1,
      template_name: templateName,
      layout_json: layoutJson,
      created_at: new Date().toISOString().split("T")[0],
    };

    setTemplates([...templates, newTemplate]);
    setTemplateName("");
    setLayoutJson('{\n  "title": "Event Pass",\n  "fields": []\n}');
    setMessage("Ticket template created successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>Bulk Ticket Generation</h1>
          <p className="text-muted">
            Generate tickets for approved participants only. Select a ticket template and run bulk generation.
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

      {/* Ticket Generation Card */}
      <div className="card shadow mb-4">
        <div className="card-header bg-white border-bottom">
          <h5 className="mb-0">Ticket Generation</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleGenerateTickets}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="event_id" className="form-label">
                  Event <span className="text-danger">*</span>
                </label>
                <select
                  id="event_id"
                  className="form-select"
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value)}
                  required
                >
                  <option value="">-- Select Event --</option>
                  {events.map((event) => (
                    <option key={event.event_id} value={event.event_id}>
                      {event.event_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="template_id" className="form-label">
                  Ticket Template <span className="text-danger">*</span>
                </label>
                <select
                  id="template_id"
                  className="form-select"
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  required
                >
                  {templates.map((template) => (
                    <option key={template.template_id} value={template.template_id}>
                      {template.template_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg w-100">
              Generate Bulk Tickets
            </button>
          </form>
        </div>
      </div>

      {/* Create Template and Available Templates Grid */}
      <div className="row">
        <div className="col-lg-6 mb-4">
          <div className="card shadow">
            <div className="card-header bg-white border-bottom">
              <h5 className="mb-0">Create Ticket Template</h5>
            </div>
            <div className="card-body">
              <p className="text-muted mb-3">
                Use JSON to configure the template structure. Stored templates can be selected when generating
                tickets.
              </p>
              <form onSubmit={handleCreateTemplate}>
                <div className="mb-3">
                  <label htmlFor="template_name" className="form-label">
                    Template Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="template_name"
                    className="form-control"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="layout_json" className="form-label">
                    Layout JSON <span className="text-danger">*</span>
                  </label>
                  <textarea
                    id="layout_json"
                    className="form-control"
                    rows="8"
                    value={layoutJson}
                    onChange={(e) => setLayoutJson(e.target.value)}
                    required
                    style={{ fontFamily: "monospace", fontSize: "12px" }}
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  Save Template
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-6 mb-4">
          <div className="card shadow">
            <div className="card-header bg-white border-bottom">
              <h5 className="mb-0">Available Templates</h5>
            </div>
            <div className="card-body">
              {templates.length === 0 ? (
                <div className="alert alert-info mb-0">No ticket templates created yet.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-sm table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>Name</th>
                        <th>Created At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {templates.map((template) => (
                        <tr key={template.template_id}>
                          <td>
                            <strong>{template.template_name}</strong>
                          </td>
                          <td>
                            <small className="text-muted">{template.created_at}</small>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Template Details */}
      <div className="card shadow">
        <div className="card-header bg-white border-bottom">
          <h5 className="mb-0">Template Layout (JSON)</h5>
        </div>
        <div className="card-body">
          {templates.length === 0 ? (
            <p className="text-muted">No templates available.</p>
          ) : (
            <div style={{ background: "#f8f9fc", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "12px" }}>
              <pre style={{ margin: 0, fontFamily: "monospace", fontSize: "12px", whiteSpace: "pre-wrap" }}>
                {templates[templates.length - 1].layout_json}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GenerateTickets;

import { useState, useRef } from "react";

function GenerateTickets() {
  const [view, setView] = useState("initial"); // initial, designer, preview
  const [formData, setFormData] = useState({ eventName: "", template: "" });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [errors, setErrors] = useState({});

  // Designer state
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [draggedElement, setDraggedElement] = useState(null);
  const [templateDesign, setTemplateDesign] = useState({
    backgroundColor: "#ffffff",
    borderSize: 2,
    borderColor: "#000000",
    width: 375,
    height: 600,
    alignment: "center",
  });
  const [savedTemplates, setSavedTemplates] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("emsTicketTemplates")) || {};
    } catch {
      return {};
    }
  });
  const [templateName, setTemplateName] = useState("");
  const [downloadType, setDownloadType] = useState("bulk");
  const canvasRef = useRef(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setStatus({ type: "", message: "" });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const availableElements = [
    { type: "passNumber", label: "Pass Number", icon: "🎫" },
    { type: "name", label: "Name", icon: "👤" },
    { type: "designation", label: "Designation", icon: "💼" },
    { type: "companyName", label: "Company Name", icon: "🏢" },
    { type: "mobileNumber", label: "Mobile Number", icon: "📱" },
    { type: "qrcode", label: "QR Code", icon: "📲" },
  ];

  const handleAddElement = (elementType) => {
    const newElement = {
      id: Date.now(),
      type: elementType,
      x: 20,
      y: 20 + elements.length * 30,
      width: 150,
      height: 30,
      fontSize: 14,
      fontColor: "#000000",
    };
    setElements([...elements, newElement]);
    setSelectedElement(newElement.id);
  };

  const handleUpdateElement = (id, updates) => {
    setElements(elements.map((el) => (el.id === id ? { ...el, ...updates } : el)));
  };

  const handleRemoveElement = (id) => {
    setElements(elements.filter((el) => el.id !== id));
    setSelectedElement(null);
  };

  const handleMouseDown = (e, elementId) => {
    if (e.button === 0) {
      setDraggedElement(elementId);
      setSelectedElement(elementId);
    }
  };

  const handleMouseMove = (e) => {
    if (!draggedElement || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    handleUpdateElement(draggedElement, { x: Math.max(0, x - 75), y: Math.max(0, y - 15) });
  };

  const handleMouseUp = () => {
    setDraggedElement(null);
  };

  const handleTemplateChange = (field, value) => {
    setTemplateDesign((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveTemplate = () => {
    if (!templateName.trim()) {
      setStatus({ type: "error", message: "Please enter a template name." });
      return;
    }

    const templateData = {
      name: templateName,
      design: templateDesign,
      elements: elements,
      createdAt: new Date().toISOString(),
    };

    const updatedTemplates = {
      ...savedTemplates,
      [templateName]: templateData,
    };

    localStorage.setItem("emsTicketTemplates", JSON.stringify(updatedTemplates));
    setSavedTemplates(updatedTemplates);
    setStatus({ type: "success", message: `Template "${templateName}" saved successfully!` });
    setTemplateName("");
  };

  const handleLoadTemplate = (name) => {
    const template = savedTemplates[name];
    if (template) {
      setTemplateDesign(template.design);
      setElements(template.elements);
      setStatus({ type: "success", message: `Template "${name}" loaded!` });
    }
  };

  const handleDeleteTemplate = (name) => {
    const updatedTemplates = { ...savedTemplates };
    delete updatedTemplates[name];
    localStorage.setItem("emsTicketTemplates", JSON.stringify(updatedTemplates));
    setSavedTemplates(updatedTemplates);
    setStatus({ type: "success", message: `Template "${name}" deleted!` });
  };

  const downloadTicket = async () => {
    if (!canvasRef.current) return;

    try {
      const canvas = await html2canvas(canvasRef.current, { scale: 2 });
      const link = document.createElement("a");
      link.href = canvas.toDataURL();
      link.download = `ticket-${downloadType}-${Date.now()}.png`;
      link.click();
      setStatus({ type: "success", message: `Ticket downloaded as ${downloadType}!` });
    } catch (error) {
      setStatus({ type: "error", message: "Failed to download ticket. Please try again." });
    }
  };

  const handleDownload = async () => {
    if (downloadType === "bulk") {
      setStatus({
        type: "info",
        message: "Bulk download would generate multiple tickets. Frontend prototype can download individual ticket.",
      });
    }
    downloadTicket();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};

    if (!formData.eventName) nextErrors.eventName = "Select an event first.";
    if (!formData.template) nextErrors.template = "Choose a ticket template.";

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus({ type: "error", message: "Please select both event and template." });
      return;
    }

    setView("designer");
    setStatus({ type: "success", message: "Design your ticket layout below." });
  };

  if (view === "initial") {
    return (
      <div className="page-shell">
        <div className="card" style={{ maxWidth: "680px", margin: "0 auto" }}>
          <div className="card-header panel-header">
            <div>
              <p className="panel-label">Ticket tools</p>
              <h1 className="page-title">Generate tickets</h1>
            </div>
          </div>
          <div className="card-body">
            <p className="panel-copy">
              Validate ticket options with the EMS interface. Design your custom ticket layout.
            </p>

            {status.message && (
              <div className={`alert ${status.type === "success" ? "alert-success" : "alert-error"}`}>
                {status.message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="eventName" className="form-label">
                  Event selector
                </label>
                <select
                  id="eventName"
                  name="eventName"
                  value={formData.eventName}
                  onChange={handleChange}
                  className={`select-field ${errors.eventName ? "input-error" : ""}`}
                >
                  <option value="">Choose an event</option>
                  <option value="Leadership Summit">Leadership Summit</option>
                  <option value="Community Training">Community Training</option>
                  <option value="Volunteer Orientation">Volunteer Orientation</option>
                </select>
                {errors.eventName && <div className="field-error">{errors.eventName}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="template" className="form-label">
                  Ticket template
                </label>
                <select
                  id="template"
                  name="template"
                  value={formData.template}
                  onChange={handleChange}
                  className={`select-field ${errors.template ? "input-error" : ""}`}
                >
                  <option value="">Choose template style</option>
                  <option value="standard">Standard pass</option>
                  <option value="vip">VIP pass</option>
                </select>
                {errors.template && <div className="field-error">{errors.template}</div>}
              </div>

              <button type="submit" className="button button-primary">
                Start Ticket Design
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <style>{`
        .designer-container {
          display: grid;
          grid-template-columns: 300px 1fr 350px;
          gap: 20px;
          margin-top: 20px;
        }

        .designer-panel {
          background: #f5f5f5;
          padding: 15px;
          border-radius: 8px;
          border: 1px solid #e0e0e0;
          max-height: 800px;
          overflow-y: auto;
        }

        .elements-section {
          margin-bottom: 20px;
        }

        .elements-section h3 {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 10px;
          color: #333;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .element-button {
          display: block;
          width: 100%;
          padding: 8px 12px;
          margin-bottom: 8px;
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
          font-size: 13px;
          text-align: left;
          transition: all 0.2s;
        }

        .element-button:hover {
          background: #e3f2fd;
          border-color: #2196f3;
        }

        .canvas-area {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .ticket-preview {
          border: 2px solid #999;
          background: white;
          position: relative;
          cursor: move;
          overflow: hidden;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ticket-element {
          position: absolute;
          padding: 8px;
          border: 2px solid #bbb;
          background: rgba(200, 200, 255, 0.1);
          cursor: grab;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.1s;
          user-select: none;
        }

        .ticket-element:hover {
          border-color: #2196f3;
          background: rgba(33, 150, 243, 0.15);
        }

        .ticket-element.selected {
          border: 3px dashed #2196f3;
          background: rgba(33, 150, 243, 0.2);
          box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.3);
        }

        .ticket-element.dragging {
          opacity: 0.7;
          z-index: 1000;
        }

        .resize-handle {
          position: absolute;
          width: 12px;
          height: 12px;
          background: #2196f3;
          border: 2px solid white;
          bottom: -6px;
          right: -6px;
          cursor: nwse-resize;
          display: none;
        }

        .ticket-element.selected .resize-handle {
          display: block;
        }

        .properties-panel {
          background: #f5f5f5;
          padding: 15px;
          border-radius: 8px;
          border: 1px solid #e0e0e0;
          max-height: 800px;
          overflow-y: auto;
        }

        .property-group {
          margin-bottom: 15px;
        }

        .property-label {
          font-size: 12px;
          font-weight: 600;
          color: #666;
          margin-bottom: 5px;
          text-transform: uppercase;
        }

        .property-input {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 12px;
        }

        .property-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .template-management {
          background: #fff3e0;
          padding: 12px;
          border-radius: 6px;
          margin-bottom: 15px;
        }

        .template-item {
          background: white;
          padding: 8px 10px;
          margin: 5px 0;
          border: 1px solid #ddd;
          border-radius: 4px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
        }

        .template-item button {
          padding: 4px 8px;
          margin-left: 5px;
          font-size: 11px;
          cursor: pointer;
          background: #f0f0f0;
          border: 1px solid #ccc;
          border-radius: 3px;
        }

        .template-item button:hover {
          background: #e0e0e0;
        }

        .alert {
          padding: 12px;
          border-radius: 4px;
          margin-bottom: 15px;
          font-size: 13px;
        }

        .alert-success {
          background: #d4edda;
          border: 1px solid #c3e6cb;
          color: #155724;
        }

        .alert-error {
          background: #f8d7da;
          border: 1px solid #f5c6cb;
          color: #721c24;
        }

        .alert-info {
          background: #d1ecf1;
          border: 1px solid #bee5eb;
          color: #0c5460;
        }

        .button-group {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .button {
          padding: 10px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.2s;
        }

        .button-primary {
          background: #2196f3;
          color: white;
        }

        .button-primary:hover {
          background: #1976d2;
        }

        .button-secondary {
          background: #f5f5f5;
          color: #333;
          border: 1px solid #ddd;
        }

        .button-secondary:hover {
          background: #e0e0e0;
        }

        @media (max-width: 1200px) {
          .designer-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="card" style={{ marginBottom: "20px" }}>
        <div className="card-header panel-header">
          <div>
            <p className="panel-label">Ticket tools</p>
            <h1 className="page-title">Ticket Designer</h1>
          </div>
        </div>
      </div>

      {status.message && (
        <div className={`alert alert-${status.type}`}>
          {status.message}
        </div>
      )}

      <div className="designer-container">
        {/* Left Panel - Elements */}
        <div className="designer-panel">
          <div className="elements-section">
            <h3>Add Elements</h3>
            {availableElements.map((el) => (
              <button
                key={el.type}
                className="element-button"
                onClick={() => handleAddElement(el.type)}
                title={el.label}
              >
                {el.icon} {el.label}
              </button>
            ))}
          </div>

          <div className="elements-section">
            <h3>Added Elements</h3>
            <div style={{ fontSize: "12px", color: "#666" }}>
              {elements.length === 0 ? (
                <p>No elements added yet</p>
              ) : (
                elements.map((el) => (
                  <div
                    key={el.id}
                    style={{
                      padding: "8px",
                      margin: "4px 0",
                      background: selectedElement === el.id ? "#2196f3" : "#fff",
                      color: selectedElement === el.id ? "white" : "#333",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                    onClick={() => setSelectedElement(el.id)}
                  >
                    {availableElements.find((e) => e.type === el.type)?.label}
                    <button
                      style={{
                        float: "right",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        color: selectedElement === el.id ? "white" : "red",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveElement(el.id);
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Center - Canvas */}
        <div className="canvas-area">
          <div
            ref={canvasRef}
            className="ticket-preview"
            style={{
              width: `${templateDesign.width}px`,
              height: `${templateDesign.height}px`,
              backgroundColor: templateDesign.backgroundColor,
              borderWidth: `${templateDesign.borderSize}px`,
              borderColor: templateDesign.borderColor,
              margin: "0 auto",
            }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {elements.map((el) => (
              <div
                key={el.id}
                className={`ticket-element ${selectedElement === el.id ? "selected" : ""} ${
                  draggedElement === el.id ? "dragging" : ""
                }`}
                style={{
                  left: `${el.x}px`,
                  top: `${el.y}px`,
                  width: `${el.width}px`,
                  height: `${el.height}px`,
                  fontSize: `${el.fontSize}px`,
                  color: el.fontColor,
                }}
                onMouseDown={(e) => handleMouseDown(e, el.id)}
              >
                <span style={{ pointerEvents: "none" }}>
                  {el.type === "passNumber" && "PASS #001"}
                  {el.type === "name" && "John Doe"}
                  {el.type === "designation" && "Event Manager"}
                  {el.type === "companyName" && "Your Company"}
                  {el.type === "mobileNumber" && "+1 (555) 123-4567"}
                  {el.type === "qrcode" && "█▀▀█\n█ █\n█▄▄█"}
                </span>
                <div className="resize-handle"></div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center" }}>
            <select
              value={downloadType}
              onChange={(e) => setDownloadType(e.target.value)}
              className="property-input"
              style={{ width: "150px", marginRight: "10px" }}
            >
              <option value="individual">Individual</option>
              <option value="bulk">Bulk (All)</option>
            </select>
            <button className="button button-primary" onClick={handleDownload}>
              ⬇ Download Ticket
            </button>
            <button
              className="button button-secondary"
              onClick={() => setView("initial")}
              style={{ marginLeft: "10px" }}
            >
              Back
            </button>
          </div>
        </div>

        {/* Right Panel - Properties */}
        <div className="properties-panel">
          <div className="elements-section">
            <h3>Template Design</h3>

            <div className="property-group">
              <label className="property-label">Canvas Width (px)</label>
              <input
                type="number"
                value={templateDesign.width}
                onChange={(e) => handleTemplateChange("width", parseInt(e.target.value))}
                className="property-input"
                min="300"
                max="800"
              />
            </div>

            <div className="property-group">
              <label className="property-label">Canvas Height (px)</label>
              <input
                type="number"
                value={templateDesign.height}
                onChange={(e) => handleTemplateChange("height", parseInt(e.target.value))}
                className="property-input"
                min="400"
                max="1000"
              />
            </div>

            <div className="property-group">
              <label className="property-label">Background Color</label>
              <input
                type="color"
                value={templateDesign.backgroundColor}
                onChange={(e) => handleTemplateChange("backgroundColor", e.target.value)}
                className="property-input"
                style={{ height: "36px" }}
              />
            </div>

            <div className="property-group">
              <label className="property-label">Border Size (px)</label>
              <input
                type="number"
                value={templateDesign.borderSize}
                onChange={(e) => handleTemplateChange("borderSize", parseInt(e.target.value))}
                className="property-input"
                min="0"
                max="10"
              />
            </div>

            <div className="property-group">
              <label className="property-label">Border Color</label>
              <input
                type="color"
                value={templateDesign.borderColor}
                onChange={(e) => handleTemplateChange("borderColor", e.target.value)}
                className="property-input"
                style={{ height: "36px" }}
              />
            </div>

            <div className="property-group">
              <label className="property-label">Alignment</label>
              <select
                value={templateDesign.alignment}
                onChange={(e) => handleTemplateChange("alignment", e.target.value)}
                className="property-input"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>

          {selectedElement && (
            <div className="elements-section">
              <h3>Element Properties</h3>
              {elements
                .filter((el) => el.id === selectedElement)
                .map((el) => (
                  <div key={el.id}>
                    <div className="property-group">
                      <label className="property-label">X Position</label>
                      <input
                        type="number"
                        value={el.x}
                        onChange={(e) => handleUpdateElement(el.id, { x: parseInt(e.target.value) })}
                        className="property-input"
                      />
                    </div>

                    <div className="property-group">
                      <label className="property-label">Y Position</label>
                      <input
                        type="number"
                        value={el.y}
                        onChange={(e) => handleUpdateElement(el.id, { y: parseInt(e.target.value) })}
                        className="property-input"
                      />
                    </div>

                    <div className="property-row">
                      <div className="property-group">
                        <label className="property-label">Width</label>
                        <input
                          type="number"
                          value={el.width}
                          onChange={(e) =>
                            handleUpdateElement(el.id, { width: parseInt(e.target.value) })
                          }
                          className="property-input"
                        />
                      </div>

                      <div className="property-group">
                        <label className="property-label">Height</label>
                        <input
                          type="number"
                          value={el.height}
                          onChange={(e) =>
                            handleUpdateElement(el.id, { height: parseInt(e.target.value) })
                          }
                          className="property-input"
                        />
                      </div>
                    </div>

                    <div className="property-row">
                      <div className="property-group">
                        <label className="property-label">Font Size</label>
                        <input
                          type="number"
                          value={el.fontSize}
                          onChange={(e) =>
                            handleUpdateElement(el.id, { fontSize: parseInt(e.target.value) })
                          }
                          className="property-input"
                          min="8"
                          max="36"
                        />
                      </div>

                      <div className="property-group">
                        <label className="property-label">Font Color</label>
                        <input
                          type="color"
                          value={el.fontColor}
                          onChange={(e) => handleUpdateElement(el.id, { fontColor: e.target.value })}
                          className="property-input"
                          style={{ height: "36px" }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}

          <div className="template-management">
            <h3 style={{ marginTop: 0 }}>Save/Load Template</h3>
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Template name"
              className="property-input"
              style={{ marginBottom: "8px" }}
            />
            <button
              className="button button-primary"
              onClick={handleSaveTemplate}
              style={{ width: "100%" }}
            >
              💾 Save Template
            </button>

            {Object.keys(savedTemplates).length > 0 && (
              <div style={{ marginTop: "12px" }}>
                <h4 style={{ fontSize: "12px", margin: "8px 0 6px 0" }}>Saved Templates</h4>
                {Object.keys(savedTemplates).map((name) => (
                  <div key={name} className="template-item">
                    <span>{name}</span>
                    <div>
                      <button onClick={() => handleLoadTemplate(name)}>Load</button>
                      <button onClick={() => handleDeleteTemplate(name)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GenerateTickets;

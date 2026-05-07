import { useState, useEffect } from "react";
import RegistrationFormBuilder from "./RegistrationFormBuilder";
import SuccessPageBuilder from "./SuccessPageBuilder";
import api from "../../api/api";
import { useParams, useNavigate } from "react-router-dom";

function EventEdit() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    startTime: "09:00",
    startPeriod: "AM",
    endDate: "",
    endTime: "05:00",
    endPeriod: "PM",
    location: "",
    category: "EVENT",
    eventFor: "all",
    capacity: "",
    entryFee: "",
    additionalInfo: "",
  });
  const [organizer, setOrganizer] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Event Organizer",
    image: "",
  });
  const [registrationFields, setRegistrationFields] = useState([]);
  const [successPageConfig, setSuccessPageConfig] = useState(null);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState("event-details");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        const response = await api.getEvent(eventId);
        if (response.success) {
          const e = response.data;
          
          // Parse start date and time
          const startDT = new Date(e.start_date_time);
          const endDT = new Date(e.end_date_time);
          
          const formatTime = (date) => {
            let hours = date.getHours();
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const period = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;
            return {
              time: `${hours.toString().padStart(2, '0')}:${minutes}`,
              period
            };
          };

          const startT = formatTime(startDT);
          const endT = formatTime(endDT);

          setFormData({
            title: e.event_name,
            description: e.description,
            startDate: startDT.toISOString().split('T')[0],
            startTime: startT.time,
            startPeriod: startT.period,
            endDate: endDT.toISOString().split('T')[0],
            endTime: endT.time,
            endPeriod: endT.period,
            location: e.address,
            category: e.category || "EVENT",
            eventFor: e.event_for || "all",
            capacity: e.capacity || "",
            entryFee: e.entry_fee || "",
            additionalInfo: e.additional_info || "",
          });
          setOrganizer({
            name: e.organizer_name || "",
            email: e.organizer_email || "",
            phone: e.organizer_phone || "",
            role: e.organizer_role || "Event Organizer",
            image: "",
          });
          setRegistrationFields(e.registration_fields || []);
          setSuccessPageConfig(e.success_page_config || null);
        }
      } catch (error) {
        setStatus({ type: "error", message: "Failed to load event data." });
      } finally {
        setLoading(false);
      }
    };

    if (eventId) fetchEventData();
  }, [eventId]);

  const convertTo24Hour = (time, period) => {
    let [hours, minutes] = time.split(':');
    hours = parseInt(hours);
    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  };

  const steps = [
    { id: "event-details", label: "Event Details" },
    { id: "registration-form", label: "Registration Form" },
    { id: "success-page", label: "Success Page" }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === activeTab);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      if (activeTab === "event-details") {
        const nextErrors = {};
        if (!formData.title.trim()) nextErrors.title = "Event title is required.";
        if (!formData.description.trim()) nextErrors.description = "Event description is required.";
        if (!formData.startDate) nextErrors.startDate = "Start date is required.";
        if (!formData.endDate) nextErrors.endDate = "End date is required.";
        if (!formData.location.trim()) nextErrors.location = "Location is required.";
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) {
          setStatus({ type: "error", message: "Please complete all required fields." });
          return;
        }
      }
      setActiveTab(steps[currentStepIndex + 1].id);
      setStatus({ type: "", message: "" });
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setActiveTab(steps[currentStepIndex - 1].id);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleOrganizerChange = (event) => {
    const { name, value } = event.target;
    setOrganizer((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateEvent = async () => {
    const startDateTime = `${formData.startDate}T${convertTo24Hour(formData.startTime, formData.startPeriod)}:00`;
    const endDateTime = `${formData.endDate}T${convertTo24Hour(formData.endTime, formData.endPeriod)}:00`;

    const eventPayload = {
      event_name: formData.title,
      description: formData.description,
      start_date_time: startDateTime,
      end_date_time: endDateTime,
      address: formData.location,
      event_for: formData.eventFor,
      category: formData.category,
      capacity: formData.capacity ? parseInt(formData.capacity) : null,
      entry_fee: formData.entryFee ? parseFloat(formData.entryFee) : 0,
      additional_info: formData.additionalInfo,
      organizer_details: organizer.name ? organizer : null,
      registration_fields: registrationFields,
      success_page_config: successPageConfig
    };

    try {
      setStatus({ type: "loading", message: "Updating event..." });
      const response = await api.updateEvent(eventId, eventPayload);
      if (response.success) {
        setStatus({ type: "success", message: "Event updated successfully! 🎉" });
        setTimeout(() => navigate("/admin/dashboard"), 1500);
      }
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Update failed." });
    }
  };

  if (loading) return <div className="page-shell"><div className="card">Loading event...</div></div>;

  return (
    <div className="page-shell">
      <div className="card" style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div className="card-header panel-header">
           <h1 className="page-title">Edit Event</h1>
        </div>

        <div className="ec-tabs">
          {steps.map(step => (
            <button
              key={step.id}
              className={`ec-tab ${activeTab === step.id ? "ec-tab--active" : ""}`}
              onClick={() => setActiveTab(step.id)}
            >
              {step.label}
            </button>
          ))}
        </div>

        <div className="card-body">
          {status.message && (
            <div className={`alert ${status.type === "success" ? "alert-success" : (status.type === "loading" ? "alert-info" : "alert-error")}`}>
              {status.message}
            </div>
          )}

          {activeTab === "event-details" && (
            <div className="form-container">
              <div className="form-group">
                <label className="form-label">Title</label>
                <input name="title" value={formData.title} onChange={handleChange} className="input-field" />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea name="description" rows="4" value={formData.description} onChange={handleChange} className="textarea-field" />
              </div>
              <div className="section-grid columns-2">
                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <input name="startDate" type="date" value={formData.startDate} onChange={handleChange} className="input-field" />
                </div>
                <div className="form-group">
                  <label className="form-label">End Date</label>
                  <input name="endDate" type="date" value={formData.endDate} onChange={handleChange} className="input-field" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Location</label>
                <input name="location" value={formData.location} onChange={handleChange} className="input-field" />
              </div>
              <div className="section-grid columns-2">
                <div className="form-group">
                  <label className="form-label">Capacity</label>
                  <input name="capacity" type="number" value={formData.capacity} onChange={handleChange} className="input-field" />
                </div>
                <div className="form-group">
                  <label className="form-label">Entry Fee (₹)</label>
                  <input name="entryFee" type="number" value={formData.entryFee} onChange={handleChange} className="input-field" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Event Guide / Additional Info</label>
                <textarea name="additionalInfo" rows="3" value={formData.additionalInfo} onChange={handleChange} className="textarea-field" />
              </div>
              <div className="organizer-section" style={{ background: "#f8fafc", padding: "1.5rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                <h3 style={{ margin: "0 0 1rem", fontSize: "1.1rem" }}>Organizer Information</h3>
                <div className="section-grid columns-2">
                   <div className="form-group">
                      <label className="form-label">Name</label>
                      <input name="name" value={organizer.name} onChange={handleOrganizerChange} className="input-field" />
                   </div>
                   <div className="form-group">
                      <label className="form-label">Phone</label>
                      <input name="phone" value={organizer.phone} onChange={handleOrganizerChange} className="input-field" />
                   </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "registration-form" && (
            <RegistrationFormBuilder initialFields={registrationFields} onSave={setRegistrationFields} />
          )}

          {activeTab === "success-page" && (
            <div>
              <SuccessPageBuilder initialConfig={successPageConfig} onSave={setSuccessPageConfig} />
              <div style={{ marginTop: "2rem", display: "flex", justifyContent: "flex-end" }}>
                <button className="button button-primary" onClick={handleUpdateEvent}>Update Event</button>
              </div>
            </div>
          )}
        </div>

        <div className="ec-footer">
          <button className="button button-secondary" onClick={handlePrevious} disabled={currentStepIndex === 0}>Previous</button>
          <span>Step {currentStepIndex + 1} of 3</span>
          <button className="button button-primary" onClick={handleNext} disabled={currentStepIndex === 2}>Next</button>
        </div>
      </div>
      <style>{`
        .ec-tabs { display: flex; gap: 8px; padding: 0 20px; border-bottom: 1px solid #e5e7eb; background: #f9fafb; }
        .ec-tab { padding: 12px 20px; border: none; background: transparent; cursor: pointer; font-weight: 600; color: #6b7280; border-bottom: 3px solid transparent; transition: 0.2s; }
        .ec-tab--active { color: #111827; border-bottom-color: #fbbf24; }
        .ec-footer { display: flex; justify-content: space-between; align-items: center; padding: 20px; border-top: 1px solid #e5e7eb; background: #fff; }
        .form-container { display: flex; flex-direction: column; gap: 1.5rem; }
      `}</style>
    </div>
  );
}

export default EventEdit;

import { useState, useEffect } from "react";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import RegistrationFormBuilder from "./RegistrationFormBuilder";
import SuccessPageBuilder from "./SuccessPageBuilder";
import api from "../../api/api";
import { useParams, useNavigate } from "react-router-dom";

function EventEdit() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet',
    'link'
  ];
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
  const [eventImage, setEventImage] = useState({
    file: null,
    preview: null,
    imageId: null,
    uploading: false,
  });
  const [organizer, setOrganizer] = useState({
    name: "",
    email: "",
    phone: "",
    country: "India",
    role: "Event Organizer",
    image: "",
  });
  const [organizerErrors, setOrganizerErrors] = useState({});
  const [registrationFields, setRegistrationFields] = useState([
    { id: "participant_name", label: "Participant Name", type: "text", required: true, order: 1 },
    { id: "designation", label: "Designation", type: "text", required: false, order: 2 },
    { id: "company_name", label: "Company Name", type: "text", required: false, order: 3 },
    { id: "email", label: "Email", type: "email", required: true, order: 4 },
    { id: "mobile_number", label: "Mobile Number", type: "tel", required: true, order: 5 },
    { id: "gst_number", label: "GST Number", type: "text", required: false, order: 6 },
    { id: "membership_number", label: "Membership Number", type: "text", required: false, order: 7 },
  ]);
  const [successPageConfig, setSuccessPageConfig] = useState(null);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState("event-details");
  const [loading, setLoading] = useState(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [publishedEventId, setPublishedEventId] = useState(null);

  const steps = [
    { id: "event-details", label: "Event Details" },
    { id: "registration-form", label: "Registration Form" },
    { id: "success-page", label: "Success Page" }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === activeTab);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        const response = await api.getEvent(eventId);
        
        if (!response.success) {
          setStatus({ type: "error", message: "Failed to load event: " + (response.message || "Unknown error") });
          setLoading(false);
          return;
        }
        
        const e = response.data;
        
        if (!e || !e.event_id) {
          setStatus({ type: "error", message: "Event not found." });
          setLoading(false);
          return;
        }
        
        // Validate date fields
        if (!e.start_date_time || !e.end_date_time) {
          setStatus({ type: "error", message: "Event is missing date information." });
          setLoading(false);
          return;
        }
        
        // Parse start date and time
        const startDT = new Date(e.start_date_time);
        const endDT = new Date(e.end_date_time);
        
        // Check if dates are valid
        if (isNaN(startDT.getTime()) || isNaN(endDT.getTime())) {
          setStatus({ type: "error", message: "Event has invalid date format." });
          setLoading(false);
          return;
        }
        
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
        
        // Parse JSON fields if they come as strings (shouldn't happen, but being defensive)
        let registrationFieldsData = e.registration_fields || [];
        if (typeof registrationFieldsData === 'string') {
          try {
            registrationFieldsData = JSON.parse(registrationFieldsData);
          } catch (e) {
            registrationFieldsData = [];
          }
        }
        
        let successPageConfigData = e.success_page_config || null;
        if (typeof successPageConfigData === 'string') {
          try {
            successPageConfigData = JSON.parse(successPageConfigData);
          } catch (e) {
            successPageConfigData = null;
          }
        }

        setFormData({
          title: e.event_name || "",
          description: e.description || "",
          startDate: startDT.toISOString().split('T')[0],
          startTime: startT.time,
          startPeriod: startT.period,
          endDate: endDT.toISOString().split('T')[0],
          endTime: endT.time,
          endPeriod: endT.period,
          location: e.address || "",
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
          country: "India",
          role: e.organizer_role || "Event Organizer",
          image: "",
        });
        setRegistrationFields(Array.isArray(registrationFieldsData) ? registrationFieldsData : []);
        setSuccessPageConfig(successPageConfigData || null);
        setIsDraft(e.is_draft || false);
        
        if (e.image_id && e.image_url) {
          setEventImage({
            file: null,
            preview: e.image_url,
            imageId: e.image_id,
            uploading: false,
          });
        }
        
        setStatus({ type: "", message: "" });
      } catch (error) {
        console.error("Error loading event:", error);
        setStatus({ type: "error", message: error.message || "Failed to load event data." });
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

  const validatePhoneNumber = (phoneNumber, country) => {
    // Remove all non-digit characters for validation
    const digitsOnly = phoneNumber.replace(/\D/g, "");
    
    if (phoneNumber.trim() === "") {
      return { valid: true, error: "" };
    }
    
    if (country === "India") {
      if (digitsOnly.length !== 10) {
        return { valid: false, error: "Indian phone number must be exactly 10 digits" };
      }
      if (!/^[6-9]/.test(digitsOnly)) {
        return { valid: false, error: "Indian phone number must start with 6, 7, 8, or 9" };
      }
    } else if (country === "USA") {
      if (digitsOnly.length !== 10) {
        return { valid: false, error: "USA phone number must be exactly 10 digits" };
      }
    }
    
    return { valid: true, error: "" };
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleOrganizerChange = (event) => {
    const { name, value } = event.target;
    const newOrganizer = { ...organizer, [name]: value };
    setOrganizer(newOrganizer);
    
    // Validate phone number if phone or country changed
    if (name === "phone" || name === "country") {
      const validation = validatePhoneNumber(newOrganizer.phone, newOrganizer.country);
      setOrganizerErrors((prev) => ({
        ...prev,
        phone: validation.error,
      }));
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setStatus({ type: "error", message: "Invalid image format." });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setStatus({ type: "error", message: "Image size must be less than 5MB." });
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const preview = e.target.result;
      setEventImage(prev => ({
        ...prev,
        file: file,
        preview: preview,
        imageId: null,
        uploading: true,
      }));

      try {
        const response = await api.uploadImage(preview, file.name, formData.title || "Event Image");
        if (response.success) {
          setEventImage(prev => ({
            ...prev,
            imageId: response.data.image_id,
            uploading: false,
          }));
          setStatus({ type: "success", message: "Image uploaded successfully!" });
        }
      } catch (error) {
        setStatus({ type: "error", message: "Error uploading image: " + error.message });
        setEventImage(prev => ({ ...prev, uploading: false }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setEventImage({ file: null, preview: null, imageId: null, uploading: false });
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setActiveTab(steps[currentStepIndex + 1].id);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setActiveTab(steps[currentStepIndex - 1].id);
    }
  };

  const handleUpdateEvent = async () => {
    // Validate before update
    const nextErrors = {};
    if (!formData.title.trim()) nextErrors.title = "Event title is required.";
    if (!formData.description.trim()) nextErrors.description = "Event description is required.";
    if (!formData.startDate) nextErrors.startDate = "Start date is required.";
    if (!formData.endDate) nextErrors.endDate = "End date is required.";
    
    if (formData.startDate && formData.endDate) {
      const startDT = new Date(`${formData.startDate}T${convertTo24Hour(formData.startTime, formData.startPeriod)}:00`);
      const endDT = new Date(`${formData.endDate}T${convertTo24Hour(formData.endTime, formData.endPeriod)}:00`);
      
      if (endDT <= startDT) {
        nextErrors.endDate = "End date and time must be later than start date and time.";
      }
    }

    if (!formData.location.trim()) nextErrors.location = "Location is required.";
    
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setActiveTab("event-details");
      setStatus({ type: "error", message: "Please fix the validation errors." });
      return;
    }

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
      success_page_config: successPageConfig,
      image_id: eventImage.imageId || null,
    };

    try {
      setStatus({ type: "loading", message: "Updating event..." });
      const response = await api.updateEvent(eventId, eventPayload);
      if (response.success) {
        setStatus({ type: "success", message: "Event updated successfully! 🎉" });
        setShowSuccessPopup(true);
      }
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Update failed." });
    }
  };

  const handlePublishDraft = async () => {
    // Validate required fields
    const nextErrors = {};
    if (!formData.title.trim()) nextErrors.title = "Event title is required.";
    if (!formData.description.trim()) nextErrors.description = "Event description is required.";
    if (!formData.startDate) nextErrors.startDate = "Start date is required.";
    if (!formData.endDate) nextErrors.endDate = "End date is required.";
    
    if (formData.startDate && formData.endDate) {
      const startDT = new Date(`${formData.startDate}T${convertTo24Hour(formData.startTime, formData.startPeriod)}:00`);
      const endDT = new Date(`${formData.endDate}T${convertTo24Hour(formData.endTime, formData.endPeriod)}:00`);
      
      if (endDT <= startDT) {
        nextErrors.endDate = "End date and time must be later than start date and time.";
      }
    }

    if (!formData.location.trim()) nextErrors.location = "Location is required.";
    
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setActiveTab("event-details");
      setStatus({ type: "error", message: "Please fix the validation errors before publishing." });
      return;
    }

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
      success_page_config: successPageConfig,
      image_id: eventImage.imageId || null,
      is_draft: false
    };

    try {
      setStatus({ type: "loading", message: "Publishing event..." });
      const response = await api.updateEvent(eventId, eventPayload);
      if (response.success) {
        setPublishedEventId(eventId);
        setShowSuccessPopup(true);
        setIsDraft(false);
        setStatus({ type: "success", message: `Event "${formData.title}" published successfully! 🎉` });
      }
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Publishing failed." });
    }
  };

  if (loading) {
    return (
      <div className="page-shell">
        <div className="card">
          <div style={{ padding: "2rem", textAlign: "center" }}>
            <p>Loading event...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (status.type === "error" && status.message) {
    return (
      <div className="page-shell">
        <div className="card" style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div className="card-header panel-header">
            <div>
              <p className="panel-label">Event editor</p>
              <h1 className="page-title">Error Loading Event</h1>
            </div>
            <button 
              onClick={() => window.location.href = "/admin/dashboard"} 
              className="button button-text"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666', fontWeight: 600 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="19" y1="12" x2="5" y2="12"/>
                <polyline points="12 19 5 12 12 5"/>
              </svg>
              Back to Dashboard
            </button>
          </div>
          <div className="card-body">
            <div className="alert alert-error">
              {status.message}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="card" style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div className="card-header panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p className="panel-label">Event editor</p>
            <h1 className="page-title">{isDraft ? 'Edit Draft Event' : 'Edit Event'}</h1>
          </div>
          <button 
            onClick={() => navigate("/admin/dashboard")} 
            className="button button-text"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666', fontWeight: 600 }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
            Back to Dashboard
          </button>
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
              <p className="panel-copy">Update the basic event information and schedule.</p>

              <form onSubmit={(e) => { e.preventDefault(); }}>
                <div className="form-group">
                  <label htmlFor="title" className="form-label">
                    Event title
                  </label>
                  <input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`input-field ${errors.title ? "input-error" : ""}`}
                    placeholder="Enter event title"
                  />
                  {errors.title && <div className="field-error">{errors.title}</div>}
                </div>

                <div className="form-group quill-editor-group">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <div className={`quill-wrapper ${errors.description ? "quill-error" : ""}`}>
                    <ReactQuill
                      theme="snow"
                      value={formData.description}
                      onChange={(content) => {
                        setFormData(prev => ({ ...prev, description: content }));
                        if (errors.description) setErrors(prev => ({ ...prev, description: "" }));
                      }}
                      modules={modules}
                      formats={formats}
                      placeholder="Describe the event purpose and expected outcomes..."
                    />
                  </div>
                  {errors.description && <div className="field-error">{errors.description}</div>}
                </div>

                <div className="section-grid columns-2">
                  <div className="form-group">
                    <label htmlFor="startDate" className="form-label">
                      Start date
                    </label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <input
                        id="startDate"
                        name="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={handleChange}
                        className={`input-field ${errors.startDate ? "input-error" : ""}`}
                        style={{ flex: 2 }}
                      />
                      <input
                        name="startTime"
                        type="time"
                        value={formData.startTime}
                        onChange={handleChange}
                        className="input-field"
                        style={{ flex: 1 }}
                      />
                      <select
                        name="startPeriod"
                        value={formData.startPeriod}
                        onChange={handleChange}
                        className="input-field"
                        style={{ width: "70px" }}
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                    {errors.startDate && <div className="field-error">{errors.startDate}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="endDate" className="form-label">
                      End date
                    </label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <input
                        id="endDate"
                        name="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={handleChange}
                        className={`input-field ${errors.endDate ? "input-error" : ""}`}
                        style={{ flex: 2 }}
                      />
                      <input
                        name="endTime"
                        type="time"
                        value={formData.endTime}
                        onChange={handleChange}
                        className="input-field"
                        style={{ flex: 1 }}
                      />
                      <select
                        name="endPeriod"
                        value={formData.endPeriod}
                        onChange={handleChange}
                        className="input-field"
                        style={{ width: "70px" }}
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                    {errors.endDate && <div className="field-error">{errors.endDate}</div>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="location" className="form-label">
                    Location
                  </label>
                  <input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className={`input-field ${errors.location ? "input-error" : ""}`}
                    placeholder="Enter venue or online link"
                  />
                  {errors.location && <div className="field-error">{errors.location}</div>}
                </div>

                <div className="section-grid columns-2">
                  <div className="form-group">
                    <label htmlFor="category" className="form-label">
                      Event Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="input-field"
                    >
                      <option value="EVENT">Event</option>
                      <option value="CONFERENCE">Conference</option>
                      <option value="WORKSHOP">Workshop</option>
                      <option value="WEBINAR">Webinar</option>
                      <option value="MEETUP">Meetup</option>
                      <option value="GALA">Gala</option>
                      <option value="TRAINING">Training</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="eventFor" className="form-label">
                      Event For
                    </label>
                    <select
                      id="eventFor"
                      name="eventFor"
                      value={formData.eventFor}
                      onChange={handleChange}
                      className="input-field"
                    >
                      <option value="all">Everyone</option>
                      <option value="tssia_members">TSSIA Members</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="capacity" className="form-label">
                      Capacity (Optional)
                    </label>
                    <input
                      id="capacity"
                      name="capacity"
                      type="number"
                      value={formData.capacity}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Maximum number of attendees"
                      min="1"
                    />
                  </div>
                </div>

                <div className="section-grid columns-2">
                  <div className="form-group">
                    <label htmlFor="entryFee" className="form-label">
                      Entry Fee (Optional)
                    </label>
                    <input
                      id="entryFee"
                      name="entryFee"
                      type="number"
                      value={formData.entryFee}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="additionalInfo" className="form-label">
                    Additional Information (Optional)
                  </label>
                  <textarea
                    id="additionalInfo"
                    name="additionalInfo"
                    rows="3"
                    value={formData.additionalInfo}
                    onChange={handleChange}
                    className="textarea-field"
                    placeholder="Any additional details about the event..."
                  />
                </div>

                {/* Event Image Upload Section */}
                <div style={{
                  padding: "1.5rem",
                  background: "#f0f9ff",
                  borderRadius: "8px",
                  marginTop: "2rem",
                  marginBottom: "1.5rem",
                  border: "2px dashed #0ea5e9"
                }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "1rem", color: "#111827" }}>📸 Event Image (Optional)</h3>

                  {!eventImage.preview ? (
                    <div>
                      <label htmlFor="event-image" style={{
                        display: "block", padding: "2rem", background: "white", border: "2px dashed #cbd5e1", borderRadius: "6px", cursor: "pointer", textAlign: "center"
                      }}>
                        <input id="event-image" type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
                        <div>
                          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" style={{ marginBottom: "0.5rem", marginLeft: "auto", marginRight: "auto" }}>
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                          </svg>
                          <p style={{ margin: "0.5rem 0", fontWeight: "600", color: "#0ea5e9" }}>Click to select an image</p>
                        </div>
                      </label>
                    </div>
                  ) : (
                    <div>
                      <div style={{ position: "relative", marginBottom: "1rem", borderRadius: "6px", overflow: "hidden", maxWidth: "300px" }}>
                        <img src={eventImage.preview} alt="Event preview" style={{ width: "100%", height: "auto", display: "block" }} />
                        <button type="button" onClick={handleRemoveImage} style={{ position: "absolute", top: "0.5rem", right: "0.5rem", background: "rgba(0, 0, 0, 0.6)", color: "white", border: "none", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer" }}>✕</button>
                      </div>
                      {eventImage.uploading && <div style={{ padding: "0.5rem 1rem", background: "#f0f9ff", color: "#0369a1", borderRadius: "6px", fontSize: "0.9rem", fontWeight: "600", display: "inline-block" }}>Uploading image...</div>}
                      {eventImage.imageId && <div style={{ padding: "0.75rem 1rem", background: "#ecfdf5", border: "1px solid #86efac", borderRadius: "6px", color: "#166534", fontWeight: "600" }}>✓ Image linked successfully</div>}
                    </div>
                  )}
                </div>

                {/* Organizer Section */}
                <div style={{
                  padding: "1.5rem",
                  background: "#f9fafb",
                  borderRadius: "8px",
                  marginTop: "2rem",
                  marginBottom: "1rem",
                  border: "1px solid #e5e7eb"
                }}>
                  <h3 style={{
                    fontSize: "1.1rem",
                    fontWeight: "700",
                    marginBottom: "1rem",
                    color: "#111827"
                  }}>Organizer Information (Optional)</h3>

                  <div className="section-grid columns-2">
                    <div className="form-group">
                      <label htmlFor="organizer-name" className="form-label">
                        Organizer Name
                      </label>
                      <input
                        id="organizer-name"
                        name="name"
                        value={organizer.name}
                        onChange={handleOrganizerChange}
                        className="input-field"
                        placeholder="Your name or organization"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="organizer-role" className="form-label">
                        Role/Title
                      </label>
                      <input
                        id="organizer-role"
                        name="role"
                        value={organizer.role}
                        onChange={handleOrganizerChange}
                        className="input-field"
                        placeholder="e.g., Event Manager"
                      />
                    </div>
                  </div>

                  <div className="section-grid columns-2">
                    <div className="form-group">
                      <label htmlFor="organizer-email" className="form-label">
                        Email
                      </label>
                      <input
                        id="organizer-email"
                        name="email"
                        type="email"
                        value={organizer.email}
                        onChange={handleOrganizerChange}
                        className="input-field"
                        placeholder="contact@example.com"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="organizer-country" className="form-label">
                        Country
                      </label>
                      <select
                        id="organizer-country"
                        name="country"
                        value={organizer.country}
                        onChange={handleOrganizerChange}
                        className="input-field"
                      >
                        <option value="India">India</option>
                        <option value="USA">USA</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="organizer-phone" className="form-label">
                        Phone ({organizer.country} - 10 digits)
                      </label>
                      <input
                        id="organizer-phone"
                        name="phone"
                        value={organizer.phone}
                        onChange={handleOrganizerChange}
                        className={`input-field ${organizerErrors.phone ? "input-error" : ""}`}
                        placeholder={organizer.country === "India" ? "9876543210" : "2025551234"}
                      />
                      {organizerErrors.phone && <div className="field-error" style={{ color: "#dc2626", fontSize: "0.875rem", marginTop: "0.25rem" }}>{organizerErrors.phone}</div>}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}

          {activeTab === "registration-form" && (
            <RegistrationFormBuilder initialFields={registrationFields} onSave={setRegistrationFields} />
          )}

          {activeTab === "success-page" && (
            <div>
              <SuccessPageBuilder initialConfig={successPageConfig} onSave={setSuccessPageConfig} />
              <div style={{ marginTop: "2rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                {isDraft && (
                  <button 
                    className="button button-primary" 
                    onClick={handlePublishDraft}
                    style={{ backgroundColor: '#10b981' }}
                  >
                    Publish Event
                  </button>
                )}
                <button className="button button-primary" onClick={handleUpdateEvent}>
                  {isDraft ? 'Save Draft' : 'Update Event'}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="ec-footer">
          {currentStepIndex > 0 && (
            <button className="button button-secondary" onClick={handlePrevious}>Previous</button>
          )}
          {! (currentStepIndex > 0) && <div></div>}
          <span>Step {currentStepIndex + 1} of 3</span>
          {currentStepIndex < steps.length - 1 && (
            <button className="button button-primary" onClick={handleNext}>Next</button>
          )}
          {! (currentStepIndex < steps.length - 1) && <div></div>}
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

            <h2 className="success-title">{publishedEventId ? 'Event Published!' : 'Event Updated!'}</h2>
            <p className="success-message">
              {publishedEventId 
                ? <>Your event <strong>"{formData.title}"</strong> is now live and ready to accept registrations!</>
                : <>Changes to <strong>"{formData.title}"</strong> have been saved successfully.</>
              }
            </p>

            <div className="success-actions-vertical">
              <button 
                className="button button-primary" 
                onClick={() => window.open(`/event/${publishedEventId || eventId}`, '_blank')}
                style={{ width: '100%', marginBottom: '1rem' }}
              >
                View Landing Page
              </button>
              <button 
                className="button button-secondary" 
                onClick={() => {
                  setShowSuccessPopup(false);
                  setPublishedEventId(null);
                  if (publishedEventId) {
                    navigate("/admin/dashboard");
                  }
                }}
                style={{ width: '100%' }}
              >
                {publishedEventId ? 'Back to Dashboard' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
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
          max-width: 450px;
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
          background: #fbbf24;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 20px rgba(251, 191, 36, 0.3);
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

        .success-actions-vertical {
          display: flex;
          flex-direction: column;
        }

        .ec-tabs { display: flex; gap: 8px; padding: 0 20px; border-bottom: 1px solid #e5e7eb; background: #f9fafb; }
        .ec-tab { padding: 12px 20px; border: none; background: transparent; cursor: pointer; font-weight: 600; color: #6b7280; border-bottom: 3px solid transparent; transition: 0.2s; }
        .ec-tab--active { color: #111827; border-bottom-color: #fbbf24; }
        .ec-footer { display: flex; justify-content: space-between; align-items: center; padding: 20px; border-top: 1px solid #e5e7eb; background: #fff; }
        .form-container { display: flex; flex-direction: column; gap: 1.5rem; }
        .quill-wrapper {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
          background: white;
          transition: border-color 0.2s;
        }

        .quill-wrapper:focus-within {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .quill-wrapper.quill-error {
          border-color: #ef4444;
        }

        .ql-toolbar.ql-snow {
          border: none !important;
          border-bottom: 1px solid #e2e8f0 !important;
          background: #f8fafc;
        }

        .ql-container.ql-snow {
          border: none !important;
          min-height: 200px;
          font-family: inherit;
          font-size: 1rem;
        }
      `}</style>
    </div>
  );
}

export default EventEdit;

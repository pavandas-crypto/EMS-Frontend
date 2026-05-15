import { useState, useEffect } from "react";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import RegistrationFormBuilder from "./RegistrationFormBuilder";
import SuccessPageBuilder from "./SuccessPageBuilder";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";

// Utility function to generate unique event ID
const generateEventId = () => {
  return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

function EventCreate() {
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
    capacity: "",
    entryFee: "",
    category: "EVENT",
    eventFor: "all",
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
  const [status, setStatus] = useState({ type: "", message: "", eventId: "", landingPageUrl: "" });
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState("event-details");
  const [createdEventId, setCreatedEventId] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [draftEvent, setDraftEvent] = useState(null);
  const [loadingDraft, setLoadingDraft] = useState(true);
  const [showingDraft, setShowingDraft] = useState(false);
  const [publishedFromDraft, setPublishedFromDraft] = useState(false);

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

  const steps = [
    { id: "event-details", label: "Event Details" },
    { id: "registration-form", label: "Registration Form" },
    { id: "success-page", label: "Success Page" }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === activeTab);

  // Check for existing draft event on component mount
  useEffect(() => {
    const checkForDraft = async () => {
      try {
        const response = await api.getDraftEvent();
        if (response.data && response.data.event_id) {
          setDraftEvent(response.data);
        }
      } catch (error) {
        console.error("Error checking for draft event:", error);
      } finally {
        setLoadingDraft(false);
      }
    };

    checkForDraft();
  }, []);

  // Update registration fields requirement based on event category
  useEffect(() => {
    if (formData.eventFor === 'tssia_members') {
      setRegistrationFields(prev => prev.map(field => 
        field.id === 'membership_number' ? { ...field, required: true } : field
      ));
    } else {
      setRegistrationFields(prev => prev.map(field => 
        field.id === 'membership_number' ? { ...field, required: false } : field
      ));
    }
  }, [formData.eventFor]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      // Validate current step before proceeding
      if (activeTab === "event-details") {
        const nextErrors = {};

        if (!formData.title.trim()) nextErrors.title = "Event title is required.";
        if (!formData.description.trim()) nextErrors.description = "Event description is required.";
        if (!formData.startDate) nextErrors.startDate = "Start date and time are required.";
        if (!formData.endDate) nextErrors.endDate = "End date and time are required.";
        if (formData.startDate && formData.endDate) {
          const startDT = new Date(`${formData.startDate}T${convertTo24Hour(formData.startTime, formData.startPeriod)}:00`);
          const endDT = new Date(`${formData.endDate}T${convertTo24Hour(formData.endTime, formData.endPeriod)}:00`);
          
          if (endDT <= startDT) {
            nextErrors.endDate = "End date and time must be later than start date and time.";
          }
        }
        if (!formData.location.trim()) nextErrors.location = "Event location is required.";

        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
          setStatus({ type: "error", message: "Please complete all required fields before proceeding to the next step." });
          // Scroll to first error field
          setTimeout(() => {
            const firstErrorField = Object.keys(nextErrors)[0];
            const element = document.getElementById(firstErrorField);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              element.focus();
            }
          }, 100);
          return;
        }
      }

      setActiveTab(steps[currentStepIndex + 1].id);
      setStatus({ type: "", message: "" });
      // Scroll to top of new tab
      setTimeout(() => {
        const cardElement = document.querySelector('.card');
        if (cardElement) {
          cardElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setActiveTab(steps[currentStepIndex - 1].id);
      // Scroll to top of new tab
      setTimeout(() => {
        const cardElement = document.querySelector('.card');
        if (cardElement) {
          cardElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setStatus({ type: "", message: "", eventId: "" });
    setErrors((prev) => ({ ...prev, [name]: "" }));
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

  const handleOrganizerChange = (event) => {
    const { name, value } = event.target;
    const newOrganizer = { ...organizer, [name]: value };
    setOrganizer(newOrganizer);
    setStatus({ type: "", message: "", eventId: "" });
    
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

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setStatus({ 
        type: "error", 
        message: "Invalid image format. Please upload JPEG, PNG, GIF, or WebP." 
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setStatus({ 
        type: "error", 
        message: "Image size must be less than 5MB." 
      });
      return;
    }

    // Create preview and upload automatically
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
      setStatus({ type: "loading", message: "Uploading image..." });

      try {
        const response = await api.uploadImage(
          preview,
          file.name,
          formData.title || "Event Image"
        );

        if (response.success) {
          setEventImage(prev => ({
            ...prev,
            imageId: response.data.image_id,
            uploading: false,
          }));
          setStatus({ 
            type: "success", 
            message: "Image uploaded successfully!" 
          });
        }
      } catch (error) {
        setStatus({
          type: "error",
          message: "Error uploading image: " + error.message
        });
        setEventImage(prev => ({ ...prev, uploading: false }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUploadImage = async () => {
    if (!eventImage.file) return;

    try {
      setEventImage(prev => ({ ...prev, uploading: true }));
      setStatus({ type: "loading", message: "Uploading image..." });

      const response = await api.uploadImage(
        eventImage.preview,
        eventImage.file.name,
        formData.title || "Event Image"
      );

      if (response.success) {
        setEventImage(prev => ({
          ...prev,
          imageId: response.data.image_id,
          uploading: false,
        }));
        setStatus({ 
          type: "success", 
          message: "Image uploaded successfully!" 
        });
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: "Error uploading image: " + error.message
      });
      setEventImage(prev => ({ ...prev, uploading: false }));
    }
  };

  const handleRemoveImage = () => {
    setEventImage({
      file: null,
      preview: null,
      imageId: null,
      uploading: false,
    });
  };

  const validateForm = () => {
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
    if (!formData.location.trim()) nextErrors.location = "Event location is required.";

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus({ type: "error", message: "Please fix the highlighted fields to continue.", eventId: "" });
      return false;
    }

    setStatus({ type: "", message: "" });
    return true;
  };

  const convertTo24Hour = (time, period) => {
    let [hours, minutes] = time.split(':');
    hours = parseInt(hours);
    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // This is for form navigation only - actual event creation happens in handleCreateEvent
  };

  const handleCreateEvent = async () => {
    if (!validateForm()) {
      setActiveTab("event-details");
      return;
    }

    // Prepare date-time strings
    const startDateTime = `${formData.startDate}T${convertTo24Hour(formData.startTime, formData.startPeriod)}:00`;
    const endDateTime = `${formData.endDate}T${convertTo24Hour(formData.endTime, formData.endPeriod)}:00`;

    // Map to backend schema
    const eventPayload = {
      event_name: formData.title,
      description: formData.description,
      start_date_time: startDateTime,
      end_date_time: endDateTime,
      address: formData.location,
      event_for: formData.eventFor,
      capacity: formData.capacity ? parseInt(formData.capacity) : null,
      entry_fee: formData.entryFee ? parseFloat(formData.entryFee) : 0,
      category: formData.category,
      additional_info: formData.additionalInfo,
      image_id: eventImage.imageId || null,
      organizer_details: organizer.name ? organizer : null,
      registration_fields: registrationFields,
      success_page_config: successPageConfig,
      is_draft: false,
    };

    try {
      setStatus({ type: "loading", message: "Publishing event..." });
      const response = await api.createEvent(eventPayload);

      if (response.success) {
        const eventId = response.data.event_id;
        const landingPageUrl = `/event/${eventId}`;
        
        setCreatedEventId(eventId);
        setShowSuccessPopup(true);
        setStatus({
          type: "success",
          message: `Event "${formData.title}" published successfully! 🎉`,
          eventId: eventId,
          landingPageUrl: landingPageUrl,
        });
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Error publishing event. Please try again.",
        eventId: "",
        landingPageUrl: "",
      });
      console.error("Event creation error:", error);
    }
  };

  const handleSaveDraft = async () => {
    // Prepare date-time strings (only if provided)
    const startDateTime = formData.startDate ? `${formData.startDate}T${convertTo24Hour(formData.startTime, formData.startPeriod)}:00` : null;
    const endDateTime = formData.endDate ? `${formData.endDate}T${convertTo24Hour(formData.endTime, formData.endPeriod)}:00` : null;

    // Map to backend schema - with is_draft = true
    const draftPayload = {
      event_name: formData.title || "Untitled Event",
      description: formData.description,
      start_date_time: startDateTime,
      end_date_time: endDateTime,
      address: formData.location,
      event_for: formData.eventFor,
      capacity: formData.capacity ? parseInt(formData.capacity) : null,
      entry_fee: formData.entryFee ? parseFloat(formData.entryFee) : 0,
      category: formData.category,
      additional_info: formData.additionalInfo,
      image_id: eventImage.imageId || null,
      organizer_details: organizer.name ? organizer : null,
      registration_fields: registrationFields,
      success_page_config: successPageConfig,
      is_draft: true,
    };

    try {
      setStatus({ type: "loading", message: "Saving draft..." });
      const response = await api.createEvent(draftPayload);

      if (response.success) {
        setDraftEvent(response.data);
        setShowingDraft(true);
        setStatus({
          type: "success",
          message: `Draft event "${formData.title || 'Untitled Event'}" saved successfully!`,
          eventId: "",
          landingPageUrl: "",
        });
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Error saving draft. Please try again.",
        eventId: "",
        landingPageUrl: "",
      });
      console.error("Draft save error:", error);
    }
  };

  const handlePublishDraft = async () => {
    if (!draftEvent || !draftEvent.event_id) return;

    // Validate required fields are complete
    if (!formData.title.trim() || !formData.description.trim() || !formData.startDate || !formData.endDate || !formData.location.trim()) {
      setStatus({
        type: "error",
        message: "Please complete all required fields (title, description, dates, location) before publishing.",
        eventId: "",
      });
      return;
    }

    // Prepare date-time strings
    const startDateTime = `${formData.startDate}T${convertTo24Hour(formData.startTime, formData.startPeriod)}:00`;
    const endDateTime = `${formData.endDate}T${convertTo24Hour(formData.endTime, formData.endPeriod)}:00`;

    const publishPayload = {
      event_name: formData.title,
      description: formData.description,
      start_date_time: startDateTime,
      end_date_time: endDateTime,
      address: formData.location,
      event_for: formData.eventFor,
      capacity: formData.capacity ? parseInt(formData.capacity) : null,
      entry_fee: formData.entryFee ? parseFloat(formData.entryFee) : 0,
      category: formData.category,
      additional_info: formData.additionalInfo,
      image_id: eventImage.imageId || null,
      organizer_details: organizer.name ? organizer : null,
      registration_fields: registrationFields,
      success_page_config: successPageConfig,
      is_draft: false,
    };

    try {
      setStatus({ type: "loading", message: "Publishing draft event..." });
      const response = await api.updateEvent(draftEvent.event_id, publishPayload);

      if (response.success) {
        const eventId = response.data.event_id;
        const landingPageUrl = `/event/${eventId}`;
        
        setCreatedEventId(eventId);
        setPublishedFromDraft(true);
        setShowSuccessPopup(true);
        setDraftEvent(null);
        setShowingDraft(false);
        setStatus({
          type: "success",
          message: `Draft event "${formData.title}" published successfully! 🎉`,
          eventId: eventId,
          landingPageUrl: landingPageUrl,
        });
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Error publishing draft. Please try again.",
        eventId: "",
        landingPageUrl: "",
      });
      console.error("Draft publish error:", error);
    }
  };

  const handleDeleteDraft = async () => {
    if (!draftEvent || !draftEvent.event_id) return;

    if (!window.confirm("Are you sure you want to delete this draft event? This action cannot be undone.")) {
      return;
    }

    try {
      setStatus({ type: "loading", message: "Deleting draft..." });
      await api.deleteEvent(draftEvent.event_id);

      setDraftEvent(null);
      setShowingDraft(false);
      setFormData({
        title: "",
        description: "",
        startDate: "",
        startTime: "09:00",
        startPeriod: "AM",
        endDate: "",
        endTime: "05:00",
        endPeriod: "PM",
        location: "",
        capacity: "",
        entryFee: "",
        category: "EVENT",
        eventFor: "all",
        additionalInfo: "",
      });
      setEventImage({
        file: null,
        preview: null,
        imageId: null,
        uploading: false,
      });
      setStatus({
        type: "success",
        message: "Draft event deleted successfully.",
        eventId: "",
        landingPageUrl: "",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Error deleting draft. Please try again.",
        eventId: "",
        landingPageUrl: "",
      });
      console.error("Draft delete error:", error);
    }
  };

  const handleViewDraft = () => {
    if (!draftEvent) return;
    
    // Load draft data into form
    setFormData({
      title: draftEvent.event_name || "",
      description: draftEvent.description || "",
      startDate: draftEvent.start_date_time ? draftEvent.start_date_time.split('T')[0] : "",
      startTime: draftEvent.start_date_time ? draftEvent.start_date_time.split('T')[1].substring(0, 5) : "09:00",
      startPeriod: "AM",
      endDate: draftEvent.end_date_time ? draftEvent.end_date_time.split('T')[0] : "",
      endTime: draftEvent.end_date_time ? draftEvent.end_date_time.split('T')[1].substring(0, 5) : "05:00",
      endPeriod: "PM",
      location: draftEvent.address || "",
      capacity: draftEvent.capacity || "",
      entryFee: draftEvent.entry_fee || "",
      category: draftEvent.category || "EVENT",
      eventFor: draftEvent.event_for || "all",
      additionalInfo: draftEvent.additional_info || "",
    });

    if (draftEvent.image_id) {
      setEventImage({
        file: null,
        preview: draftEvent.image_url || null,
        imageId: draftEvent.image_id,
        uploading: false,
      });
    }

    setShowingDraft(true);
    setActiveTab("event-details");
  };

  const handlePreviewLandingPage = () => {
    if (status.landingPageUrl) {
      window.open(status.landingPageUrl, '_blank', 'width=1200,height=800');
    }
  };

  const handleCreateAnother = () => {
    // Reset all form data
    setFormData({
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      location: "",
      capacity: "",
      entryFee: "",
      category: "EVENT",
      additionalInfo: "",
    });
    setEventImage({
      file: null,
      preview: null,
      imageId: null,
      uploading: false,
    });
    setOrganizer({
      name: "",
      email: "",
      phone: "",
      country: "India",
      role: "Event Organizer",
      image: "",
    });
    setOrganizerErrors({});
    setRegistrationFields([]);
    setSuccessPageConfig(null);
    setStatus({ type: "", message: "", eventId: "", landingPageUrl: "" });
    setCreatedEventId(null);
    setPublishedFromDraft(false);
    setActiveTab("event-details");
  };

  return (
    <div className="page-shell">
      {/* Draft Event Alert */}
      {!loadingDraft && draftEvent && !showingDraft && (
        <div style={{
          background: "#fff7ed",
          border: "2px solid #fb923c",
          borderRadius: "8px",
          padding: "1.5rem",
          marginBottom: "1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <div>
            <h3 style={{ margin: "0 0 0.5rem 0", color: "#92400e", fontWeight: "700" }}>
              📝 You have an unsaved draft event
            </h3>
            <p style={{ margin: "0 0 0.5rem 0", color: "#b45309" }}>
              <strong>"{draftEvent.event_name}"</strong> - Save your progress by editing this draft or delete it to create a new event
            </p>
            <p style={{ margin: "0", fontSize: "0.9rem", color: "#d97706" }}>
              Drafted on: {new Date(draftEvent.draft_saved_at).toLocaleString()}
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              className="button button-primary"
              onClick={handleViewDraft}
              style={{
                padding: "0.6rem 1.2rem",
                fontSize: "0.95rem",
                background: "#fb923c",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Edit Draft
            </button>
            <button
              className="button button-text"
              onClick={handleDeleteDraft}
              style={{
                padding: "0.6rem 1.2rem",
                fontSize: "0.95rem",
                color: "#dc2626",
                fontWeight: "600",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: "inline", marginRight: "0.5rem" }}>
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
              Delete
            </button>
          </div>
        </div>
      )}

      <div className="card event-create-card">
        <div className="card-header panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p className="panel-label">Event builder</p>
            <h1 className="page-title">{showingDraft ? "Edit Draft Event" : "Create new event"}</h1>
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

        {/* Tabs */}
        <div className="ec-tabs">
          <button
            type="button"
            className={`ec-tab ${activeTab === "event-details" ? "ec-tab--active" : ""}`}
            disabled
          >
            Event Details
          </button>
          <button
            type="button"
            className={`ec-tab ${activeTab === "registration-form" ? "ec-tab--active" : ""}`}
            disabled
          >
            Registration Form
          </button>
          <button
            type="button"
            className={`ec-tab ${activeTab === "success-page" ? "ec-tab--active" : ""}`}
            disabled
          >
            Success Page
          </button>
        </div>

        <div className="card-body">
          {/* Event Details Tab */}
          {activeTab === "event-details" && (
            <>
              <p className="panel-copy">Configure the basic event information and schedule.</p>

              {status.message && (
                <div className={`alert ${status.type === "success" ? "alert-success" : "alert-error"}`}>
                  {status.message}
                  {status.type === "success" && status.eventId && (
                    <div style={{ marginTop: "1rem" }}>
                      <p style={{ margin: "0.5rem 0 0" }}>
                        <strong>Landing Page URL:</strong>
                      </p>
                      <a 
                        href={status.landingPageUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-block",
                          marginTop: "0.5rem",
                          padding: "0.5rem 1rem",
                          background: "rgba(255, 255, 255, 0.2)",
                          borderRadius: "6px",
                          color: "white",
                          textDecoration: "none",
                          fontWeight: "500",
                          transition: "background 0.2s",
                        }}
                        onMouseOver={(e) => e.target.style.background = "rgba(255, 255, 255, 0.3)"}
                        onMouseOut={(e) => e.target.style.background = "rgba(255, 255, 255, 0.2)"}
                      >
                        View Event Landing Page →
                      </a>
                    </div>
                  )}
                </div>
              )}

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
                  <h3 style={{
                    fontSize: "1.1rem",
                    fontWeight: "700",
                    marginBottom: "1rem",
                    color: "#111827"
                  }}>📸 Event Image (Optional)</h3>

                  {!eventImage.preview ? (
                    <div>
                      <label htmlFor="event-image" style={{
                        display: "block",
                        padding: "2rem",
                        background: "white",
                        border: "2px dashed #cbd5e1",
                        borderRadius: "6px",
                        cursor: "pointer",
                        textAlign: "center",
                        transition: "all 0.3s ease",
                      }} 
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.currentTarget.style.borderColor = "#0ea5e9";
                        e.currentTarget.style.background = "#f0f9ff";
                      }}
                      onDragLeave={(e) => {
                        e.currentTarget.style.borderColor = "#cbd5e1";
                        e.currentTarget.style.background = "white";
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.currentTarget.style.borderColor = "#cbd5e1";
                        e.currentTarget.style.background = "white";
                        if (e.dataTransfer.files?.[0]) {
                          const event = new Event('change', { bubbles: true });
                          Object.defineProperty(event, 'target', {
                            value: { files: e.dataTransfer.files },
                            enumerable: true
                          });
                          handleImageChange(event);
                        }
                      }}>
                        <input
                          id="event-image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          style={{ display: "none" }}
                        />
                        <div>
                          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" style={{ marginBottom: "0.5rem", marginLeft: "auto", marginRight: "auto" }}>
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <polyline points="21 15 16 10 5 21"/>
                          </svg>
                          <p style={{ margin: "0.5rem 0", fontWeight: "600", color: "#0ea5e9" }}>
                            Drag and drop your image here or click to select
                          </p>
                          <p style={{ margin: "0.5rem 0", fontSize: "0.9rem", color: "#64748b" }}>
                            Supported: JPEG, PNG, GIF, WebP (Max 5MB)
                          </p>
                          <p style={{ margin: "0.5rem 0", fontSize: "0.85rem", color: "#0369a1", fontWeight: "600", background: "#e0f2fe", padding: "8px 12px", borderRadius: "6px", display: "inline-block" }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }}>
                              <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>
                            </svg>
                            Guide: Use <strong>1920 x 1080 px</strong> (16:9 ratio) for a perfect fit.
                          </p>
                        </div>
                      </label>
                    </div>
                  ) : (
                    <div>
                      <div style={{
                        position: "relative",
                        marginBottom: "1rem",
                        borderRadius: "6px",
                        overflow: "hidden",
                        maxWidth: "300px",
                      }}>
                        <img 
                          src={eventImage.preview} 
                          alt="Event preview" 
                          style={{
                            width: "100%",
                            height: "auto",
                            display: "block",
                            borderRadius: "6px",
                          }}
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          style={{
                            position: "absolute",
                            top: "0.5rem",
                            right: "0.5rem",
                            background: "rgba(0, 0, 0, 0.6)",
                            color: "white",
                            border: "none",
                            borderRadius: "50%",
                            width: "32px",
                            height: "32px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "18px",
                          }}
                        >
                          ✕
                        </button>
                      </div>
                      
                      {eventImage.uploading && (
                        <div style={{
                          padding: "0.5rem 1rem",
                          background: "#f0f9ff",
                          color: "#0369a1",
                          borderRadius: "6px",
                          fontSize: "0.9rem",
                          fontWeight: "600",
                          display: "inline-block"
                        }}>
                          Uploading image...
                        </div>
                      )}

                      {eventImage.imageId && (
                        <div style={{
                          padding: "0.75rem 1rem",
                          background: "#ecfdf5",
                          border: "1px solid #86efac",
                          borderRadius: "6px",
                          color: "#166534",
                          fontWeight: "600",
                        }}>
                          ✓ Image uploaded successfully (ID: {eventImage.imageId})
                        </div>
                      )}
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
            </>
          )}

          {/* Registration Form Tab */}
          {activeTab === "registration-form" && (
            <>
              <p className="panel-copy">Customize the participant registration form fields.</p>
              <RegistrationFormBuilder
                initialFields={registrationFields}
                onSave={(fields) => {
                  setRegistrationFields(fields);
                }}
              />
            </>
          )}

          {/* Success Page Tab */}
          {activeTab === "success-page" && (
            <>
              <p className="panel-copy">Configure the page participants see after successful registration.</p>
              
              {status.message && (
                <div className={`alert ${status.type === "success" ? "alert-success" : "alert-error"}`}>
                  <div>{status.message}</div>
                  {status.type === "success" && status.eventId && (
                    <div style={{ marginTop: "1rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                      <button
                        type="button"
                        className="button button-primary"
                        onClick={handlePreviewLandingPage}
                        style={{
                          padding: "0.6rem 1.2rem",
                          fontSize: "0.95rem",
                          fontWeight: "600",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                        Preview Landing Page
                      </button>
                      <button
                        type="button"
                        className="button button-secondary"
                        onClick={handleCreateAnother}
                        style={{
                          padding: "0.6rem 1.2rem",
                          fontSize: "0.95rem",
                          fontWeight: "600",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="12" y1="5" x2="12" y2="19"/>
                          <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        Create Another Event
                      </button>
                    </div>
                  )}
                </div>
              )}

              {!createdEventId && (
                <>
                  <SuccessPageBuilder
                    initialConfig={successPageConfig}
                    onSave={(config) => {
                      setSuccessPageConfig(config);
                    }}
                  />
                  <div className="success-action-row">
                    <button
                      type="button"
                      className="button button-secondary"
                      onClick={handleSaveDraft}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        marginRight: "1rem",
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                        <polyline points="17 21 17 13 7 13 7 21"/>
                        <polyline points="7 3 7 8 15 8"/>
                      </svg>
                      Save as Draft
                    </button>
                    <button
                      type="button"
                      className="button button-primary"
                      onClick={showingDraft ? handlePublishDraft : handleCreateEvent}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.75rem",
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"/>
                        <polyline points="17 17 12 12 7 17"/>
                        <polyline points="12 12 12 3"/>
                      </svg>
                      {showingDraft ? "Publish Draft Event" : "Create Event & Generate Landing Page"}
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="ec-footer">
          {currentStepIndex > 0 && (
            <button
              className="button button-secondary ec-nav-button"
              onClick={handlePrevious}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
              Previous
            </button>
          )}
          {currentStepIndex === 0 && (
            <div style={{ width: "120px" }}></div>
          )}
          <div className="ec-step-indicator">
            Step {currentStepIndex + 1} of {steps.length}: {steps[currentStepIndex].label}
          </div>
          {currentStepIndex < steps.length - 1 && (
            <button
              className="button button-primary ec-nav-button"
              onClick={handleNext}
            >
              Next
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          )}
          {currentStepIndex === steps.length - 1 && (
            <div style={{ width: "120px" }}></div>
          )}
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

            <h2 className="success-title">{publishedFromDraft ? 'Event Published!' : 'Event Created!'}</h2>
            <p className="success-message">
              {publishedFromDraft 
                ? <>Your event <strong>"{formData.title}"</strong> is now live and ready to accept registrations!</>
                : <>Your event <strong>"{formData.title}"</strong> has been successfully created and is now live.</>
              }
            </p>

            <div className="success-actions-vertical">
              <button 
                className="button button-primary" 
                onClick={handlePreviewLandingPage}
                style={{ width: '100%', marginBottom: '1rem' }}
              >
                View Landing Page
              </button>
              <button 
                className="button button-secondary" 
                onClick={() => {
                  setShowSuccessPopup(false);
                  handleCreateAnother();
                }}
                style={{ width: '100%' }}
              >
                Create Another Event
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

        .ec-tabs {
          display: flex;
          gap: 8px;
          border-bottom: 1px solid #e5e7eb;
          padding: 0 20px;
          background: #f9fafb;
        }

        .ec-tab {
          padding: 12px 16px;
          border: none;
          background: transparent;
          border-bottom: 3px solid transparent;
          font-size: 13px;
          font-weight: 600;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .ec-tab:hover {
          color: #111827;
          background: #f3f4f6;
        }

        .ec-tab:disabled {
          cursor: default;
          opacity: 1;
          background: transparent;
        }

        .ec-tab--active {
          border-bottom-color: #fbbf24;
          color: #111827;
        }

        .ec-navigation {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          background: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
        }

        .ec-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: linear-gradient(135deg, var(--color-primary-50) 0%, var(--color-neutral-50) 100%);
          border-top: 1px solid var(--color-neutral-200);
          border-radius: 0 0 var(--radius-lg) var(--radius-lg);
          box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.05);
        }

        .ec-step-indicator {
          font-size: 14px;
          font-weight: 600;
          color: var(--color-neutral-700);
          background: rgba(255, 255, 255, 0.8);
          padding: 8px 16px;
          border-radius: var(--radius-md);
          border: 1px solid var(--color-neutral-200);
        }

        .ec-nav-button {
          min-width: 120px;
          font-weight: 600;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .ec-nav-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }

        .ec-nav-button:hover::before {
          left: 100%;
        }

        .ec-nav-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .success-action-row {
          display: flex;
          justify-content: flex-end;
          margin-top: 1.5rem;
        }
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

export default EventCreate;

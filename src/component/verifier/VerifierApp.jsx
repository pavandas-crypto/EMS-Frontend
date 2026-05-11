import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import './Verifier.css';
import EventSelection from './EventSelection';
import VerifierDashboard from './dashboard';

function VerifierApp() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [assignedEvents, setAssignedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load assigned events from localStorage or fetch them
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAssignedEvents(user.assigned_events || []);
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    // Clear cookies
    document.cookie = 'emsSession=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'emsUserRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '/';
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!selectedEvent) {
    return <EventSelection events={assignedEvents} onEventSelect={setSelectedEvent} onLogout={handleLogout} />;
  }

  return <VerifierDashboard selectedEvent={selectedEvent} onBackToSelection={() => setSelectedEvent(null)} onLogout={handleLogout} />;
}

export default VerifierApp;

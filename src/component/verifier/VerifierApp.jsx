import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import './Verifier.css';
import EventSelection from './EventSelection';
import VerifierDashboard from './dashboard';

function VerifierApp() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [assignedEvents, setAssignedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('verifier');

  useEffect(() => {
    const role = localStorage.getItem('userRole') || 'verifier';
    setUserRole(role);

    const loadEvents = async () => {
      setLoading(true);
      if (role === 'admin') {
        try {
          const response = await api.getEvents(1, 100);
          if (response.success) {
            setAssignedEvents(response.data || []);
          } else {
            setAssignedEvents([]);
          }
        } catch (error) {
          console.error('Error fetching events for admin:', error);
          setAssignedEvents([]);
        } finally {
          setLoading(false);
        }
      } else {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const user = JSON.parse(storedUser);
            setAssignedEvents(user.assigned_events || []);
          } catch (e) {
            console.error('Error parsing user data:', e);
            setAssignedEvents([]);
          }
        } else {
          try {
            const profile = await api.getProfile();
            if (profile.success) {
              setAssignedEvents(profile.data?.assigned_events || []);
            } else {
              setAssignedEvents([]);
            }
          } catch (error) {
            console.error('Error fetching verifier profile:', error);
            setAssignedEvents([]);
          }
        }
        setLoading(false);
      }
    };

    loadEvents();
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
    return <EventSelection userRole={userRole} events={assignedEvents} onEventSelect={setSelectedEvent} onLogout={handleLogout} />;
  }

  return <VerifierDashboard selectedEvent={selectedEvent} onBackToSelection={() => setSelectedEvent(null)} onLogout={handleLogout} />;
}

export default VerifierApp;

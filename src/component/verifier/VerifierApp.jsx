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
    const role = (localStorage.getItem('userRole') || 'verifier').toLowerCase();
    setUserRole(role);

    const loadEvents = async () => {
      setLoading(true);
      console.log(`[VerifierApp] Loading assigned events for role: ${role}`);
      
      if (role === 'admin') {
        try {
          const response = await api.getEvents(1, 100);
          if (response.success) {
            setAssignedEvents(response.data || []);
          } else {
            setAssignedEvents([]);
          }
        } catch (error) {
          console.error('[VerifierApp] Error fetching events for admin:', error);
          setAssignedEvents([]);
        } finally {
          setLoading(false);
        }
      } else {
        try {
          // Always fetch assigned events from database via dedicated endpoint
          const assignedResponse = await api.getAssignedEvents();
          if (assignedResponse.success) {
            console.log('[VerifierApp] Successfully fetched assigned events from DB');
            setAssignedEvents(assignedResponse.data || []);
          } else {
            // Fallback to profile endpoint if dedicated endpoint fails
            console.warn('[VerifierApp] Assigned events endpoint returned success:false, trying profile fallback');
            const profile = await api.getProfile();
            if (profile.success) {
              setAssignedEvents(profile.data?.assigned_events || []);
            } else {
              setAssignedEvents([]);
            }
          }
        } catch (error) {
          console.error('[VerifierApp] Error fetching verifier events from DB:', error);
          // Fallback to profile endpoint
          try {
            const profile = await api.getProfile();
            if (profile.success) {
              setAssignedEvents(profile.data?.assigned_events || []);
            }
          } catch (profileError) {
            console.error('[VerifierApp] Error fetching profile fallback:', profileError);
            setAssignedEvents([]);
          }
        } finally {
          setLoading(false);
        }
      }
    };

    loadEvents();
  }, []);

  const handleRefreshEvents = async () => {
    setLoading(true);
    try {
      const response = await api.getAssignedEvents();
      if (response.success) {
        setAssignedEvents(response.data || []);
      }
    } catch (error) {
      console.error('Error refreshing events:', error);
      // Try profile endpoint as fallback
      try {
        const profile = await api.getProfile();
        if (profile.success) {
          setAssignedEvents(profile.data?.assigned_events || []);
        }
      } catch (profileError) {
        console.error('Error fetching profile:', profileError);
      }
    } finally {
      setLoading(false);
    }
  };

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
    return <EventSelection userRole={userRole} events={assignedEvents} onEventSelect={setSelectedEvent} onLogout={handleLogout} onRefresh={handleRefreshEvents} />;
  }

  return <VerifierDashboard selectedEvent={selectedEvent} onBackToSelection={() => setSelectedEvent(null)} onLogout={handleLogout} />;
}

export default VerifierApp;

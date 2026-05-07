import React, { useState, useEffect } from 'react';
// import { eventService } from '../../services/api';

const EventListSample = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await eventService.getEvents(1, 10);
        if (response.success) {
          setEvents(response.data);
        } else {
          setError('Failed to load events');
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <div className="p-4 text-center">Loading events...</div>;
  if (error) return <div className="p-4 text-red-500 text-center">Error: {error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Event List (PostgreSQL)</h2>
      <div className="grid gap-4">
        {events.length === 0 ? (
          <p>No events found in the database.</p>
        ) : (
          events.map(event => (
            <div key={event.event_id} className="p-4 border rounded shadow-sm bg-white">
              <h3 className="font-semibold text-lg">{event.event_name}</h3>
              <p className="text-gray-600">{event.description}</p>
              <div className="mt-2 text-sm text-gray-500">
                <span>📍 {event.address}</span>
                <span className="ml-4">📅 {new Date(event.start_date_time).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventListSample;

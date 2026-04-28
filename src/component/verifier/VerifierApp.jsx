import React, { useState } from 'react';
import EventSelection from './EventSelection';
import VerifierDashboard from './dashboard';

const VerifierApp = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
  };

  const handleBackToSelection = () => {
    setSelectedEvent(null);
  };

  return (
    <div>
      {!selectedEvent ? (
        <EventSelection onEventSelect={handleEventSelect} />
      ) : (
        <VerifierDashboard
          selectedEvent={selectedEvent}
          onBackToSelection={handleBackToSelection}
        />
      )}
    </div>
  );
};

export default VerifierApp;
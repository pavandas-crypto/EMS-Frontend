import React from 'react';
import { useNavigate } from 'react-router-dom';
import './verifier/Verifier.css';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="v-center">
      <div className="v-card" style={{ maxWidth: '480px', textAlign: 'center', padding: '3.5rem 2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <img 
            src="/images/tssia logo.png" 
            alt="TSSIA Logo" 
            style={{ height: '60px', width: 'auto' }} 
          />
        </div>

        <h2 className="v-card__title" style={{ fontSize: '2rem' }}>Event Not Found</h2>
        
        <p className="v-card__desc" style={{ color: '#666', marginBottom: '2.5rem' }}>
          The event you're looking for doesn't exist or has been removed. 
          Please check the URL or return to the main events page.
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button 
            onClick={() => navigate('/')}
            className="v-btn"
            style={{ width: '100%', padding: '1rem' }}
          >
            Explore Events
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

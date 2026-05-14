import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f8f9fa',
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      padding: '20px'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '32px',
        boxShadow: '0 40px 100px rgba(0,0,0,0.08)',
        width: '100%',
        maxWidth: '900px',
        padding: '80px 60px',
        display: 'flex',
        alignItems: 'center',
        gap: '60px',
        position: 'relative',
        border: '1px solid rgba(0,0,0,0.03)'
      }}>
        {/* Browser control dots decoration */}
        <div style={{ position: 'absolute', top: '30px', left: '30px', display: 'flex', gap: '8px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }}></div>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }}></div>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }}></div>
        </div>

        {/* Left Side - Illustration of Disconnected Plugs */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <svg width="280" height="280" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="70" fill="#f1f5f9" />
            
            {/* Top Wire and Plug */}
            <path d="M40 30C40 30 40 70 80 70C120 70 120 100 120 100" stroke="#312e81" strokeWidth="6" strokeLinecap="round" />
            <g transform="translate(100, 95) rotate(-90)">
                <rect width="25" height="40" rx="6" fill="#312e81" />
                <rect x="7" y="40" width="3" height="15" rx="1.5" fill="#312e81" />
                <rect x="15" y="40" width="3" height="15" rx="1.5" fill="#312e81" />
            </g>

            {/* Bottom Wire and Socket */}
            <path d="M160 170C160 170 160 130 120 130C80 130 80 100 80 100" stroke="#312e81" strokeWidth="6" strokeLinecap="round" />
            <g transform="translate(75, 65) rotate(90)">
                <rect width="25" height="40" rx="6" fill="#312e81" />
                <circle cx="8" cy="8" r="3" fill="#fff" opacity="0.3" />
                <circle cx="17" cy="8" r="3" fill="#fff" opacity="0.3" />
            </g>
            
            {/* Sparks decoration */}
            <circle cx="100" cy="100" r="2" fill="#312e81" opacity="0.4" />
            <circle cx="115" cy="85" r="1.5" fill="#312e81" opacity="0.2" />
            <circle cx="85" cy="115" r="1.5" fill="#312e81" opacity="0.2" />
          </svg>
        </div>

        {/* Right Side - Content */}
        <div style={{ flex: 1.2, textAlign: 'left' }}>
          <h1 style={{ 
            fontSize: '140px', 
            fontWeight: '900', 
            color: '#312e81', 
            margin: '0',
            lineHeight: '0.9',
            letterSpacing: '-4px',
            opacity: '0.9'
          }}>404</h1>
          
          <h2 style={{ 
            fontSize: '42px', 
            fontWeight: '800', 
            color: '#1e1b4b', 
            margin: '10px 0 20px',
            letterSpacing: '-1px'
          }}>Page Not Found</h2>
          
          <p style={{ 
            fontSize: '18px', 
            color: '#64748b', 
            lineHeight: '1.6',
            margin: '0 0 45px',
            maxWidth: '320px'
          }}>
            We're sorry, the page you requested could not be found. Please go back to the homepage.
          </p>
          
          <button 
            onClick={() => navigate('/')}
            style={{
              background: '#312e81',
              color: '#fff',
              border: 'none',
              padding: '18px 48px',
              borderRadius: '50px',
              fontSize: '15px',
              fontWeight: '700',
              letterSpacing: '1.5px',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 12px 30px rgba(49, 46, 129, 0.25)',
              display: 'inline-flex',
              alignItems: 'center',
              textTransform: 'uppercase'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(49, 46, 129, 0.35)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(49, 46, 129, 0.25)';
            }}
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

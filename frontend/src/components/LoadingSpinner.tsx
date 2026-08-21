import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  subtext?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "Initializing AI Assistant...",
  subtext = "Verifying institutional access credentials",
}) => {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'radial-gradient(circle at 50% 40%, #1a080a 0%, #08080a 70%, #030304 100%)',
      color: '#ffffff',
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      overflow: 'hidden',
    }}>
      {/* Background ambient glowing orb */}
      <div style={{
        position: 'absolute',
        width: '320px',
        height: '320px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139, 0, 0, 0.35) 0%, rgba(212, 175, 55, 0.1) 50%, rgba(0,0,0,0) 80%)',
        filter: 'blur(40px)',
        animation: 'pulseGlow 3s ease-in-out infinite alternate',
      }} />

      {/* Glassmorphic Loader Card */}
      <div style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'rgba(20, 20, 25, 0.65)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '24px',
        padding: '40px 48px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        maxWidth: '90vw',
        width: '380px',
        textAlign: 'center',
      }}>
        {/* Ring & Logo Box */}
        <div style={{
          position: 'relative',
          width: '90px',
          height: '90px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '24px',
        }}>
          {/* Dual spinning outer rings */}
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '2.5px solid transparent',
            borderTopColor: '#8B0000',
            borderRightColor: '#D4AF37',
            animation: 'spin 1.2s linear infinite',
          }} />
          <div style={{
            position: 'absolute',
            inset: '-6px',
            borderRadius: '50%',
            border: '1.5px solid transparent',
            borderBottomColor: 'rgba(212, 175, 55, 0.4)',
            animation: 'spin 2s linear infinite reverse',
          }} />

          {/* PU Crest / Logo in Center */}
          <img
            src="/pu-logo.png"
            alt="Panjab University"
            style={{
              width: '46px',
              height: '46px',
              objectFit: 'contain',
              filter: 'drop-shadow(0 2px 8px rgba(139, 0, 0, 0.5))',
              animation: 'logoPulse 2s ease-in-out infinite',
            }}
            onError={(e) => {
              // Fallback icon if image fails
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
        </div>

        {/* Loading Text */}
        <h3 style={{
          fontSize: '1.15rem',
          fontWeight: 600,
          letterSpacing: '0.02em',
          color: '#f3f4f6',
          margin: '0 0 8px 0',
        }}>
          {message}
        </h3>

        <p style={{
          fontSize: '0.85rem',
          color: '#9ca3af',
          margin: 0,
          fontWeight: 400,
          lineHeight: 1.4,
        }}>
          {subtext}
        </p>

        {/* Progress Bar Animation */}
        <div style={{
          width: '100%',
          height: '3px',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '10px',
          marginTop: '24px',
          overflow: 'hidden',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: '40%',
            background: 'linear-gradient(90deg, #8B0000, #D4AF37)',
            borderRadius: '10px',
            animation: 'loadingProgress 1.6s ease-in-out infinite',
          }} />
        </div>
      </div>

      {/* Embedded keyframe styles */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes logoPulse {
          0%, 100% { transform: scale(1); opacity: 0.95; }
          50% { transform: scale(1.06); opacity: 1; }
        }
        @keyframes pulseGlow {
          0% { transform: scale(0.9); opacity: 0.5; }
          100% { transform: scale(1.15); opacity: 0.85; }
        }
        @keyframes loadingProgress {
          0% { left: -40%; width: 30%; }
          50% { width: 60%; }
          100% { left: 100%; width: 30%; }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;

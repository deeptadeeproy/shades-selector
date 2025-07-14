import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { SignupForm } from '../components/SignupForm';
import { useNavigate } from 'react-router-dom';

interface SignupProps {
  onNavigateToLogin: () => void;
  onSignup: (name: string, email: string, password: string) => void;
  onSuccess?: () => void;
}

export const Signup: React.FC<SignupProps> = ({ onNavigateToLogin, onSignup, onSuccess }) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate('/app')}
          className="flex items-center gap-2 mb-6 text-sm"
          style={{ color: hovered ? 'var(--text)' : 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s' }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to app
        </button>
        <Card style={{ border: 'none', backgroundColor: 'var(--bg-light)' }}>
          <CardContent className="p-6">
            <SignupForm
              onSignup={onSignup}
              onSwitchToLogin={onNavigateToLogin}
              onSuccess={onSuccess}
              showSuccessMessage={true}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 
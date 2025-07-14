import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { LoginForm } from '../components/LoginForm';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  onNavigateToSignup: () => void;
  onLogin: (email: string, password: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onNavigateToSignup, onLogin }) => {
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
            <LoginForm
              onLogin={onLogin}
              onSwitchToSignup={onNavigateToSignup}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 
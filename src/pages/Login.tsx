import React from 'react';
import { Card, CardContent } from '../components/ui/card';
import { LoginForm } from '../components/LoginForm';

interface LoginProps {
  onNavigateToSignup: () => void;
  onLogin: (email: string, password: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onNavigateToSignup, onLogin }) => {
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <div className="w-full max-w-md">
        <Card>
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
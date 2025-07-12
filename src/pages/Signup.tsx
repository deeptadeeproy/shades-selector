import React from 'react';
import { Card, CardContent } from '../components/ui/card';
import { SignupForm } from '../components/SignupForm';

interface SignupProps {
  onNavigateToLogin: () => void;
  onSignup: (name: string, email: string, password: string) => void;
  onSuccess?: () => void;
}

export const Signup: React.FC<SignupProps> = ({ onNavigateToLogin, onSignup, onSuccess }) => {
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <div className="w-full max-w-md">
        <Card>
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
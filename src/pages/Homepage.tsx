import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { LoginForm } from '../components/LoginForm';
import { SignupForm } from '../components/SignupForm';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

interface HomepageProps {
  onLogin: (email: string, password: string) => void;
  onSignup: (name: string, email: string, password: string) => void;
  onUseAsGuest: () => void;
  onSuccess?: () => void;
}

export const Homepage: React.FC<HomepageProps> = ({ 
  onLogin, 
  onSignup, 
  onUseAsGuest,
  onSuccess
}) => {
  const [showSignup, setShowSignup] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const handleSwitchToSignup = () => setShowSignup(true);
  const handleSwitchToLogin = () => setShowSignup(false);

  // Handle redirect when countdown reaches 0
  useEffect(() => {
    if (countdown === 0 && isSuccess) {
      if (onSuccess) {
        onSuccess();
      }
    }
  }, [countdown, isSuccess, onSuccess]);

  const handleSignupSuccess = () => {
    setIsSuccess(true);
    setCountdown(3);
    
    // Start countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Show success message if signup was successful
  if (isSuccess) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-6"
        style={{ backgroundColor: 'var(--bg)' }}
      >
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Logo */}
            <div className="text-center lg:text-left">
              <div className="mb-8">
                <h1 className="text-6xl lg:text-7xl font-bold leading-none tracking-tight" style={{ color: 'var(--text)' }}>
                  Shadecard
                </h1>
                <p className="text-xl mt-4" style={{ color: 'var(--text-muted)' }}>
                  Create perfect color palettes in minutes
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--success)' }}></div>
                  <span style={{ color: 'var(--text)' }}>Generate beautiful color schemes</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--primary)' }}></div>
                  <span style={{ color: 'var(--text)' }}>Save and organize your palettes</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--secondary)' }}></div>
                  <span style={{ color: 'var(--text)' }}>Export to CSS, SCSS, and more</span>
                </div>
              </div>
            </div>
            
            {/* Right Side - Success Message */}
            <div className="w-full max-w-md mx-auto">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border" style={{
                borderColor: 'var(--border)',
                backgroundColor: 'rgba(var(--bg-light-rgb), 0.1)'
              }}>
                <Card>
                  <CardHeader className="text-center">
                    <CardTitle style={{ color: 'var(--text)' }}>Account Created!</CardTitle>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      Welcome to Shadecard! Your account has been created successfully.
                    </p>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="p-4 rounded-lg mb-4" style={{
                      backgroundColor: 'var(--success)',
                      color: 'var(--bg-light)'
                    }}>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                          <polyline points="22,4 12,14.01 9,11.01"/>
                        </svg>
                        <span className="font-medium">Account created successfully!</span>
                      </div>
                      <p className="text-sm">
                        Redirecting to main page in {countdown} seconds...
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Logo */}
          <div className="text-center lg:text-left">
            <div className="mb-8">
              <h1 className="text-6xl lg:text-7xl font-bold leading-none tracking-tight" style={{ color: 'var(--text)' }}>
                Shadecard
              </h1>
              <p className="text-xl mt-4" style={{ color: 'var(--text-muted)' }}>
                Create perfect color palettes in minutes
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--success)' }}></div>
                <span style={{ color: 'var(--text)' }}>Generate beautiful color schemes</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--primary)' }}></div>
                <span style={{ color: 'var(--text)' }}>Save and organize your palettes</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--secondary)' }}></div>
                <span style={{ color: 'var(--text)' }}>Export to CSS, SCSS, and more</span>
              </div>
            </div>
          </div>
          
          {/* Right Side - Auth Forms */}
          <div className="w-full max-w-md mx-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border" style={{
              borderColor: 'var(--border)',
              backgroundColor: 'rgba(var(--bg-light-rgb), 0.1)'
            }}>
              {showSignup ? (
                <SignupForm
                  onSignup={onSignup}
                  onSwitchToLogin={handleSwitchToLogin}
                  onSuccess={handleSignupSuccess}
                  showSuccessMessage={false}
                />
              ) : (
                <LoginForm
                  onLogin={onLogin}
                  onSwitchToSignup={handleSwitchToSignup}
                />
              )}
              
              {/* Use as Guest Button */}
              <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
                <Button
                  onClick={onUseAsGuest}
                  variant="secondary"
                  className="w-full flex items-center justify-center gap-2"
                  style={{
                    color: 'var(--text-muted)',
                    borderColor: 'var(--border)',
                    backgroundColor: 'transparent'
                  }}
                >
                  Use as Guest
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                    style={{ transform: 'rotate(-45deg)' }}
                  >
                    <path d="M7 17L17 7M17 7H7M17 7V17"/>
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface SignupFormProps {
  onSignup: (name: string, email: string, password: string) => void;
  onSwitchToLogin: () => void;
  onSuccess?: () => void;
  className?: string;
  showSuccessMessage?: boolean;
  isLoading?: boolean;
}

export const SignupForm: React.FC<SignupFormProps> = ({ 
  onSignup, 
  onSwitchToLogin, 
  onSuccess,
  className = "",
  showSuccessMessage = false,
  isLoading: externalLoading
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const loading = externalLoading !== undefined ? externalLoading : isLoading;

  // Handle redirect when countdown reaches 0
  useEffect(() => {
    if (countdown === 0 && isSuccess) {
      if (onSuccess) {
        onSuccess();
      } else {
        window.location.href = '/app';
      }
    }
  }, [countdown, isSuccess, onSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setError(null);
    if (externalLoading !== undefined) {
      await onSignup(name, email, password);
      return;
    }
    setIsLoading(true);
    
    try {
      await onSignup(name, email, password);
      if (showSuccessMessage) {
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
      }
    } catch (error) {
      console.error('Signup failed:', error);
      setError(error instanceof Error ? error.message : 'Signup failed');
    }
    setIsLoading(false);
  };

  // Show success message if signup was successful and showSuccessMessage is true
  if (isSuccess && showSuccessMessage) {
    return (
      <div className={className}>
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
    );
  }

  return (
    <div className={className}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold" style={{ color: 'var(--text)' }}>Create Account</h2>
        <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
          Join Shadecard to save your color palettes
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg text-sm" style={{
            backgroundColor: 'var(--danger)',
            color: 'var(--bg-light)'
          }}>
            {error}
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="name" style={{ color: 'var(--text)' }}>Full Name</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            required
            style={{
              backgroundColor: 'var(--bg-light)',
              borderColor: 'var(--border)',
              color: 'var(--text)'
            }}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email" style={{ color: 'var(--text)' }}>Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            style={{
              backgroundColor: 'var(--bg-light)',
              borderColor: 'var(--border)',
              color: 'var(--text)'
            }}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password" style={{ color: 'var(--text)' }}>Password</Label>
          <div style={{ position: 'relative' }}>
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
              style={{
                backgroundColor: 'var(--bg-light)',
                borderColor: 'var(--border)',
                color: 'var(--text)'
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              style={{
                position: 'absolute',
                right: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)'
              }}
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                // Eye-off icon (Feather)
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.06 10.06 0 0 1 12 20c-5.05 0-9.29-3.36-10-8 .21-1.38.77-2.68 1.62-3.8"/>
                  <path d="M6.1 6.1A9.94 9.94 0 0 1 12 4c5.05 0 9.29 3.36 10 8-.21 1.38-.77 2.68-1.62 3.8"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              ) : (
                // Eye icon (Feather)
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <ellipse cx="12" cy="12" rx="10" ry="8"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" style={{ color: 'var(--text)' }}>Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            required
            style={{
              backgroundColor: 'var(--bg-light)',
              borderColor: 'var(--border)',
              color: 'var(--text)'
            }}
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={loading || password !== confirmPassword}
        >
          {loading ? 'Signing Up...' : 'Create Account'}
        </Button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="font-medium hover:underline"
            style={{ color: 'var(--primary)' }}
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}; 
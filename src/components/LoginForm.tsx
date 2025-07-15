import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
  onSwitchToSignup: () => void;
  className?: string;
  isLoading?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ 
  onLogin, 
  onSwitchToSignup, 
  className = "",
  isLoading: externalLoading
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const loading = externalLoading !== undefined ? externalLoading : isLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (externalLoading !== undefined) {
      await onLogin(email, password);
      return;
    }
    setIsLoading(true);
    
    try {
      await onLogin(email, password);
    } catch (error) {
      console.error('Login failed:', error);
      setError(error instanceof Error ? error.message : 'Login failed');
    }
    setIsLoading(false);
  };

  return (
    <div className={className}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold" style={{ color: 'var(--text)' }}>Welcome Back</h2>
        <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
          Sign in to your Shadecard account
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
              placeholder="Enter your password"
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
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.06 10.06 0 0 1 12 20c-5.05 0-9.29-3.36-10-8 .21-1.38.77-2.68 1.62-3.8M6.1 6.1A9.94 9.94 0 0 1 12 4c5.05 0 9.29 3.36 10 8-.21 1.38-.77 2.68-1.62 3.8M1 1l22 22"/><circle cx="12" cy="12" r="3"/></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="12" rx="10" ry="8"/><circle cx="12" cy="12" r="3"/></svg>
              )}
            </button>
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Logging In...' : 'Sign In'}
        </Button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <button
            onClick={onSwitchToSignup}
            className="font-medium hover:underline"
            style={{ color: 'var(--primary)' }}
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}; 
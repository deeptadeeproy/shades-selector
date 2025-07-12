import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
  onSwitchToSignup: () => void;
  className?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ 
  onLogin, 
  onSwitchToSignup, 
  className = "" 
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      await onLogin(email, password);
    } catch (error) {
      console.error('Login failed:', error);
      setError(error instanceof Error ? error.message : 'Login failed');
    }
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
          <Input
            id="password"
            type="password"
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
        </div>
        
        <Button 
          type="submit" 
          className="w-full"
        >
          Sign In
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
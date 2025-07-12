import React from 'react';
import { Button } from './ui/button';

interface NavigationProps {
  palette: any;
  isLoggedIn: boolean;
  onNavigateToLogin: () => void;
  onNavigateToSignup: () => void;
  onLogout: () => void;
}

export const Navigation: React.FC<NavigationProps> = React.memo(({ 
  palette, 
  isLoggedIn, 
  onNavigateToLogin, 
  onNavigateToSignup, 
  onLogout 
}) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - Left side */}
          <div className="flex items-center">
            <h1 className="text-2xl font-medium leading-none tracking-tight" style={{ color: 'var(--text)' }}>
              Shadecard
            </h1>
          </div>
          
          {/* Right side - Auth buttons or user menu */}
          <div className="flex items-center space-x-4">
            {!isLoggedIn ? (
              <>
                <Button 
                  size="sm" 
                  variant="secondary"
                  className="flex items-center gap-2"
                  style={{ 
                    color: 'var(--text-muted)',
                    borderColor: 'var(--border)'
                  }}
                  onClick={onNavigateToSignup}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="m22 21-2-2"/>
                    <path d="M16 16h6"/>
                  </svg>
                  Sign Up
                </Button>
                <Button 
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={onNavigateToLogin}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                    <polyline points="10,17 15,12 10,7"/>
                    <line x1="15" y1="12" x2="3" y2="12"/>
                  </svg>
                  Login
                </Button>
              </>
            ) : (
              <Button 
                size="sm" 
                variant="secondary"
                className="flex items-center gap-2"
                style={{ 
                  color: 'var(--text-muted)',
                  borderColor: 'var(--border)'
                }}
                onClick={onLogout}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16,17 21,12 16,7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Logout
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
});

Navigation.displayName = 'Navigation'; 
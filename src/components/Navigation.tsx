import React, { useState } from 'react';
import { Button } from './ui/button';

interface NavigationProps {
  palette: any;
  isLoggedIn: boolean;
  onNavigateToLogin: () => void;
  onNavigateToSignup: () => void;
  onLogout: () => void;
  onNavigateToProjects: () => void;
}

export const Navigation: React.FC<NavigationProps> = React.memo(({ 
  palette, 
  isLoggedIn, 
  onNavigateToLogin, 
  onNavigateToSignup, 
  onLogout,
  onNavigateToProjects
}) => {
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

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
            {isLoggedIn && (
              <button
                className="text-sm font-medium px-3 py-2 rounded transition-colors duration-150"
                style={{ color: 'var(--text-muted)', background: 'none', border: 'none' }}
                onMouseOver={e => (e.currentTarget.style.color = 'var(--text)')}
                onMouseOut={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                onClick={onNavigateToProjects}
              >
                Projects
              </button>
            )}
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
              <div className="relative">
                <Button 
                  size="sm" 
                  variant="secondary"
                  className="flex items-center gap-2"
                  style={{ 
                    color: 'var(--text-muted)',
                    borderColor: 'var(--border)'
                  }}
                  onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="8" r="5"/>
                    <path d="M20 21a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h3l2-2h2l2 2h3a2 2 0 0 1 2 2Z"/>
                  </svg>
                  Account
                  <svg 
                    width="12" 
                    height="12" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                    className={`transition-transform duration-200 ${isAccountMenuOpen ? 'rotate-180' : ''}`}
                  >
                    <polyline points="6,9 12,15 18,9"/>
                  </svg>
                </Button>
                
                {/* Account Dropdown Menu */}
                {isAccountMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg border" style={{
                    backgroundColor: 'var(--bg-light)',
                    borderColor: 'var(--border)',
                    color: 'var(--text)'
                  }}>
                    <div className="py-1">
                      <button
                        className="w-full text-left px-4 py-2 text-sm hover:bg-opacity-10 transition-colors duration-200"
                        style={{ 
                          color: 'var(--text)',
                          '--tw-bg-opacity': '0.1'
                        } as React.CSSProperties}
                        onClick={() => {
                          // TODO: Add manage account functionality
                          setIsAccountMenuOpen(false);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 20h9"/>
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                          </svg>
                          Manage Account
                        </div>
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 text-sm hover:bg-opacity-10 transition-colors duration-200"
                        style={{ 
                          color: 'var(--text)',
                          '--tw-bg-opacity': '0.1'
                        } as React.CSSProperties}
                        onClick={() => {
                          onLogout();
                          setIsAccountMenuOpen(false);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                            <polyline points="16,17 21,12 16,7"/>
                            <line x1="21" y1="12" x2="9" y2="12"/>
                          </svg>
                          Logout
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
});

Navigation.displayName = 'Navigation'; 
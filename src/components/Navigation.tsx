import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { useLocation, useNavigate } from 'react-router-dom';
import { ConfirmationModal } from './ConfirmationModal';

interface NavigationProps {
  isLoggedIn: boolean;
  onNavigateToLogin: () => void;
  onNavigateToSignup: () => void;
  onLogout: () => void;
  onNavigateToProjects: () => void;
  showProjectsButton?: boolean;
  userName?: string;
  onNavigateToManageAccount?: () => void;
  onThemeChange?: (isLightMode: boolean) => void;
}

export const Navigation: React.FC<NavigationProps> = React.memo(({ 
  isLoggedIn, 
  onNavigateToLogin, 
  onNavigateToSignup, 
  onLogout,
  onNavigateToProjects,
  showProjectsButton = true,
  userName,
  onNavigateToManageAccount,
  onThemeChange
}) => {
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isAccountMenuOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isAccountMenuOpen]);
  const location = useLocation();
  const navigate = useNavigate();
  const [isLightMode, setIsLightMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('themeMode');
      if (stored === 'light') return true;
      if (stored === 'dark') return false;
      return document.body.classList.contains('light');
    }
    return false;
  });

  useEffect(() => {
    if (typeof document !== 'undefined' && location.pathname !== '/app') {
      if (isLightMode) {
        document.body.classList.add('light');
        localStorage.setItem('themeMode', 'light');
      } else {
        document.body.classList.remove('light');
        localStorage.setItem('themeMode', 'dark');
      }
    }
  }, [isLightMode, location.pathname]);

  const handleToggleLightMode = () => {
    const newThemeState = !isLightMode;
    console.log('Navigation: Toggling theme to:', newThemeState, 'on path:', location.pathname);
    setIsLightMode(newThemeState);
    
    // If on palette page, call the theme change callback
    if (location.pathname === '/app' && onThemeChange) {
      console.log('Navigation: Calling onThemeChange callback');
      onThemeChange(newThemeState);
    }
  };

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo - Left side */}
            <div className="flex items-center">
              <h1 className="text-2xl font-medium leading-none tracking-tight" style={{ color: 'var(--text)' }}>
                Shadecard
              </h1>
            </div>

            {/* Center - User name if logged in */}
            {isLoggedIn && userName && (
              <div className="flex-1 flex justify-center">
                <span className="text-base font-medium" style={{ color: 'var(--text-muted)' }}>{userName}</span>
              </div>
            )}

            {/* Right side - Auth buttons or user menu */}
            <div className="flex items-center space-x-4 justify-end">
              {location.pathname !== '/app' && (
                <button
                  className="text-sm font-medium px-3 py-2 rounded transition-colors duration-150"
                  style={{ color: 'var(--text-muted)', background: 'none', border: 'none' }}
                  onMouseOver={e => (e.currentTarget.style.color = 'var(--text)')}
                  onMouseOut={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                  onClick={() => navigate('/app')}
                >
                  Palette
                </button>
              )}
              {isLoggedIn && showProjectsButton && (
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
                <div className="relative flex items-center space-x-2">
                  {/* Theme Toggle Button - hidden on palette page */}
                  {location.pathname !== '/app' && (
                    <button
                      className="p-2 rounded transition-colors duration-200"
                      style={{ 
                        color: 'var(--text-muted)',
                        background: 'none',
                        border: 'none'
                      }}
                      onMouseOver={e => (e.currentTarget.style.color = 'var(--text)')}
                      onMouseOut={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                      onClick={handleToggleLightMode}
                    >
                      {isLightMode ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 1 0 9.79 9.79z"/>
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="5"/>
                          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                        </svg>
                      )}
                    </button>
                  )}

                  {/* Account Dropdown Button */}
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
                    <div ref={accountMenuRef} className="absolute top-full right-0 mt-2 w-48 rounded-lg shadow-lg border z-50" style={{
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
                            if (onNavigateToManageAccount) onNavigateToManageAccount();
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
                            setShowLogoutConfirm(true);
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
      <ConfirmationModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={() => { setShowLogoutConfirm(false); onLogout(); }}
        title="Log Out"
        message="Are you sure you want to log out?"
        confirmText="Log Out"
        cancelText="Cancel"
        isDestructive={true}
      />
    </>
  );
});

Navigation.displayName = 'Navigation'; 
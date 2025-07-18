import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { ColorPaletteSelector } from './components/ColorPaletteSelector';
import { PaletteManager } from './components/PaletteManager';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Homepage } from './pages/Homepage';
import { Projects } from './pages/Projects';
import { ProjectDetails } from './pages/ProjectDetails';
import { ManageAccount } from './pages/ManageAccount';
import { loginUser, registerUser, logoutUser, type AuthUser, updateUserName } from './config/api';
import { ProjectCacheProvider } from './contexts/ProjectCacheContext';
import { PaletteCacheProvider } from './contexts/PaletteCacheContext';

function resetPaletteCssVars() {
  const root = document.documentElement;
  root.removeAttribute('style'); // Removes all inline styles, reverting to CSS defaults
}

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Global theme persistence for all pages except /app (palette page)
  useEffect(() => {
    if (location.pathname !== '/app') {
      const stored = localStorage.getItem('themeMode');
      if (stored === 'light') {
        document.body.classList.add('light');
      } else {
        document.body.classList.remove('light');
      }
    }
  }, [location.pathname]);

  // Check for existing token on app load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        setCurrentUser(user);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      setAuthError(null);
      const response = await loginUser(email, password);
      
      // Store token and user data
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('userData', JSON.stringify(response.user));
      
      setCurrentUser(response.user);
      setIsLoggedIn(true);
      navigate('/app');
    } catch (error) {
      console.error('Login failed:', error);
      setAuthError(error instanceof Error ? error.message : 'Login failed');
      throw error;
    }
  };

  const handleSignup = async (name: string, email: string, password: string) => {
    try {
      setAuthError(null);
      const response = await registerUser(name, email, password);
      
      // Store token and user data
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('userData', JSON.stringify(response.user));
      
      setCurrentUser(response.user);
      setIsLoggedIn(true);
      // Don't navigate immediately - let the Signup component show success message first
      // navigate('/');
    } catch (error) {
      console.error('Signup failed:', error);
      setAuthError(error instanceof Error ? error.message : 'Signup failed');
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout API call failed:', error);
      // Continue with logout even if API call fails
    }
    
    // Clear local storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    
    setCurrentUser(null);
    setIsLoggedIn(false);
    resetPaletteCssVars();
    navigate('/');
  };

  const navigateToLogin = () => navigate('/login');
  const navigateToSignup = () => navigate('/signup');
  const navigateToMain = () => navigate('/app');
  const navigateToProjects = () => navigate('/projects');
  // const navigateToManageAccount = () => navigate('/account');

  const handleUseAsGuest = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setCurrentUser(null);
    setIsLoggedIn(false);
    setIsGuestMode(true);
    navigate('/app');
  };

  const handleUpdateName = async (newName: string) => {
    if (!currentUser) return;
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('No auth token');
    const response = await updateUserName(newName, token);
    setCurrentUser(response.user);
    localStorage.setItem('userData', JSON.stringify(response.user));
  };
  const handleDeleteAccount = async (password: string) => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('No auth token');
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://shades-backend.drhomelab.in'}/api/auth/user`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ password })
    });
    if (response.status === 401) {
      throw new Error('Incorrect password');
    }
    if (!response.ok) {
      throw new Error('Failed to delete account');
    }
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setCurrentUser(null);
    setIsLoggedIn(false);
    resetPaletteCssVars();
    navigate('/');
  };

  return (
    <PaletteManager>
      <Routes>
        <Route 
          path="/login" 
          element={
            <Login 
              onNavigateToSignup={navigateToSignup}
              onLogin={handleLogin}
            />
          } 
        />
        
        <Route 
          path="/signup" 
          element={
            <Signup 
              onNavigateToLogin={navigateToLogin}
              onSignup={handleSignup}
              onSuccess={navigateToMain}
            />
          } 
        />
        
        <Route 
          path="/" 
          element={
            !isLoading && isLoggedIn ? (
              <Navigate to="/app" replace />
            ) : !isLoading ? (
              (() => { resetPaletteCssVars(); return (
                <Homepage 
                  onLogin={handleLogin}
                  onSignup={handleSignup}
                  onUseAsGuest={handleUseAsGuest}
                  onSuccess={navigateToMain}
                />
              ); })()
            ) : null
          } 
        />
        
        {/* Authenticated routes wrapped in providers */}
        {(!isLoading && isLoggedIn) && (
          <Route
            path="/*"
            element={
              <ProjectCacheProvider>
                <PaletteCacheProvider>
                  <Routes>
                    <Route 
                      path="app" 
                      element={
                        <ColorPaletteSelector 
                          isLoggedIn={isLoggedIn}
                          onNavigateToLogin={navigateToLogin}
                          onNavigateToSignup={navigateToSignup}
                          onLogout={handleLogout}
                          onNavigateToProjects={navigateToProjects}
                          userName={currentUser?.name}
                        />
                      }
                    />
                    <Route 
                      path="projects" 
                      element={
                        <Projects 
                          onNavigateBack={navigateToMain}
                          onNavigateToLogin={navigateToLogin}
                          onNavigateToSignup={navigateToSignup}
                          onLogout={handleLogout}
                          onNavigateToProjects={navigateToProjects}
                          userName={currentUser?.name}
                        />
                      }
                    />
                    <Route 
                      path="project" 
                      element={
                        <ProjectDetails 
                          onNavigateBack={navigateToProjects}
                          onNavigateToLogin={navigateToLogin}
                          onNavigateToSignup={navigateToSignup}
                          onLogout={handleLogout}
                          onNavigateToProjects={navigateToProjects}
                          userName={currentUser?.name}
                        />
                      }
                    />
                    <Route 
                      path="account" 
                      element={
                        currentUser ? (
                          <ManageAccount
                            user={currentUser}
                            onUpdateName={handleUpdateName}
                            onDeleteAccount={handleDeleteAccount}
                          />
                        ) : (
                          <Navigate to="/" replace />
                        )
                      }
                    />
                  </Routes>
                </PaletteCacheProvider>
              </ProjectCacheProvider>
            }
          />
        )}
        {/* Guest mode: allow /app only, no providers */}
        {(!isLoading && isGuestMode) && (
          <Route
            path="app"
            element={
              <ColorPaletteSelector
                isLoggedIn={false}
                onNavigateToLogin={navigateToLogin}
                onNavigateToSignup={navigateToSignup}
                onLogout={handleLogout}
                onNavigateToProjects={navigateToProjects}
                userName={undefined}
              />
            }
          />
        )}
        {/* Redirect any unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PaletteManager>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

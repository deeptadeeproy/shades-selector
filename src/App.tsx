import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { ColorPaletteSelector } from './components/ColorPaletteSelector';
import { PaletteManager } from './components/PaletteManager';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Homepage } from './pages/Homepage';
import { Projects } from './pages/Projects';
import { loginUser, registerUser, logoutUser, type AuthUser } from './config/api';

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

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
      setIsGuestMode(false);
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
      setIsGuestMode(false);
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
    setIsGuestMode(false);
    navigate('/');
  };

  const navigateToLogin = () => navigate('/login');
  const navigateToSignup = () => navigate('/signup');
  const navigateToMain = () => navigate('/app');
  const navigateToProjects = () => navigate('/projects');

  const handleUseAsGuest = () => {
    // Clear any existing auth data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setCurrentUser(null);
    setIsLoggedIn(false);
    setIsGuestMode(true);
    navigate('/app');
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
            isLoggedIn ? (
              <Navigate to="/app" replace />
            ) : (
              <Homepage 
                onLogin={handleLogin}
                onSignup={handleSignup}
                onUseAsGuest={handleUseAsGuest}
                onSuccess={navigateToMain}
              />
            )
          } 
        />
        
        <Route 
          path="/app" 
          element={
            isLoggedIn || isGuestMode ? (
              <ColorPaletteSelector 
                isLoggedIn={isLoggedIn}
                onNavigateToLogin={navigateToLogin}
                onNavigateToSignup={navigateToSignup}
                onLogout={handleLogout}
                onNavigateToProjects={navigateToProjects}
              />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        
        <Route 
          path="/projects" 
          element={
            isLoggedIn ? (
              <Projects 
                onNavigateBack={navigateToMain}
                onNavigateToLogin={navigateToLogin}
                onNavigateToSignup={navigateToSignup}
                onLogout={handleLogout}
                onNavigateToProjects={navigateToProjects}
              />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        
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

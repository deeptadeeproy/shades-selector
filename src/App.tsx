import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { ColorPaletteSelector } from './components/ColorPaletteSelector';
import { PaletteManager } from './components/PaletteManager';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (email: string, password: string) => {
    // TODO: Implement actual login logic with your backend
    console.log('Login attempt:', { email, password });
    
    // For now, just simulate successful login
    setIsLoggedIn(true);
    navigate('/');
  };

  const handleSignup = async (name: string, email: string, password: string) => {
    // TODO: Implement actual signup logic with your backend
    console.log('Signup attempt:', { name, email, password });
    
    // For now, just simulate successful signup
    setIsLoggedIn(true);
    navigate('/');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/');
  };

  const navigateToLogin = () => navigate('/login');
  const navigateToSignup = () => navigate('/signup');
  const navigateToMain = () => navigate('/');

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
            />
          } 
        />
        
        <Route 
          path="/" 
          element={
            <ColorPaletteSelector 
              isLoggedIn={isLoggedIn}
              onNavigateToLogin={navigateToLogin}
              onNavigateToSignup={navigateToSignup}
              onLogout={handleLogout}
            />
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

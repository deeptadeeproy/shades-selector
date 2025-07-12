import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface PaletteManagerProps {
  children: React.ReactNode;
}

export const PaletteManager: React.FC<PaletteManagerProps> = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    const root = document.documentElement;
    
    // Check if we're on the main page (ColorPaletteSelector)
    const isMainPage = location.pathname === '/';
    
    if (!isMainPage) {
      // Clear any dynamic palette colors and reset to default
      // This ensures the default palette from CSS is used
      const dynamicPaletteKeys = [
        '--bg-dark', '--bg', '--bg-light',
        '--text', '--text-muted',
        '--highlight', '--border', '--border-muted',
        '--tertiary',
        '--danger', '--warning', '--success', '--info',
        '--bg-light-rgb', '--bg-rgb', '--border-rgb', '--text-rgb',
        '--card-border'
      ];
      
      dynamicPaletteKeys.forEach(key => {
        root.style.removeProperty(key);
      });
      
      // Explicitly set the default primary and secondary colors
      // to override any dynamic palette colors that might be applied
      root.style.setProperty('--primary', '#92b0f1');
      root.style.setProperty('--secondary', '#8b5cf6');
      
      // Reset to dark mode for non-main pages
      // This ensures consistent styling across login/signup pages
      document.body.classList.remove('light');
      
      // Force a reflow to ensure CSS variables are properly applied
      root.offsetHeight;
    }
  }, [location.pathname]);

  return <>{children}</>;
}; 
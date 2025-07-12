import React, { useState, useEffect, useCallback, useMemo, lazy, Suspense } from 'react';
import { ColorControls } from './ColorControls';
import { ColorPaletteDisplay } from './ColorPaletteDisplay';
import { Navigation } from './Navigation';
import { Button } from './ui/button';
import { generatePalette, convertColorsToPalette } from '../config/api';
import type { ColorConfig } from '../utils/colorUtils';

// Lazy load modal components to reduce initial bundle size
const CssCodeModal = lazy(() => import('./CssCodeModal').then(module => ({ default: module.CssCodeModal })));
const AlertsModal = lazy(() => import('./AlertsModal').then(module => ({ default: module.AlertsModal })));
const ColorPickerModal = lazy(() => import('./ColorPickerModal').then(module => ({ default: module.ColorPickerModal })));

type ColorFormat = 'oklch' | 'hsl' | 'rgb' | 'hex';

interface ColorPaletteSelectorProps {
  isLoggedIn: boolean;
  onNavigateToLogin: () => void;
  onNavigateToSignup: () => void;
  onLogout: () => void;
  onNavigateToProjects: () => void;
}

// Loading fallback for lazy components
const ModalFallback = () => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
    </div>
  </div>
);

export const ColorPaletteSelector: React.FC<ColorPaletteSelectorProps> = React.memo(({ 
  isLoggedIn, 
  onNavigateToLogin, 
  onNavigateToSignup, 
  onLogout,
  onNavigateToProjects
}) => {
  const [config, setConfig] = useState<ColorConfig>({
    hue: 265,
    chroma: 0.0,
    isLight: false,
  });

  const [palette, setPalette] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCssModalOpen, setIsCssModalOpen] = useState(false);
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [paletteFormat, setPaletteFormat] = useState<ColorFormat>('oklch');

  // Generate palette from backend API
  const generatePaletteFromAPI = useCallback(async (newConfig: ColorConfig) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await generatePalette(newConfig.hue, newConfig.chroma, newConfig.isLight);
      
      if (result.success) {
        const convertedPalette = convertColorsToPalette(result.colors);
        setPalette(convertedPalette);
      } else {
        throw new Error('Failed to generate palette');
      }
    } catch (err) {
      console.error('Error generating palette from API:', err);
      let errorMessage = 'Failed to generate palette';
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      } else {
        errorMessage = String(err);
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle config changes - only generate palette when user interacts
  const handleConfigChange = useCallback((newConfig: ColorConfig) => {
    console.log('ColorPaletteSelector: handleConfigChange called with:', newConfig);
    setConfig(newConfig);
    // Generate palette immediately when config changes (user interaction)
    generatePaletteFromAPI(newConfig);
  }, [generatePaletteFromAPI]);

  const handleColorPickerOpen = useCallback(() => {
    setIsColorPickerOpen(true);
  }, []);

  const handleCssModalOpen = useCallback(() => {
    setIsCssModalOpen(true);
  }, []);

  const handleAlertsModalOpen = useCallback(() => {
    setIsAlertsModalOpen(true);
  }, []);

  const handleCssModalClose = useCallback(() => {
    setIsCssModalOpen(false);
  }, []);

  const handleAlertsModalClose = useCallback(() => {
    setIsAlertsModalOpen(false);
  }, []);

  const handleColorPickerClose = useCallback(() => {
    setIsColorPickerOpen(false);
  }, []);

  const handlePaletteFormatChange = useCallback((format: ColorFormat) => {
    setPaletteFormat(format);
  }, []);

  // Generate initial palette on component mount
  useEffect(() => {
    generatePaletteFromAPI(config);
  }, []); // Only run once on mount

  // Memoized styles and values
  const backgroundStyle = useMemo(() => ({
    backgroundColor: palette && config.isLight ? palette['bg-light'] : palette ? palette['bg-dark'] : '#171717'
  }), [config.isLight, palette]);

  const bgLightRgb = useMemo(() => 
    config.isLight ? '255, 255, 255' : '51, 51, 51', 
    [config.isLight]
  );

  const bgRgb = useMemo(() => 
    config.isLight ? '245, 245, 245' : '23, 23, 23', 
    [config.isLight]
  );

  const borderRgb = useMemo(() => 
    config.isLight ? '102, 102, 102' : '204, 204, 204', 
    [config.isLight]
  );

  const cardBorder = useMemo(() => 
    config.isLight 
      ? '1px solid rgba(var(--border-rgb, 102, 102, 102), 0.2)' 
      : '1px solid rgba(var(--border-rgb, 204, 204, 204), 0.2)', 
    [config.isLight]
  );

  // Apply colors to CSS custom properties in real-time
  useEffect(() => {
    if (!palette) return;
    
    const root = document.documentElement;
    
    // Apply all palette colors as CSS custom properties
    Object.entries(palette).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, String(value));
    });

    // Apply RGB values for glassmorphic effects
    root.style.setProperty('--bg-light-rgb', bgLightRgb);
    root.style.setProperty('--bg-rgb', bgRgb);
    root.style.setProperty('--border-rgb', borderRgb);

    // Set card border based on theme mode
    root.style.setProperty('--card-border', cardBorder);

    // Don't set theme class on body for dynamic palettes
    // The dynamic colors from the backend should take precedence
    // document.body.classList.toggle('light', config.isLight);
  }, [palette, config.isLight, bgLightRgb, bgRgb, borderRgb, cardBorder]);

  // Memoized button styles
  const secondaryButtonStyle = useMemo(() => ({
    color: 'var(--text-muted)',
    borderColor: 'var(--border-muted)',
  }), []);

  const secondaryButtonHoverStyle = useMemo(() => ({
    color: 'var(--text)',
    borderColor: 'var(--border)',
  }), []);

  const secondaryButtonLeaveStyle = useMemo(() => ({
    color: 'var(--text-muted)',
    borderColor: 'var(--border-muted)',
  }), []);

  const linkStyle = useMemo(() => ({
    color: 'var(--text-muted)',
    '--tw-text-opacity': '1',
    textShadow: '0 0 8px rgba(var(--text-rgb, 0, 0, 0), 0.3)'
  } as React.CSSProperties), []);

  const linkHoverStyle = useMemo(() => ({
    color: 'var(--text)',
    textShadow: '0 0 12px rgba(var(--text-rgb, 0, 0, 0), 0.5)'
  }), []);

  const linkLeaveStyle = useMemo(() => ({
    color: 'var(--text-muted)',
    textShadow: '0 0 8px rgba(var(--text-rgb, 0, 0, 0), 0.3)'
  }), []);

  // Show loading state or error
  if (isLoading && !palette) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-white">Generating your palette...</p>
        </div>
      </div>
    );
  }

  if (error && !palette) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error: {error}</p>
          <Button onClick={() => generatePaletteFromAPI(config)}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!palette) {
    return null;
  }

  return (
    <div className="min-h-screen" style={backgroundStyle}>
      {/* Navigation Bar */}
      <Navigation 
        palette={palette}
        isLoggedIn={isLoggedIn}
        onNavigateToLogin={onNavigateToLogin}
        onNavigateToSignup={onNavigateToSignup}
        onLogout={onLogout}
        onNavigateToProjects={onNavigateToProjects}
      />
      
      {/* Main Content - with top padding to account for fixed navbar */}
      <div className="pt-24 p-6 flex items-center justify-center min-h-screen">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Color Palette Display - Left Side */}
            <div className="lg:col-span-2">
              <ColorPaletteDisplay 
                palette={palette} 
                onFormatChange={handlePaletteFormatChange}
              />
              {/* Made with love - shown only on desktop below color palette */}
              <div className="hidden lg:block mt-4 text-center">
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Made with ❤️ by{' '}
                  <a 
                    href="https://droyfolio.vercel.app" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-text hover:to-text transition-colors duration-200 inline-flex items-center gap-1 font-semibold"
                    style={linkStyle}
                    onMouseEnter={(e) => {
                      Object.assign(e.currentTarget.style, linkHoverStyle);
                    }}
                    onMouseLeave={(e) => {
                      Object.assign(e.currentTarget.style, linkLeaveStyle);
                    }}
                  >
                    Deeptadeep Roy
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M7 17L17 7M17 7H7M17 7V17"/>
                    </svg>
                  </a>
                </p>
              </div>
            </div>
            
            {/* Controls - Right Side */}
            <div className="lg:col-span-1 flex flex-col">
              {/* Mobile subtext above controls */}
              <div className="lg:hidden mb-3 ml-4">
                <p className="text-sm" style={{ color: palette['text-muted'] }}>
                  Adjust the Sliders and toggle theme to create your perfect color palette.
                </p>
              </div>
              
              <div className="flex flex-col">
                <ColorControls 
                  config={config} 
                  onConfigChange={handleConfigChange} 
                  onColorPickerOpen={handleColorPickerOpen}
                />

                {/* Action Buttons */}
                <div className="flex space-x-3 mt-4 justify-end lg:justify-start">
                  <Button 
                    onClick={handleAlertsModalOpen}
                    variant="secondary"
                    className="self-end w-full lg:max-w-none lg:self-auto flex-1 transition-colors duration-200"
                    style={secondaryButtonStyle}
                    onMouseEnter={(e) => {
                      Object.assign(e.currentTarget.style, secondaryButtonHoverStyle);
                    }}
                    onMouseLeave={(e) => {
                      Object.assign(e.currentTarget.style, secondaryButtonLeaveStyle);
                    }}
                  >
                    Alerts
                  </Button>
                  <Button 
                    onClick={handleCssModalOpen}
                    className="self-end w-full lg:max-w-none lg:self-auto flex-1"
                  >
                    See Code
                  </Button>
                </div>

                {/* Made with love - shown only on mobile below buttons */}
                <div className="lg:hidden mt-6 text-center">
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    Made with ❤️ by{' '}
                    <a 
                      href="https://droyfolio.vercel.app" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-text hover:to-text transition-colors duration-200 inline-flex items-center gap-1 font-semibold"
                      style={linkStyle}
                      onMouseEnter={(e) => {
                        Object.assign(e.currentTarget.style, linkHoverStyle);
                      }}
                      onMouseLeave={(e) => {
                        Object.assign(e.currentTarget.style, linkLeaveStyle);
                      }}
                    >
                      Deeptadeep Roy
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M7 17L17 7M17 7H7M17 7V17"/>
                      </svg>
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Suspense fallback={<ModalFallback />}>
        <CssCodeModal 
          isOpen={isCssModalOpen}
          onClose={handleCssModalClose}
          palette={palette}
          currentFormat={paletteFormat}
        />
      </Suspense>
      <Suspense fallback={<ModalFallback />}>
        <AlertsModal 
          isOpen={isAlertsModalOpen}
          onClose={handleAlertsModalClose}
          palette={palette}
          currentFormat={paletteFormat}
        />
      </Suspense>
      <Suspense fallback={<ModalFallback />}>
        <ColorPickerModal
          isOpen={isColorPickerOpen}
          onClose={handleColorPickerClose}
          onColorSelect={handleConfigChange}
          currentConfig={config}
          palette={palette}
        />
      </Suspense>
    </div>
  );
});

ColorPaletteSelector.displayName = 'ColorPaletteSelector'; 

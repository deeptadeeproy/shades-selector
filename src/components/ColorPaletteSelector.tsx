import React, { useState, useEffect } from 'react';
import { ColorControls } from './ColorControls';
import { ColorPaletteDisplay } from './ColorPaletteDisplay';
import { CssCodeModal } from './CssCodeModal';
import { AlertsModal } from './AlertsModal';
import { Button } from './ui/button';
import { generateColorPalette, type ColorConfig } from '../utils/colorUtils';

export const ColorPaletteSelector: React.FC = () => {
  const [config, setConfig] = useState<ColorConfig>({
    hue: 200,
    chroma: 0.1,
    isLight: false,
  });

  const [isCssModalOpen, setIsCssModalOpen] = useState(false);
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);

  const palette = generateColorPalette(config);

  // Apply colors to CSS custom properties in real-time
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply all palette colors as CSS custom properties
    Object.entries(palette).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });

    // Apply RGB values for glassmorphic effects
    const bgLightRgb = config.isLight ? '255, 255, 255' : '51, 51, 51';
    const bgRgb = config.isLight ? '245, 245, 245' : '23, 23, 23';
    const borderRgb = config.isLight ? '102, 102, 102' : '204, 204, 204';
    
    root.style.setProperty('--bg-light-rgb', bgLightRgb);
    root.style.setProperty('--bg-rgb', bgRgb);
    root.style.setProperty('--border-rgb', borderRgb);

    // Set theme class on body
    document.body.classList.toggle('light', config.isLight);
  }, [palette, config.isLight, config.hue, config.chroma]);

  return (
    <div className="min-h-screen p-6 flex items-center justify-center" style={{ backgroundColor: config.isLight ? palette['bg-light'] : palette['bg-dark'] }}>
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Color Palette Display - Left Side */}
          <div className="lg:col-span-2">
            <ColorPaletteDisplay palette={palette} />
          </div>
          
          {/* Controls - Right Side with heading above */}
          <div className="lg:col-span-1">
            {/* Page heading and subtext above controls only */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2" style={{ color: palette.text }}>
                Shades Selector
              </h1>
              <p className="text-sm" style={{ color: palette['text-muted'] }}>
                Adjust the OKLCH sliders and toggle theme to create your perfect color palette.
              </p>
            </div>
            
            <ColorControls config={config} onConfigChange={setConfig} />

            {/* Action Buttons */}
            <div className="mt-6 flex space-x-3">
              <Button 
                onClick={() => setIsCssModalOpen(true)}
                className="flex-1"
              >
                See Code
              </Button>
              <Button 
                onClick={() => setIsAlertsModalOpen(true)}
                variant="secondary"
                className="flex-1"
              >
                Alerts
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CssCodeModal 
        isOpen={isCssModalOpen}
        onClose={() => setIsCssModalOpen(false)}
        palette={palette}
      />
      <AlertsModal 
        isOpen={isAlertsModalOpen}
        onClose={() => setIsAlertsModalOpen(false)}
        palette={palette}
      />
    </div>
  );
}; 
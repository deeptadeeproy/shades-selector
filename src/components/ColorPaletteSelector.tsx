import React, { useState, useEffect } from 'react';
import { ColorControls } from './ColorControls';
import { ColorPaletteDisplay } from './ColorPaletteDisplay';
import { CssCodeModal } from './CssCodeModal';
import { AlertsModal } from './AlertsModal';
import { ColorPickerModal } from './ColorPickerModal';
import { Button } from './ui/button';
import { generateColorPalette, type ColorConfig } from '../utils/colorUtils';

type ColorFormat = 'oklch' | 'hsl' | 'rgb' | 'hex';

export const ColorPaletteSelector: React.FC = () => {
  const [config, setConfig] = useState<ColorConfig>({
    hue: 265,
    chroma: 0.0,
    isLight: false,
  });

  const [isCssModalOpen, setIsCssModalOpen] = useState(false);
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [paletteFormat, setPaletteFormat] = useState<ColorFormat>('oklch');

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

    // Set card border based on theme mode
    const cardBorder = config.isLight 
      ? '1px solid rgba(var(--border-rgb, 102, 102, 102), 0.2)' 
      : '1px solid rgba(var(--border-rgb, 204, 204, 204), 0.2)';
    root.style.setProperty('--card-border', cardBorder);

    // Set theme class on body
    document.body.classList.toggle('light', config.isLight);
  }, [palette, config.isLight, config.hue, config.chroma]);

  return (
    <div className="min-h-screen p-6 flex items-center justify-center" style={{ backgroundColor: config.isLight ? palette['bg-light'] : palette['bg-dark'] }}>
      <div className="max-w-7xl mx-auto w-full">
        {/* Mobile heading - shown only on mobile */}
        <div className="lg:hidden mb-6 -mt-2">
          <h1 className="text-3xl font-bold mb-2" style={{ color: palette.text }}>
            Shadecard
          </h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Color Palette Display - Left Side */}
          <div className="lg:col-span-2">
            <ColorPaletteDisplay 
              palette={palette} 
              onFormatChange={setPaletteFormat}
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
                  style={{ 
                    color: 'var(--text-muted)',
                    '--tw-text-opacity': '1',
                    textShadow: '0 0 8px rgba(var(--text-rgb, 0, 0, 0), 0.3)'
                  } as React.CSSProperties}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--text)';
                    e.currentTarget.style.textShadow = '0 0 12px rgba(var(--text-rgb, 0, 0, 0), 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-muted)';
                    e.currentTarget.style.textShadow = '0 0 8px rgba(var(--text-rgb, 0, 0, 0), 0.3)';
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
          
          {/* Controls - Right Side with heading above */}
          <div className="lg:col-span-1 flex flex-col">
            {/* Mobile subtext above controls */}
            <div className="lg:hidden mb-3 ml-4">
              <p className="text-sm" style={{ color: palette['text-muted'] }}>
                Adjust the Sliders and toggle theme to create your perfect color palette.
              </p>
            </div>
            {/* Page heading and subtext above controls only - hidden on mobile */}
            <div className="hidden lg:block mb-6">
              <h1 className="text-3xl font-bold mb-2" style={{ color: palette.text }}>
                Shadecard
              </h1>
              <p className="text-sm" style={{ color: palette['text-muted'] }}>
                Adjust the Sliders and toggle theme to create your perfect color palette.
              </p>
            </div>
            
            <div className="flex flex-col">
              <ColorControls 
                config={config} 
                onConfigChange={setConfig} 
                onColorPickerOpen={() => setIsColorPickerOpen(true)}
              />

              {/* Action Buttons */}
              <div className="flex space-x-3 mt-4 justify-end lg:justify-start">
                <Button 
                  onClick={() => setIsAlertsModalOpen(true)}
                  variant="secondary"
                  className="self-end w-full lg:max-w-none lg:self-auto flex-1 transition-colors duration-200"
                  style={{
                    color: 'var(--text-muted)',
                    borderColor: 'var(--border-muted)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--text)';
                    e.currentTarget.style.borderColor = 'var(--border)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-muted)';
                    e.currentTarget.style.borderColor = 'var(--border-muted)';
                  }}
                >
                  Alerts
                </Button>
                <Button 
                  onClick={() => setIsCssModalOpen(true)}
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
                    style={{ 
                      color: 'var(--text-muted)',
                      '--tw-text-opacity': '1',
                      textShadow: '0 0 8px rgba(var(--text-rgb, 0, 0, 0), 0.3)'
                    } as React.CSSProperties}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--text)';
                      e.currentTarget.style.textShadow = '0 0 12px rgba(var(--text-rgb, 0, 0, 0), 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--text-muted)';
                      e.currentTarget.style.textShadow = '0 0 8px rgba(var(--text-rgb, 0, 0, 0), 0.3)';
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

      {/* Modals */}
      <CssCodeModal 
        isOpen={isCssModalOpen}
        onClose={() => setIsCssModalOpen(false)}
        palette={palette}
        currentFormat={paletteFormat}
      />
      <AlertsModal 
        isOpen={isAlertsModalOpen}
        onClose={() => setIsAlertsModalOpen(false)}
        palette={palette}
        currentFormat={paletteFormat}
      />
      <ColorPickerModal
        isOpen={isColorPickerOpen}
        onClose={() => setIsColorPickerOpen(false)}
        onColorSelect={setConfig}
        currentConfig={config}
        palette={palette}
      />
    </div>
  );
}; 

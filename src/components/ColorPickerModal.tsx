import React, { useState, useEffect } from 'react';
import { Modal } from './ui/modal';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { CustomColorPicker } from './CustomColorPicker';
import type { ColorConfig } from '../utils/colorUtils';
import { oklch } from 'culori';
import { oklchStringToHex } from '../utils/oklchConversions';

interface ColorPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onColorSelect: (config: ColorConfig) => void;
  currentConfig: ColorConfig;
  palette: any;
}

// Convert hex color to OKLCH values using culori
function hexToOklch(hexColor: string): { l: number; c: number; h: number } {
  try {
    const color = oklch(hexColor);
    if (!color || typeof color.l !== 'number' || typeof color.c !== 'number' || typeof color.h !== 'number') {
      console.warn('Invalid color conversion for:', hexColor);
      return { l: 0.5, c: 0, h: 0 };
    }

    return {
      l: color.l,
      c: Math.max(0, Math.min(0.4, color.c)), // Clamp chroma to valid range
      h: color.h >= 0 ? color.h : color.h + 360 // Ensure hue is positive
    };
  } catch (error) {
    console.error('Error converting hex to OKLCH:', error);
    return { l: 0.5, c: 0, h: 0 };
  }
}

// Determine if a color works better as primary in light or dark mode
function getRecommendedThemeMode(l: number): boolean {
  // For primary colors:
  // - Light colors (l > 0.7) work better with dark theme
  // - Dark colors (l < 0.3) work better with light theme
  // - Medium colors (0.3 <= l <= 0.7) can work with either, but prefer light theme for better contrast
  if (l > 0.7) {
    return false; // Dark theme for light colors
  } else if (l < 0.3) {
    return true; // Light theme for dark colors
  } else {
    return true; // Light theme for medium colors (better contrast)
  }
}

export const ColorPickerModal: React.FC<ColorPickerModalProps> = ({
  isOpen,
  onClose,
  onColorSelect,
  currentConfig,
  palette
}) => {
  const [selectedColor, setSelectedColor] = useState('#3b82f6');
  const [previewConfig, setPreviewConfig] = useState<ColorConfig>(currentConfig);

  // Initialize selectedColor with current primary color when modal opens
  useEffect(() => {
    if (isOpen) {
      // Convert current OKLCH primary color to hex for the color picker
      const currentPrimaryColor = palette.primary;
      const hexColor = oklchStringToHex(currentPrimaryColor);
      setSelectedColor(hexColor);
    }
  }, [isOpen, palette.primary]);

  // Update preview when color changes
  useEffect(() => {
    const { l, c, h } = hexToOklch(selectedColor);
    const recommendedThemeMode = getRecommendedThemeMode(l);
    
    console.log('ColorPickerModal: Converting hex', selectedColor, 'to OKLCH:', { l, c, h });
    console.log('ColorPickerModal: Recommended theme mode:', recommendedThemeMode);
    
    setPreviewConfig({
      hue: h,
      chroma: c,
      isLight: recommendedThemeMode
    });
  }, [selectedColor]);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
  };

  const handleApply = () => {
    console.log('ColorPickerModal: Applying color config:', previewConfig);
    console.log('ColorPickerModal: Selected hex color:', selectedColor);
    onColorSelect(previewConfig);
    onClose();
  };

  const handleCancel = () => {
    setSelectedColor('#3b82f6');
    setPreviewConfig(currentConfig);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} backgroundColor={palette.bg}>
      <div className="w-full max-w-md mx-auto p-6">
        <div className="flex items-center gap-2 mb-6">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="13.5" cy="6.5" r=".5"/>
            <circle cx="17.5" cy="10.5" r=".5"/>
            <circle cx="8.5" cy="7.5" r=".5"/>
            <circle cx="6.5" cy="12.5" r=".5"/>
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
          </svg>
          <h2 className="text-xl font-semibold" style={{ color: 'var(--text)' }}>Color Picker</h2>
        </div>
        <div className="space-y-6">
          {/* Color Picker */}
          <div className="space-y-3">
            <Label>Choose Primary Color</Label>
            <CustomColorPicker 
              value={selectedColor}
              onChange={handleColorChange}
            />
          </div>

          {/* Preview Values */}
          <div className="space-y-3">
            <Label>Preview Values</Label>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="space-y-1">
                <span style={{ color: 'var(--text-muted)' }}>Hue</span>
                <div 
                  className="font-mono font-light px-3 py-2 text-center"
                  style={{
                    backgroundColor: 'var(--bg-light)',
                    color: 'var(--text)',
                    borderRadius: '8px',
                    fontWeight: '600',
                  }}
                >
                  {Math.round(previewConfig.hue)}°
                </div>
              </div>
              <div className="space-y-1">
                <span style={{ color: 'var(--text-muted)' }}>Chroma</span>
                <div 
                  className="font-mono font-light px-3 py-2 text-center"
                  style={{
                    backgroundColor: 'var(--bg-light)',
                    color: 'var(--text)',
                    borderRadius: '8px',
                    fontWeight: '600',
                  }}
                >
                  {previewConfig.chroma.toFixed(3)}
                </div>
              </div>
              <div className="space-y-1">
                <span style={{ color: 'var(--text-muted)' }}>Theme</span>
                <div 
                  className="font-mono font-light px-3 py-2 text-center"
                  style={{
                    backgroundColor: 'var(--bg-light)',
                    color: 'var(--text)',
                    borderRadius: '8px',
                    fontWeight: '600',
                  }}
                >
                  {previewConfig.isLight ? 'Light' : 'Dark'}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={handleCancel} 
              variant="secondary" 
              className="flex-1 transition-colors duration-200"
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
              Cancel
            </Button>
            <Button onClick={handleApply} className="flex-1">
              Apply Color
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}; 
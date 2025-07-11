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
  const color = oklch(hexColor);
  if (!color) {
    return { l: 0.5, c: 0, h: 0 };
  }
  
  return {
    l: color.l ?? 0.5,
    c: Math.round((color.c ?? 0) * 1000) / 1000, // Round to 3 decimal places
    h: color.h ?? 0
  };
}

// Determine if a color works better as primary in light or dark mode
function getRecommendedThemeMode(l: number, c: number): boolean {
  // If lightness is 65% or more, recommend dark theme
  // If lightness is less than 65%, recommend light theme
  return l < 0.65;
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
    const recommendedThemeMode = getRecommendedThemeMode(l, c);
    
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
                  className="font-mono px-3 py-2 text-center"
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
                  className="font-mono px-3 py-2 text-center"
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
                  className="px-3 py-2 text-center"
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
            <Button onClick={handleCancel} variant="secondary" className="flex-1">
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
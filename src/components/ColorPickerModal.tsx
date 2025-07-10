import React, { useState, useEffect } from 'react';
import { Modal } from './ui/modal';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { CustomColorPicker } from './CustomColorPicker';
import type { ColorConfig } from '../utils/colorUtils';

interface ColorPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onColorSelect: (config: ColorConfig) => void;
  currentConfig: ColorConfig;
  palette: any;
}

// Convert RGB to OKLCH values
function rgbToOklch(r: number, g: number, b: number): { l: number; c: number; h: number } {
  // Normalize RGB values
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  // Convert to linear RGB
  const rLinear = rNorm <= 0.04045 ? rNorm / 12.92 : Math.pow((rNorm + 0.055) / 1.055, 2.4);
  const gLinear = gNorm <= 0.04045 ? gNorm / 12.92 : Math.pow((gNorm + 0.055) / 1.055, 2.4);
  const bLinear = bNorm <= 0.04045 ? bNorm / 12.92 : Math.pow((bNorm + 0.055) / 1.055, 2.4);

  // Convert to XYZ
  const x = rLinear * 0.4124 + gLinear * 0.3576 + bLinear * 0.1805;
  const y = rLinear * 0.2126 + gLinear * 0.7152 + bLinear * 0.0722;
  const z = rLinear * 0.0193 + gLinear * 0.1192 + bLinear * 0.9505;

  // Convert to OKLab
  const l = Math.pow(0.8189330101 * x + 0.3618667424 * y - 0.1288597137 * z, 1/3);
  const a = Math.pow(0.0329845446 * x + 0.9293118715 * y + 0.0361446382 * z, 1/3);
  const bLab = Math.pow(0.0482003018 * x + 0.2643662691 * y + 0.6338517070 * z, 1/3);

  // Convert to OKLCH
  const l_ok = 0.2104542553 * l + 0.7936177850 * a - 0.0040720468 * bLab;
  const a_ok = 1.9779984951 * l - 2.4285922050 * a + 0.4505937099 * bLab;
  const b_ok = 0.0259040371 * l + 0.7827717662 * a - 0.8086757660 * bLab;

  const c = Math.sqrt(a_ok * a_ok + b_ok * b_ok);
  let h = Math.atan2(b_ok, a_ok) * (180 / Math.PI);
  if (h < 0) h += 360;

  return {
    l: Math.max(0, Math.min(1, l_ok)),
    c: Math.max(0, Math.min(0.4, c)),
    h: h
  };
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

  // Update preview when color changes
  useEffect(() => {
    const color = selectedColor;
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    
    const { c, h } = rgbToOklch(r, g, b);
    
    setPreviewConfig({
      hue: h,
      chroma: c,
      isLight: currentConfig.isLight
    });
  }, [selectedColor, currentConfig.isLight]);

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
                  className="font-mono px-3 py-2"
                  style={{
                    backgroundColor: 'var(--bg)',
                    color: 'var(--text)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                >
                  {Math.round(previewConfig.hue)}°
                </div>
              </div>
              <div className="space-y-1">
                <span style={{ color: 'var(--text-muted)' }}>Chroma</span>
                <div 
                  className="font-mono px-3 py-2"
                  style={{
                    backgroundColor: 'var(--bg)',
                    color: 'var(--text)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                >
                  {previewConfig.chroma.toFixed(3)}
                </div>
              </div>
              <div className="space-y-1">
                <span style={{ color: 'var(--text-muted)' }}>Theme</span>
                <div 
                  className="font-mono px-3 py-2"
                  style={{
                    backgroundColor: 'var(--bg)',
                    color: 'var(--text)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
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
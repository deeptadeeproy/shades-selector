import React, { useState } from 'react';
import { Modal } from './ui/modal';
import { Button } from './ui/button';
import type { ColorPalette } from '../utils/colorUtils';

interface CssCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  palette: ColorPalette;
}

type ColorFormat = 'oklch' | 'hsl' | 'rgba';

export const CssCodeModal: React.FC<CssCodeModalProps> = ({ isOpen, onClose, palette }) => {
  const [copied, setCopied] = useState(false);
  const [format, setFormat] = useState<ColorFormat>('oklch');

  // Convert OKLCH to HSL (simplified conversion)
  const oklchToHsl = (oklchValue: string): string => {
    // Extract values from OKLCH string
    const match = oklchValue.match(/oklch\(([^)]+)\)/);
    if (!match) return oklchValue;
    
    const [l, c, h] = match[1].split(' ').map(Number);
    
    // Simplified OKLCH to HSL conversion
    const lightness = Math.round(l * 100);
    const saturation = Math.round(c * 100);
    const hue = Math.round(h);
    
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  // Convert OKLCH to RGBA (simplified conversion)
  const oklchToRgba = (oklchValue: string): string => {
    // Extract values from OKLCH string
    const match = oklchValue.match(/oklch\(([^)]+)\)/);
    if (!match) return oklchValue;
    
    const [l, c, h] = match[1].split(' ').map(Number);
    
    // Simplified OKLCH to RGB conversion
    const hueRad = (h * Math.PI) / 180;
    const a = c * Math.cos(hueRad);
    const b = c * Math.sin(hueRad);
    
    const r = Math.round(255 * Math.max(0, Math.min(1, l + 1.13983 * a + 0.39465 * b)));
    const g = Math.round(255 * Math.max(0, Math.min(1, l - 0.58060 * a + 0.80511 * b)));
    const b_val = Math.round(255 * Math.max(0, Math.min(1, l - 0.80511 * a - 0.80511 * b)));
    
    return `rgba(${r}, ${g}, ${b_val}, 1)`;
  };

  const convertColor = (oklchValue: string): string => {
    switch (format) {
      case 'hsl':
        return oklchToHsl(oklchValue);
      case 'rgba':
        return oklchToRgba(oklchValue);
      default:
        return oklchValue;
    }
  };

  const generateCssCode = () => {
    const cssVars = Object.entries(palette)
      .map(([key, value]) => `  --${key}: ${convertColor(value)};`)
      .join('\n');

    return `:root {
${cssVars}
}

/* Usage examples */
.bg-primary {
  background-color: var(--primary);
}

.text-primary {
  color: var(--primary);
}

.border-primary {
  border-color: var(--primary);
}`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateCssCode());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const cssCode = generateCssCode();

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-4xl">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text)' }}>
            Generated CSS Variables
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Copy these CSS custom properties to use your color palette in your project.
          </p>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>CSS Code:</span>
            <div className="flex items-center space-x-2">
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as ColorFormat)}
                className="h-8 px-3 text-sm rounded-lg border"
                style={{
                  backgroundColor: 'var(--bg-light)',
                  color: 'var(--text)',
                  borderColor: 'var(--border)',
                  borderRadius: '0.5rem',
                }}
              >
                <option value="oklch">OKLCH</option>
                <option value="hsl">HSL</option>
                <option value="rgba">RGBA</option>
              </select>
              <Button 
                onClick={handleCopy} 
                size="sm"
                className="h-8"
              >
                {copied ? 'Copied!' : 'Copy Code'}
              </Button>
            </div>
          </div>
          <pre 
            className="p-4 rounded-lg text-sm overflow-x-auto max-h-96 custom-scrollbar"
            style={{
              backgroundColor: 'rgba(var(--bg-dark-rgb, 0, 0, 0), 0.1)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
              scrollbarWidth: 'thin',
              scrollbarColor: 'var(--border) transparent',
            }}
          >
            <style>{`
              .custom-scrollbar::-webkit-scrollbar {
                width: 8px;
                height: 8px;
              }
              .custom-scrollbar::-webkit-scrollbar-track {
                background: transparent;
                border-radius: 4px;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb {
                background: var(--border);
                border-radius: 4px;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: var(--text-muted);
              }
              .custom-scrollbar::-webkit-scrollbar-corner {
                background: transparent;
              }
            `}</style>
            <code>{cssCode}</code>
          </pre>
        </div>

        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
          <p>💡 Tip: Add these variables to your CSS root selector to use them throughout your application.</p>
        </div>
      </div>
    </Modal>
  );
}; 
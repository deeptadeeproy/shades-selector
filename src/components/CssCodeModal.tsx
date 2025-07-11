import React, { useState } from 'react';
import { Modal } from './ui/modal';
import { Button } from './ui/button';
import { Dropdown } from './ui/dropdown';
import type { ColorPalette } from '../utils/colorUtils';
import { oklchStringToHex, oklchStringToRgba, oklchStringToHsl } from '../utils/oklchConversions';

interface CssCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  palette: ColorPalette;
  currentFormat?: 'oklch' | 'hsl' | 'rgb' | 'hex';
}

type ColorFormat = 'oklch' | 'hsl' | 'rgb' | 'hex';

export const CssCodeModal: React.FC<CssCodeModalProps> = ({ isOpen, onClose, palette, currentFormat = 'oklch' }) => {
  const [copied, setCopied] = useState(false);
  const [format, setFormat] = useState<ColorFormat>(currentFormat);

  // Update format when currentFormat prop changes
  React.useEffect(() => {
    setFormat(currentFormat);
  }, [currentFormat]);

  const formatOptions = [
    { value: 'oklch', label: 'OKLCH' },
    { value: 'hsl', label: 'HSL' },
    { value: 'rgb', label: 'RGB' },
    { value: 'hex', label: 'HEX' },
  ];

  // Convert OKLCH to HSL using accurate conversion
  const oklchToHsl = (oklchValue: string): string => {
    return oklchStringToHsl(oklchValue);
  };

  // Convert OKLCH to RGBA using accurate conversion
  const oklchToRgba = (oklchValue: string): string => {
    return oklchStringToRgba(oklchValue);
  };

  // Convert OKLCH to Hex using accurate conversion
  const oklchToHex = (oklchValue: string): string => {
    return oklchStringToHex(oklchValue);
  };

  const convertColor = (oklchValue: string): string => {
    switch (format) {
      case 'hsl':
        return oklchToHsl(oklchValue);
      case 'rgb':
        return oklchToRgba(oklchValue);
      case 'hex':
        return oklchToHex(oklchValue);
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
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-4xl" palette={palette}>
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
            <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>CSS:</span>
            <div className="flex items-center space-x-2">
              <Dropdown
                value={format}
                onChange={(value) => setFormat(value as ColorFormat)}
                options={formatOptions}
              />
              <Button 
                onClick={handleCopy} 
                size="sm"
                className="h-8 min-w-[80px]"
              >
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </div>
          <div className="mt-4">
            <pre 
              className="p-4 rounded-lg text-sm overflow-x-auto max-h-96 custom-scrollbar"
              style={{
                color: 'var(--text-muted)',
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
        </div>

        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
          <p>💡 Tip: Add these variables to your CSS root selector to use them throughout your application.</p>
        </div>
      </div>
    </Modal>
  );
}; 
import React, { useState } from 'react';
import type { ColorPalette } from '../utils/colorUtils';
import { ColorSwatch } from './ColorSwatch';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dropdown } from './ui/dropdown';
import { oklchStringToHex, oklchStringToRgba, oklchStringToHsl } from '../utils/oklchConversions';

interface ColorPaletteDisplayProps {
  palette: ColorPalette;
  onFormatChange?: (format: ColorFormat) => void;
}

type ColorFormat = 'oklch' | 'hsl' | 'rgba' | 'hex';

export const ColorPaletteDisplay: React.FC<ColorPaletteDisplayProps> = ({ palette, onFormatChange }) => {
  const [format, setFormat] = useState<ColorFormat>('oklch');

  const handleFormatChange = (newFormat: ColorFormat) => {
    setFormat(newFormat);
    onFormatChange?.(newFormat);
  };

  const formatOptions = [
    { value: 'oklch', label: 'OKLCH' },
    { value: 'hsl', label: 'HSL' },
    { value: 'rgba', label: 'RGBA' },
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
      case 'rgba':
        return oklchToRgba(oklchValue);
      case 'hex':
        return oklchToHex(oklchValue);
      default:
        return oklchValue;
    }
  };

  const handleCopyColor = async (colorValue: string) => {
    try {
      await navigator.clipboard.writeText(convertColor(colorValue));
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const colorCategories = [
    {
      title: 'Background',
      colors: [
        { name: 'bg-dark', color: palette['bg-dark'] },
        { name: 'bg', color: palette.bg },
        { name: 'bg-light', color: palette['bg-light'] },
      ]
    },
    {
      title: 'Text',
      colors: [
        { name: 'text', color: palette.text },
        { name: 'text-muted', color: palette['text-muted'] },
      ]
    },
    {
      title: 'Border',
      colors: [
        { name: 'highlight', color: palette.highlight },
        { name: 'border', color: palette.border },
        { name: 'border-muted', color: palette['border-muted'] },
      ]
    },
    {
      title: 'Action',
      colors: [
        { name: 'primary', color: palette.primary },
        { name: 'secondary', color: palette.secondary },
      ]
    },
    {
      title: 'Alert',
      colors: [
        { name: 'danger', color: palette.danger },
        { name: 'warning', color: palette.warning },
        { name: 'success', color: palette.success },
        { name: 'info', color: palette.info },
      ]
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Color Palette</CardTitle>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>Export Style:</span>
            <Dropdown
              value={format}
              onChange={(value) => handleFormatChange(value as ColorFormat)}
              options={formatOptions}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Row 1: Background and Text side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-muted)' }}>Background</h3>
              <div className="flex flex-wrap gap-4">
                {colorCategories[0].colors.map((colorItem) => (
                  <ColorSwatch
                    key={colorItem.name}
                    name={colorItem.name}
                    color={colorItem.color}
                    onCopy={() => handleCopyColor(colorItem.color)}
                  />
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-muted)' }}>Text</h3>
              <div className="flex flex-wrap gap-4">
                {colorCategories[1].colors.map((colorItem) => (
                  <ColorSwatch
                    key={colorItem.name}
                    name={colorItem.name}
                    color={colorItem.color}
                    onCopy={() => handleCopyColor(colorItem.color)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Row 2: Border and Action side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-muted)' }}>Border</h3>
              <div className="flex flex-wrap gap-4">
                {colorCategories[2].colors.map((colorItem) => (
                  <ColorSwatch
                    key={colorItem.name}
                    name={colorItem.name}
                    color={colorItem.color}
                    onCopy={() => handleCopyColor(colorItem.color)}
                  />
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-muted)' }}>Action</h3>
              <div className="flex flex-wrap gap-4">
                {colorCategories[3].colors.map((colorItem) => (
                  <ColorSwatch
                    key={colorItem.name}
                    name={colorItem.name}
                    color={colorItem.color}
                    onCopy={() => handleCopyColor(colorItem.color)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Row 3: Alert (full width) */}
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-muted)' }}>Alert</h3>
            <div className="flex flex-wrap gap-4">
              {colorCategories[4].colors.map((colorItem) => (
                <ColorSwatch
                  key={colorItem.name}
                  name={colorItem.name}
                  color={colorItem.color}
                  onCopy={() => handleCopyColor(colorItem.color)}
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 
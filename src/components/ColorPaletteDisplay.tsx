import React, { useState, useCallback, useMemo } from 'react';
import type { ColorPalette } from '../utils/colorUtils';
import { ColorSwatch } from './ColorSwatch';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dropdown } from './ui/dropdown';
import { Button } from './ui/button';
import { oklchStringToHex, oklchStringToRgba, oklchStringToHsl } from '../utils/oklchConversions';

interface ColorPaletteDisplayProps {
  palette: ColorPalette;
  onFormatChange?: (format: ColorFormat) => void;
}

type ColorFormat = 'oklch' | 'hsl' | 'rgb' | 'hex';

export const ColorPaletteDisplay: React.FC<ColorPaletteDisplayProps> = React.memo(({ palette, onFormatChange }) => {
  const [format, setFormat] = useState<ColorFormat>('oklch');

  const handleFormatChange = useCallback((newFormat: ColorFormat) => {
    setFormat(newFormat);
    onFormatChange?.(newFormat);
  }, [onFormatChange]);

  const formatOptions = useMemo(() => [
    { value: 'oklch', label: 'OKLCH' },
    { value: 'hsl', label: 'HSL' },
    { value: 'rgb', label: 'RGB' },
    { value: 'hex', label: 'HEX' },
  ], []);

  // Memoized conversion functions
  const oklchToHsl = useCallback((oklchValue: string): string => {
    return oklchStringToHsl(oklchValue);
  }, []);

  const oklchToRgba = useCallback((oklchValue: string): string => {
    return oklchStringToRgba(oklchValue);
  }, []);

  const oklchToHex = useCallback((oklchValue: string): string => {
    return oklchStringToHex(oklchValue);
  }, []);

  const convertColor = useCallback((oklchValue: string): string => {
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
  }, [format, oklchToHsl, oklchToRgba, oklchToHex]);

  const handleCopyColor = useCallback(async (colorValue: string) => {
    try {
      await navigator.clipboard.writeText(convertColor(colorValue));
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }, [convertColor]);

  // Memoized color categories
  const colorCategories = useMemo(() => [
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
        { name: 'text', color: palette['text'] },
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
        { name: 'tertiary', color: palette.tertiary },
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
  ], [palette]);

  // Memoized render functions for each category
  const renderColorCategory = useCallback((category: typeof colorCategories[0]) => (
    <div key={category.title}>
      <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-muted)' }}>{category.title}</h3>
      <div className="flex flex-wrap gap-4">
        {category.colors.map((colorItem) => (
          <ColorSwatch
            key={colorItem.name}
            name={colorItem.name}
            color={colorItem.color}
            onCopy={() => handleCopyColor(colorItem.color)}
            tooltipValue={convertColor(colorItem.color)}
          />
        ))}
      </div>
    </div>
  ), [handleCopyColor, convertColor]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Palette</CardTitle>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>Format:</span>
              <Dropdown
                value={format}
                onChange={(value) => handleFormatChange(value as ColorFormat)}
                options={formatOptions}
              />
            </div>
            <Button size="sm" className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17,21 17,13 7,13 7,21"/>
                <polyline points="7,3 7,8 15,8"/>
              </svg>
              Save
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Row 1: Background and Text side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {renderColorCategory(colorCategories[0])}
            {renderColorCategory(colorCategories[1])}
          </div>

          {/* Row 2: Border and Action side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {renderColorCategory(colorCategories[2])}
            {renderColorCategory(colorCategories[3])}
          </div>

          {/* Row 3: Alert (full width) */}
          {renderColorCategory(colorCategories[4])}
        </div>
      </CardContent>
    </Card>
  );
});

ColorPaletteDisplay.displayName = 'ColorPaletteDisplay'; 
import React, { useState, useCallback, useMemo, useRef } from 'react';
import type { ColorPalette } from '../utils/colorUtils';
import { ColorSwatch } from './ColorSwatch';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dropdown } from './ui/dropdown';
import { Button } from './ui/button';
import { oklchStringToHex, oklchStringToRgba, oklchStringToHsl } from '../utils/oklchConversions';

interface ColorPaletteDisplayProps {
  palette: ColorPalette;
  onFormatChange?: (format: ColorFormat) => void;
  onSave?: () => void;
  isLoggedIn?: boolean;
  saveLabel?: string;
  refineMode?: boolean;
  onEditColor?: (name: string) => void;
  onToggleRefine?: () => void;
  editingColorName?: string | null;
  onRefineColorChange?: (name: string, newColor: string) => void;
  saveDisabled?: boolean;
  editingPaletteId?: string | null;
  saveSuccess?: boolean;
}

type ColorFormat = 'oklch' | 'hsl' | 'rgb' | 'hex';

export const ColorPaletteDisplay: React.FC<ColorPaletteDisplayProps> = React.memo(({ palette, onFormatChange, onSave, isLoggedIn, refineMode = false, onEditColor, onToggleRefine, onRefineColorChange, saveDisabled, editingPaletteId, saveSuccess = false }) => {
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

  // Native color picker logic
  const colorInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const handleSwatchClick = (name: string) => {
    if (refineMode && colorInputRefs.current[name]) {
      colorInputRefs.current[name]!.click();
    } else if (refineMode && onEditColor) {
      onEditColor(name);
    }
  };
  const handleNativeColorChange = (name: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (onRefineColorChange) {
      onRefineColorChange(name, e.target.value);
    }
  };

  // Memoized render functions for each category
  const renderColorCategory = useCallback((category: typeof colorCategories[0]) => (
    <div key={category.title}>
      <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-muted)' }}>{category.title}</h3>
      <div className="flex flex-wrap gap-4">
        {category.colors.map((colorItem) => (
          <div key={colorItem.name} className="relative">
            <ColorSwatch
              name={colorItem.name}
              color={colorItem.color}
              refineMode={refineMode}
              onEdit={refineMode ? () => handleSwatchClick(colorItem.name) : undefined}
              onCopy={!refineMode ? () => handleCopyColor(colorItem.color) : undefined}
              tooltipValue={!refineMode ? convertColor(colorItem.color) : undefined}
            />
            {refineMode && (
              <input
                ref={el => { colorInputRefs.current[colorItem.name] = el; }}
                type="color"
                value={oklchStringToHex(colorItem.color)}
                onChange={e => handleNativeColorChange(colorItem.name, e)}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: 'pointer',
                  zIndex: 2
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  ), [handleCopyColor, convertColor, refineMode, onEditColor, onRefineColorChange]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Palette</CardTitle>
          <div className="flex items-center space-x-3">
            <Button
              size="sm"
              variant="secondary"
              className="flex items-center gap-2"
              onClick={onToggleRefine}
              style={{ border: 'none' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 20h9"/>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
              {refineMode ? 'Done' : 'Refine'}
            </Button>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>Format:</span>
              <Dropdown
                value={format}
                onChange={(value) => handleFormatChange(value as ColorFormat)}
                options={formatOptions}
              />
            </div>
            {isLoggedIn && (
              editingPaletteId ? (
                <Button 
                  size="sm" 
                  onClick={onSave}
                  className="flex items-center gap-2"
                  disabled={saveDisabled || saveSuccess}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                    <polyline points="17,21 17,13 7,13 7,21"/>
                    <polyline points="7,3 7,8 15,8"/>
                  </svg>
                  {saveSuccess ? 'Saved Changes' : 'Save Changes'}
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={onSave}
                  className="flex items-center gap-2"
                  disabled={refineMode}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                    <polyline points="17,21 17,13 7,13 7,21"/>
                    <polyline points="7,3 7,8 15,8"/>
                  </svg>
                  Save
                </Button>
              )
            )}
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
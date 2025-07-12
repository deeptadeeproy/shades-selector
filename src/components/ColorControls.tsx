import React, { useState, useCallback, useMemo } from 'react';
import type { ColorConfig } from '../utils/colorUtils';
import { createHueGradient, createChromaGradient } from '../utils/colorUtils';
import { Slider } from './ui/slider';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

interface ColorControlsProps {
  config: ColorConfig;
  onConfigChange: (config: ColorConfig) => void;
  onColorPickerOpen: () => void;
}

export const ColorControls: React.FC<ColorControlsProps> = React.memo(({ config, onConfigChange, onColorPickerOpen }) => {
  const [isEditingHue, setIsEditingHue] = useState(false);
  const [isEditingChroma, setIsEditingChroma] = useState(false);
  const [hueInputValue, setHueInputValue] = useState('');
  const [chromaInputValue, setChromaInputValue] = useState('');
  
  // Local state for slider values during dragging (not committed yet)
  const [localHue, setLocalHue] = useState(config.hue);
  const [localChroma, setLocalChroma] = useState(config.chroma);

  // Update local values when config changes from outside
  React.useEffect(() => {
    setLocalHue(config.hue);
    setLocalChroma(config.chroma);
  }, [config.hue, config.chroma]);

  // Memoized gradient calculations
  const hueGradient = useMemo(() => 
    createHueGradient(localChroma, 0.5), 
    [localChroma]
  );
  
  const chromaGradient = useMemo(() => 
    createChromaGradient(localHue, 0.5), 
    [localHue]
  );

  // Handle slider changes during dragging (update local state only)
  const handleHueChange = useCallback((value: number[]) => {
    setLocalHue(value[0]);
  }, []);

  const handleChromaChange = useCallback((value: number[]) => {
    setLocalChroma(value[0]);
  }, []);

  // Handle slider commit (when user releases the slider)
  const handleHueCommit = useCallback((value: number[]) => {
    const newHue = value[0];
    setLocalHue(newHue);
    onConfigChange({ ...config, hue: newHue });
  }, [config, onConfigChange]);

  const handleChromaCommit = useCallback((value: number[]) => {
    const newChroma = value[0];
    setLocalChroma(newChroma);
    onConfigChange({ ...config, chroma: newChroma });
  }, [config, onConfigChange]);

  const handleThemeToggle = useCallback(() => {
    onConfigChange({ ...config, isLight: !config.isLight });
  }, [config, onConfigChange]);

  const handleHueInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Limit to 3 digits (excluding decimal point)
    const digitsOnly = value.replace(/[^\d]/g, '');
    if (digitsOnly.length > 3) {
      return;
    }
    
    setHueInputValue(value);
    if (value === '') {
      onConfigChange({ ...config, hue: 0 });
    } else {
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && numValue >= 0 && numValue <= 360) {
        onConfigChange({ ...config, hue: numValue });
      }
    }
  }, [config, onConfigChange]);

  const handleChromaInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Limit to 4 digits (excluding decimal point)
    const digitsOnly = value.replace(/[^\d]/g, '');
    if (digitsOnly.length > 4) {
      return;
    }
    
    setChromaInputValue(value);
    if (value === '') {
      onConfigChange({ ...config, chroma: 0 });
    } else {
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && numValue >= 0 && numValue <= 0.4) {
        onConfigChange({ ...config, chroma: numValue });
      }
    }
  }, [config, onConfigChange]);

  const handleHueFocus = useCallback(() => {
    setIsEditingHue(true);
    setHueInputValue(config.hue === 0 ? '0' : Math.round(config.hue).toString());
  }, [config.hue]);

  const handleHueBlur = useCallback(() => {
    setIsEditingHue(false);
    setHueInputValue('');
  }, []);

  const handleChromaFocus = useCallback(() => {
    setIsEditingChroma(true);
    setChromaInputValue(config.chroma === 0 ? '0' : config.chroma.toString());
  }, [config.chroma]);

  const handleChromaBlur = useCallback(() => {
    setIsEditingChroma(false);
    setChromaInputValue('');
  }, []);

  // Memoized display values
  const hueDisplayValue = useMemo(() => {
    if (isEditingHue) {
      return hueInputValue;
    }
    return config.hue === 0 ? '0' : Math.round(config.hue).toString();
  }, [isEditingHue, hueInputValue, config.hue]);

  const chromaDisplayValue = useMemo(() => {
    if (isEditingChroma) {
      return chromaInputValue;
    }
    if (config.chroma === 0) return '0';
    return config.chroma.toString();
  }, [isEditingChroma, chromaInputValue, config.chroma]);

  // Memoized theme toggle styles
  const themeToggleStyle = useMemo(() => ({
    backgroundColor: config.isLight ? 'var(--primary)' : 'var(--border)',
  }), [config.isLight]);

  const themeToggleSpanStyle = useMemo(() => ({
    backgroundColor: 'var(--bg-light)',
    borderRadius: '50%',
  }), []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Color Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme Toggle and Color Picker */}
          <div className="space-y-3">
            <Label>Theme Mode</Label>
            <div className="flex items-center justify-between">
              <button
                onClick={handleThemeToggle}
                className="theme-toggle relative inline-flex h-6 w-11 items-center transition-colors"
                style={themeToggleStyle}
              >
                <span
                  className={`inline-block h-4 w-4 transform transition-transform flex items-center justify-center ${
                    config.isLight ? 'translate-x-6' : 'translate-x-1'
                  }`}
                  style={themeToggleSpanStyle}
                >
                  {config.isLight ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="5"/>
                      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                    </svg>
                  ) : (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                    </svg>
                  )}
                </span>
              </button>
              
              <Button
                onClick={onColorPickerOpen}
                size="sm"
                variant="secondary"
                className="flex items-center gap-2"
                style={{ 
                  color: 'var(--text-muted)',
                  borderColor: 'var(--border)'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="13.5" cy="6.5" r=".5"/>
                  <circle cx="17.5" cy="10.5" r=".5"/>
                  <circle cx="8.5" cy="7.5" r=".5"/>
                  <circle cx="6.5" cy="12.5" r=".5"/>
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
                </svg>
                Pick Color
              </Button>
            </div>
          </div>

          {/* Hue Control */}
          <div className="space-y-3">
            <Label htmlFor="hue-slider">Hue</Label>
            <div className="space-y-2">
              <Slider
                id="hue-slider"
                value={[localHue]}
                onValueChange={handleHueChange}
                onValueCommit={handleHueCommit}
                max={360}
                min={0}
                step={1}
                className="w-full"
                style={{
                  '--slider-track-background': hueGradient,
                } as React.CSSProperties}
              />
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={hueDisplayValue}
                  onChange={handleHueInputChange}
                  onFocus={handleHueFocus}
                  onBlur={handleHueBlur}
                  min={0}
                  max={360}
                  step={1}
                  className="w-20"
                />
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>(0 - 360)</span>
              </div>
            </div>
          </div>

          {/* Chroma Control */}
          <div className="space-y-3">
            <Label htmlFor="chroma-slider">Chroma</Label>
            <div className="space-y-2">
              <Slider
                id="chroma-slider"
                value={[localChroma]}
                onValueChange={handleChromaChange}
                onValueCommit={handleChromaCommit}
                max={0.4}
                min={0}
                step={0.005}
                className="w-full"
                style={{
                  '--slider-track-background': chromaGradient,
                } as React.CSSProperties}
              />
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={chromaDisplayValue}
                  onChange={handleChromaInputChange}
                  onFocus={handleChromaFocus}
                  onBlur={handleChromaBlur}
                  min={0}
                  max={0.4}
                  step={0.005}
                  className="w-20"
                />
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>(0 - 0.4)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

ColorControls.displayName = 'ColorControls'; 
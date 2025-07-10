import React from 'react';
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

export const ColorControls: React.FC<ColorControlsProps> = ({ config, onConfigChange, onColorPickerOpen }) => {
  const handleHueChange = (value: number[]) => {
    onConfigChange({ ...config, hue: value[0] });
  };

  const handleChromaChange = (value: number[]) => {
    onConfigChange({ ...config, chroma: value[0] });
  };

  const handleThemeToggle = () => {
    onConfigChange({ ...config, isLight: !config.isLight });
  };

  const handleHueInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      onConfigChange({ ...config, hue: 0 });
    } else {
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && numValue >= 0 && numValue <= 360) {
        onConfigChange({ ...config, hue: numValue });
      }
    }
  };

  const handleChromaInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      onConfigChange({ ...config, chroma: 0 });
    } else {
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && numValue >= 0 && numValue <= 0.4) {
        onConfigChange({ ...config, chroma: numValue });
      }
    }
  };

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
                style={{
                  backgroundColor: config.isLight ? 'var(--primary)' : 'var(--border)',
                }}
              >
                <span
                  className={`inline-block h-4 w-4 transform transition-transform flex items-center justify-center ${
                    config.isLight ? 'translate-x-6' : 'translate-x-1'
                  }`}
                  style={{
                    backgroundColor: 'var(--bg-light)',
                    borderRadius: '50%',
                  }}
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
                className="flex items-center gap-2"
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
                value={[config.hue]}
                onValueChange={handleHueChange}
                max={360}
                min={0}
                step={1}
                className="w-full"
                style={{
                  '--slider-track-background': createHueGradient(config.chroma, 0.5),
                } as React.CSSProperties}
              />
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={config.hue === 0 ? '' : Math.round(config.hue)}
                  onChange={handleHueInputChange}
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
                value={[config.chroma]}
                onValueChange={handleChromaChange}
                max={0.4}
                min={0}
                step={0.01}
                className="w-full"
                style={{
                  '--slider-track-background': createChromaGradient(config.hue, 0.5),
                } as React.CSSProperties}
              />
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={config.chroma === 0 ? '' : config.chroma.toFixed(2)}
                  onChange={handleChromaInputChange}
                  min={0}
                  max={0.4}
                  step={0.01}
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
}; 
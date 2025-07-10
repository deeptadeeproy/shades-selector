import React from 'react';
import type { ColorConfig } from '../utils/colorUtils';
import { createHueGradient, createChromaGradient } from '../utils/colorUtils';
import { Slider } from './ui/slider';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface ColorControlsProps {
  config: ColorConfig;
  onConfigChange: (config: ColorConfig) => void;
}

export const ColorControls: React.FC<ColorControlsProps> = ({ config, onConfigChange }) => {
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
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= 360) {
      onConfigChange({ ...config, hue: value });
    }
  };

  const handleChromaInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= 0.4) {
      onConfigChange({ ...config, chroma: value });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Color Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme Toggle */}
          <div className="space-y-3">
            <Label>Theme Mode</Label>
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Dark</span>
              <button
                onClick={handleThemeToggle}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                style={{
                  backgroundColor: config.isLight ? 'var(--primary)' : 'var(--border)',
                }}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full transition-transform ${
                    config.isLight ? 'translate-x-6' : 'translate-x-1'
                  }`}
                  style={{
                    backgroundColor: 'var(--bg-light)',
                  }}
                />
              </button>
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Light</span>
            </div>
          </div>

          {/* Hue Control */}
          <div className="space-y-3">
            <Label htmlFor="hue-slider">Hue (0-360°)</Label>
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
                  value={Math.round(config.hue)}
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
            <Label htmlFor="chroma-slider">Chroma (0-0.4)</Label>
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
                  value={config.chroma.toFixed(2)}
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
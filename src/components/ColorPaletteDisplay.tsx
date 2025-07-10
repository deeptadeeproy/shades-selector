import React from 'react';
import type { ColorPalette } from '../utils/colorUtils';
import { ColorSwatch } from './ColorSwatch';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface ColorPaletteDisplayProps {
  palette: ColorPalette;
}

export const ColorPaletteDisplay: React.FC<ColorPaletteDisplayProps> = ({ palette }) => {
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
        <CardTitle>Color Palette</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Row 1: Background and Text side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text)' }}>Background</h3>
              <div className="flex flex-wrap gap-4">
                {colorCategories[0].colors.map((colorItem) => (
                  <ColorSwatch
                    key={colorItem.name}
                    name={colorItem.name}
                    color={colorItem.color}
                  />
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text)' }}>Text</h3>
              <div className="flex flex-wrap gap-4">
                {colorCategories[1].colors.map((colorItem) => (
                  <ColorSwatch
                    key={colorItem.name}
                    name={colorItem.name}
                    color={colorItem.color}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Row 2: Border and Action side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text)' }}>Border</h3>
              <div className="flex flex-wrap gap-4">
                {colorCategories[2].colors.map((colorItem) => (
                  <ColorSwatch
                    key={colorItem.name}
                    name={colorItem.name}
                    color={colorItem.color}
                  />
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text)' }}>Action</h3>
              <div className="flex flex-wrap gap-4">
                {colorCategories[3].colors.map((colorItem) => (
                  <ColorSwatch
                    key={colorItem.name}
                    name={colorItem.name}
                    color={colorItem.color}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Row 3: Alert (full width) */}
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text)' }}>Alert</h3>
            <div className="flex flex-wrap gap-4">
              {colorCategories[4].colors.map((colorItem) => (
                <ColorSwatch
                  key={colorItem.name}
                  name={colorItem.name}
                  color={colorItem.color}
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 
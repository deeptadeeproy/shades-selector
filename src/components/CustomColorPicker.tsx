import React, { useState } from 'react';
import { Button } from './ui/button';

interface CustomColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

const predefinedColors = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899',
  '#06b6d4', '#84cc16', '#f97316', '#6366f1', '#14b8a6', '#f43f5e',
  '#0ea5e9', '#22c55e', '#eab308', '#a855f7', '#f06292', '#0891b2',
  '#4ade80', '#fb923c', '#7c3aed', '#be185d', '#0284c7', '#16a34a',
  '#ca8a04', '#9333ea', '#e11d48', '#0369a1', '#15803d', '#a16207'
];

export const CustomColorPicker: React.FC<CustomColorPickerProps> = ({ value, onChange }) => {
  const [customColor, setCustomColor] = useState(value);
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleColorSelect = (color: string) => {
    onChange(color);
    setCustomColor(color);
    setShowCustomInput(false);
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setCustomColor(color);
    onChange(color);
  };

  return (
    <div className="space-y-4">
      {/* Predefined Colors Grid */}
      <div className="grid grid-cols-6 gap-2">
        {predefinedColors.map((color) => (
          <button
            key={color}
            onClick={() => handleColorSelect(color)}
            className="w-8 h-8 rounded-lg border-2 transition-all hover:scale-110"
            style={{
              backgroundColor: color,
              border: value === color 
                ? '2px solid rgb(81, 82, 83)' 
                : '1px solid #e5e7eb',
            }}
            title={color}
          />
        ))}
      </div>

      {/* Custom Color Input */}
      <div className="flex items-center gap-3">
        <Button
          onClick={() => setShowCustomInput(!showCustomInput)}
          variant="secondary"
          size="sm"
          className="flex items-center gap-2 transition-colors duration-200"
          style={{
            color: 'var(--text-muted)',
            borderColor: 'var(--border-muted)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text)';
            e.currentTarget.style.borderColor = 'var(--border)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-muted)';
            e.currentTarget.style.borderColor = 'var(--border-muted)';
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          Add Hexcode
        </Button>
        
                 {showCustomInput && (
           <div className="flex items-center gap-2 justify-end">
             <input
               type="text"
               value={customColor}
               onChange={(e) => handleCustomColorChange({ target: { value: e.target.value } } as any)}
               className="px-3 h-8 text-sm font-mono rounded-lg focus:outline-none w-24"
               style={{
                 backgroundColor: 'var(--bg)',
                 color: 'var(--text)',
                 border: '1px solid var(--border)',
                 borderRadius: '8px',
               }}
               placeholder="#000000"
             />
             <input
               type="color"
               value={customColor}
               onChange={handleCustomColorChange}
               className="w-8 h-8 rounded-full cursor-pointer border-0 flex-shrink-0"
               style={{
                 backgroundColor: customColor,
                 borderRadius: '50%',
               }}
             />
           </div>
         )}
      </div>
    </div>
  );
}; 
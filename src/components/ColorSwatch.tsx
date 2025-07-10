import React from 'react';
import { cn } from '../lib/utils';

interface ColorSwatchProps {
  name: string;
  color: string;
  className?: string;
}

export const ColorSwatch: React.FC<ColorSwatchProps> = ({ name, color, className }) => {
  return (
    <div className={cn("flex flex-col items-center space-y-2", className)}>
      <div
        className="w-20 h-20 rounded-xl shadow-sm"
        style={{ 
          backgroundColor: color,
        }}
      />
      <div className="text-center">
        <p className="text-xs font-medium" style={{ color: 'var(--text)' }}>{name}</p>
      </div>
    </div>
  );
}; 
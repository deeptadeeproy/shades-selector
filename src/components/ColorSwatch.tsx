import React, { useState } from 'react';
import { cn } from '../lib/utils';

interface ColorSwatchProps {
  name: string;
  color: string;
  className?: string;
  onCopy?: () => void;
}

export const ColorSwatch: React.FC<ColorSwatchProps> = ({ name, color, className, onCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (onCopy && !copied) {
      onCopy();
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    }
  };

  return (
    <div className={cn("flex flex-col items-center space-y-2 relative", className)}>
      <div className="relative">
        <div
          className="w-20 h-20 rounded-xl shadow-sm"
          style={{ 
            backgroundColor: color,
            border: '1px solid rgba(229, 231, 235, 0.32)',
          }}
        />
        {onCopy && (
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200"
            style={{
              backgroundColor: 'transparent',
              color: '#6b7280',
            }}
            disabled={copied}
          >
            {copied ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
        )}
      </div>
      <div className="text-center">
        <p className="text-xs font-medium" style={{ color: 'var(--text)' }}>{name}</p>
      </div>
    </div>
  );
}; 
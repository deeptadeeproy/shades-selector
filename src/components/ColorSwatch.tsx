import React, { useState, useCallback, useMemo } from 'react';
import { cn } from '../lib/utils';

interface ColorSwatchProps {
  name: string;
  color: string;
  className?: string;
  onCopy?: () => void;
  tooltipValue?: string;
  refineMode?: boolean;
  onEdit?: () => void;
}

export const ColorSwatch: React.FC<ColorSwatchProps> = React.memo(({ name, color, className, onCopy, tooltipValue, refineMode = false, onEdit }) => {
  const [copied, setCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleCopy = useCallback(async () => {
    if (onCopy && !copied) {
      onCopy();
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    }
  }, [onCopy, copied]);

  const handleMouseEnter = useCallback(() => {
    setShowTooltip(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setShowTooltip(false);
  }, []);

  // Memoized styles
  const buttonStyle = useMemo(() => ({
    backgroundColor: color,
    border: '1px solid rgba(229, 231, 235, 0.32)',
  }), [color]);

  const tooltipStyle = useMemo(() => ({
    backgroundColor: 'var(--bg)',
    color: 'var(--text)',
    border: '1px solid var(--border)',
    top: '-45px',
    left: '50%',
    transform: 'translateX(-50%)',
    whiteSpace: 'nowrap' as const,
  }), []);

  const tooltipArrowStyle = useMemo(() => ({
    width: 0,
    height: 0,
    borderLeft: '6px solid transparent',
    borderRight: '6px solid transparent',
    borderTop: '6px solid var(--border)',
  }), []);

  const iconStyle = useMemo(() => ({
    color: '#6b7280'
  }), []);

  return (
    <div className={cn("flex flex-col items-center space-y-2 relative", className)}>
      <div className="relative">
        <button
          className={cn(
            "w-20 h-20 rounded-xl shadow-sm cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 relative group",
            refineMode && "animate-jiggle"
          )}
          style={buttonStyle}
          onMouseEnter={refineMode ? undefined : handleMouseEnter}
          onMouseLeave={refineMode ? undefined : handleMouseLeave}
          onClick={refineMode && onEdit ? onEdit : handleCopy}
          disabled={refineMode ? false : copied}
        >
          {/* Edit icon in center if refineMode, else copy icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            {refineMode ? (
              <svg className="w-6 h-6 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={iconStyle}>
                <path d="M12 20h9"/>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
            ) : copied ? (
              <svg 
                className="w-6 h-6 opacity-100 transition-opacity duration-200" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                style={iconStyle}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg 
                className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                style={iconStyle}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </div>
        </button>
        {/* Tooltip only if not in refine mode */}
        {!refineMode && showTooltip && tooltipValue && (
          <div
            className="absolute z-50 px-3 py-2 text-sm font-mono rounded-xl shadow-lg pointer-events-none"
            style={tooltipStyle}
          >
            {tooltipValue}
            {/* Tooltip arrow */}
            <div
              className="absolute top-full left-1/2 transform -translate-x-1/2"
              style={tooltipArrowStyle}
            />
          </div>
        )}
      </div>
      <div className="text-center">
        <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{name}</p>
      </div>
    </div>
  );
});

ColorSwatch.displayName = 'ColorSwatch'; 
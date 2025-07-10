import * as React from "react"
import { cn } from "../../lib/utils"

import type { ColorPalette } from '../../utils/colorUtils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  backgroundColor?: string;
  palette?: ColorPalette;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, className, backgroundColor, palette }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div 
        className={cn(
          "relative max-w-2xl w-full max-h-[80vh] overflow-y-auto rounded-xl shadow-2xl backdrop-blur-md",
          className
        )}
        style={{
          backgroundColor: backgroundColor || (palette ? palette.bg : 'rgba(var(--bg-rgb, 0, 0, 0), 0.95)'),
          color: 'var(--text)',
          border: '1px solid rgba(var(--border-rgb, 0, 0, 0), 0.2)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-opacity-10 transition-colors"
          style={{ 
            backgroundColor: 'rgba(var(--border-rgb, 0, 0, 0), 0.1)',
            color: 'var(--text)',
          }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
}; 
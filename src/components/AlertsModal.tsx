import React from 'react';
import { Modal } from './ui/modal';
import type { ColorPalette } from '../utils/colorUtils';
import { oklchStringToHex, oklchStringToRgba, oklchStringToHsl } from '../utils/oklchConversions';

type ColorFormat = 'oklch' | 'hsl' | 'rgb' | 'hex';

interface AlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  palette: ColorPalette;
  currentFormat?: ColorFormat;
}

export const AlertsModal: React.FC<AlertsModalProps> = ({ isOpen, onClose, palette, currentFormat = 'oklch' }) => {
  const convertColor = (oklchValue: string): string => {
    switch (currentFormat) {
      case 'hsl':
        return oklchStringToHsl(oklchValue);
      case 'rgb':
        return oklchStringToRgba(oklchValue);
      case 'hex':
        return oklchStringToHex(oklchValue);
      default:
        return oklchValue;
    }
  };

  const alerts = [
    {
      type: 'success',
      title: 'Success!',
      message: 'Your changes have been saved successfully.',
      color: palette.success,
      icon: '✓'
    },
    {
      type: 'warning',
      title: 'Warning',
      message: 'Please review your input before proceeding.',
      color: palette.warning,
      icon: '⚠'
    },
    {
      type: 'danger',
      title: 'Error',
      message: 'Something went wrong. Please try again.',
      color: palette.danger,
      icon: '✕'
    },
    {
      type: 'info',
      title: 'Information',
      message: 'Here is some helpful information for you.',
      color: palette.info,
      icon: 'ℹ'
    }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} palette={palette}>
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text)' }}>
            Alert Examples
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            See how your alert colors look in real-world scenarios.
          </p>
        </div>

        <div className="space-y-4">
          {alerts.map((alert) => (
            <div 
              key={alert.type}
              className="p-4 rounded-lg flex items-start space-x-3"
            >
              <div
                className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold"
                style={{
                  backgroundColor: alert.color,
                  color: palette['bg-light'],
                }}
              >
                {alert.icon}
              </div>
              <div className="flex-1">
                <h3 
                  className="font-semibold mb-1"
                  style={{ color: 'var(--text)' }}
                >
                  {alert.title}
                </h3>
                <p 
                  className="text-sm"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {alert.message}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-lg">
          <h4 className="font-medium mb-2" style={{ color: 'var(--text)' }}>Color Values:</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {alerts.map((alert) => (
              <div key={alert.type} className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 rounded border"
                  style={{ backgroundColor: alert.color, borderColor: 'var(--border)' }}
                />
                <span style={{ color: 'var(--text-muted)' }}>{alert.type}:</span>
                <code className="font-mono" style={{ color: 'var(--text-muted)' }}>
                  {convertColor(alert.color)}
                </code>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}; 
import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password?: string) => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  passwordLabel?: string;
  passwordError?: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isDestructive = true,
  isLoading = false,
  passwordLabel,
  passwordError
}) => {
  const [password, setPassword] = React.useState('');
  React.useEffect(() => { if (!isOpen) setPassword(''); }, [isOpen]);
  if (!isOpen) return null;

  const handleConfirm = () => {
    if (passwordLabel) {
      onConfirm(password);
    } else {
      onConfirm();
    }
    // Do not call onClose here; let parent control closing
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle style={{ color: 'var(--text)' }}>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            {message}
          </p>
          {passwordLabel && (
            <div className="mb-4">
              <label htmlFor="delete-password" className="block mb-1 text-sm font-medium">{passwordLabel}</label>
              <input
                id="delete-password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded border"
                style={{ background: 'var(--bg-light)', color: 'var(--text)', borderColor: 'var(--border)' }}
                autoFocus
                disabled={isLoading}
              />
              {passwordError && <div className="text-red-600 text-xs mt-1">{passwordError}</div>}
            </div>
          )}
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
              style={{
                color: 'var(--text-muted)',
                borderColor: 'var(--border)',
                backgroundColor: 'transparent'
              }}
            >
              {cancelText}
            </Button>
            <Button
              onClick={handleConfirm}
              className="flex-1"
              disabled={Boolean(isLoading || (passwordLabel && !password))}
              style={isDestructive ? { backgroundColor: '#ef4444', color: '#fff' } : undefined}
            >
              {isLoading && confirmText.toLowerCase().startsWith('delete')
                ? 'Deleting...'
                : isLoading && (confirmText === 'Log Out' || title.toLowerCase().includes('log out') || message.toLowerCase().includes('log out'))
                  ? 'Logging out...'
                  : confirmText}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 
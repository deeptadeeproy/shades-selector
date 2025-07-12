import React, { useState } from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { ConfirmationModal } from '../components/ConfirmationModal';

interface ManageAccountProps {
  user: { id: string; name: string; email: string };
  onUpdateName: (newName: string) => Promise<void>;
  onDeleteAccount: (password: string) => Promise<void>;
}

export const ManageAccount: React.FC<ManageAccountProps> = ({ user, onUpdateName, onDeleteAccount }) => {
  const [name, setName] = useState(user.name);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await onUpdateName(name);
      setSuccess('Name updated successfully!');
    } catch (err) {
      setError('Failed to update name.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (password?: string) => {
    setIsDeleting(true);
    setError(null);
    setPasswordError(null);
    try {
      await onDeleteAccount(password || '');
      setIsDeleting(false);
      setShowConfirm(false); // Only close on success
    } catch (err: any) {
      if (err && err.message === 'Incorrect password') {
        setPasswordError(err.message);
      } else {
        setError('Failed to delete account.');
      }
      setIsDeleting(false);
      // Do not close modal on error
      return;
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-16 p-8 rounded-lg shadow-lg" style={{ background: 'var(--bg-light)', color: 'var(--text)' }}>
      <h2 className="text-2xl font-semibold mb-6">Manage Account</h2>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1 text-sm font-medium">Name</label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            maxLength={100}
            placeholder="Enter your name"
          />
        </div>
        <Button type="submit" disabled={isSaving || name === user.name} className="w-full">
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
        {success && <div className="text-green-600 text-sm mt-2">{success}</div>}
        {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
      </form>
      <hr className="my-8" />
      <div className="flex gap-3">
        <Button type="button" variant="secondary" className="flex-1" onClick={() => window.history.back()}>
          Back
        </Button>
        <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowConfirm(true)} style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}>
          Delete Account
        </Button>
      </div>
      {showConfirm && (
        <ConfirmationModal
          isOpen={showConfirm}
          onClose={() => setShowConfirm(false)}
          onConfirm={handleDelete}
          title="Delete Account"
          message="Are you sure you want to delete your account? This will permanently delete all your projects and their palettes. This action cannot be undone."
          confirmText="Delete Account"
          isDestructive={true}
          isLoading={isDeleting}
          passwordLabel="Enter your password to confirm"
          passwordError={passwordError || undefined}
        />
      )}
    </div>
  );
}; 
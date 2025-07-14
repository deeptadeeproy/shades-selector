import React from 'react';

interface LoadingModalProps {
  isOpen: boolean;
  message?: string;
}

export const LoadingModal: React.FC<LoadingModalProps> = ({ isOpen, message = "Loading palette..." }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 flex flex-col items-center gap-4 min-w-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-lg font-medium text-gray-900 dark:text-gray-100">{message}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">Please wait...</p>
      </div>
    </div>
  );
}; 
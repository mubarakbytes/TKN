import React, { useState, useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

const Alert = ({ type = 'success', message, isOpen, onClose, autoClose = true }) => {
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    setIsVisible(isOpen);
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Auto close after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, onClose]);

  if (!isVisible) return null;

  const icons = {
    success: <CheckCircleIcon className="h-5 w-5 text-green-400" />,
    error: <XCircleIcon className="h-5 w-5 text-red-400" />,
    warning: <ExclamationCircleIcon className="h-5 w-5 text-yellow-400" />,
    info: <InformationCircleIcon className="h-5 w-5 text-blue-400" />
  };

  const styles = {
    success: 'bg-green-50 text-green-800 dark:bg-green-900/10 dark:text-green-400',
    error: 'bg-red-50 text-red-800 dark:bg-red-900/10 dark:text-red-400',
    warning: 'bg-yellow-50 text-yellow-800 dark:bg-yellow-900/10 dark:text-yellow-400',
    info: 'bg-blue-50 text-blue-800 dark:bg-blue-900/10 dark:text-blue-400'
  };

  return (
    <div className={`fixed top-4 right-4 z-50 animate-slide-in`}>
      <div className={`rounded-lg p-4 ${styles[type]} flex items-start shadow-lg max-w-sm`}>
        <div className="flex-shrink-0">{icons[type]}</div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-4 inline-flex flex-shrink-0 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <XCircleIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default Alert;

